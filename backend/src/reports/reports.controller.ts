import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  getReports(@Request() req) {
    return this.reportsService.getReports(req.user.userId);
  }

  @Post('website/:websiteId')
  generateReport(@Request() req, @Param('websiteId') websiteId: string) {
    return this.reportsService.generateReport(req.user.userId, websiteId);
  }
}
