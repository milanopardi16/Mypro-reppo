# Prisma Deployment Report

## وضعیت کلی

- `Prisma` نسخه **6.19.0**
- `datasource db` از **PostgreSQL** استفاده می‌کند
- `DATABASE_URL` از متغیر محیطی بارگذاری می‌شود
- `generator client` با `prisma-client-js` تنظیم شده است

## پشتیبانی Railway

Railway به طور کامل PostgreSQL و Prisma را پشتیبانی می‌کند. بسته‌ی نصب‌شده و روش اجرای مهاجرت‌ها نیز با سنت Rails سازگار است.

## ساختار مهاجرت

- `prisma/migrations/20250603130000_init/` 
- `prisma/migrations/20250603140000_phase2_relations/`
- `prisma/migrations/20250603150000_schema_seed_align/`
- `prisma/migrations/migration_lock.toml`

## اسکریپت‌های مرتبط

- `npm run db:generate` 
- `npm run db:migrate` 
- `npm run db:setup`
- `npm run db:seed`

## هشدارها

- قبل از اجرای `prisma migrate deploy` باید مطمئن شد که `DATABASE_URL` در محیط Railwy سالم است.
- `prisma migrate deploy` فقط در محیط تولید اجرا شود و بهتر است ابتدا روی محیط staging تست شود.

## توصیه

اسکریپت آماده شده در `railway-deployment/scripts/prisma-deploy.sh` باید با مقداردهی صحیح `DATABASE_URL` اجرا شود:

```bash
bash railway-deployment/scripts/prisma-deploy.sh
```
