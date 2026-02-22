## Axentralab Deployment Guide (Short)

Ei file-ta frontend (Vercel) ebong backend (Railway/Render/VPS) deploy korar jonno shohoj, actionable steps, env template, ebong Prisma/Stripe/S3 checklist dey.

---

**Quick summary**: Push repo to GitHub, connect frontend to Vercel, backend to Railway/Render (ba VPS), set environment variables, run Prisma migrations, configure Stripe webhook, then deploy.

---

## Env template (backend `.env`)

Nicher gulo backend-e proyojon:

```
DATABASE_URL="postgresql://USER:PASS@HOST:5432/DBNAME?schema=public"
JWT_SECRET="change_this_to_a_secure_random_string"
PORT=3001
NODE_ENV=production

STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

RESEND_API_KEY=rr_...
# Or SMTP
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-pass

S3_BUCKET=your-bucket
S3_ACCESS_KEY=AKIA...
S3_SECRET_KEY=...
S3_REGION=us-east-1

# Optional
FRONTEND_URL=https://app.yourdomain.com
```

Frontend needs public variables (example `.env.production` in `frontend`):

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## Frontend (Vercel) — short steps

1. Push `frontend` code to GitHub (repo or monorepo root).
2. In Vercel: New Project → Import repository → set Project Root to `frontend` (if monorepo).
3. In Vercel Project Settings → Environment Variables: add `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
4. Build Command: `npm run build`. Node 18+. Vercel handles Next output.
5. Deploy.

Local test:
```bash
cd frontend
npm install
npm run dev
```

---

## Backend (Railway) — short steps

1. Push `backend` to GitHub.
2. Railway: New Project → Deploy from GitHub → set Root to `backend`.
3. Add PostgreSQL plugin (Railway provides `DATABASE_URL`).
4. Set Environment Variables in Railway (use the `.env` template above).
5. Build Command: `npm install && npm run build && npx prisma generate`
6. Start Command: `npm run start:prod`
7. Run migrations once: `npx prisma migrate deploy` (Railway console or via deploy hook).

Local test commands (backend):
```bash
cd backend
npm install
cp .env.example .env
# edit .env with real values
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

Render and VPS instructions are similar — use the same build/start commands and run `npx prisma migrate deploy` in production.

---

## Prisma / Database notes

- Locally use `npx prisma migrate dev` for development. In CI/prod use `npx prisma migrate deploy`.
- Ensure `prisma generate` runs after `npm install` and before app start so `@prisma/client` is available.
- If using Railway/Render, add a deploy migration step or run migrations via console.

---

## Stripe webhook

- In Stripe Dashboard, add a webhook endpoint: `https://api.yourdomain.com/api/subscriptions/webhook`.
- Copy the webhook secret into `STRIPE_WEBHOOK_SECRET` env var.
- For local testing use `stripe listen --forward-to localhost:3001/api/subscriptions/webhook`.

---

## S3 Backup checklist

- Create S3-compatible bucket (Backblaze/Wasabi/AWS).
- Create access key and secret; put in env vars.
- Ensure backend has bucket write/read permissions.
- If storing backups metadata in DB, run migrations first.

---

## CORS & Security

- Set CORS in backend to allow `FRONTEND_URL`/Vercel domain only.
- Set `JWT_SECRET` strong and keep private.
- Enable HTTPS on custom domains.

---

## Deployment checklist (final)

- [ ] Repo pushed to GitHub
- [ ] `backend` env vars set (DB, JWT, Stripe, S3, email)
- [ ] `frontend` env vars set (`NEXT_PUBLIC_API_URL`, stripe key)
- [ ] Prisma client generated & migrations applied
- [ ] Stripe webhook configured
- [ ] CORS configured for frontend domain
- [ ] Verify backups and scan cron jobs (optional)

---

## Next steps I can do for you

1. Locally start the `backend` (I will need `.env` values).
2. Create a sample frontend API call to `GET /api/websites` and wire authorization token.
3. Assist with connecting GitHub → Vercel / Railway (you'll authorize third-party).

Please reply with which next step you want (1/2/3) and, if 1, provide the minimal `.env` values or say you want me to provide an `.env` template file in the repo.
