# Production Launch Checklist

Use this checklist to ensure your Axentralab deployment is production-ready.

---

## ✅ Pre-Launch (Week 1)

### Code & Git
- [ ] All code committed to GitHub
- [ ] `.gitignore` configured (no `.env` files)
- [ ] `.env.production` created with real values
- [ ] No hardcoded secrets in code
- [ ] Code reviewed for security issues

### Environment Setup
- [ ] PostgreSQL database created and tested
- [ ] Redis instance created (Railway/Render auto-includes)
- [ ] S3/Wasabi bucket created
- [ ] Stripe keys obtained (Live, not Test)
- [ ] Resend/SMTP email configured
- [ ] Custom domains purchased (example: app.yourdomain.com, api.yourdomain.com)

### Backend Deployment
- [ ] Backend deployed to Railway/Render/VPS
- [ ] Environment variables configured in hosting platform
- [ ] `npx prisma migrate deploy` executed successfully
- [ ] Backend accessible at API endpoint (test with Postman)
- [ ] CORS configured to allow frontend domain only
- [ ] SSL/HTTPS enabled on API domain
- [ ] Worker processes running for monitoring and backups

### Frontend Deployment
- [ ] Frontend deployed to Vercel
- [ ] `NEXT_PUBLIC_API_URL` points to production API
- [ ] Domain configured (CNAME record set)
- [ ] SSL/HTTPS enabled
- [ ] Built and deployed successfully
- [ ] No console errors in production

### Payment & Billing
- [ ] Stripe account activated (Live mode)
- [ ] Product plans created in Stripe (Starter, Pro, Agency)
- [ ] Stripe webhook endpoint configured (`/api/subscriptions/webhook`)
- [ ] Webhook secret stored in environment
- [ ] Test payment flow works end-to-end
- [ ] Payment confirmation emails working

### Email Service
- [ ] Resend/SMTP credentials configured successfully
- [ ] Test email sent successfully
- [ ] Domain verified in Resend (if using Resend)
- [ ] Verification emails working
- [ ] Password reset emails working
- [ ] Alert emails configured

### Security
- [ ] JWT_SECRET is strong (minimum 32 characters)
- [ ] Database password is strong
- [ ] S3 credentials use IAM keys with minimal permissions
- [ ] No credentials in code or logs
- [ ] HTTPS enabled on all domains
- [ ] CORS whitelist contains only frontend domain
- [ ] Rate limiting enabled (if available on hosting)

---

## 🔧 Pre-Launch Testing (Week 2)

### Authentication Flow
- [ ] User registration works
- [ ] Email verification email sent
- [ ] Email verification link works
- [ ] Login works correctly
- [ ] JWT tokens are issued
- [ ] Password reset works
- [ ] Session persistence works

### Website Monitoring
- [ ] Can create a website
- [ ] Website monitoring starts (5-min interval)
- [ ] Uptime check results appear in database
- [ ] Dashboard displays monitoring data
- [ ] Downtime alert email sent when website is down
- [ ] Recovery alert email sent when website comes back up

### Backups
- [ ] Backup cron job triggered at 2 AM UTC
- [ ] Backups appear in S3 bucket
- [ ] Backup metadata stored in database
- [ ] Can view backups in dashboard
- [ ] Old backups cleaned up after 30 days

### Security Scanning
- [ ] Security scan triggered at 3 AM UTC
- [ ] SSL certificate checks working
- [ ] Security headers checks working
- [ ] VirusTotal scan working (if API key configured)
- [ ] Vulnerability findings appear in dashboard
- [ ] Security alert emails sent for high-risk sites

### Reports
- [ ] Monthly report generated on 1st of month
- [ ] Report contains correct data (uptime, backups, scans)
- [ ] Report email sent to users
- [ ] Report accessible via dashboard
- [ ] HTML report generated and stored in S3

### Payment Integration
- [ ] User can upgrade to Starter plan
- [ ] Stripe checkout page works
- [ ] Payment processes successfully
- [ ] Subscription stored in database
- [ ] Plan limits enforced (website count limits)
- [ ] Stripe webhook updates subscription status
- [ ] Invoice/receipt email sent

### Multiple User Scenarios
- [ ] User 1 can create account
- [ ] User 2 can create separate account
- [ ] User 1 cannot see User 2's data
- [ ] Multiple websites per user works correctly
- [ ] Team member invitations work (if feature exists)

