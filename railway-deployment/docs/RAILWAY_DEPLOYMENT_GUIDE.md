# Railway Deployment Guide

## 1. Create Railway Project

- وارد داشبورد Railway شوید.
- یک پروژه جدید بسازید.
- نام پروژه را مانند `capital-network-railway` انتخاب کنید.

## 2. Connect GitHub Repository

- ریپازیتوری خود را به Railway متصل کنید.
- اگر می‌خواهید فقط پوشه `railway-deployment` را استقرار دهید، مسیر دایرکتوری را به `railway-deployment` تنظیم کنید.

## 3. Create PostgreSQL Service

- در Railway یک سرویس PostgreSQL اضافه کنید.
- اتصال دیتابیس را از Railway دریافت کنید.
- مقدار `DATABASE_URL` را در بخش Environment Variables پروژه اضافه کنید.

## 4. Configure Variables

در بخش Environment Variables مقادیر زیر را تعریف کنید:

- `NODE_ENV=production`
- `PORT=4001`
- `DATABASE_URL=<Railway PostgreSQL connection string>`
- `DIRECT_URL=<your app url>`
- `NEXTAUTH_SECRET=<strong secret>`
- `JWT_ACCESS_SECRET=<32+ char secret>`
- `JWT_REFRESH_SECRET=<32+ char secret>`
- `ADMIN_EMAIL=<admin email>`
- `ADMIN_USERNAME=<admin username>`
- `ADMIN_PASSWORD=<admin password>`
- `ADMIN_PASSWORD_SALT=<password salt>`
- `CORS_ORIGINS=<https://your-production-domain>`
- `NEXT_PUBLIC_SITE_URL=<https://your-production-domain>`

## 5. Deploy Application

- `railway-deployment/app` شامل کپی مستقل برنامه است.
- اگر Railwy اجازه می‌دهد، ریشه پروژه را روی `railway-deployment` قرار دهید.
- `deployment/railway.json` و `deployment/nixpacks.toml` برای تعریف فرایند استقرار ایجاد شده‌اند.

## 6. Run Prisma Migration

- از اسکریپت زیر برای اجرای مهاجرت‌ها استفاده کنید:

```bash
bash railway-deployment/scripts/prisma-deploy.sh
```

## 7. Verify Health Check

- پس از راه‌اندازی، بررسی کنید که endpointهای زیر پاسخ می‌دهند:

```bash
curl -fsS http://localhost:4001/api/health
curl -fsS http://localhost:4001/api/ready
```

## 8. Verify Authentication

- با استفاده از `ADMIN_EMAIL` و `ADMIN_PASSWORD` در مسیر `/api/admin/auth/login` ورود کنید.
- بررسی کنید که `accessToken` و `refreshToken` دریافت می‌شود.

## 9. Verify Uploads

- اگر فایل‌ها بارگذاری می‌شوند، مسیر `/uploads` باید با JWT حفاظت شده باشد.
- در Railway، ذخیره‌سازی محلی قابل اتکا نیست. برای تولید باید انتقال به فضای ابری یا volume پایدار مدنظر قرار گیرد.

## 10. Verify Production Environment

- `NODE_ENV=production` و `SERVE_STATIC=true` فعال باشند.
- `CORS_ORIGINS` و `NEXT_PUBLIC_SITE_URL` با دامنه واقعی تطبیق کند.
- مطمئن شوید `JWT_*` و `NEXTAUTH_SECRET` مخفی و امن نگهداری شوند.
