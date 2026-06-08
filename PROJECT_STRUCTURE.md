# 📁 Project Structure Guide - Capital Network

## نقشه ساختار پروژه

```
my-site/
├── app/
│   ├── components/              # کامپوننت‌های React
│   │   ├── Animations.jsx       # انیمیشن‌های مختلف
│   │   ├── BlogCard.jsx         # کارت مقاله
│   │   ├── BlogSearch.jsx       # جستجوی وبلاگ
│   │   ├── BlogSidebar.jsx      # سایدبار وبلاگ
│   │   ├── ContactForm.jsx      # فرم تماس
│   │   ├── FAQ.jsx              # سوالات متداول
│   │   ├── Footer.jsx           # فوتر
│   │   ├── Header.jsx           # هدر/ناوبری
│   │   ├── Hero.jsx             # بخش قهرمان
│   │   ├── LoginForm.jsx        # فرم ورود
│   │   ├── Process.jsx          # فرآیند کار
│   │   ├── RegisterForm.jsx     # فرم ثبت‌نام
│   │   ├── ScrollToTop.jsx      # دکمه اسکرول
│   │   ├── SearchModal.jsx      # موال جستجو
│   │   ├── Services.jsx         # بخش خدمات
│   │   ├── TrustSection.jsx     # بخش اعتماد
│   │
│   ├── data/                    # داده‌های استاتیک
│   │   ├── blog-posts.js        # فهرست مقالات
│   │   ├── siteContent.js       # محتوای سایت
│   │
│   ├── (routes)/               # صفحات و روت‌ها
│   │   ├── page.js              # صفحه اصلی (/)
│   │   ├── not-found.js         # صفحه 404
│   │   ├── error.js             # صفحه خطای سرور
│   │   ├── sitemap.js           # نقشه سایت
│   │   ├── robots.js            # فایل robots.txt
│   │   │
│   │   ├── about/
│   │   │   └── page.js          # صفحه درباره ما
│   │   │
│   │   ├── blog/
│   │   │   ├── page.js          # صفحه وبلاگ (لیست)
│   │   │   └── [slug]/
│   │   │       └── page.js      # صفحه مقاله واحد
│   │   │
│   │   ├── contact/
│   │   │   └── page.js          # صفحه تماس
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.js          # داشبورد کاربری
│   │   │
│   │   ├── founder_onboarding/
│   │   │   └── page.js          # فرم onboarding بنیان‌گذاران
│   │   │
│   │   ├── login/
│   │   │   └── page.js          # صفحه ورود
│   │   │
│   │   ├── process/
│   │   │   └── page.js          # صفحه فرآیند کار
│   │   │
│   │   ├── register/
│   │   │   └── page.js          # صفحه ثبت‌نام
│   │   │
│   │   ├── services/
│   │   │   └── page.js          # صفحه خدمات
│   │   │
│   │   ├── layout.js            # Layout اصلی
│   │   ├── globals.css          # استایل‌های جهانی
│   │   ├── page.module.css      # استایل صفحه اصلی
│   │
│   ├── public/                  # فایل‌های static
│   │   ├── fonts/Vazir/        # فونت‌های Vazir
│   │   ├── uploads/            # فایل‌های آپلود شده
│   │
│   ├── package.json             # Dependencies و scripts
│   ├── next.config.mjs          # تنظیمات Next.js
│   ├── jsconfig.json            # تنظیمات JavaScript
│   ├── eslint.config.mjs        # ESLint configuration
│   ├── .env.local               # متغیرهای محیط توسعه
│   ├── .gitignore               # فایل‌های مستثنی از git
```

## 📋 توضیح روت‌ها (Routes)

| مسیر | فایل | توضیح |
|------|------|--------|
| `/` | `page.js` | صفحه اصلی با تمام بخش‌ها |
| `/about` | `about/page.js` | صفحه درباره Capital Network |
| `/services` | `services/page.js` | صفحه خدمات و طرح‌های مختلف |
| `/process` | `process/page.js` | صفحه فرآیند سرمایه‌گذاری |
| `/blog` | `blog/page.js` | صفحه لیست وبلاگ |
| `/blog/[slug]` | `blog/slug/page.js` | صفحه مقاله واحد |
| `/contact` | `contact/page.js` | صفحه تماس با ما |
| `/login` | `login/page.js` | صفحه ورود |
| `/register` | `register/page.js` | صفحه ثبت‌نام |
| `/founder_onboarding` | `founder_onboarding/page.js` | فرم کامل onboarding |
| `/dashboard` | `dashboard/page.js` | داشبورد کاربری (placeholder) |

## 🔧 فایل‌های مهم

### `layout.js` - Layout اصلی
- HTML structure، font faces، metadata root
- RTL support برای فارسی
- Vazir font integration

### `globals.css` - استایل‌های جهانی
- CSS Variables و color scheme
- Animation keyframes
- Responsive breakpoints: 1024px, 768px, 480px
- Glass-morphism effects

### `data/siteContent.js` - مدل داده‌ها
```javascript
{
  hero: { badge, title, tagline, description, cta, phone },
  services: [{ id, title, description, items, tags, featured }],
  processSteps: [{ title, description, duration }],
  trust: { metrics, continents }
}
```

### `data/blog-posts.js` - مقالات
```javascript
{
  id, slug, title, excerpt, category, tags,
  author, date, readTime, content, featured
}
```

## 💾 Data Storage

### localStorage Keys
- `siteContent` - محتوای صفحات ویرایش‌شده
- `capitalNetworkRegistrations` - لیست ثبت‌نام‌ها

## 🎨 Design System

### رنگ‌ها
- Primary Gold: `#D19C0A`
- Secondary Teal: `#00B2A9`
- Dark Navy: `#0A1D3D`
- Light Gray: `rgba(255,255,255,0.x)`

### Typography
- Font Family: Vazir (Local)
- Weights: 100 (Thin), 300 (Light), 400 (Regular), 500 (Medium), 700 (Bold)

### Spacing
- Grid: 12px base unit
- Padding: 20px, 24px, 32px, 40px
- Gap: 12px, 16px, 20px, 24px

### Animations
- Transitions: 0.3s ease
- Keyframes: pulse, blink, shimmer, float, gradient-border, spin

## Development

```bash
npm install
npm run dev       # Frontend (5173) + API (4001)
npm run dev:api   # API only
npm run build     # Production frontend build
npm run start:prod # Express + static dist
```

### Environment Variables

```
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
ADMIN_USERNAME=admin
ADMIN_PASSWORD=...
```

## 📱 Responsive Breakpoints

```css
Desktop:     > 1024px (full layout)
Tablet:      768px - 1024px (2 column)
Mobile:      < 768px (1 column, full width)
Small Phone: < 480px (minimal padding)
```

## ✅ Best Practices

1. **استفاده از Components**: کامپوننت‌ها را در `components/` folder قرار دهید
2. **Static Data**: داده‌های استاتیک در `data/` folder
3. **CSS Classes**: از `cn-` prefix استفاده کنید
4. **Metadata**: هر صفحه باید metadata داشته باشد
5. **Image Optimization**: از Next.js Image component استفاده کنید
6. **SEO**: alt text برای تمام تصاویر

## 📝 نکات مهم

- **Client Components**: فایل‌های با `'use client'` directive
- **Metadata Export**: `export const metadata = {...}`
- **Environment**: `.env.production` برای مقادیر حساس
- **Build Output**: `.next/` folder (automatically generated)

---

**آخرین بروزرسانی**: ۱۴۰۵/۲/۱۷
**نسخه**: 1.0.0
