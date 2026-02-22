import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { EmailService } from '../common/email/email.service';
import { Cron } from '@nestjs/schedule';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);
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
    }
  }

  // Generate monthly reports on 1st of each month at 4 AM
  @Cron('0 4 1 * *')
  async generateMonthlyReports() {
    this.logger.log('📊 Generating monthly reports...');
    const users = await this.prisma.user.findMany({
      include: { websites: true },
    });

    for (const user of users) {
      if (user.websites.length === 0) continue;

      try {
        await this.generateUserMonthlyReport(user.id);
      } catch (err) {
        this.logger.error(`Failed to generate report for user ${user.id}:`, err.message);
      }
    }
  }

  async generateUserMonthlyReport(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { websites: true },
    });

    if (!user) throw new Error('User not found');

    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
    const monthName = lastMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Gather data for all user's websites
    const websiteReports: any[] = [];
    let totalUptime = 0;
    let websiteCount = 0;

    for (const website of user.websites) {
      const checks = await this.prisma.check.findMany({
        where: {
          websiteId: website.id,
          checkedAt: {
            gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
            lt: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 1),
          },
        },
      });

      const successCount = checks.filter(c => c.success).length;
      const totalCount = checks.length || 1;
      const uptime = Math.round((successCount / totalCount) * 100);

      const backups = await this.prisma.backup.findMany({
        where: {
          websiteId: website.id,
          createdAt: {
            gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
            lt: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 1),
          },
        },
      });

      const securityScans = await this.prisma.securityScan.findMany({
        where: {
          websiteId: website.id,
          scannedAt: {
            gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
            lt: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 1),
          },
        },
      });

      const avgRiskScore = securityScans.length > 0 ? Math.round(securityScans.reduce((sum, s) => sum + s.riskScore, 0) / securityScans.length) : 0;

      websiteReports.push({
        name: website.name,
        url: website.url,
        uptime,
        checksPerformed: totalCount,
        backupsCreated: backups.length,
        backupSize: backups.reduce((sum, b) => sum + Number(b.fileSize), 0),
        securityScans: securityScans.length,
        avgRiskScore,
      });

      totalUptime += uptime;
      websiteCount++;
    }

    const avgUptime = websiteCount > 0 ? Math.round(totalUptime / websiteCount) : 100;

    // Generate HTML report
    const htmlReport = this.generateHTMLReport({
      userName: user.name || user.email,
      monthName,
      avgUptime,
      websiteReports,
      generatedDate: new Date().toLocaleDateString(),
    });

    // Save report (PDF conversion can be done client-side or via external service)
    // For now, save as HTML with data for PDF conversion
    const reportPath = `/tmp/report-${userId}-${lastMonth.getTime()}.html`;
    fs.writeFileSync(reportPath, htmlReport);

    // Upload to S3 if configured
    let reportUrl = null;
    if (this.s3) {
      const key = `reports/${userId}/${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}-report.html`;
      const bucket = process.env.S3_BUCKET;

      await this.s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: htmlReport,
          ContentType: 'text/html',
        }),
      );

      reportUrl = `https://${bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;
      this.logger.log(`✅ Report uploaded to S3: ${reportUrl}`);
    }

    // Save report metadata to database
    const report = await this.prisma.report.create({
      data: {
        userId,
        reportType: 'monthly',
        reportData: JSON.stringify({ monthName, avgUptime, websiteReports }),
        reportUrl: reportUrl || reportPath,
        generatedAt: new Date(),
      },
    });

    // Send email with report link
    await this.emailService.sendMonthlyReport(user.email, user.name || 'User', reportUrl || reportPath, monthName);

    // Clean up temp file if not using S3
    if (!this.s3 && fs.existsSync(reportPath)) {
      fs.unlinkSync(reportPath);
    }

    this.logger.log(`✅ Monthly report generated for ${user.email}`);
    return report;
  }

  private generateHTMLReport(data: any): string {
    const { userName, monthName, avgUptime, websiteReports, generatedDate } = data;

    const websiteRows = websiteReports
      .map(
        (w: any) => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; text-align: left;">${w.name}</td>
        <td style="padding: 12px; text-align: center;">${w.uptime}%</td>
        <td style="padding: 12px; text-align: center;">${w.checksPerformed}</td>
        <td style="padding: 12px; text-align: center;">${w.backupsCreated}</td>
        <td style="padding: 12px; text-align: center;">${w.securityScans}</td>
        <td style="padding: 12px; text-align: center;">${w.avgRiskScore}/100</td>
      </tr>
    `,
      )
      .join('');

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Axentralab Monthly Report</title>
  <style>
    body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 20px; background: #f5f5f5; }
    .container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { color: #007bff; margin-bottom: 10px; }
    .meta { color: #666; font-size: 14px; margin-bottom: 30px; }
    .summary { background: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 30px; border-left: 4px solid #007bff; }
    .summary-item { display: inline-block; margin-right: 30px; }
    .summary-label { color: #666; font-size: 12px; text-transform: uppercase; }
    .summary-value { font-size: 24px; font-weight: bold; color: #007bff; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { background: #007bff; color: white; padding: 12px; text-align: left; }
    .good { color: #28a745; }
    .warning { color: #ffc107; }
    .danger { color: #dc3545; }
    .footer { color: #999; font-size: 12px; text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 Axentralab Monthly Report</h1>
    <div class="meta">
      <p><strong>Period:</strong> ${monthName}<br>
      <strong>User:</strong> ${userName}<br>
      <strong>Generated:</strong> ${generatedDate}</p>
    </div>

    <div class="summary">
      <div class="summary-item">
        <div class="summary-label">Average Uptime</div>
        <div class="summary-value good">${avgUptime}%</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">Websites Monitored</div>
        <div class="summary-value">${websiteReports.length}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">Total Backups</div>
        <div class="summary-value">${websiteReports.reduce((sum: number, w: any) => sum + w.backupsCreated, 0)}</div>
      </div>
    </div>

    <h2>Website Performance</h2>
    <table>
      <thead>
        <tr>
          <th>Website</th>
          <th>Uptime</th>
          <th>Checks</th>
          <th>Backups</th>
          <th>Security Scans</th>
          <th>Risk Score</th>
        </tr>
      </thead>
      <tbody>
        ${websiteRows}
      </tbody>
    </table>

    <div class="footer">
      <p>This report was automatically generated by Axentralab.<br>
      For more details and settings, visit your <a href="${process.env.FRONTEND_URL || 'https://app.axentralab.com'}/dashboard">dashboard</a>.</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  async getReports(userId: string) {
    return this.prisma.report.findMany({
      where: { userId },
      orderBy: { generatedAt: 'desc' },
      take: 12, // Last 12 months
    });
  }

  async generateReport(userId: string, websiteId: string) {
    const website = await this.prisma.website.findFirst({
      where: { id: websiteId, userId },
    });

    if (!website) throw new Error('Website not found or unauthorized');

    return this.generateCustomWebsiteReport(userId, websiteId);
  }

  private async generateCustomWebsiteReport(userId: string, websiteId: string) {
    const website = await this.prisma.website.findUnique({
      where: { id: websiteId },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!website || !user) throw new Error('Website or user not found');

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const checks = await this.prisma.check.findMany({
      where: {
        websiteId,
        checkedAt: { gte: weekAgo },
      },
      orderBy: { checkedAt: 'asc' },
    });

    const successCount = checks.filter(c => c.success).length;
    const uptime = Math.round((successCount / (checks.length || 1)) * 100);

    const htmlReport = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Website Report - ${website.name}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 900px; margin: 20px auto; padding: 20px; background: white; border-radius: 8px; }
    h1 { color: #007bff; }
    .stat { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${website.name} - Weekly Report</h1>
    <p><strong>Website:</strong> ${website.url}</p>
    <p><strong>Period:</strong> Last 7 days</p>
    <div class="stat">
      <strong>Uptime:</strong> ${uptime}% (${successCount}/${checks.length} checks passed)
    </div>
    <div class="stat">
      <strong>Average Response Time:</strong> ${checks.length > 0 ? Math.round(checks.reduce((sum, c) => sum + c.responseTime, 0) / checks.length) : 0}ms
    </div>
  </div>
</body>
</html>
    `;

    const report = await this.prisma.report.create({
      data: {
        userId,
        reportType: 'website',
        reportData: JSON.stringify({ website: website.name, uptime, checksCount: checks.length }),
        reportUrl: '',
        generatedAt: new Date(),
      },
    });

    return report;
  }
}
