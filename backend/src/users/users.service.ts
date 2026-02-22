import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        notifications: true,
        websites: {
          select: {
            id: true,
            url: true,
            name: true,
            status: true,
          },
        },
      },
    });

    const { passwordHash, verificationToken, resetToken, resetTokenExpiry, ...profile } = user;
    return profile;
  }

  async updateProfile(userId: string, updateData: { name?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
      },
    });
  }

  async getNotificationSettings(userId: string) {
    let settings = await this.prisma.notificationSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await this.prisma.notificationSettings.create({
        data: { userId },
      });
    }

    return settings;
  }

  async updateNotificationSettings(userId: string, updateData: any) {
    return this.prisma.notificationSettings.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        ...updateData,
      },
    });
  }

  async getDashboardStats(userId: string) {
    const websites = await this.prisma.website.findMany({
      where: { userId },
    });

    const onlineWebsites = websites.filter(w => w.status === 'online').length;
    const avgUptime = websites.length > 0
      ? websites.reduce((sum, w) => sum + (w.uptimePercentage || 100), 0) / websites.length
      : 100;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const backupCount = await this.prisma.backup.count({
      where: {
        website: {
          userId,
        },
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    const alertCount = await this.prisma.alert.count({
      where: {
        userId,
        resolved: false,
      },
    });

    return {
      totalWebsites: websites.length,
      onlineWebsites,
      averageUptime: Math.round(avgUptime * 100) / 100,
      backupsThisMonth: backupCount,
      unresolvedAlerts: alertCount,
    };
  }
}
