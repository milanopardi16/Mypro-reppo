# راهنمای سریع استقرار Railway

## پیش‌نیازها

- حساب [GitHub](https://github.com)
- حساب [Railway](https://railway.app)
- مخزن این پروژه روی GitHub

---

## مرحله ۱ — آپلود به GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

جزئیات بیشتر: `GITHUB_SETUP.md`

---

## مرحله ۲ — ساخت پروژه در Railway

1. وارد [railway.app](https://railway.app) شوید
2. **New Project** → **Deploy from GitHub repo**
3. مخزن خود را انتخاب کنید
4. **Settings** → **Config file path** را تنظیم کنید:

```
/deployment/railway/railway.json
```

5. **Root Directory** را خالی بگذارید (ریشه مخزن)

---

## مرحله ۳ — افزودن PostgreSQL

1. در پروژه Railway: **+ New** → **Database** → **PostgreSQL**
2. در سرویس اپلیکیشن → **Variables**:
   - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}`
   - `DIRECT_URL` = `${{Postgres.DATABASE_URL}}`

---

## مرحله ۴ — متغیرهای محیطی

```bash
node deployment/railway/scripts/generate-secrets.mjs
```

مقادیر تولیدشده + موارد زیر را در Railway → **Variables** قرار دهید:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `SERVE_STATIC` | `true` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-app.up.railway.app` |
| `NEXTAUTH_SECRET` | (generated) |
| `JWT_ACCESS_SECRET` | (generated) |
| `JWT_REFRESH_SECRET` | (generated) |
| `ADMIN_EMAIL` | ایمیل ادمین |
| `ADMIN_PASSWORD` | رمز قوی |
| `ADMIN_PASSWORD_SALT` | (generated) |

لیست کامل: `env.template` و `ENVIRONMENT_VARIABLES.md`

---

## مرحله ۵ — Deploy

Railway به‌صورت خودکار:

1. `npm ci --include=dev`
2. `npx prisma generate`
3. `npm run build`
4. `npx prisma migrate deploy` (pre-deploy)
5. `sh deployment/railway/scripts/railway-start.sh`

---

## مرحله ۶ — Seed (اولین بار)

از Railway CLI یا Shell سرویس:

```bash
npx prisma db seed
```

یا متغیر `RUN_SEED=true` را یک‌بار تنظیم کنید و redeploy کنید، سپس حذفش کنید.

---

## مرحله ۷ — تست

```bash
curl https://your-app.up.railway.app/health
# {"status":"ok"}
```

---

# Quick Start (English)

## Railway setup

1. Push repo to GitHub
2. Railway → New Project → Deploy from GitHub
3. Set **Config file path**: `/deployment/railway/railway.json`
4. Add **PostgreSQL** database plugin
5. Set env vars from `env.template`
6. Deploy — migrations run via `preDeployCommand`
7. Seed once: `npx prisma db seed`
8. Verify: `GET /health` → `{"status":"ok"}`

## Docker builder (optional)

Change config path to `/deployment/railway/railway-docker.json`

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails on Prisma | Ensure `DATABASE_URL` and `DIRECT_URL` are set |
| 502 after deploy | Check logs; verify `PORT` is used (Railway sets it) |
| Static files missing | Set `SERVE_STATIC=true` |
| Migration error | Confirm `DIRECT_URL` points to PostgreSQL (not pooled) |
| JWT errors | Secrets must be ≥ 32 characters |
