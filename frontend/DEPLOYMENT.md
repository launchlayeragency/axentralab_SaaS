# Deployment Guide

## Prerequisites

- Vercel account (for frontend)
- PostgreSQL database (Railway, Supabase, or similar)
- Stripe account
- Domain name (optional)

## Step 1: Frontend Deployment (Vercel)

### Option A: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
cd axentralab-saas
vercel
```

### Option B: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_SITE_URL`

6. Click "Deploy"

## Step 2: Database Setup

### Option A: Railway

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL database
4. Copy connection string
5. Add to environment variables

### Option B: Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy connection string
5. Add to environment variables

## Step 3: Backend Deployment

### Choose your backend:

#### Option A: NestJS Backend

1. Create separate repository for backend
2. Deploy to Railway/Render:
```bash
# Railway
railway login
railway init
railway up
```

3. Set environment variables
4. Connect to PostgreSQL

#### Option B: Laravel Backend

1. Create separate repository for backend
2. Deploy to Laravel Forge or VPS
3. Configure Nginx/Apache
4. Set environment variables
5. Run migrations

## Step 4: Stripe Integration

1. Go to [stripe.com/dashboard](https://dashboard.stripe.com)
2. Get API keys:
   - Test mode keys for development
   - Live mode keys for production
3. Create products and prices
4. Set up webhooks:
   - URL: `https://your-api.com/webhooks/stripe`
   - Events: 
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

## Step 5: Email Service

### Option A: Resend

1. Go to [resend.com](https://resend.com)
2. Get API key
3. Verify domain
4. Add to environment variables

### Option B: SMTP

1. Use service like SendGrid, Mailgun, or AWS SES
2. Get SMTP credentials
3. Add to environment variables

## Step 6: Storage (S3)

### Option A: Backblaze B2

1. Create account at [backblaze.com](https://www.backblaze.com)
2. Create bucket
3. Get application key
4. Add credentials to environment

### Option B: Wasabi

1. Create account at [wasabi.com](https://wasabi.com)
2. Create bucket
3. Get access keys
4. Add credentials to environment

## Step 7: Domain Setup

1. Purchase domain from registrar
2. Add custom domain in Vercel:
   - Go to Project Settings → Domains
   - Add your domain
   - Follow DNS instructions

3. Configure DNS records:
```
Type  Name  Value
A     @     76.76.21.21
CNAME www   cname.vercel-dns.com
```

4. Wait for DNS propagation (up to 48 hours)

## Step 8: SSL Certificate

- Vercel automatically provides SSL certificates
- No additional configuration needed

## Step 9: Monitoring & Alerts

1. Set up UptimeRobot:
   - Create monitors for your site
   - Configure alert contacts

2. Set up error tracking (optional):
   - Sentry
   - LogRocket
   - Bugsnag

## Step 10: Final Checks

### Security
- [ ] Environment variables are secure
- [ ] API endpoints are protected
- [ ] CORS is configured correctly
- [ ] Rate limiting is enabled
- [ ] SQL injection prevention
- [ ] XSS protection

### Performance
- [ ] Images are optimized
- [ ] Code is minified
- [ ] Caching is configured
- [ ] CDN is enabled

### SEO
- [ ] Meta tags are set
- [ ] Sitemap is generated
- [ ] Robots.txt is configured
- [ ] Open Graph tags are set

### Testing
- [ ] Test all user flows
- [ ] Test payment integration
- [ ] Test email delivery
- [ ] Test backup/restore
- [ ] Test monitoring alerts

## Maintenance

### Regular Tasks
- Monitor error logs
- Check backup integrity
- Review security alerts
- Update dependencies
- Monitor performance metrics

### Scaling
- Upgrade database as needed
- Add Redis for caching
- Configure CDN
- Set up load balancing
- Add queue system for background jobs

## Troubleshooting

### Build Failures
- Check Node.js version (18+)
- Clear build cache
- Check environment variables
- Review build logs

### Database Connection Issues
- Verify connection string
- Check IP whitelist
- Verify database credentials
- Check SSL requirements

### Email Delivery Issues
- Verify domain authentication
- Check spam folder
- Review email service logs
- Verify API keys

## Support

For deployment issues, contact:
- Email: support@axentralab.com
- Documentation: docs.axentralab.com

## Cost Estimates

### Monthly Costs (Approximate)
- Vercel (Pro): $20/month
- Database (Railway): $5-20/month
- Stripe: 2.9% + 30¢ per transaction
- Email (Resend): $0-20/month
- Storage (Backblaze): $5/TB/month
- Domain: $10-15/year

Total: ~$50-100/month for small scale

---

Last updated: February 2026
