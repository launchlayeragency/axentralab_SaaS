# Axentralab - Complete Production Deployment Guide

This guide will walk you through deploying Axentralab to production across all required services: Frontend (Vercel), Backend (Railway/Render), Database, and Storage.

---

## 🎯 Overview: What You're Deploying

| Component | Service | Hosting |
|-----------|---------|---------|
| **Frontend** | Next.js 14 | Vercel (recommended) |
| **Backend API** | NestJS | Railway, Render, or VPS |
| **Database** | PostgreSQL | Managed service (Supabase, RDS, Railway) |
| **Storage** | S3-compatible | Wasabi, Backblaze, or AWS S3 |
| **Email** | Resend/SMTP | Resend or your email provider |
| **Worker Jobs** | BullMQ + Redis | Railway, Render, or self-hosted |

**Total Setup Time: 2-4 hours**

---

## ✅ Pre-Deployment Checklist

### Step 1: Prepare GitHub Repository

```bash
# Initialize git (if not already done)
cd axentralab-full-stack
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Axentralab full-stack SaaS"

# Push to GitHub
git remote add origin https://github.com/YOUR-USERNAME/axentralab-full-stack.git
git branch -M main
git push -u origin main
```

**Create .gitignore** to exclude sensitive files:
```
# Environment files
.env
.env.local
.env.*.local

# Node modules
node_modules/
dist/
build/

# Database
*.db
*.sqlite

# Logs
logs/
*.log
npm-debug.log*

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db
```

---

## 🚀 Part 1: Backend Deployment

### Option A: Railway (⭐ Recommended - Easiest)

#### 1. Sign Up & Create Project

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub"
5. Choose your repository

#### 2. Configure Database

1. Click "Add Service"
2. Select "PostgreSQL"
3. Railway automatically sets `DATABASE_URL` ✓

#### 3. Configure Redis

1. Click "Add Service"
2. Select "Redis"
3. Railway automatically sets `REDIS_URL` ✓

#### 4. Configure Backend Service

1. Set Root Directory: `/backend`
2. Go to Variables tab
3. Add all `.env.production` variables:

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=[Generate: openssl rand -base64 32]
FRONTEND_URL=https://app.yourdomain.com
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_BUCKET=axentralab-backups
S3_REGION=us-east-1
VIRUSTOTAL_API_KEY=[optional]
```

#### 5. Configure Build & Deploy

- **Build Command**: `npm install && npm run build && npx prisma generate`
- **Start Command**: `npm run start:prod`

#### 6. Deploy Migrations

In Railway console tab:
```bash
npx prisma migrate deploy
```

✅ **Backend is now LIVE!**

Get your API URL from Railway dashboard (e.g., `https://railway-api.up.railway.app`)

---

### Option B: Render

#### 1. Create Web Service

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repository
4. Select `/backend` as root directory

#### 2. Environment Variables

Add all production variables (see Railway section)

#### 3. Build & Start Commands

- **Build**: `npm install && npm run build && npx prisma generate`
- **Start**: `npm run start:prod`

#### 4. Database

Create PostgreSQL database in Render (paid tier required for PostgreSQL)

#### 5. Redis

Use Render's Redis or external Redis service

---

### Option C: Self-Hosted VPS

```bash
# SSH into your VPS
ssh -i your-key.pem ubuntu@your-vps-ip

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Install Redis
sudo apt-get install -y redis-server

# Install PM2 (process manager)
sudo npm install -g pm2

# Clone repo
git clone https://github.com/YOUR-USERNAME/axentralab-full-stack.git
cd axentralab-full-stack/backend

# Install & build
npm install
npm run build

# Setup .env
cp .env.example .env
# Edit .env with your values
nano .env

# Run migrations
npx prisma migrate deploy

# Start with PM2
pm2 start dist/main.js --name "axentralab-api"
pm2 save
pm2 startup

# Setup Nginx reverse proxy
sudo apt-get install -y nginx
sudo tee /etc/nginx/sites-available/api.yourdomain.com <<EOF
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/api.yourdomain.com /etc/nginx/sites-enabled/
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly -a standalone -d api.yourdomain.com
```

---

## 🎨 Part 2: Frontend Deployment

### Deploy to Vercel

#### 1. Connect GitHub

