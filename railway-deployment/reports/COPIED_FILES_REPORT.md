# Copied Files Report

تمام فایل‌های مورد نیاز برای استقرار تولیدی به مسیر `railway-deployment/app` کپی شده‌اند.

## موارد اصلی کپی‌شده

- `package.json`
- `package-lock.json`
- `vite.config.js`
- `jsconfig.json`
- `index.html`
- `app/` (فرانت‌اند React و مسیرهای صفحات)
- `public/` (دارایی‌های استاتیک و فونت‌ها)
- `server/` (Express API، Socket.IO، میدلورها، مسیردهی و Prisma)
- `prisma/` (schema, migrations, seed)
- `scripts/` (ابزارهای پشتیبانی و اعتبارسنجی)

## توضیحات

فولدر `railway-deployment/app` حاوی یک کپی ایزوله از برنامه است که می‌تواند مستقل از پروژه اصلی اجرا شود. این کپی بدون تغییر در پروژه اصلی ساخته شده است.

فولدرهای زیر در فضای جدید ایجاد شده‌اند و فقط برای Railwy اختصاص یافته‌اند:

- `railway-deployment/config`
- `railway-deployment/deployment`
- `railway-deployment/scripts`
- `railway-deployment/reports`
- `railway-deployment/docs`
