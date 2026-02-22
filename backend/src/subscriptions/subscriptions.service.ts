import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import Stripe from 'stripe';
import { EmailService } from '../common/email/email.service';

@Injectable()
export class SubscriptionsService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckoutSession(userId: string, plan: 'starter' | 'pro' | 'agency') {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    // Get or create Stripe customer from subscription record
    let customerId = user.subscription?.stripeCustomerId as string | undefined;
    if (!customerId) {
      const customer = await this.stripe.customers.create({
        email: user.email,
        metadata: { userId },
      });
      customerId = customer.id;

      // Persist customerId in subscription (create subscription record if missing)
      await this.prisma.subscription.upsert({
        where: { userId },
        update: { stripeCustomerId: customerId },
        create: {
          userId,
          stripeCustomerId: customerId,
          plan: plan,
          status: 'pending',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(),
        },
      });
    }

    // Price IDs from env
    const priceIds = {
      starter: this.configService.get('STRIPE_STARTER_PRICE_ID'),
      pro: this.configService.get('STRIPE_PRO_PRICE_ID'),
      agency: this.configService.get('STRIPE_AGENCY_PRICE_ID'),
    };

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceIds[plan],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${this.configService.get('FRONTEND_URL')}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get('FRONTEND_URL')}/pricing`,
      subscription_data: {
        trial_period_days: 14,
      },
    });

    return { url: session.url };
  }

  async createPortalSession(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription?.stripeCustomerId) {
      throw new Error('No subscription found');
    }

    const session = await this.stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${this.configService.get('FRONTEND_URL')}/dashboard`,
    });

    return { url: session.url };
  }

  async handleWebhook(signature: string, rawBody: Buffer) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed':
        // When checkout completes, retrieve subscription and persist
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.subscription) {
          const sub = await this.stripe.subscriptions.retrieve(session.subscription as string);
          await this.handleSubscriptionUpdate(sub);
        }
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
    }

    return { received: true };
  }

  private async handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    const userId = subscription.metadata.userId;

    await this.prisma.subscription.upsert({
      where: { userId },
      update: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
      create: {
        userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        plan: 'starter', // Determine from price ID
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    await this.prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: { status: 'canceled' },
    });
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice) {
    console.log('Payment succeeded:', invoice.id);
    try {
      const customerEmail = invoice.customer_email || invoice['customer_email'];
      const userId = invoice.metadata?.userId;
      if (customerEmail && userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        await this.emailService.sendReceipt(customerEmail, user?.name || '', `https://dashboard.axentralab.com/invoices/${invoice.id}`);
      }
    } catch (err) {
      console.error('Error sending receipt email', err?.message || err);
    }
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice) {
    console.log('Payment failed:', invoice.id);
    try {
      // Find subscription by stripe subscription id or customer
      const stripeSubId = invoice.subscription as string | undefined;
      const stripeCustomer = invoice.customer as string | undefined;

      let subscriptionRecord = null;
      if (stripeSubId) {
        subscriptionRecord = await this.prisma.subscription.findFirst({ where: { stripeSubscriptionId: stripeSubId } });
      }
      if (!subscriptionRecord && stripeCustomer) {
        subscriptionRecord = await this.prisma.subscription.findFirst({ where: { stripeCustomerId: stripeCustomer } });
      }

      if (subscriptionRecord) {
        // Send email to user
        const user = await this.prisma.user.findUnique({ where: { id: subscriptionRecord.userId } });
        if (user) {
          await this.emailService.sendPaymentFailed(user.email, user.name || '');
        }

        // Update subscription status
        await this.prisma.subscription.update({ where: { id: subscriptionRecord.id }, data: { status: 'past_due' } });

        // If Stripe indicates many attempts, cancel subscription automatically
        const attemptCount = (invoice.attempt_count as number) || 0;
        const maxAttempts = Number(this.configService.get('STRIPE_MAX_PAYMENT_ATTEMPTS') || 3);
        if (attemptCount >= maxAttempts) {
          await this.prisma.subscription.update({ where: { id: subscriptionRecord.id }, data: { status: 'canceled', cancelAtPeriodEnd: true } });
        }
      }
    } catch (err) {
      console.error('Error handling payment failed', err?.message || err);
    }
  }

  async getSubscription(userId: string) {
    return this.prisma.subscription.findUnique({
      where: { userId },
    });
  }
}
