import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { SecurityService } from './security.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('security')
@UseGuards(JwtAuthGuard)
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get('website/:websiteId')
  getScans(@Request() req, @Param('websiteId') websiteId: string) {
    return this.securityService.getScans(req.user.userId, websiteId);
  }

  @Post('website/:websiteId/scan')
  manualScan(@Request() req, @Param('websiteId') websiteId: string) {
    return this.securityService.manualScan(req.user.userId, websiteId);
  }
}
