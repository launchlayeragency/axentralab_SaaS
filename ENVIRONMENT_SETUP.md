# Quick Start Guide - Environment Setup

This guide helps you set up environment variables quickly for development and production.

---

## 🔧 Development Setup (Local)

### 1. Backend Environment

```bash
cd backend

# Copy the example env file
cp .env.example .env

# Edit with your local values
nano .env
```

**Development .env template:**

```env
# Database (SQLite for dev, PostgreSQL for prod)
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="dev-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV="development"

# Frontend URL
FRONTEND_URL="http://localhost:3000"

# Stripe (Test Keys)
STRIPE_SECRET_KEY="sk_test_YOUR_TEST_KEY"
STRIPE_WEBHOOK_SECRET="whsec_test_YOUR_TEST_SECRET"
STRIPE_STARTER_PRICE_ID="price_1234567890"
STRIPE_PRO_PRICE_ID="price_0987654321"
STRIPE_AGENCY_PRICE_ID="price_5555555555"

# Email (Mock mode - logs to console)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="Axentralab <noreply@localhost>"

# S3 (Optional for dev)
# S3_ACCESS_KEY_ID="optional"
# S3_SECRET_ACCESS_KEY="optional"
# S3_BUCKET="optional"
# S3_REGION="us-east-1"

# Redis (Local)
REDIS_URL="redis://localhost:6379"

# Monitoring Settings
MONITORING_INTERVAL_SECONDS=60
MONITORING_TIMEOUT_SECONDS=10

# Backup Settings
BACKUP_RETENTION_DAYS=7
BACKUP_SCHEDULE="0 2 * * *"
```

### 2. Frontend Environment

```bash
cd frontend

# Copy environment file
cp .env.example .env.local
```

**Development .env.local template:**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_TEST_KEY
```

### 3. Start Services

**Terminal 1 - Backend API:**
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate  # Only first time
npm run start:dev
```

**Terminal 2 - Backend Worker (optional):**
```bash
cd backend
npm run start:worker
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Terminal 4 - Redis (if using Docker):**
```bash
docker run -d -p 6379:6379 redis:alpine
```

**Terminal 5 - Stripe Webhook Testing:**
```bash
stripe listen --forward-to localhost:3001/api/subscriptions/webhook
# Copy webhook secret to STRIPE_WEBHOOK_SECRET
```

---

## 🔐 Generate Strong Secrets

### JWT Secret
```bash
# macOS/Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### Database Password
```bash
# Simple strong password
openssl rand -hex 16

# Or use a password generator
# https://www.random.org/passwords/
```

---

## 📧 Email Service Setup

### Option 1: Resend (Easiest)

1. Sign up: [resend.com](https://resend.com)
2. Create API key
3. Add to .env:
```env
RESEND_API_KEY=re_YOUR_KEY
```

### Option 2: Gmail SMTP

1. Enable 2FA on your Google account
2. Create App Password: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Add to .env:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-digit-app-password
```

### Option 3: SendGrid

1. Sign up: [sendgrid.com](https://sendgrid.com)
2. Create API key
3. Add to .env:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.YOUR_SENDGRID_KEY
```

---

## 💳 Stripe Setup

### Test Keys (Development)

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Sign up for free
3. Click "Developers" → "API keys"
4. Copy "Secret key" (starts with `sk_test_`)
5. Copy "Publishable key" (starts with `pk_test_`)
6. Add to your .env files

### Create Test Products

1. Go to "Products" → "Create product"
2. Create 3 products:
   - **Starter**: $9/month (50 websites)
   - **Pro**: $29/month (200 websites)
   - **Agency**: $99/month (unlimited)
3. Copy price IDs to .env:

```env
STRIPE_STARTER_PRICE_ID=price_xxxxx
STRIPE_PRO_PRICE_ID=price_xxxxx
STRIPE_AGENCY_PRICE_ID=price_xxxxx
```

### Test Payments

Use Stripe test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Auth**: `4000 0025 0000 3155`

---

## 🪣 S3/Wasabi Setup (Optional)

### For Development (Skip S3)
Leave S3 variables empty — backups will be logged only.

### For Production: Wasabi

1. Sign up: [wasabisys.com](https://wasabisys.com)
2. Create bucket: `axentralab-backups`
3. Create access key in settings
4. Add to .env:

```env
S3_ACCESS_KEY_ID=your_access_key
S3_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET=axentralab-backups
S3_REGION=us-west-1
S3_ENDPOINT=https://s3.wasabisys.com
```

### For Production: Backblaze B2

1. Sign up: [backblaze.com](https://backblaze.com)
2. Create bucket
3. Create application key
4. Add to .env:

```env
S3_ACCESS_KEY_ID=your_key_id
S3_SECRET_ACCESS_KEY=your_application_key
S3_BUCKET=your_bucket_name
S3_REGION=us-west-004
S3_ENDPOINT=https://s3.us-west-004.backblazeb2.com
```

---

## 🔒 Security Scanning (Optional)

### VirusTotal API

1. Sign up: [virustotal.com](https://www.virustotal.com/gui/my-apikey)
2. Copy API key
3. Add to .env:

```env
VIRUSTOTAL_API_KEY=your_api_key
```

Leave blank to skip VirusTotal checks (basic security scans will still run).

---

## ✅ Verify Your Setup

### Backend
```bash
# Should return 401 (no auth token)
curl http://localhost:3001/api/auth/me
```

### Frontend
```bash
# Should load the app
open http://localhost:3000
```

### Email (if configured)
```bash
# Send test email
curl -X POST http://localhost:3001/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Stripe Webhook
```bash
# Should see "Webhook received"
stripe trigger payment_intent.succeeded
```

---

## 🚀 Production Setup

Once everything works locally:

1. Copy `.env.production` template
2. Get real values for all services
3. Never commit `.env` files to git
4. Use hosting platform's environment variable interface
5. Test in staging before deploying to production

See [`PRODUCTION_DEPLOYMENT.md`](./PRODUCTION_DEPLOYMENT.md) for detailed instructions.

---

## 🆘 Troubleshooting

### Port already in use
```bash
# Find and kill process on port 3001
lsof -i :3001
kill -9 <PID>

# Or use different port
PORT=3002 npm run start:dev
```

### Cannot connect to Redis
```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# Start Redis with Docker
docker run -d -p 6379:6379 redis:alpine
```

### Email not sending
1. Check SMTP credentials
2. Verify email from address
3. Check spam folder
4. Review logs in backend console

### Database connection error
```bash
# Test PostgreSQL connection
psql postgresql://user:pass@localhost:5432/axentralab

# Or use Prisma Studio
npm run prisma:studio
```

---

**Ready to develop!** 🎉
