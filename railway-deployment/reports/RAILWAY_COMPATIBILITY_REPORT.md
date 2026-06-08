# Railway Compatibility Report

## جمع‌بندی

این پروژه برای اجرای Railway به صورت **PARTIALLY_COMPATIBLE** ارزیابی می‌شود.

## شمارش معماری

- چارچوب فرانت‌اند: **Vite + React 19**
- چارچوب بک‌اند: **Express**
- پایگاه داده: **Prisma + PostgreSQL**
- نسخه درخواست‌شده Node: **>=18**
- احراز هویت: **JWT با access / refresh tokens**
- بارگذاری فایل: **Multer با ذخیره محلی روی فولدر `uploads`**
- WebSocket: **Socket.IO**
- وظایف پس‌زمینه: **هیچ کرون یا background job مشخصی شناسایی نشد**
- سرویس‌های خارجی: **Firebase Admin** و **Supabase** به صورت اختیاری

## تطابق Railway

- `Express + Node` و `PostgreSQL` به طور عمومی در Railway پشتیبانی می‌شوند.
- `Prisma` به عنوان ORM سازگار است.
- پروژه از پورت HTTP و متغیرهای محیطی استاندارد استفاده می‌کند.

## مسدودکننده‌ها و هشدارها

### مسدودکننده‌ها

- **ذخیره فایل روی دیسک محلی** (`uploads/`) در Railway دارای خطر ناپایداری است.
- **Socket.IO** نیاز به پشتیبانی WebSocket / sticky session دارد که در Railway قابل پشتیبانی است، اما نیاز به تنظیمات مناسب دارد.

### هشدارها

- متغیرهای محیطی نیاز به پیکربندی دقیق دارند، به ویژه `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `DATABASE_URL`.
- **Firebase** و **Supabase** به صورت اختیاری امکان دارد وابستگی بیشتری برای استقرار ایجاد کنند.

## نتیجه

این بسته‌ی Railwy آماده است، اما باید با **اصلاح معماری بارگذاری فایل** و **آزمایش WebSocket** در Railway همراه باشد.
