import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Worker } from 'bullmq';

async function bootstrapWorker() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const monitoringService = app.get('MonitoringService');
  const backupsService = app.get('BackupsService');

  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  const connection = { connection: { url: redisUrl } } as any;

  // Monitor worker with retries/backoff
  new Worker(
    'monitor',
    async job => {
      const websiteId = job.data.websiteId as string;
      if (!websiteId) return;
      console.log(`Worker: processing monitor job for ${websiteId}`);
      await monitoringService.checkWebsite(websiteId);
    },
    {
      connection: connection.connection,
      concurrency: Number(process.env.MONITOR_WORKER_CONCURRENCY || 5),
      lockDuration: 120000,
    },
  );

  // Backup worker with concurrency and error handling
  new Worker(
    'backup',
    async job => {
      const websiteId = job.data.websiteId as string;
      if (!websiteId) return;
      console.log(`Worker: processing backup job for ${websiteId}`);
      await backupsService.performBackup(websiteId);
    },
    {
      connection: connection.connection,
      concurrency: Number(process.env.BACKUP_WORKER_CONCURRENCY || 2),
      lockDuration: 30 * 60 * 1000, // 30 minutes for long backups
    },
  );

  console.log('Workers started: monitor, backup');
}

bootstrapWorker().catch(err => {
  console.error('Worker bootstrap failed', err?.message || err);
  process.exit(1);
});
