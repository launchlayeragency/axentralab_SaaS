import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../common/prisma/prisma.service';
import axios from 'axios';
import { EmailService } from '../common/email/email.service';

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);

  constructor(private prisma: PrismaService, private emailService: EmailService) {}

  // Run every 5 minutes for all websites
  @Cron('*/5 * * * *')
  async checkAllWebsites() {
    this.logger.log('🔍 Starting website monitoring check...');

    const websites = await this.prisma.website.findMany({
      include: {
        user: {
          include: {
            subscription: true,
          },
        },
      },
    });

    this.logger.log(`Found ${websites.length} websites to check`);

    for (const website of websites) {
      try {
        // Enqueue monitor job
        const { Queue } = await import('bullmq');
        const q = new Queue('monitor', { connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' } });
        await q.add(
          'monitor',
          { websiteId: website.id },
          {
            attempts: Number(process.env.JOB_ATTEMPTS || 3),
            backoff: { type: 'exponential', delay: Number(process.env.JOB_BACKOFF_MS || 5000) },
            removeOnComplete: { age: 3600 },
          },
        );
        await q.close();
      } catch (error) {
        this.logger.error(`Error enqueuing check for ${website.url}: ${error.message}`);
      }
    }

    this.logger.log('✅ Website monitoring check completed');
  }

  async checkWebsite(websiteId: string) {
    const website = await this.prisma.website.findUnique({
      where: { id: websiteId },
      include: {
        user: {
          include: {
            notifications: true,
          },
        },
      },
    });

    if (!website) {
      return;
    }

    const startTime = Date.now();
    let success = false;
    let statusCode = 0;
    let errorMessage: string | null = null;

    try {
      const response = await axios.get(website.url, {
        timeout: 30000, // 30 seconds
        validateStatus: () => true, // Don't throw on any status code
      });

      statusCode = response.status;
      success = statusCode >= 200 && statusCode < 400;
    } catch (error) {
      errorMessage = error.message;
      success = false;
    }

    const responseTime = Date.now() - startTime;

    // Save check result
    const check = await this.prisma.check.create({
      data: {
        websiteId,
        statusCode,
        responseTime,
        success,
        errorMessage,
      },
    });

    // Update website status
    const newStatus = success ? 'online' : 'offline';
    const wasOnline = website.status === 'online';

    await this.prisma.website.update({
      where: { id: websiteId },
      data: {
        status: newStatus,
        lastChecked: new Date(),
      },
    });

    // Calculate uptime percentage
    await this.updateUptimePercentage(websiteId);

    // Send alert if status changed
    if (wasOnline && !success) {
      await this.sendDowntimeAlert(website, check);
    } else if (!wasOnline && success) {
      await this.sendRecoveryAlert(website);
    }

    this.logger.log(`✓ Checked ${website.url} - Status: ${statusCode}, Response: ${responseTime}ms`);
  }

  private async updateUptimePercentage(websiteId: string) {
    // Calculate uptime for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const checks = await this.prisma.check.findMany({
      where: {
        websiteId,
        checkedAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    if (checks.length === 0) return;

    const successfulChecks = checks.filter(c => c.success).length;
    const uptimePercentage = (successfulChecks / checks.length) * 100;

    await this.prisma.website.update({
      where: { id: websiteId },
      data: {
        uptimePercentage: Math.round(uptimePercentage * 100) / 100,
      },
    });
  }

  private async sendDowntimeAlert(website: any, check: any) {
    this.logger.warn(`🚨 Website DOWN: ${website.url}`);

    // Create alert
    await this.prisma.alert.create({
      data: {
        userId: website.userId,
        websiteId: website.id,
        type: 'downtime',
        severity: 'critical',
        message: `Website ${website.name} (${website.url}) is down. Status: ${check.statusCode || 'Timeout'}`,
      },
    });

    // TODO: Send email/SMS notification
    if (website.user.notifications?.emailEnabled) {
      this.logger.log(`📧 Sending downtime email to ${website.user.email}`);
      await this.emailService.sendDowntimeAlert(
        website.user.email,
        website.name,
        website.url,
        `Status: ${check.statusCode || 'Timeout'}`,
      );
    }

    if (website.user.notifications?.smsEnabled && website.user.notifications?.phoneNumber) {
      this.logger.log(`📱 Would send SMS to ${website.user.notifications.phoneNumber}`);
      // await this.smsService.sendDowntimeAlert(website.user.notifications.phoneNumber, website);
    }
  }

  private async sendRecoveryAlert(website: any) {
    this.logger.log(`✅ Website RECOVERED: ${website.url}`);

    // Create alert
    await this.prisma.alert.create({
      data: {
        userId: website.userId,
        websiteId: website.id,
        type: 'downtime',
        severity: 'info',
        message: `Website ${website.name} (${website.url}) is back online.`,
      },
    });

    // Send recovery email
    if (website.user.notifications?.emailEnabled) {
      await this.emailService.sendRecoveryAlert(website.user.email, website.name, website.url);
    }
  }

  // Manual check endpoint
  async manualCheck(websiteId: string) {
    await this.checkWebsite(websiteId);
    return { message: 'Website check completed' };
  }
}
