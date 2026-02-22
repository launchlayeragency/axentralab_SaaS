# Axentralab Backend API

NestJS-based REST API for Axentralab Website Maintenance SaaS platform.

## 🚀 Features Implemented

✅ **Authentication System**
- User registration with email verification
- JWT-based login
- Password reset functionality
- Profile management

✅ **Website Management**
- CRUD operations for websites
- Plan-based website limits
- Website statistics and analytics

✅ **Automated Monitoring**
- Cron job running every 5 minutes
- HTTP status code checking
- Response time measurement
- Uptime percentage calculation
- Automatic alerts on downtime

✅ **Alert System**
- Downtime alerts
- Recovery notifications
- Database storage of all alerts

✅ **Subscription Management**
- Stripe integration
- Checkout session creation
- Customer portal
- Webhook handling
- Plan limits enforcement

✅ **User Dashboard**
- Dashboard statistics API
- Notification settings
- Profile management

⏳ **Partial Implementation** (Stubs created):
- Backup system (cron job ready)
- Security scanning (cron job ready)
- Report generation (cron job ready)

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Stripe account (for payments)

## 🛠 Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

Create a PostgreSQL database:

```sql
CREATE DATABASE axentralab;
```

### 3. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update the values:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/axentralab?schema=public"
JWT_SECRET="your-secret-key-here"
STRIPE_SECRET_KEY="sk_test_..."
# ... other variables
```

### 4. Run Prisma Migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5. Start Development Server

```bash
npm run start:dev
```

API will be available at: **http://localhost:3001/api**

## 📡 API Endpoints

### Authentication

```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login
POST   /api/auth/verify-email      # Verify email
POST   /api/auth/forgot-password   # Request password reset
POST   /api/auth/reset-password    # Reset password
GET    /api/auth/me                # Get current user (protected)
```

### Users

```
GET    /api/users/profile                # Get user profile
PATCH  /api/users/profile                # Update profile
GET    /api/users/notifications          # Get notification settings
PATCH  /api/users/notifications          # Update notifications
GET    /api/users/dashboard/stats        # Get dashboard stats
```

### Websites

```
POST   /api/websites                     # Add new website
GET    /api/websites                     # List all websites
GET    /api/websites/:id                 # Get website details
GET    /api/websites/:id/stats           # Get website statistics
PATCH  /api/websites/:id                 # Update website
DELETE /api/websites/:id                 # Delete website
```

### Monitoring

```
POST   /api/monitoring/check/:websiteId  # Manual check
```

### Backups

```
GET    /api/backups/website/:websiteId   # List backups
POST   /api/backups/:id/restore          # Restore backup
```

### Security

```
GET    /api/security/website/:websiteId  # List scans
POST   /api/security/website/:websiteId/scan  # Manual scan
```

### Reports

```
GET    /api/reports                      # List reports
POST   /api/reports/website/:websiteId   # Generate report
```

### Subscriptions

```
POST   /api/subscriptions/checkout       # Create checkout session
POST   /api/subscriptions/portal         # Create portal session
GET    /api/subscriptions                # Get subscription
POST   /api/subscriptions/webhook        # Stripe webhook
```

## 🔐 Authentication

All protected endpoints require JWT token in Authorization header:

```bash
Authorization: Bearer <token>
```

Example with curl:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3001/api/websites
```

## 🗄 Database Schema

The Prisma schema includes:

- **users** - User accounts
- **websites** - Monitored websites
- **checks** - Uptime check results
- **backups** - Backup records
- **security_scans** - Security scan results
- **alerts** - System alerts
- **subscriptions** - Stripe subscriptions
- **notification_settings** - User preferences
- **reports** - Generated reports

## ⏰ Cron Jobs

The following automated tasks run:

- **Every 5 minutes**: Website uptime monitoring
- **Daily at 2 AM**: Backup creation
- **Daily at 3 AM**: Security scans
- **1st of month at 4 AM**: Monthly report generation

## 🔧 Development Commands

```bash
# Start development server
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Run Prisma Studio (database GUI)
npm run prisma:studio

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Format code
npm run format

# Lint code
npm run lint
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Project Structure

```
src/
├── auth/                   # Authentication module
│   ├── dto/               # Data Transfer Objects
│   ├── guards/            # JWT guard
│   ├── strategies/        # Passport strategies
│   └── auth.service.ts
├── users/                 # User management
├── websites/              # Website CRUD
├── monitoring/            # Uptime monitoring with cron
├── backups/               # Backup system
├── security/              # Security scanning
├── reports/               # Report generation
├── subscriptions/         # Stripe integration
├── common/
│   └── prisma/           # Prisma service
├── app.module.ts         # Main module
└── main.ts               # Entry point
```

## 🚀 Deployment

### Option 1: Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL
railway add --plugin postgresql

# Deploy
railway up
```

### Option 2: Render

1. Connect GitHub repository
2. Select "Web Service"
3. Build command: `npm install && npm run build && npx prisma generate && npx prisma migrate deploy`
4. Start command: `npm run start:prod`
5. Add PostgreSQL database
6. Set environment variables

### Option 3: VPS (Ubuntu)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone <repo-url>
cd axentralab-backend

# Install dependencies
npm install

# Build
npm run build

# Setup Prisma
npx prisma generate
npx prisma migrate deploy

# Start with PM2
pm2 start dist/main.js --name axentralab-api

# Save PM2 configuration
pm2 save
pm2 startup
```

## 🔐 Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Set strong DATABASE_URL password
- [ ] Enable HTTPS
- [ ] Set up rate limiting
- [ ] Enable CORS for frontend domain only
- [ ] Use environment variables for all secrets
- [ ] Set up monitoring and logging
- [ ] Regular security updates

## 📊 Monitoring

The monitoring system:
- Checks websites every 5 minutes
- Stores check results in database
- Calculates uptime percentage
- Sends alerts on downtime/recovery
- Tracks response times

## 💳 Stripe Integration

1. Create products in Stripe Dashboard
2. Copy price IDs to .env
3. Set up webhook endpoint
4. Test with Stripe CLI:

```bash
stripe listen --forward-to localhost:3001/api/subscriptions/webhook
```

## 🐛 Troubleshooting

### Database connection issues

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U username -d axentralab -h localhost
```

### Prisma errors

```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Regenerate Prisma Client
npx prisma generate
```

### Cron jobs not running

Check logs:
```bash
# Development
npm run start:dev

# Production with PM2
pm2 logs axentralab-api
```

## 📝 TODO

- [ ] Implement S3 backup functionality
- [ ] Add VirusTotal integration for malware scanning
- [ ] Implement PDF report generation
- [ ] Add email service (Resend/SMTP)
- [ ] Add SMS alerts (Twilio)
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Write unit tests
- [ ] Add API documentation (Swagger)
- [ ] Set up error tracking (Sentry)

## 🤝 Contributing

This is a private project. No contributions are accepted at this time.

## 📄 License

Proprietary - All rights reserved

---

Built with ❤️ using NestJS
