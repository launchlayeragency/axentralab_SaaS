import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import { EmailService } from '../common/email/email.service';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class SecurityService {
  private readonly logger = new Logger(SecurityService.name);
  private virustotalApiKey: string;

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {
    this.virustotalApiKey = this.configService.get('VIRUSTOTAL_API_KEY');
  }

  // Run daily at 3 AM
  @Cron('0 3 * * *')
  async performDailyScans() {
    this.logger.log('🔒 Running daily security scans...');
    const websites = await this.prisma.website.findMany({
      include: { user: true },
    });

    for (const website of websites) {
      try {
        await this.scanWebsite(website.id);
      } catch (err) {
        this.logger.error(`Security scan failed for ${website.url}:`, err.message);
      }
    }
  }

  async scanWebsite(websiteId: string) {
    const website = await this.prisma.website.findUnique({
      where: { id: websiteId },
      include: { user: true },
    });

    if (!website) throw new Error('Website not found');

    const findings: string[] = [];
    let riskScore = 0;

    // Check 1: SSL/TLS Certificate
    const sslCheck = await this.checkSSL(website.url);
    if (!sslCheck.valid) {
      findings.push(`🔴 SSL Certificate Issue: ${sslCheck.reason}`);
      riskScore += 30;
    } else if (sslCheck.daysUntilExpiry < 30) {
      findings.push(`🟡 SSL Certificate expires in ${sslCheck.daysUntilExpiry} days`);
      riskScore += 10;
    }

    // Check 2: Common Security Headers
    const headerCheck = await this.checkSecurityHeaders(website.url);
    if (headerCheck.missingHeaders.length > 0) {
      findings.push(`🟡 Missing security headers: ${headerCheck.missingHeaders.join(', ')}`);
      riskScore += 15;
    }

    // Check 3: VirusTotal scan (if configured)
    if (this.virustotalApiKey) {
      const vtCheck = await this.checkVirusTotal(website.url);
      if (vtCheck.malicious > 0) {
        findings.push(`🔴 VirusTotal: ${vtCheck.malicious} vendors flagged as malicious`);
        riskScore += 50;
      } else if (vtCheck.suspicious > 0) {
        findings.push(`🟡 VirusTotal: ${vtCheck.suspicious} vendors flagged as suspicious`);
        riskScore += 15;
      }
    }

    // Check 4: Common vulnerabilities
    const commonVulnCheck = await this.checkCommonVulnerabilities(website.url);
    if (commonVulnCheck.length > 0) {
      findings.push(...commonVulnCheck.map(v => `🟡 Potential vulnerability: ${v}`));
      riskScore += commonVulnCheck.length * 5;
    }

    // Cap risk score at 100
    riskScore = Math.min(riskScore, 100);

    // Save scan to database
    const scan = await this.prisma.securityScan.create({
      data: {
        websiteId,
        riskScore,
        findings: findings.join('\n'),
        scannedAt: new Date(),
      },
    });

    this.logger.log(`✅ Security scan completed for ${website.url} (risk score: ${riskScore})`);

    // Send alert if risk score is high
    if (riskScore >= 30 && website.user) {
      await this.emailService.sendSecurityAlert(website.user.email, website.name, findings);
    }

    return scan;
  }

  private async checkSSL(url: string): Promise<{ valid: boolean; reason?: string; daysUntilExpiry?: number }> {
    try {
      const hostname = new URL(url).hostname;
      const response = await axios.get(`https://www.ssllabs.com/api/v3/analyze?host=${hostname}`, {
        timeout: 10000,
      });

      if (response.data.status === 'READY') {
        const grade = response.data.grade;
        const valid = ['A', 'A+'].includes(grade);
        return { valid, reason: `SSL Grade: ${grade}` };
      }

      // Fallback: check certificate expiry
      return await this.checkSSLExpiry(hostname);
    } catch (err) {
      this.logger.warn(`SSL check failed for ${url}: ${err.message}`);
      return { valid: true }; // Assume secure if check fails
    }
  }

  private async checkSSLExpiry(hostname: string): Promise<{ valid: boolean; daysUntilExpiry?: number }> {
    try {
      const https = await import('https');
      return new Promise((resolve) => {
        const request = https.request(
          { hostname, port: 443, method: 'HEAD' },
          (res) => {
            const cert = res.socket.getPeerCertificate();
            if (cert && cert.valid_to) {
              const expiryDate = new Date(cert.valid_to);
              const now = new Date();
              const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              const valid = daysUntilExpiry > 0;
              resolve({ valid, daysUntilExpiry });
            } else {
              resolve({ valid: false });
            }
          },
        );
        request.on('error', () => resolve({ valid: true }));
        request.end();
      });
    } catch (err) {
      return { valid: true };
    }
  }

  private async checkSecurityHeaders(url: string): Promise<{ missingHeaders: string[] }> {
    try {
      const response = await axios.head(url, { timeout: 5000, maxRedirects: 5 });
      const headers = response.headers;

      const requiredHeaders = [
        'x-content-type-options',
        'x-frame-options',
        'strict-transport-security',
        'content-security-policy',
      ];

      const missingHeaders = requiredHeaders.filter(h => !headers[h]);
      return { missingHeaders };
    } catch (err) {
      this.logger.warn(`Header check failed for ${url}: ${err.message}`);
      return { missingHeaders: [] };
    }
  }

  private async checkVirusTotal(url: string): Promise<{ malicious: number; suspicious: number }> {
    if (!this.virustotalApiKey) {
      return { malicious: 0, suspicious: 0 };
    }

    try {
      const response = await axios.get('https://www.virustotal.com/api/v3/urls/search', {
        params: { query: url },
        headers: { 'x-apikey': this.virustotalApiKey },
        timeout: 10000,
      });

      if (response.data.data && response.data.data.length > 0) {
        const result = response.data.data[0];
        const stats = result.attributes.last_analysis_stats;
        return {
          malicious: stats.malicious || 0,
          suspicious: stats.suspicious || 0,
        };
      }

      return { malicious: 0, suspicious: 0 };
    } catch (err) {
      this.logger.warn(`VirusTotal check failed: ${err.message}`);
      return { malicious: 0, suspicious: 0 };
    }
  }

  private async checkCommonVulnerabilities(url: string): Promise<string[]> {
    const vulnerabilities: string[] = [];

    try {
      const response = await axios.head(url, { timeout: 5000, maxRedirects: 5 });
      const server = response.headers['server'];

      // Check for outdated server signatures
      if (server) {
        if (server.toLowerCase().includes('apache/2.2')) {
          vulnerabilities.push('Outdated Apache version (2.2)');
        }
        if (server.toLowerCase().includes('nginx/1.')) {
          vulnerabilities.push('Outdated Nginx version (1.x)');
        }
      }

      // Check for common vulnerability exposures
      const exposedPaths = ['/.git/', '/.env', '/wp-config.php.bak', '/config.php.bak'];
      for (const path of exposedPaths) {
        try {
          const pathCheck = await axios.head(url + path, { timeout: 2000 });
          if (pathCheck.status < 400) {
            vulnerabilities.push(`Exposed file detected: ${path}`);
          }
        } catch {
          // Path not found, which is good
        }
      }
    } catch (err) {
      this.logger.warn(`Common vulnerability check failed: ${err.message}`);
    }

    return vulnerabilities;
  }

  async getScans(userId: string, websiteId: string) {
    return this.prisma.securityScan.findMany({
      where: {
        website: {
          id: websiteId,
          userId,
        },
      },
      orderBy: { scannedAt: 'desc' },
      take: 30,
    });
  }

  async manualScan(userId: string, websiteId: string) {
    const website = await this.prisma.website.findFirst({
      where: { id: websiteId, userId },
    });

    if (!website) throw new Error('Website not found');

    return this.scanWebsite(websiteId);
  }

  async getLatestScans(userId: string) {
    return this.prisma.securityScan.findMany({
      where: {
        website: { userId },
      },
      orderBy: { scannedAt: 'desc' },
      take: 5,
    });
  }
}
