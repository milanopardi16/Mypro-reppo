# API Conversion Report

## وضعیت کلی

API بک‌اند به صورت Express.js و Socket.IO پیاده‌سازی شده است و باید برای Railway تطبیق یابد.

## Endpoints کلیدی

### صحت و آمادگی

| مسیر | روش | حالت |
|------|-----|------|
| `/api/health` | GET | ✅ کار می‌کند |
| `/api/ready` | GET | ✅ کار می‌کند (بررسی دیتابیس) |
| `/api/admin/health` | GET | ✅ کار می‌کند |
| `/api/db/health` | GET | ✅ کار می‌کند |

### احراز هویت

| مسیر | روش | حالت |
|------|-----|------|
| `/api/admin/auth/login` | POST | ✅ JWT |
| `/api/admin/auth/refresh` | POST | ✅ Token refresh |
| `/api/admin/auth/logout` | POST | ✅ Logout |
| `/api/admin/me` | GET | ✅ Protected |

### مسائل و حالت

| مسیر | روش | حالت |
|------|-----|------|
| `/api/*` | GET/POST | ✅ مورد حمایت |
| `/api/registrations` | POST | ✅ Rate limited |
| `/api/founder-onboarding` | POST | ✅ Rate limited |
| `/uploads` | GET | ✅ Protected (requireAdmin) |

## Socket.IO

- پروتکل WebSocket فعال است.
- احراز هویت با JWT یا ADMIN_TOKEN.
- CORS با تنظیمات اصلاح‌شده محافظت می‌شود.

## نتیجه

تمام endpoints Express برای Railway آماده هستند. Socket.IO نیاز به تنظیمات Sticky Session Railwy دارد.
