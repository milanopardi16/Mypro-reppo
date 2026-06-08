# Railway Environment Variables

این سند متغیرهای محیطی لازم برای اجرای برنامه در محیط Railway را فهرست می‌کند.

## متغیرهای اجباری

- `NODE_ENV` - باید `production` در استقرار Railway باشد.
- `PORT` - پورت HTTP که سرور Express به آن گوش می‌دهد.
- `REG_SERVER_PORT` - مقدار جایگزین پورت سرور برای اجرای محلی یا تنظیمات داخلی.
- `DATABASE_URL` - رشته اتصال PostgreSQL برای Prisma.
- `DIRECT_URL` - آدرس کامل برنامه در محیط تولید.
- `NEXTAUTH_SECRET` - راز امن برای احراز هویت جانبی و نگهداری نشست.
- `JWT_ACCESS_SECRET` - کلید JWT دسترسی با حداقل ۳۲ کاراکتر.
- `JWT_REFRESH_SECRET` - کلید JWT نوسازی با حداقل ۳۲ کاراکتر.
- `ADMIN_EMAIL` - ایمیل مدیر پیش‌فرض.
- `ADMIN_PASSWORD` - رمز عبور مدیر اولیه.
- `ADMIN_PASSWORD_SALT` - نمکی که برای هش رمز عبور استفاده می‌شود.
- `CORS_ORIGINS` - لیست دامین‌های مجاز برای CORS.
- `NEXT_PUBLIC_SITE_URL` - آدرس عمومی سایت برای CORS و متا.

## متغیرهای اختیاری / کمکی

- `ADMIN_USERNAME` - نام کاربری مدیر (اگر ورود با نام کاربری پشتیبانی شود).
- `ADMIN_TOKEN` - توکن امن برای اشکال‌زدایی و اتصال Socket.IO در حالت غیرتولید.
- `SERVE_STATIC` - `true` برای سرو کردن فایل‌های ساخته‌شده Vue/Vite در محیط تولید.
- `NEXT_PUBLIC_SUPABASE_URL` - اگر بخش‌هایی از فرانت‌اند به Supabase نیاز دارند.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - کلید عمومی Supabase.
- `SUPABASE_SERVICE_ROLE_KEY` - کلید سرویس Supabase برای عملیات سروری.
- `FIREBASE_PROJECT_ID` - شناسه پروژه Firebase.
- `FIREBASE_CLIENT_EMAIL` - ایمیل سرویس Firebase.
- `FIREBASE_PRIVATE_KEY` - کلید خصوصی Firebase.

## نکات مهم

- `DATABASE_URL` باید شامل SSL یا تنظیمات امن اتصال PostgreSQL در محیط production باشد.
- `JWT_ACCESS_SECRET` و `JWT_REFRESH_SECRET` باید در Railway به صورت متغیر مخفی تنظیم شوند و روی مخزن کامیت نشوند.
- در Railway، متغیرها باید از صفحه تنظیمات پروژه Railway یا CLI بارگذاری شوند.
