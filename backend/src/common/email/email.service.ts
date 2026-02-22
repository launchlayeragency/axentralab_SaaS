import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import axios from 'axios';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private resendApiKey: string;
  private useResend: boolean = false;
  private readonly logger = new Logger(EmailService.name);
  private readonly defaultFrom = 'noreply@axentralab.com';

  constructor(private configService: ConfigService) {
    // Check if Resend is configured
    this.resendApiKey = this.configService.get('RESEND_API_KEY');
    if (this.resendApiKey) {
      this.useResend = true;
      this.logger.log('Email service: using Resend');
    } else {
      // Fall back to SMTP
      const host = this.configService.get('SMTP_HOST');
      const port = Number(this.configService.get('SMTP_PORT') || 587);
      const user = this.configService.get('SMTP_USER');
      const pass = this.configService.get('SMTP_PASSWORD');

      if (host && user && pass) {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: {
            user,
            pass,
          },
        });
        this.logger.log('Email service: using SMTP');
      } else {
        this.logger.warn('⚠️  No email service configured (Resend or SMTP) — emails will be logged only');
        this.transporter = null;
      }
    }
  }

  async sendMail(to: string, subject: string, html: string, text?: string) {
    const from = this.configService.get('SMTP_FROM') || this.defaultFrom;

    if (this.useResend) {
      return this.sendViaResend(from, to, subject, html, text);
    }

    if (!this.transporter) {
      this.logger.log(`📧 Email (mock) to=${to} subject="${subject}"`);
      return { mocked: true, success: true };
    }

    try {
      const info = await this.transporter.sendMail({
        from,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''),
      });
      this.logger.log(`✅ Email sent to ${to} — ID: ${info.messageId}`);
      return info;
    } catch (err) {
      this.logger.error(`❌ Error sending email to ${to}:`, err.message);
      throw err;
    }
  }

  private async sendViaResend(from: string, to: string, subject: string, html: string, text?: string) {
    try {
      const response = await axios.post(
        'https://api.resend.com/emails',
        {
          from,
          to,
          subject,
          html,
          text: text || html.replace(/<[^>]*>/g, ''),
        },
        {
          headers: {
            Authorization: `Bearer ${this.resendApiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      this.logger.log(`✅ Email sent via Resend to ${to} — ID: ${response.data.id}`);
      return response.data;
    } catch (err) {
      this.logger.error(`❌ Error sending email via Resend to ${to}:`, err.response?.data || err.message);
      throw err;
    }
  }

  async sendVerificationEmail(to: string, userName: string, verificationUrl: string) {
    const subject = 'Verify your Axentralab email';
    const html = `
      <h2>Welcome to Axentralab! 🎉</h2>
      <p>Hi ${userName},</p>
      <p>Please verify your email address to activate your account:</p>
      <p><a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a></p>
      <p>Or copy this link: <code>${verificationUrl}</code></p>
      <p>This link expires in 24 hours.</p>
      <hr>
      <p>If you didn't create this account, ignore this email.</p>
    `;
    return this.sendMail(to, subject, html);
  }

  async sendPasswordReset(to: string, userName: string, resetUrl: string) {
    const subject = 'Reset your Axentralab password';
    const html = `
      <h2>Password Reset Request</h2>
      <p>Hi ${userName},</p>
      <p>We received a request to reset your password. Click the link below:</p>
      <p><a href="${resetUrl}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
      <p>Or copy this link: <code>${resetUrl}</code></p>
      <p>This link expires in 1 hour.</p>
      <hr>
      <p>If you didn't request this, ignore this email.</p>
    `;
    return this.sendMail(to, subject, html);
  }

  async sendDowntimeAlert(to: string, websiteName: string, websiteUrl: string, statusCode?: number, responseTime?: number) {
    const subject = `🔴 ALERT: ${websiteName} is DOWN`;
    const html = `
      <h2 style="color: #dc3545;">Website Down Alert</h2>
      <p>Your website <strong>${websiteName}</strong> is currently unreachable.</p>
      <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Website:</strong> <a href="${websiteUrl}">${websiteUrl}</a></p>
        <p><strong>Status:</strong> Down</p>
        ${statusCode ? `<p><strong>HTTP Status:</strong> ${statusCode}</p>` : ''}
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      </div>
      <p><a href="${process.env.FRONTEND_URL}/dashboard" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Dashboard</a></p>
      <hr>
      <p><small>This is an automated alert. If this is incorrect, check your website manually or adjust monitoring settings.</small></p>
    `;
    return this.sendMail(to, subject, html);
  }

  async sendRecoveryAlert(to: string, websiteName: string, websiteUrl: string, downtime?: string) {
    const subject = `✅ RECOVERED: ${websiteName} is back online`;
    const html = `
      <h2 style="color: #28a745;">Website Recovery Alert</h2>
      <p>Your website <strong>${websiteName}</strong> is now back online.</p>
      <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Website:</strong> <a href="${websiteUrl}">${websiteUrl}</a></p>
        <p><strong>Status:</strong> Online ✓</p>
        ${downtime ? `<p><strong>Downtime Duration:</strong> ${downtime}</p>` : ''}
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      </div>
      <p><a href="${process.env.FRONTEND_URL}/dashboard" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Dashboard</a></p>
    `;
    return this.sendMail(to, subject, html);
  }

  async sendPaymentFailed(to: string, userName: string, invoiceAmount?: string) {
    const subject = `⚠️  Payment failed — action required`;
    const html = `
      <h2 style="color: #dc3545;">Payment Failed</h2>
      <p>Hi ${userName},</p>
      <p>We were unable to process your recent payment${invoiceAmount ? ` for $${invoiceAmount}` : ''}.</p>
      <p>Please update your payment method to avoid service interruption:</p>
      <p><a href="${process.env.FRONTEND_URL}/dashboard/billing" style="background-color: #ffc107; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Update Payment Method</a></p>
      <hr>
      <p><small>Your services will be paused in 7 days if payment is not received.</small></p>
    `;
    return this.sendMail(to, subject, html);
  }

  async sendPaymentSuccess(to: string, userName: string, invoiceAmount: string, planName: string) {
    const subject = `✅ Payment received — thank you`;
    const html = `
      <h2 style="color: #28a745;">Payment Received</h2>
      <p>Hi ${userName},</p>
      <p>Thank you for your payment! Your account is now active.</p>
      <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Plan:</strong> ${planName}</p>
        <p><strong>Amount:</strong> $${invoiceAmount}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      <p><a href="${process.env.FRONTEND_URL}/dashboard" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Dashboard</a></p>
    `;
    return this.sendMail(to, subject, html);
  }

  async sendMonthlyReport(to: string, userName: string, reportUrl: string, reportPeriod: string) {
    const subject = `📊 Your Axentralab monthly report — ${reportPeriod}`;
    const html = `
      <h2>Monthly Report</h2>
      <p>Hi ${userName},</p>
      <p>Your monthly maintenance report for <strong>${reportPeriod}</strong> is ready!</p>
      <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><a href="${reportUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">📥 Download Report (PDF)</a></p>
      </div>
      <p>Highlights:</p>
      <ul>
        <li>Uptime & availability</li>
        <li>Security scans & alerts</li>
        <li>Backups performed</li>
        <li>Performance metrics</li>
      </ul>
      <p><a href="${process.env.FRONTEND_URL}/dashboard/reports" style="color: #007bff;">View more details →</a></p>
    `;
    return this.sendMail(to, subject, html);
  }

  async sendSecurityAlert(to: string, websiteName: string, findings: string[]) {
    const subject = `🔒 Security Alert: ${websiteName}`;
    const html = `
      <h2 style="color: #dc3545;">Security Alert</h2>
      <p>Security scan found issues on <strong>${websiteName}</strong>:</p>
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <ul>
          ${findings.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>
      <p><a href="${process.env.FRONTEND_URL}/dashboard/security" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Review Security Report</a></p>
    `;
    return this.sendMail(to, subject, html);
  }
}
