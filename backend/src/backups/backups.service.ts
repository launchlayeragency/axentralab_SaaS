import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { EmailService } from '../common/email/email.service';
import { Cron } from '@nestjs/schedule';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import SftpClient from 'ssh2-sftp-client';
import { Client as SSHClient } from 'ssh2';
import { Readable } from 'stream';
import * as AdmZip from 'adm-zip';

@Injectable()
export class BackupsService {
  private readonly logger = new Logger(BackupsService.name);
  private s3: S3Client | null = null;

  constructor(private prisma: PrismaService, private emailService: EmailService) {
    const accessKey = process.env.S3_ACCESS_KEY_ID;
    const secret = process.env.S3_SECRET_ACCESS_KEY;
    const region = process.env.S3_REGION || 'us-east-1';
    const endpoint = process.env.S3_ENDPOINT || undefined;

    if (accessKey && secret) {
      this.s3 = new S3Client({
        region,
        credentials: { accessKeyId: accessKey, secretAccessKey: secret },
        endpoint,
      });
      this.logger.log('✅ S3 configured for backups');
    } else {
      this.logger.warn('⚠️  S3 not configured — backups will be stored locally only');
    }
  }

  // Run daily at 2 AM
  @Cron('0 2 * * *')
  async performDailyBackups() {
    this.logger.log('⏰ Running daily backup job...');
    const websites = await this.prisma.website.findMany({
      include: { user: true },
    });

    for (const website of websites) {
      try {
        // Enqueue backup job for worker
        const { Queue } = await import('bullmq');
        const q = new Queue('backup', { connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' } });
        await q.add('backup', { websiteId: website.id }, {
          attempts: Number(process.env.JOB_ATTEMPTS || 3),
          backoff: { type: 'exponential', delay: Number(process.env.JOB_BACKOFF_MS || 5000) },
          removeOnComplete: { age: 86400 },
        });
        await q.close();
        this.logger.log(`✅ Enqueued backup job for ${website.url}`);
      } catch (err) {
        this.logger.error(`❌ Failed to enqueue backup for ${website.url}: ${err?.message || err}`);
      }
    }
  }

  // Perform a single website backup (used by worker)
  async performBackup(websiteId: string) {
    const website = await this.prisma.website.findUnique({
      where: { id: websiteId },
      include: { user: true },
    });

    if (!website) throw new Error('Website not found');

    try {
      this.logger.log(`🔄 Starting backup for ${website.url}...`);

      let backupContent: Buffer;
      let backupFileName: string;

      // Get backup content based on website type and connection method
      if (website.sshHost && website.sshUser) {
        // SSH backup (for WordPress or any website with SSH access)
        const result = await this.backupViaSsh(website);
        backupContent = result.content;
        backupFileName = result.fileName;
      } else if (website.ftpHost && website.ftpUser) {
        // FTP/SFTP backup
        const result = await this.backupViaFtp(website);
        backupContent = result.content;
        backupFileName = result.fileName;
      } else {
        // Fallback: Simple snapshot backup (metadata only)
        backupContent = Buffer.from(JSON.stringify({
          website: website.url,
          timestamp: new Date().toISOString(),
          type: 'metadata-only',
          note: 'Full backup requires SSH or FTP credentials',
        }));
        backupFileName = `backup-${website.id}-${Date.now()}.json`;
      }

      // Upload to S3 if configured
      let s3Path: string | null = null;
      if (this.s3) {
        const bucket = process.env.S3_BUCKET;
        s3Path = `backups/${website.id}/${backupFileName}`;

        await this.s3.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: s3Path,
            Body: backupContent,
            ContentType: 'application/zip',
          }),
        );

        this.logger.log(`✅ Backup uploaded to S3: ${s3Path} (${backupContent.length / 1024 / 1024} MB)`);
      }

      // Record backup in database
      const backup = await this.prisma.backup.create({
        data: {
          websiteId: website.id,
          filePath: s3Path || '',
          fileSize: BigInt(backupContent.length),
          status: 'completed',
          backupType: 'full',
        },
      });

      this.logger.log(`✅ Backup completed for ${website.url}`);

      // Clean up old backups (keep last 30 days)
      await this.cleanupOldBackups(website.id);

      return backup;
    } catch (err) {
      this.logger.error(`❌ Backup failed for ${website.url}:`, err.message);

      // Record failed backup
      await this.prisma.backup.create({
        data: {
          websiteId: website.id,
          filePath: '',
          fileSize: BigInt(0),
          status: 'failed',
          backupType: 'full',
        },
      });

      // Notify user of backup failure
      if (website.user) {
        await this.emailService.sendMail(
          website.user.email,
          `⚠️ Backup failed for ${website.name}`,
          `<p>The automated backup for <strong>${website.name}</strong> failed.</p><p>Error: ${err.message}</p>`,
        );
      }

      throw err;
    }
  }

  private async backupViaSsh(
    website: any,
  ): Promise<{ content: Buffer; fileName: string }> {
    return new Promise(async (resolve, reject) => {
      const ssh = new SSHClient();
      const sftp = new SftpClient();

      try {
        await new Promise<void>((sshResolve, sshReject) => {
          ssh.on('ready', async () => {
            try {
              // Connect SFTP
              await sftp.connect({
                host: website.sshHost,
                port: website.sshPort || 22,
                username: website.sshUser,
                privateKey: website.sshPrivateKey || undefined,
                password: undefined,
              });

              // Create backup archive
              const backupPath = `${website.wpPath || '/var/www/html'}/backup-${Date.now()}.tar.gz`;
              const homeDir = website.wpPath || '/var/www/html';

              // Execute tar command to create backup
              ssh.exec(`tar -czf ${backupPath} -C ${homeDir} .`, async (err, stream) => {
                if (err) {
                  await sftp.end();
                  return sshReject(err);
                }

                stream.on('close', async () => {
                  try {
                    // Download the backup file
                    const content = await sftp.get(backupPath);
                    const buffer = await this.streamToBuffer(content);

                    // Delete remote backup
                    await new Promise<void>((delResolve) => {
                      ssh.exec(`rm ${backupPath}`, () => {
                        delResolve();
                      });
                    });

                    await sftp.end();
                    ssh.end();

                    resolve({
                      content: buffer,
                      fileName: `backup-${website.id}-${Date.now()}.tar.gz`,
                    });
                  } catch (err) {
                    await sftp.end();
                    sshReject(err);
                  }
                });

                stream.on('error', (err) => {
                  sshReject(err);
                });
              });
            } catch (err) {
              await sftp.end();
              sshReject(err);
            }
          });

          ssh.on('error', sshReject);

          ssh.connect({
            host: website.sshHost,
            port: website.sshPort || 22,
            username: website.sshUser,
            privateKey: website.sshPrivateKey || undefined,
          });
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  private async backupViaFtp(website: any): Promise<{ content: Buffer; fileName: string }> {
    const sftp = new SftpClient();

    try {
      await sftp.connect({
        host: website.ftpHost,
        port: website.ftpPort || 22,
        username: website.ftpUser,
        password: website.ftpPassword || undefined,
      });

      const files = await sftp.list(website.wpPath || '/public_html');

      // Create in-memory ZIP with important files
      const zip = new AdmZip();
      for (const file of files.slice(0, 100)) {
        // Limit to first 100 files to avoid timeout
        if (file.type === '-') {
          try {
            const filePath = `${(website.wpPath || '/public_html').replace(/\/$/, '')}/${file.name}`;
            const content = await sftp.get(filePath);
            const buffer = await this.streamToBuffer(content);
            zip.addFile(file.name, buffer);
          } catch (err) {
            // Skip files that can't be read
          }
        }
      }

      await sftp.end();

      return {
        content: zip.toBuffer(),
        fileName: `backup-${website.id}-${Date.now()}.zip`,
      };
    } catch (err) {
      await sftp.end();
      throw err;
    }
  }

  // Restore backup: download from S3 and upload/run via SFTP or SSH WP-CLI
  async restoreBackup(userId: string, backupId: string) {
    const backup = await this.prisma.backup.findFirst({
      where: { id: backupId },
      include: { website: true },
    });

    if (!backup) throw new Error('Backup not found');
    if (backup.website.userId !== userId) throw new Error('Unauthorized');

    // Download from S3 if filePath set
    let dataBuffer: Buffer;
    if (backup.filePath && this.s3) {
      const bucket = process.env.S3_BUCKET;
      const get = await this.s3.send(new GetObjectCommand({ Bucket: bucket, Key: backup.filePath }));
      const stream = get.Body as Readable;
      dataBuffer = await this.streamToBuffer(stream);
    } else {
      throw new Error('No backup file available to restore');
    }

    const website = backup.website;

    // If SSH access present, upload and restore
    if (website.sshHost && website.sshUser) {
      return await this.restoreViaSsh(website, dataBuffer);
    }

    // Fallback: SFTP
    if (website.ftpHost && website.ftpUser) {
      return await this.restoreViaFtp(website, dataBuffer);
    }

    throw new Error('No restore method available (provide SSH or FTP credentials)');
  }

  private async restoreViaSsh(website: any, backupData: Buffer): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const ssh = new SSHClient();

      ssh.on('ready', async () => {
        try {
          const sftp = new SftpClient();
          await sftp.connect({
            host: website.sshHost,
            port: website.sshPort || 22,
            username: website.sshUser,
            privateKey: website.sshPrivateKey || undefined,
          });

          const remotePath = `${website.wpPath || '/tmp'}/restore-${Date.now()}.tar.gz`;
          await sftp.put(backupData, remotePath);
          await sftp.end();

          // Extract backup
          const extractPath = website.wpPath || '/var/www/html';
          ssh.exec(`cd ${extractPath} && tar -xzf ${remotePath} && rm ${remotePath}`, (err, stream) => {
            if (err) {
              ssh.end();
              return reject(err);
            }

            let stderr = '';
            stream.on('close', async (code: number) => {
              ssh.end();
              if (code === 0) {
                resolve({ message: '✅ Restore completed successfully' });
              } else {
                reject(new Error(`Restore failed: ${stderr}`));
              }
            });

            stream.stderr.on('data', (d: Buffer) => {
              stderr += d.toString();
            });
          });
        } catch (err) {
          ssh.end();
          reject(err);
        }
      });

      ssh.on('error', reject);

      ssh.connect({
        host: website.sshHost,
        port: website.sshPort || 22,
        username: website.sshUser,
        privateKey: website.sshPrivateKey || undefined,
      });
    });
  }

  private async restoreViaFtp(website: any, backupData: Buffer): Promise<any> {
    const sftp = new SftpClient();

    try {
      await sftp.connect({
        host: website.ftpHost,
        port: website.ftpPort || 22,
        username: website.ftpUser,
        password: website.ftpPassword || undefined,
      });

      const uploadPath = `${website.wpPath || '/public_html'}/restore-${Date.now()}.zip`;
      await sftp.put(backupData, uploadPath);
      await sftp.end();

      return { message: 'Backup uploaded via FTP. Please extract and restore manually on your server.' };
    } catch (err) {
      await sftp.end();
      throw err;
    }
  }

  private async streamToBuffer(stream: Readable) {
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', (err) => reject(err));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  private async cleanupOldBackups(websiteId: string) {
    const retentionDays = Number(process.env.BACKUP_RETENTION_DAYS || 30);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const oldBackups = await this.prisma.backup.findMany({
      where: {
        websiteId,
        createdAt: { lt: cutoffDate },
      },
    });

    for (const backup of oldBackups) {
      if (backup.filePath && this.s3) {
        // Delete from S3
        const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
        await this.s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: backup.filePath,
          }),
        );
      }

      // Delete from database
      await this.prisma.backup.delete({ where: { id: backup.id } });
    }

    this.logger.log(`✅ Cleaned up old backups for website ${websiteId}`);
  }

  async getBackups(userId: string, websiteId: string) {
    return this.prisma.backup.findMany({
      where: {
        website: {
          id: websiteId,
          userId,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
  }
}
