# گزارش شناسایی پروژه (DISCOVERY_REPORT.md)

این گزارش شامل تحلیل کامل ساختار فعلی پروژه مبتنی بر Node.js است که پیش از مهاجرت به PHP تهیه شده است.

## ۱. ساختار کامل پوشه‌ها
- `app/`: کدهای مربوط به Frontend (React/Vite). شامل کامپوننت‌ها، صفحات، هوک‌ها و استایل‌ها.
- `server/`: کدهای مربوط به Backend (Node.js/Express).
  - `controllers/`: منطق پردازش درخواست‌ها.
  - `middlewares/`: میان‌افزارهای امنیتی، احراز هویت و اعتبارسنجی.
  - `routes/`: تعریف مسیرهای API.
  - `repositories/`: لایه دسترسی به دیتابیس (Prisma).
  - `services/`: منطق تجاری برنامه.
  - `utils/`: ابزارهای کمکی (آپلود، خطاها و ...).
  - `validators/`: طرح‌های اعتبارسنجی Zod.
- `prisma/`: شامل `schema.prisma` برای تعریف مدل‌های دیتابیس.
- `public/`: فایل‌های عمومی استاتیک.
- `uploads/`: محل ذخیره فایل‌های آپلود شده.

## ۲. ساختار Frontend
- **تکنولوژی:** React + Vite
- **مدیریت مسیرها:** `react-router-dom`
- **استایل‌دهی:** CSS Modules و فایل‌های CSS عمومی.
- **انیمیشن:** `framer-motion`
- **ارتباط با API:** استفاده از `fetch` در سرویس‌ها و هوک‌های سفارشی.

## ۳. ساختار Backend
- **فریم‌ورک:** Express.js
- **اجرا:** `api-server.js` (شامل تنظیمات سرور و Socket.io).
- **مدیریت دیتابیس:** Prisma ORM با دیتابیس PostgreSQL (قابل مهاجرت به MySQL).

## ۴. تمام Routeها و APIها
### مسیرهای عمومی (`/api`)
- `GET /health`: بررسی سلامت سیستم.
- `GET /version`: دریافت نسخه برنامه.
- `GET /ready`: بررسی آمادگی سرور.
- `GET /blogs`: لیست بلاگ‌های عمومی.
- `GET /evaluations`: لیست ارزیابی‌ها (با فیلتر).
- `POST /registrations`: ثبت‌نام جدید.
- `GET /site-content`: دریافت محتوای سایت.
- `POST /contact`: ثبت پیام تماس.
- `POST /founder-onboarding`: ثبت‌نام فاوندر (همراه با آپلود فایل).
- `GET /chat/rooms/:roomId/messages`: دریافت پیام‌های چت.
- `POST /chat/uploads`: آپلود فایل در چت.

### مسیرهای احراز هویت (`/api/admin/auth`)
- `POST /login`: ورود ادمین.
- `POST /refresh`: نوسازی توکن JWT.
- `POST /logout`: خروج.

### مسیرهای مدیریت (`/api/admin`)
- `GET /me`: اطلاعات ادمین فعلی.
- `GET /dashboard/summary`: خلاصه داشبورد.
- `GET /blogs`: مدیریت بلاگ‌ها.
- `POST /blogs`: ایجاد بلاگ.
- `PUT /blogs/:id`: ویرایش بلاگ.
- `DELETE /blogs/:id`: حذف بلاگ.
- `GET /site-content`: دریافت محتوا برای ادمین.
- `PUT /site-content`: ویرایش محتوا.
- `GET /registrations`: لیست ثبت‌نام‌ها.
- `GET /contact-messages`: پیام‌های تماس.
- `GET /notifications`: نوتیفیکیشن‌های سیستم.
- `GET /founder-submissions`: لیست فاوندرها.
- `GET /admin-evaluations/export-excel`: خروجی اکسل ارزیابی‌ها.

## ۵. تمام Middlewareها
- `correlationMiddleware`: شناسه یکتا برای هر درخواست.
- `requestLogMiddleware`: ثبت لاگ درخواست‌ها.
- `securityMiddleware`: تنظیمات Helmet و امنیت پایه.
- `authMiddleware`: بررسی توکن JWT و نقش ادمین.
- `validateMiddleware`: اعتبارسنجی ورودی‌ها با Zod.
- `auditMiddleware`: ثبت لاگ تغییرات حساس توسط ادمین.
- `errorMiddleware`: مدیریت خطاهای متمرکز.

## ۶. مدل‌های Prisma (دیتابیس)
- `Role`: نقش‌های کاربران (Admin, User).
- `User`: اطلاعات کاربران عمومی.
- `Admin`: اطلاعات مدیران سیستم.
- `RefreshToken`: توکن‌های نوسازی JWT.
- `Notification`: اعلان‌های سیستم.
- `BlogPost`: پست‌های بلاگ.
- `Assessment`: ارزیابی‌های فنی/تجاری.
- `ContactMessage`: پیام‌های تماس با ما.
- `ChatRoom`: اتاق‌های گفتگو.
- `ChatMessage`: پیام‌های چت.
- `FounderSubmission`: اطلاعات ارسالی فاوندرها.
- `SiteContent`: محتوای داینامیک سایت (JSON).
- `PushToken`: توکن‌های Push Notification.
- `AuditLog`: لاگ فعالیت‌های ادمین.

## ۷. متغیرهای محیطی (Environment Variables)
- `DATABASE_URL`: آدرس اتصال به دیتابیس.
- `JWT_ACCESS_SECRET`: کلید رمزنگاری توکن دسترسی.
- `JWT_REFRESH_SECRET`: کلید رمزنگاری توکن نوسازی.
- `ADMIN_EMAIL`/`PASSWORD`: اطلاعات ادمین پیش‌فرض.
- `FIREBASE_*`: تنظیمات نوتیفیکیشن (اختیاری).

## ۸. تمام Socket Events
- `connection`: اتصال اولیه.
- `join_room`: ورود به اتاق چت.
- `leave_room`: خروج از اتاق.
- `typing_start`/`typing_stop`: وضعیت تایپ.
- `send_message`: ارسال پیام جدید.
- **انتشار (Emit):**
  - `admin_connected` / `user_connected`
  - `new_message`
  - `notification`

## ۹. سیستم آپلود (Upload System)
- استفاده از `multer` برای مدیریت فایل‌ها.
- ذخیره در پوشه `uploads/`.
- اعتبارسنجی حجم فایل (10MB) و نوع فایل (در فاوندر آنبوردینگ).

## ۱۰. جریان احراز هویت (Authentication Flows)
- مبتنی بر **JWT (JSON Web Tokens)**.
- Access Token در هدر Authorization (Bearer).
- Refresh Token برای تمدید نشست.
- ذخیره امن پسوردها با `bcryptjs`.

## ۱۱. سرویس‌های ثالث (Third Party Services)
- **Firebase Admin:** برای ارسال Push Notifications.
- **PostgreSQL:** به عنوان پایگاه داده اصلی (در PHP به MySQL تبدیل می‌شود).
