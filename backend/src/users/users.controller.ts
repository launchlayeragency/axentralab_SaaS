import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Patch('profile')
  updateProfile(@Request() req, @Body() updateData: { name?: string }) {
    return this.usersService.updateProfile(req.user.userId, updateData);
  }

  @Get('notifications')
  getNotifications(@Request() req) {
    return this.usersService.getNotificationSettings(req.user.userId);
  }

  @Patch('notifications')
  updateNotifications(@Request() req, @Body() updateData: any) {
    return this.usersService.updateNotificationSettings(req.user.userId, updateData);
  }

  @Get('dashboard/stats')
  getDashboardStats(@Request() req) {
    return this.usersService.getDashboardStats(req.user.userId);
  }
}