---

## 🚀 Launch Day (Final Checks)

### Pre-Launch Verification
- [ ] All services running and healthy
- [ ] Database backups recent and verified
- [ ] Error tracking (Sentry) configured
- [ ] Monitoring/observability in place
- [ ] Support email/ChatGPT setup for user support
- [ ] Status page setup (optional: statuspage.io)

### Performance Check
- [ ] Frontend loads in <3 seconds
- [ ] API responses under 500ms
- [ ] Dashboard responsive
- [ ] No JavaScript errors
- [ ] Images optimized
- [ ] Database queries optimized (no N+1)

### Production Readiness
- [ ] `.env.production` file secured (not in code)
- [ ] Sensitive logs disabled
- [ ] Debug mode OFF (`NODE_ENV=production`)
- [ ] All secrets in environment variables, not config files
- [ ] Database connection pooling configured
- [ ] Redis memory limits set

### Launch
- [ ] Marketing materials ready
- [ ] Social media announcement ready
- [ ] Landing page updated (beta tag removed)
- [ ] Support contact info visible
- [ ] Privacy policy updated
- [ ] Terms of service updated
- [ ] Pricing page live

---

## 📊 Post-Launch (Week 3+)

### Monitoring & Operations
- [ ] Monitor error rate (target: <0.1%)
- [ ] Monitor response times (target: <500ms p95)
- [ ] Monitor database performance
- [ ] Monitor Redis memory usage
- [ ] Check backup success rate (target: 99.5%)
- [ ] Monitor email delivery rate
- [ ] Check job queue health

### User Feedback
- [ ] Collect early user feedback
- [ ] Fix critical bugs within 24 hours
- [ ] Monitor support email/tickets
- [ ] Respond to user issues promptly
- [ ] Track feature requests
- [ ] Monitor user churn

### Optimization
- [ ] Analyze slow queries
- [ ] Optimize database indexes
- [ ] Cache frequently accessed data
- [ ] Monitor S3 storage usage
- [ ] Review error logs for patterns
- [ ] Plan infrastructure scaling

### Updates & Maintenance
- [ ] Plan regular dependency updates
- [ ] Schedule security patches
- [ ] Review code for security issues
- [ ] Plan database maintenance windows
- [ ] Setup automated backups
- [ ] Document runbooks for common issues

---

## 🎯 Success Metrics

Track these KPIs post-launch:

| Metric | Target | Check Frequency |
|--------|--------|-----------------|
| API Uptime | 99.9% | Daily |
| Error Rate | <0.1% | Daily |
| Response Time (P95) | <500ms | Daily |
| Backup Success Rate | >99% | Daily |
| Email Delivery | >98% | Daily |
| User Registration Conversion | TBD | Weekly |
| Active Websites Monitored | TBD | Weekly |
| Customer Satisfaction | >4.5/5 | Monthly |
| Churn Rate | <5% | Monthly |

---

## 🆘 Emergency Procedures

### Database Down
1. Switch to backup database if available
2. Notify users on status page
3. Restore from latest backup
4. Verify data integrity
5. Post-mortem analysis

### API Down
1. Check error logs for root cause
2. Restart services (if safe)
3. Roll back recent deployments if needed
4. Notify users
5. Update status page

### Security Breach
1. Isolate affected systems
2. Audit logs for unauthorized access
3. Reset user passwords
4. Notify users immediately
5. Investigate root cause
6. Implement fixes
7. Document incident

### Data Loss
1. Restore from latest backup
2. Calculate data loss window
3. Notify affected users
4. Increase backup frequency
5. Implement disaster recovery testing

---

## 📞 Support Contacts

| Issue | Contact | Response Time |
|-------|---------|----------------|
| Technical Issues | support@axentralab.com | 24 hours |
| Billing Issues | billing@axentralab.com | 48 hours |
| Security Issues | security@axentralab.com | 4 hours |
| Stripe Support | stripe.com/support | Depends on plan |
| Railway Support | railway.app/support | Depends on plan |
| Domain Issues | Your registrar | Varies |

---

## 📚 References

- [Production Deployment Guide](./PRODUCTION_DEPLOYMENT.md)
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Architecture Documentation](./ARCHITECTURE.md)

---

**✅ Ready to launch!**
