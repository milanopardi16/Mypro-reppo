# Environment Variables Report

## متغیرهای اجباری شناسایی‌شده

این پروژه از فایل `server/config/env.js` برای اعتبارسنجی متغیرهای محیطی استفاده می‌کند. متغیرهای زیر ضروری هستند:

- `NODE_ENV`
- `DATABASE_URL`
- `DIRECT_URL`
- `NEXTAUTH_SECRET`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`

## متغیرهای کنترلی اضافی

- `REG_SERVER_PORT`
- `PORT`
- `ADMIN_EMAIL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_TOKEN`
- `SERVE_STATIC`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CORS_ORIGINS`

## متغیرهای خاص درخواست‌شده

برای Railwy، گزارش پیکربندی زیر نیز ایجاد شد:

- `ADMIN_PASSWORD_SALT`

## تحلیل

- `DATABASE_URL` برای اتصال Prisma به PostgreSQL لازم است.
- `JWT_ACCESS_SECRET` و `JWT_REFRESH_SECRET` باید حداقل ۳۲ کاراکتر باشند.
- `DIRECT_URL` و `NEXT_PUBLIC_SITE_URL` برای CORS و لینک‌های تولید مورد نیاز هستند.
- `CORS_ORIGINS` باید با دامنه Railwy تنظیم شود تا درخواست‌های مرورگر معتبر بمانند.
- اگر Firebase یا Supabase در پروژه مورد استفاده قرار می‌گیرند، متغیرهای مربوطه باید به صورت ایمن در Railway تعریف شوند.
