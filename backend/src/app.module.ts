import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WebsitesModule } from './websites/websites.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { BackupsModule } from './backups/backups.module';
import { SecurityModule } from './security/security.module';
import { ReportsModule } from './reports/reports.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { EmailModule } from './common/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    EmailModule,
    AuthModule,
    UsersModule,
    WebsitesModule,
    MonitoringModule,
    BackupsModule,
    SecurityModule,
    ReportsModule,
    SubscriptionsModule,
  ],
})
export class AppModule {}
