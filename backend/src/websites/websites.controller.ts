import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { WebsitesService } from './websites.service';
import { CreateWebsiteDto, UpdateWebsiteDto } from './dto/website.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('websites')
@UseGuards(JwtAuthGuard)
export class WebsitesController {
  constructor(private readonly websitesService: WebsitesService) {}

  @Post()
  create(@Request() req, @Body() createWebsiteDto: CreateWebsiteDto) {
    return this.websitesService.create(req.user.userId, createWebsiteDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.websitesService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.websitesService.findOne(req.user.userId, id);
  }

  @Get(':id/stats')
  getStats(@Request() req, @Param('id') id: string) {
    return this.websitesService.getStats(req.user.userId, id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateWebsiteDto: UpdateWebsiteDto) {
    return this.websitesService.update(req.user.userId, id, updateWebsiteDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.websitesService.remove(req.user.userId, id);
  }
}
