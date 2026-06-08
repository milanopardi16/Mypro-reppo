# گزارش اعتبارسنجی (VALIDATION_REPORT.md)

این گزارش شامل چک‌لیست تست‌های انجام شده و مراحل تایید صحت عملکرد پس از مهاجرت به PHP است.

## ۱. تست‌های احراز هویت (Authentication)
- [x] ورود ادمین (POST /api/admin/auth/login): تایید تولید Access Token و Refresh Token.
- [x] نوسازی توکن (POST /api/admin/auth/refresh): تایید تولید توکن جدید با استفاده از Refresh Token معتبر.
- [x] خروج (POST /api/admin/auth/logout): تایید ابطال Refresh Token در پایگاه داده.
- [x] دسترسی محافظت شده (GET /api/admin/me): تایید رد درخواست بدون توکن معتبر.

## ۲. تست‌های بخش بلاگ (Blog)
- [x] دریافت لیست عمومی (GET /api/blogs): تایید نمایش پست‌های منتشر شده.
- [x] دریافت لیست ادمین (GET /api/admin/blogs): تایید نمایش تمام پست‌ها (Draft/Published).
- [x] ایجاد پست جدید (POST /api/admin/blogs).
- [x] ویرایش پست (PUT /api/admin/blogs/:id).
- [x] حذف پست (DELETE /api/admin/blogs/:id).

## ۳. تست‌های چت و Real-time
- [x] اتصال SSE (GET /api/sse.php): تایید باز ماندن اتصال و دریافت پیام‌های تست.
- [x] ارسال پیام (POST /api/chat/rooms/:roomId/messages): تایید ذخیره در دیتابیس و انتشار از طریق SSE.
- [x] آپلود فایل در چت (POST /api/chat/uploads): تایید ذخیره فایل در پوشه uploads و دریافت URL.

## ۴. تست‌های فرم‌ها و ثبت اطلاعات
- [x] ثبت‌نام کاربر (POST /api/registrations): تایید ذخیره و ایجاد اعلان برای ادمین.
- [x] فرم تماس (POST /api/contact): تایید ذخیره و ایجاد اعلان.
- [x] فاوندر آنبوردینگ (POST /api/founder-onboarding): تایید آپلود فایل Deck و ذخیره اطلاعات فاوندر.

## ۵. تست‌های مدیریتی (Admin Panel)
- [x] خلاصه داشبورد (GET /api/admin/dashboard/summary).
- [x] مدیریت ارزیابی‌ها (GET /api/admin/admin-evaluations).
- [x] خروجی اکسل/CSV (GET /api/admin/admin-evaluations/export-excel).
- [x] مدیریت نوتیفیکیشن‌ها (Mark as read).

## ۶. بررسی ساختار دیتابیس
- [x] تایید صحت جداول و روابط در MySQL (مطابق database.sql).
- [x] تایید عملکرد Foreign Keyها و Constraints.

## ۷. امنیت
- [x] بررسی هدرهای امنیتی (X-Content-Type-Options, etc.).
- [x] تایید عدم اجرای کد PHP در پوشه uploads.
- [x] تایید استفاده از Prepared Statements در تمام کوئری‌ها.
