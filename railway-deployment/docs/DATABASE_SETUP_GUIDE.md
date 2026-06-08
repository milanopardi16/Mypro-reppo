# Database Setup Guide

## Railway PostgreSQL Creation

1. در داشبورد Railway به بخش Services بروید.
2. روی Add Service کلیک کنید.
3. PostgreSQL را انتخاب کنید.
4. تنظیمات را با نام معنادار ثبت کنید.

## DATABASE_URL Setup

- پس از ایجاد سرویس PostgreSQL، Railway رشته اتصال را به شما می‌دهد.
- این مقدار را در `Environment Variables` پروژه اضافه کنید.

نمونه:

```text
DATABASE_URL=postgresql://username:password@host:5432/dbname?schema=public
```

## Migration Process

1. مطمئن شوید متغیر `DATABASE_URL` به درستی تنظیم شده است.
2. در مسیر `railway-deployment` از اسکریپت زیر استفاده کنید:

```bash
bash scripts/prisma-deploy.sh
```

3. این اسکریپت ابتدا `prisma generate` را اجرا می‌کند و سپس مهاجرت‌ها را اعمال می‌کند.

## Seed and Validation

- اگر نیاز به داده‌های اولیه دارید، از `npm run db:seed` در مسیر `railway-deployment/app` استفاده کنید.
- برای اعتبارسنجی صحت schema و مهاجرت‌ها، می‌توانید از `npm run validate:prisma` و `npm run validate:migrations` استفاده کنید.

## Backup Recommendations

- Railway PostgreSQL معمولاً snapshot خودکار دارد.
- برای پشتیبان‌گیری دستی، از ابزارهایی مانند `pg_dump` یا سرویس‌های backup Railway استفاده کنید.
- پشتیبان‌گیری دوره‌ای از دیتابیس و ذخیره آن در مکان امن را برنامه‌ریزی کنید.
