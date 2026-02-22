# Axentralab — High-level Architecture / সার্বিক আর্কিটেকচার

This document summarizes the proposed architecture for the Axentralab Website Maintenance SaaS (WMaaS). It contains both English and Bengali summaries for easy reference.

---

## 1. Overview / সারসংক্ষেপ

- Purpose: Provide 24/7 website maintenance: uptime monitoring, backups, security scans, updates, and reporting.
- Main parts: Frontend, Backend, Automation Engine, Infrastructure, 3rd-party Integrations.

---

## 2. Frontend (Website + Dashboard) / ফ্রন্টএন্ড

- Tech: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Lucide Icons.
- Responsibilities: Landing, Pricing, Auth (login/register), Client Dashboard, Website list, Reports.
- Notes: SEO-friendly landing, fast UX for sales and dashboard usage.

---

## 3. Backend (Core Brain) / ব্যাকএন্ড

- Recommended: Node.js with NestJS (REST API), JWT auth. (Alternative: Laravel)
- Responsibilities: Users, Auth, Subscriptions, Website records, Alerts, Reports, Permissions, Business logic.
- Frontend communicates with backend; backend drives decisions and exposes APIs.

---

## 4. Database Layer / ডাটাবেস

- Tech: PostgreSQL (managed), ORM: Prisma (or Eloquent if Laravel).
- Key tables: users, plans, websites, monitoring_logs, backup_records, alerts, payments.

---

## 5. Automation & Background Engine / অটোমেশন ও ওয়ার্কার

- Tech: Cron schedulers, Queue system (BullMQ + Redis), Worker services.
- Jobs: uptime checks (1–5 min), daily backups, malware scans, monthly report generation, email alerts.
- Crucial: Reliable retry, deduplication, idempotency, and monitoring of workers.

---

## 6. Website Monitoring / মনিটরিং লজিক

- Checks: HTTP status, response time, optional external uptime APIs.
- Logic: single request fail → retry; multiple consecutive fails → mark DOWN → trigger alert.
- Avoid false positives with backoff and confirmatory checks.

---

## 7. Backup System / ব্যাকআপ সিস্টেম

- Tech: WP-CLI for WordPress, SFTP/SSH for non-WP, Cloud storage (S3-compatible: Wasabi/Backblaze) for retention.
- Flow: DB dump + file archive → zip → upload to cloud → store metadata in DB → allow one-click restore.
- Schedule: daily full backups (or configurable per plan).

---

## 8. Security & Malware Scans / সিকিউরিটি

- Techniques: file-hash checks, signature-based malware scanning, suspicious login detection, SSL expiry checks.
- Output: risk score, alerts, and entries in the reports dashboard.

---

## 9. Reporting / রিপোর্টিং

- Tech: server-side report generator (HTML → PDF), charting library for visuals, email attachment delivery.
- Content: uptime %, downtime events, backup status, security summary, maintenance logs.

---

## 10. Payments & Billing / পেমেন্ট ও বিলিং

- Tech: Stripe Subscriptions + webhooks.
- Handles: recurring billing, failed payments, plan changes, cancellations, automated pausing of services.

---

## 11. Infrastructure & DevOps / ইনফ্রাস্ট্রাকচার

- Frontend: Vercel (recommended)
- Backend: Managed VPS / Render / Railway
- DB: Managed PostgreSQL (e.g., Supabase, RDS)
- Storage: S3-compatible (Wasabi, Backblaze, or AWS S3)
- Email: SMTP or service like Resend
- Observability: Logs, metrics, alerts for workers and API

Security: HTTPS, env secrets, rate limiting, access policies.

---

## 12. Minimal MVP Priorities / MVP অগ্রাধিকার

1. Implement reliable uptime checks + alerting (core value).  
2. Daily backups with one-click restore.  
3. Basic malware scan + SSL expiry check.  
4. Auth, subscription handling, simple billing (Stripe).  
5. Dashboard with website list, logs, and monthly PDF report.

---

## 13. Brutal Truth / বাস্তব কথা

- You don't need AI or blockchain initially — you need reliable automation and operational excellence.  
- Focus on worker reliability, retries, observability, and a clear simple UX for customers.

---

## 14. Quick Tech Map / দ্রুত সারাংশ (One-line)

- Frontend: Next.js + Tailwind | Backend: NestJS | DB: PostgreSQL | Workers: Cron + BullMQ | Storage: S3 | Payments: Stripe

---

If you want, I can:  
- scaffold repo folders for workers & cron jobs,  
- add initial Prisma schema for the described tables,  
- or convert this doc into `DEPLOYMENT.md` or `README` section.

আপনি কি পরবর্তী স্টেপ হিসেবে চাইবেন আমি কী করব? (Prisma schema / worker scaffold / pricing translations / deploy guide)
