import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { BackupsService } from './backups.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('backups')
@UseGuards(JwtAuthGuard)
export class BackupsController {
  constructor(private readonly backupsService: BackupsService) {}

  @Get('website/:websiteId')
  getBackups(@Request() req, @Param('websiteId') websiteId: string) {
    return this.backupsService.getBackups(req.user.userId, websiteId);
  }

  @Post(':id/restore')
  restoreBackup(@Request() req, @Param('id') id: string) {
    return this.backupsService.restoreBackup(req.user.userId, id);
  }
}
