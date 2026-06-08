/** نگاشت pageId دکمه‌های هدر به سکشن‌های محتوای صفحه */

export const PAGE_TO_SECTIONS = {
  home: ['hero', 'ctaSection', 'servicesHome', 'processHome', 'testimonialsSection', 'trust', 'testimonials'],
  services: ['servicesPage', 'services'],
  process: ['processPage', 'processSteps'],
  about: ['aboutPage'],
  contact: ['contactPage'],
  blog: ['blogPage'],
  terms: ['termsPage'],
  privacy: ['privacyPage'],
  disclaimer: ['disclaimerPage'],
  login: ['loginPage'],
  register: ['registerPage'],
  evaluation: ['requestEvaluation'],
}

export const SECTION_LABELS = {
  hero: 'Hero صفحه اصلی',
  ctaSection: 'CTA میانی صفحه اصلی',
  servicesHome: 'بخش خدمات (صفحه اصلی)',
  processHome: 'بخش فرآیند (صفحه اصلی)',
  testimonialsSection: 'بخش نظرات (صفحه اصلی)',
  trust: 'بخش اعتماد / شبکه جهانی',
  testimonials: 'لیست نظرات',
  servicesPage: 'صفحه خدمات',
  services: 'لیست خدمات',
  processPage: 'صفحه فرآیند',
  processSteps: 'مراحل فرآیند',
  blogPage: 'صفحه بلاگ',
  contactPage: 'صفحه تماس',
  aboutPage: 'صفحه درباره ما',
  loginPage: 'صفحه ورود',
  registerPage: 'صفحه ثبت‌نام',
  requestEvaluation: 'صفحه درخواست ارزیابی',
  termsPage: 'صفحه شرایط',
  privacyPage: 'صفحه حریم خصوصی',
  disclaimerPage: 'صفحه سلب مسئولیت',
}
