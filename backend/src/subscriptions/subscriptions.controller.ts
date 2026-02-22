import { Controller, Post, Get, Body, UseGuards, Request, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  createCheckout(@Request() req, @Body() body: { plan: 'starter' | 'pro' | 'agency' }) {
    return this.subscriptionsService.createCheckoutSession(req.user.userId, body.plan);
  }

  @Post('portal')
  @UseGuards(JwtAuthGuard)
  createPortal(@Request() req) {
    return this.subscriptionsService.createPortalSession(req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getSubscription(@Request() req) {
    return this.subscriptionsService.getSubscription(req.user.userId);
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    return this.subscriptionsService.handleWebhook(signature, req.rawBody);
  }
}
