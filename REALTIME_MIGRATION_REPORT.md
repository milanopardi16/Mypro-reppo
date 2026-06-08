# گزارش مهاجرت سیستم Real-time (REALTIME_MIGRATION_REPORT.md)

این گزارش جزئیات جایگزینی Socket.IO با راهکارهای مبتنی بر PHP را تشریح می‌کند.

## ۱. رویدادهای شناسایی شده (Socket.IO Events)
- `join_room`: ورود کاربر/ادمین به یک اتاق چت خاص.
- `leave_room`: خروج از اتاق.
- `typing_start`: شروع تایپ توسط طرف مقابل.
- `typing_stop`: توقف تایپ.
- `send_message`: ارسال پیام جدید.
- `new_message` (Emit): دریافت پیام جدید توسط کلاینت.
- `notification` (Emit): دریافت اعلان سیستم.

## ۲. استراتژی جایگزینی (Replacement Strategy)
با توجه به محدودیت‌های Shared Hosting در اجرای وب‌سوکت دائمی، از ترکیبی از **Server-Sent Events (SSE)** و **API Polling** استفاده می‌شود.

### الف) دریافت پیام‌ها و اعلان‌ها (SSE)
فایل `api/sse.php` به عنوان یک جریان دائمی عمل می‌کند که تغییرات دیتابیس را به کلاینت اطلاع می‌دهد.
- کلاینت به `/api/sse.php` متصل می‌شود.
- سرور هر چند ثانیه دیتابیس را برای پیام‌های جدید در اتاق مربوطه چک می‌کند.
- در صورت وجود پیام جدید، آن را با فرمت SSE ارسال می‌کند.

### ب) ارسال پیام و وضعیت تایپ (Standard API)
- ارسال پیام از طریق `POST /api/chat/messages` انجام می‌شود.
- وضعیت تایپ از طریق `POST /api/chat/typing` به سرور اعلام و در دیتابیس یا کش موقت ذخیره می‌شود تا از طریق SSE به طرف مقابل اطلاع داده شود.

## ۳. تغییرات در Frontend
در فرانت‌اند، کلاینت Socket.io با یک `EventSource` جایگزین می‌شود:
```javascript
// قبل
const socket = io();
socket.on('new_message', (msg) => { ... });

// بعد
const eventSource = new EventSource('/api/sse.php?roomId=123');
eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'new_message') { ... }
};
```

## ۴. مزایا و معایب
- **مزایا:** سازگاری کامل با هاست‌های اشتراکی، عدم نیاز به پورت باز یا سرور مجزا.
- **معایب:** تاخیر بسیار اندک (بسته به بازه زمانی چک کردن دیتابیس)، مصرف منابع دیتابیس (که با بهینه‌سازی کوئری‌ها کنترل می‌شود).
