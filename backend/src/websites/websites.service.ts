import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateWebsiteDto, UpdateWebsiteDto } from './dto/website.dto';

@Injectable()
export class WebsitesService {
  constructor(private prisma: PrismaService) {}

  // Plan limits
  private readonly PLAN_LIMITS = {
    starter: 1,
    pro: 5,
    agency: 20,
  };

  async create(userId: string, createWebsiteDto: CreateWebsiteDto) {
    // Check subscription and limits
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        websites: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user has active subscription
    if (!user.subscription || user.subscription.status !== 'active') {
      // Allow trial users to add 1 website
      if (user.websites.length >= 1) {
        throw new BadRequestException('Please upgrade your plan to add more websites');
      }
    } else {
      // Check plan limits
      const plan = user.subscription.plan;
      const limit = this.PLAN_LIMITS[plan] || 1;

      if (user.websites.length >= limit) {
        throw new BadRequestException(`Your ${plan} plan allows maximum ${limit} website(s). Please upgrade to add more.`);
      }
    }

    // Create website
    const website = await this.prisma.website.create({
      data: {
        userId,
        url: createWebsiteDto.url,
        name: createWebsiteDto.name,
        status: 'pending',
      },
    });

    return website;
  }

  async findAll(userId: string) {
    const websites = await this.prisma.website.findMany({
      where: { userId },
      include: {
        checks: {
          orderBy: { checkedAt: 'desc' },
          take: 10,
        },
        backups: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        securityScans: {
          orderBy: { scannedAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return websites;
  }

  async findOne(userId: string, websiteId: string) {
    const website = await this.prisma.website.findFirst({
      where: {
        id: websiteId,
        userId,
      },
      include: {
        checks: {
          orderBy: { checkedAt: 'desc' },
          take: 100,
        },
        backups: {
          orderBy: { createdAt: 'desc' },
        },
        securityScans: {
          orderBy: { scannedAt: 'desc' },
        },
        alerts: {
          orderBy: { sentAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!website) {
      throw new NotFoundException('Website not found');
    }

    return website;
  }

  async update(userId: string, websiteId: string, updateWebsiteDto: UpdateWebsiteDto) {
    // Check ownership
    const website = await this.prisma.website.findFirst({
      where: {
        id: websiteId,
        userId,
      },
    });

    if (!website) {
      throw new NotFoundException('Website not found');
    }

    return this.prisma.website.update({
      where: { id: websiteId },
      data: updateWebsiteDto,
    });
  }

  async remove(userId: string, websiteId: string) {
    // Check ownership
    const website = await this.prisma.website.findFirst({
      where: {
        id: websiteId,
        userId,
      },
    });

    if (!website) {
      throw new NotFoundException('Website not found');
    }

    await this.prisma.website.delete({
      where: { id: websiteId },
    });

    return { message: 'Website deleted successfully' };
  }

  async getStats(userId: string, websiteId: string) {
    const website = await this.findOne(userId, websiteId);

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

    const totalChecks = checks.length;
    const successfulChecks = checks.filter(c => c.success).length;
    const uptimePercentage = totalChecks > 0 ? (successfulChecks / totalChecks) * 100 : 100;

    // Calculate average response time
    const avgResponseTime = totalChecks > 0
      ? checks.reduce((sum, c) => sum + c.responseTime, 0) / totalChecks
      : 0;

    // Count incidents (downtime periods)
    const incidents = checks.filter(c => !c.success).length;

    return {
      websiteId,
      url: website.url,
      name: website.name,
      status: website.status,
      uptimePercentage: Math.round(uptimePercentage * 100) / 100,
      averageResponseTime: Math.round(avgResponseTime),
      totalChecks,
      incidents,
      lastChecked: website.lastChecked,
    };
  }
}