1. Go to [vercel.com](https://vercel.com)
2. "New Project" → "Import Git Repository"
3. Select your repository

#### 2. Configure Project

- **Framework**: Next.js
- **Root Directory**: `./frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

#### 3. Environment Variables

In Vercel Project Settings → Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY
```

#### 4. Deploy

Click "Deploy" — Vercel will automatically build and deploy! ✅

Your frontend will be at: `https://your-app-name.vercel.app`

---

## 🗄️ Part 3: Database & Storage Setup

### PostgreSQL Database

**Option 1: Managed Service** (Recommended)

- Railway/Render: Automatic setup ✓
- Supabase: [supabase.com](https://supabase.com)
  - Create project
  - Copy `DATABASE_URL`
  - Run: `npx prisma migrate deploy`

**Option 2: Self-Hosted**

```bash
# Create database
sudo -u postgres createdb axentralab

# Create user
sudo -u postgres psql
CREATE USER axentralab_user WITH PASSWORD 'STRONG_PASSWORD';
ALTER ROLE axentralab_user SET client_encoding TO 'utf8';
ALTER ROLE axentralab_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE axentralab_user CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE axentralab TO axentralab_user;
\q
```

### S3-Compatible Storage (For Backups)

**Option 1: Wasabi** (⭐ Recommended - cheap, fast)

1. Go to [wasabisys.com](https://wasabisys.com)
2. Create account
3. Create bucket: `axentralab-backups`
4. Create access key
5. Add to environment variables:

```env
S3_ACCESS_KEY_ID=your_wasabi_key
S3_SECRET_ACCESS_KEY=your_wasabi_secret
S3_BUCKET=axentralab-backups
S3_REGION=us-west-1
S3_ENDPOINT=https://s3.wasabisys.com
```

**Option 2: Backblaze B2**

1. Sign up at [backblaze.com](https://backblaze.com)
2. Create bucket
3. Create application key
4. Configure endpoint:
```env
S3_ENDPOINT=https://s3.us-west-004.backblazeb2.com
```

**Option 3: AWS S3**

1. Create S3 bucket
2. Generate IAM access keys with S3 permissions
3. Use default AWS endpoint

---

## 📧 Part 4: Email Service Setup

### Option A: Resend (⭐ Easiest)

1. Go to [resend.com](https://resend.com)
2. Sign up
3. Click "API Keys" → Copy key
4. Add to environment:

```env
RESEND_API_KEY=re_YOUR_KEY
```

**Verify your domain**:
1. Add DNS records from Resend dashboard
2. Wait for verification (15-30 min)

### Option B: SMTP (Gmail Example)

1. Enable 2FA on Google account
2. Create App Password: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Add environment variables:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM="Axentralab <noreply@yourdomain.com>"
```

---

## 💳 Part 5: Stripe Webhook Setup

### Configure Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://api.yourdomain.com/api/subscriptions/webhook`
4. Event: Select `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`
5. Copy webhook secret
6. Add to environment:

```env
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
```

**Test webhook locally**:
```bash
stripe listen --forward-to localhost:3001/api/subscriptions/webhook
```

---

## 🔒 Part 6: Custom Domain & SSL

### Setup Custom Domain

1. Register domain (Namecheap, GoDaddy, etc.)
2. Point to Vercel for frontend:
   - Create `CNAME` record: `app.yourdomain.com → cname.vercel-dns.com`
3. Point to Railway/Render for backend:
   - Create `CNAME` record: `api.yourdomain.com → your-railway-domain.railway.app`

### Enable HTTPS

- **Vercel**: Automatic SSL ✓
- **Railway**: Automatic SSL ✓
- **VPS**: Use Let's Encrypt (certbot)

---

## 🧪 Part 7: Testing in Production

### Test Backend

```bash
# Test API health
curl https://api.yourdomain.com/api/auth/me

# Should return 401 (unauthorized) — this is correct without JWT
```

### Test Frontend

1. Visit `https://app.yourdomain.com`
2. Check browser console for errors
3. Test login/register flow

### Test Monitoring

1. Add a website in dashboard
2. Wait 5 minutes
3. Check monitoring table for uptime check results

### Test Email

1. Register new user
2. Check email for verification link

### Test Backup

1. Configure SSH/FTP credentials for a website
2. Wait until 2 AM UTC or trigger manual backup
3. Check S3 bucket for backup files

---

## ⚠️ Part 8: Production Safety Checklist

### Security

- [ ] JWT_SECRET is strong (use `openssl rand -base64 32`)
- [ ] Database password is strong
- [ ] S3 credentials are secured (use IAM roles if possible)
- [ ] CORS is configured correctly (backend only allows frontend domain)
- [ ] Environment variables are NOT in git repo
- [ ] HTTPS/SSL is enabled on all domains
- [ ] Stripe webhook is secured

### Monitoring

- [ ] Setup error tracking (Sentry, DataDog, etc.)
- [ ] Monitor Redis memory usage
- [ ] Monitor database connections
- [ ] Setup alerts for job failures
- [ ] Monitor backup job success rate

### Backups

- [ ] Database backups are automated (Railway/Render does this)
- [ ] S3 lifecycle policy: delete backups after 30 days
- [ ] Test restore process

### Team Access

- [ ] All env variables are documented in 1Password/LastPass
- [ ] Only authorized people have access to admin dashboard
- [ ] GitHub repo is private
- [ ] Production database connection is restricted by IP

---

## 🚨 Troubleshooting

### Backend not deploying

```bash
# Check logs
railway logs

# Or for Render
# Check Build Logs in dashboard
```

### Migrations failed

```bash
# In Railway console:
npx prisma migrate deploy --skip-ask

# Or force sync:
npx prisma db push --force-reset
```

### Emails not sending

- Check Resend dashboard for bounces
- Verify SMTP credentials
- Check email logs: `SELECT * FROM emails_log ORDER BY created_at DESC LIMIT 10;`

### Backups not running

- Check if Redis is connected: `redis-cli ping`
- Check if worker process is running
- Review backup job logs

### High database usage

```sql
-- Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Archive old check records
DELETE FROM checks WHERE created_at < NOW() - INTERVAL '90 days';
```

---

## 📊 Next Steps

1. **Monitor performance**: Setup APM (Application Performance Monitoring)
2. **Scale workers**: Increase MONITOR_WORKER_CONCURRENCY if needed
3. **Add features**: Enable VirusTotal scans, SMS alerts, etc.
4. **Team training**: Teach team how to use dashboard
5. **Marketing**: Launch beta/paid tier
6. **Analytics**: Add Segment/Mixpanel for user tracking

---

## 🆘 Getting Help

- **Backend Issues**: Check NestJS docs & backend/README.md
- **Frontend Issues**: Check Next.js docs & frontend/README.md
- **Railway**: [railway.app/docs](https://railway.app/docs)
- **Render**: [docs.render.com](https://docs.render.com)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)

---

**🎉 Congratulations! Your Axentralab SaaS is now live!**
