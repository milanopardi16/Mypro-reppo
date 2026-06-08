# Healthcheck Setup

## نقاط پایانی سلامت موجود

این برنامه دو endpoint سلامت قابل بررسی دارد:

- `GET /api/health`
- `GET /api/ready`

## نحوه اجرا

- ابتدا برنامه را با `bash ./scripts/start.sh` در دایرکتوری `railway-deployment` اجرا کنید.
- سپس با استفاده از curl یا ابزار مشابه بررسی کنید:

```bash
curl -fsS http://localhost:4001/api/health
curl -fsS http://localhost:4001/api/ready
```

## اسکریپت‌های کمکی

- `railway-deployment/scripts/healthcheck.sh`
- `railway-deployment/scripts/railway-healthcheck.sh`

### نمونه استفاده

```bash
bash railway-deployment/scripts/healthcheck.sh
bash railway-deployment/scripts/railway-healthcheck.sh
```

## Railway readiness

- Railway از قابلیت healthcheck و readiness پشتیبانی می‌کند.
- مسیر `/api/ready` وضعیت اتصال دیتابیس را نیز بررسی می‌کند.
- در صورت `200 OK`، برنامه آماده دریافت ترافیک است.
