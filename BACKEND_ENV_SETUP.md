# Backend Environment Variables Setup Guide for Render/Production

## Required Environment Variables for Deployment

### 1. DATABASE
```
DATABASE_URL=postgresql://username:password@host:5432/axentralab?schema=public
```
**Where to get:**
- Render: Creates automatically when you add PostgreSQL
- From Render dashboard: Services → PostgreSQL → Connection String

---

### 2. SERVER & NODE
```
PORT=3001
NODE_ENV=production
```

---

### 3. JWT AUTHENTICATION ⭐ CRITICAL
```
JWT_SECRET=<generate_random_32_chars>
JWT_EXPIRES_IN=7d
```
**Generate strong secret (run in terminal):**
```bash
# On Windows PowerShell:
-join ((33..126) | Get-Random -Count 32 | % {[char]$_})

# Or use online: https://www.random.org/strings/
```

---

### 4. FRONTEND URL
```
FRONTEND_URL=https://your-vercel-frontend-url.vercel.app
# For custom domain: https://app.yourdomain.com
```

---

### 5. STRIPE PAYMENT INTEGRATION ⭐ REQUIRED
Go to: https://dashboard.stripe.com/apikeys

```
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
STRIPE_STARTER_PRICE_ID=price_xxxxxxxxxxxx
STRIPE_PRO_PRICE_ID=price_xxxxxxxxxxxx
STRIPE_AGENCY_PRICE_ID=price_xxxxxxxxxxxx
```

**Steps:**
1. Get Live API Keys (not Test)
2. Create Product Plans in Stripe → Products
3. Create Webhook: Settings → Webhooks → Add endpoint
   - Endpoint URL: `https://your-backend-url/api/subscriptions/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy Webhook Secret

---

### 6. EMAIL SERVICE (Choose ONE) ⭐ REQUIRED

#### Option A: RESEND (Recommended - Easiest)
https://resend.com

```
RESEND_API_KEY=re_xxxxxxxxxxxx
```

#### Option B: SMTP (Gmail, SendGrid, etc.)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=Axentralab <noreply@axentralab.com>
```

For Gmail: Use App Password (not regular password)
- https://myaccount.google.com/apppasswords

---

### 7. S3 / CLOUD STORAGE ⭐ REQUIRED (For Backups)

Choose ONE provider:

#### A. AWS S3
https://aws.amazon.com/s3/
```
S3_ACCESS_KEY_ID=AKIA...
S3_SECRET_ACCESS_KEY=...
S3_BUCKET=axentralab-backups
S3_REGION=us-east-1
S3_ENDPOINT=https://s3.amazonaws.com
```

#### B. Wasabi (Cheaper ✅)
https://wasabi.com
```
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_BUCKET=axentralab-backups
S3_REGION=us-east-1
S3_ENDPOINT=https://s3.wasabisys.com
```

#### C. Backblaze B2
https://www.backblaze.com/b2/cloud-storage.html
```
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_BUCKET=axentralab-backups
S3_REGION=us-west-004
S3_ENDPOINT=https://s3.us-west-004.backblazeb2.com
```

---

### 8. REDIS (For Job Queue)
```
REDIS_URL=redis://host:port
```
**Render:** Add Redis service automatically (or use Redis Cloud)

---

### 9. MONITORING SETTINGS (Optional)
```
MONITORING_INTERVAL_SECONDS=300
MONITORING_TIMEOUT_SECONDS=30
```

---

### 10. BACKUP SETTINGS (Optional)
```
BACKUP_RETENTION_DAYS=30
BACKUP_SCHEDULE=0 2 * * *
```

---

### 11. VIRUSTOTAL API (Optional - for security scanning)
https://www.virustotal.com/gui/my-apikey
```
VIRUSTOTAL_API_KEY=your_api_key
```

---

### 12. TWILIO SMS ALERTS (Optional)
https://www.twilio.com/console
```
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890
```

---

## Setup in Render Dashboard

1. Go to your Backend Service
2. Click **Settings**
3. Scroll to **Environment Variables**
4. Add each variable:
   - Key: `VARIABLE_NAME`
   - Value: `actual_value`
5. Click **Save**
6. Service will auto-redeploy

---

## Summary: Minimum Required Variables

These are the ABSOLUTE MINIMUM needed to run:

```
DATABASE_URL=...
NODE_ENV=production
PORT=3001
JWT_SECRET=... (strong random string)
FRONTEND_URL=... (your Vercel URL)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_AGENCY_PRICE_ID=price_...
RESEND_API_KEY=re_... (or SMTP variables)
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_BUCKET=...
S3_REGION=...
S3_ENDPOINT=...
REDIS_URL=...
```

---

**Status:** ✅ All files configured and pushed to GitHub
**Next Step:** Set these variables in Render dashboard
