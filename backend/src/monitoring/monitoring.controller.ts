import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('monitoring')
@UseGuards(JwtAuthGuard)
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Post('check/:websiteId')
  async manualCheck(@Param('websiteId') websiteId: string) {
    return this.monitoringService.manualCheck(websiteId);
  }
}
