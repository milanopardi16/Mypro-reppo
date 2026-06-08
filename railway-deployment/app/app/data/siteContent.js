const defaultNavItems = [
  { id: 1, label: 'خدمات', href: '/services' },
  { id: 2, label: 'فرآیند', href: '/process' },
  { id: 3, label: 'بلاگ', href: '/blog' },
  { id: 4, label: 'تماس با ما', href: '/contact' },
  { id: 5, label: 'درباره ما', href: '/about' },
]

import { normalizeHero } from './heroContent'

export const defaultSiteContent = {
  header: {
    brand: 'Capital Network',
    logoAlt: 'Capital Network',
    logoSrc: '/capital-network-logo.svg',
    nav: {
      services: 'خدمات',
      process: 'فرآیند',
      blog: 'بلاگ',
      contact: 'تماس با ما',
      about: 'درباره ما',
    },
    navItems: defaultNavItems,
    auth: {
      login: 'ورود',
      requestEvaluation: 'درخواست ارزیابی',
      evaluationHref: '/founder_onboarding',
      loginHref: '/login',
    },
    search: {
      label: 'جستجو',
      placeholder: 'جستجو در مقالات و خدمات...',
      hint: 'عبارت مورد نظر را تایپ کنید',
    },
  },
  hero: normalizeHero({}),
  ctaSection: {
    badge: 'ادامه سفر شما',
    title: 'آمادگی برای راند بعدی؟',
    description: 'تیم ما با تجربه بیش از 15 سال در زمینه تامین مالی، همراه شما تا رسیدن به اهداف مالی هستیم.',
    primaryButtonText: 'درخواست مشاوره',
    primaryButtonLink: '/contact',
    secondaryButtonText: 'درباره فرآیند',
    secondaryButtonLink: '#process',
    variant: 'default',
  },
  servicesHome: {
    badge: 'خدمات تخصصی',
    title: 'از آماده‌سازی تا',
    titleHighlight: 'بستن راند',
    description:
      'ما فقط معرفی نمی‌زنیم. کل فرآیند جذب سرمایه را مهندسی می‌کنیم تا با بهترین Valuation و کمترین Dilution راند را ببندید.',
  },
  processHome: {
    badge: 'فرآیند همکاری',
    title: 'از اولین جلسه تا',
    titleHighlight: 'Term Sheet',
    description:
      'فرآیند شفاف و مرحله‌به‌مرحله. میانگین 40 روز تا بستن راند، بدون اتلاف وقت شما و سرمایه‌گذار.',
    note: 'میانگین کل فرآیند: ۴۰-۶۰ روز از شروع تا واریز',
    ctaText: 'درخواست ارزیابی رایگان',
    ctaHref: '#contact',
    steps: [
      {
        id: 1,
        title: 'ارزیابی و آماده‌سازی',
        duration: '۲-۳ هفته',
        description:
          'جلسه استراتژی عمیق، بررسی متریک‌ها، شناسایی Gap و بازنویسی کامل پکیج سرمایه‌پذیری. خروجی: دیتاروم VC-Ready.',
        tags: ['دیتاروم', 'مدل مالی', 'Executive Summary'],
        highlight: false,
      },
      {
        id: 2,
        title: 'معرفی و جلسات',
        duration: '۳-۴ هفته',
        description:
          'مچینگ با ۸-۱۲ VC مرتبط، ارسال Warm Intro شخصی‌سازی‌شده، هماهنگی جلسات و آماده‌سازی شما برای Pitch. پیگیری تا دریافت بازخورد.',
        tags: ['Warm Intro', 'جلسات VC', 'پیگیری فعال'],
        highlight: true,
      },
      {
        id: 3,
        title: 'مذاکره و بستن',
        duration: '۲-۳ هفته',
        description:
          'تحلیل Term Sheet، مذاکره Valuation و شرایط، مدیریت Due Diligence و همراهی حقوقی تا Closing. شما تمرکز کنید روی رشد، ما روی دیل.',
        tags: ['Term Sheet', 'Due Diligence', 'Closing'],
        highlight: false,
      },
    ],
  },
  testimonialsSection: {
    badge: 'نظرات کلیدی',
    title: 'بیش از ۵۰ شرکت',
    titleHighlight: 'موفق‌ترین',
    titleSuffix: 'سریع از کپیتال نتورک استفاده کردند',
    description: 'بنیان‌گذاران و سرمایه‌گذاران موفق بر سرعت و کیفیت خدمات ما تاکید می‌کنند',
  },
  servicesPage: {
    badge: '✨',
    title: 'خدمات حرفه‌ای سرمایه‌گذاری',
    subtitle: 'ارائه طیف کاملی از خدمات سرمایه‌گذاری برای رشد و موفقیت شما',
    intro: 'ما هر گام از سفر سرمایه‌گذاری شما را پوشش می‌دهیم',
  },
  services: [
    {
      id: 1,
      title: 'آماده‌سازی VC-Ready',
      description: 'دیتاروم، مدل مالی، Executive Summary و Pitch Deck شما را به استاندارد McKinsey می‌رسانیم. VCهای Tier-1 فقط با پکیج کامل جلسه می‌گذارند.',
      items: ['بازنویسی ES و Narrative', 'ساخت دیتاروم کامل + Metrics', 'مدل مالی و Valuation'],
      tag: 'فاز اول',
      featured: false,
      color: '#D19C0A',
      iconType: 'cube',
    },
    {
      id: 2,
      title: 'معرفی هدفمند به Tier-1',
      description: 'دسترسی مستقیم به 200+ VC و CVC. بر اساس Thesis، چک‌سایز و Stage، فقط به سرمایه‌گذارهای مرتبط معرفی می‌شوید.',
      items: ['مچینگ با VCهای مرتبط با Thesis', 'Warm Intro + ایمیل شخصی Partner', 'پیگیری تا جلسه اول'],
      tag: 'فاز دوم',
      featured: true,
      color: '#00B2A9',
      iconType: 'target',
    },
    {
      id: 3,
      title: 'پشتیبانی مذاکره و بستن',
      description: 'از Term Sheet تا Closing کنارتان هستیم. روی Valuation، Liquidation Preference و Board Seat مذاکره می‌کنیم.',
      items: ['تحلیل Term Sheet و Red Flag', 'استراتژی مذاکره Valuation', 'همراهی تا امضای قرارداد'],
      tag: 'فاز سوم',
      featured: false,
      color: '#D19C0A',
      iconType: 'document',
    },
  ],
  processPage: {
    badge: '📋',
    title: 'مراحل همکاری',
    subtitle: 'فرآیند ساده و شفاف برای شروع همکاری',
    intro: 'از ثبت‌نام تا جذب سرمایه، ما در کنار شما هستیم',
  },
  processSteps: [
    {
      id: 1,
      title: 'ثبت‌نام',
      duration: '۲-۳ هفته',
      description: 'در پلتفرم ثبت‌نام کنید و اطلاعات اولیه را تکمیل نمایید',
      tags: ['ثبت‌نام', 'شروع'],
    },
    {
      id: 2,
      title: 'ارزیابی',
      duration: '۳-۴ هفته',
      description: 'تیم کارشناسی ما طرح و ایده شما را ارزیابی می‌کند',
      tags: ['ارزیابی', 'کارآفرینی'],
      highlight: true,
    },
    {
      id: 3,
      title: 'مصاحبه',
      duration: '۲-۳ هفته',
      description: 'جلسه مصاحبه تخصصی برای بررسی بیشتر برگزار می‌شود',
      tags: ['مصاحبه', 'جلسه'],
    },
    {
      id: 4,
      title: 'تأمین سرمایه',
      duration: '۲-۳ هفته',
      description: 'پس از تأیید نهایی، سرمایه مورد نیاز تأمین می‌شود',
      tags: ['تأمین سرمایه', 'بستن قرارداد'],
    },
  ],
  blogPage: {
    badge: '📝',
    title: 'آخرین مطالب',
    subtitle: 'جدیدترین مقالات و مطالب آموزشی در حوزه سرمایه‌گذاری',
    intro: 'مطالب تخصصی درباره سرمایه‌گذاری، کارآفرینی و توسعه تجارت',
    ctaText: 'مشاهده تمام مقالات',
  },
  contactPage: {
    badge: '📞',
    title: 'با ما در ارتباط باشید',
    subtitle: 'کارشناسان ما آماده پاسخگویی به سوالات شما هستند',
    phone: '۰۲۱-۱۲۳۴۵۶۷۸',
    email: 'info@capitalnetwork.ir',
    address: 'تهران، خیابان ولیعصر، برج ایران زمین',
    formTitle: 'ارسال پیام',
    formSuccessMessage: 'پیام شما با موفقیت ارسال شد. ما به زودی با شما تماس خواهیم گرفت.',
  },
  aboutPage: {
    badge: 'ℹ️',
    title: 'Capital Network',
    subtitle: 'پلتفرم تخصصی ارتباط سرمایه‌گذاران و کارآفرینان',
    storyTitle: 'داستان ما',
    storyText: 'Capital Network یک پلتفرم نوآورانه است که با هدف ایجاد پل ارتباطی بین سرمایه‌گذاران و کارآفرینان راه‌اندازی شده است. ما معتقدیم هر ایده خوب شایسته سرمایه‌گذاری است.',
    missionTitle: 'تعهد ما',
    missionText: 'ما متعهد به کمک به کارآفرینان برای رسیدن به اهداف خود و ایجاد تأثیر معنادار در اقتصاد هستیم.',
    stats: [
      { id: 1, number: '۵۰۰+', label: 'کارآفرین' },
      { id: 2, number: '۲۰۰+', label: 'سرمایه‌گذار' },
      { id: 3, number: '۱۰۰۰+', label: 'پروژه موفق' },
    ],
  },
  privacyPage: {
    badge: '🔒',
    title: 'حریم خصوصی',
    subtitle: 'سیاست حفظ و استفاده از اطلاعات شخصی',
    sections: [
      {
        id: 1,
        title: 'جمع‌آوری اطلاعات',
        body: 'ما تنها اطلاعاتی را جمع‌آوری می‌کنیم که برای ارائه خدمات، ارتباط با شما و بهبود تجربه کاربری ضروری است.',
      },
      {
        id: 2,
        title: 'استفاده از داده‌ها',
        body: 'اطلاعات شما صرفاً برای پردازش درخواست‌ها، پشتیبانی، ارسال به‌روزرسانی‌های مرتبط و تحلیل‌های داخلی استفاده می‌شود.',
      },
    ],
  },
  disclaimerPage: {
    badge: '⚠️',
    title: 'سلب مسئولیت',
    subtitle: 'محدودیت‌های حقوقی و دامنه مسئولیت',
    sections: [
      {
        id: 1,
        title: 'عدم تضمین نتیجه',
        body: 'محتوای این وب‌سایت جنبه اطلاع‌رسانی دارد و تضمینی برای جذب سرمایه، انعقاد قرارداد یا حصول نتیجه مشخص ارائه نمی‌دهد.',
      },
      {
        id: 2,
        title: 'تصمیم سرمایه‌گذاری',
        body: 'هرگونه تصمیم مالی یا سرمایه‌گذاری بر عهده کاربر است و توصیه می‌شود پیش از اقدام با مشاوران مستقل مشورت کنید.',
      },
    ],
  },
  termsPage: {
    badge: '📜',
    title: 'شرایط و ضوابط کاری',
    subtitle: 'قوانین همکاری و حدود مسئولیت‌ها',
    sections: [
      {
        id: 1,
        title: 'دامنه خدمات',
        body: 'این سند شرایط و ضوابط کلی همکاری میان «کپیتال نتورک» (در ادامه «شرکت») و مشتریان/استارتاپ‌ها (در ادامه «مشتری») را تعیین می‌کند. پیش از آغاز هرگونه همکاری، مطالعه و پذیرش این شرایط ضروری است.',
      },
      {
        id: 2,
        title: 'تعهدات مشتری',
        body: 'مشتری موظف است اطلاعات صحیح و کامل را در اختیار شرکت قرار دهد، اسناد مورد نیاز را فراهم نموده و در فرآیند همکاری پاسخگو و همکار باشد. تأخیر یا اطلاعات ناقص ممکن است بر روند خدمات تأثیر بگذارد.',
      },
      {
        id: 3,
        title: 'رازداری',
        body: 'هر دو طرف متعهد به حفظ محرمانگی اطلاعات حساس هستند. افشای اطلاعات محرمانه بدون موافقت کتبی طرف مقابل مجاز نیست مگر در مواردی که قانون یا درخواست مراجع ذی‌صلاح الزام کند.',
      },
      {
        id: 4,
        title: 'محدودیت مسئولیت',
        body: 'شرکت تمام تلاش حرفه‌ای خود را به‌کار می‌گیرد، اما تضمین مشخص برای حصول نتیجهٔ جذب سرمایه یا دریافت سرمایه‌گذاری ارائه نمی‌دهد. مسئولیت شرکت در چارچوب قوانین و محدود به خسارت‌های مستقیم خواهد بود.',
      },
    ],
  },
  loginPage: {
    title: 'ورود به حساب کاربری',
    subtitle: 'برای دسترسی به خدمات کپیتال نتورک با ایمیل یا شماره تلفن وارد حساب خود شوید',
    emailLabel: 'ایمیل یا شماره تلفن',
    passwordLabel: 'رمز عبور',
    loginButton: 'ورود',
    forgotPassword: 'رمز عبور خود را فراموش کردید؟',
    signUp: 'هنوز حساب ندارید؟ ثبت‌نام کنید',
  },
  registerPage: {
    title: 'ثبت نام در کپیتال نتورک',
    subtitle: 'برای شروع همکاری و دسترسی به خدمات، فرم زیر را تکمیل کنید',
    fullNameLabel: 'نام و نام خانوادگی',
    emailLabel: 'ایمیل',
    phoneLabel: 'شماره تلفن',
    passwordLabel: 'رمز عبور',
    confirmPasswordLabel: 'تکرار رمز عبور',
    agreeTerms: 'من شرایط و قوانین را می‌پذیرم',
    registerButton: 'ثبت نام',
    haveAccount: 'حساب کاربری دارید؟',
    loginLink: 'وارد شوید',
  },
  requestEvaluation: {
    brand: 'Capital Network',
    title: 'درخواست ارزیابی',
    subtitle: 'برای شروع، نوع همکاری خود را انتخاب کنید',
    intro: 'با انتخاب مسیر مناسب، پرونده شما به سرعت بررسی می‌شود',
    welcomeMessage: 'به کپیتال نتورک خوش آمدید',
    introText: 'برای شروع، نوع همکاری خود را انتخاب کنید',
    reviewMessage: 'تیم Capital Network طی 2 تا 7 روز کاری اطلاعات شما را بررسی می‌کند.',
  },
  trust: {
    header: {
      badge: 'شبکه جهانی',
      title: 'شبکه جهانی سرمایه‌گذاران',
      subtitle: 'دسترسی مستقیم به سرمایه‌گذاران Tier-1 در 5 قاره',
    },
    continents: [
      { id: 1, icon: '🌍', name: 'اروپا', count: '45+ VC' },
      { id: 2, icon: '🇺🇸', name: 'آمریکای شمالی', count: '38+ VC' },
      { id: 3, icon: '🌐', name: 'خاورمیانه', count: '22+ VC' },
      { id: 4, icon: '🌏', name: 'آسیا', count: '15+ VC' },
      { id: 5, icon: '🌍', name: 'آفریقا', count: '8+ VC' },
    ],
    note: 'برخی از سرمایه‌گذاران منتخب از شبکه ما (اطلاعات محرمانه)',
    metrics: [
      { id: 1, value: 50, suffix: 'M+', label: 'سرمایه جذب‌شده', prefix: '+' },
      { id: 2, value: 92, suffix: '%', label: 'نرخ موفقیت معرفی', prefix: '' },
      { id: 3, value: 40, suffix: '', label: 'میانگین رسیدن به Term Sheet', prefix: '' },
    ],
    cta: {
      text: 'شروع همکاری با شبکه جهانی',
      href: '#contact',
    },
  },
  testimonials: [
    { id: 1, author: 'علی رضایی', role: 'بنیان‌گذار و CEO، StartupX', text: 'تیم کپیتال نتورک ما را در کمتر از ۶ ماه به سه VC Tier-1 متصل کردند. بدون آن‌ها، Series A ما ممکن نبود.', rating: 5 },
    { id: 2, author: 'فاطمه محمدی', role: 'بنیان‌گذار، FinTech Solutions', text: 'دیتاروم و Pitch Deck‌شان بسیار حرفه‌ای بود. VCهای مختلف از ما تشویق کردند که بر روی نقاط تاکید آن‌ها تمرکز کنیم.', rating: 5 },
    { id: 3, author: 'محمد کریمی', role: 'CEO و بنیان‌گذار، E-commerce Pro', text: 'بهترین سرمایه‌گذار است که تاکنون کار کرده‌ام. دانش خود را به شرکت ما نیز اختصاص دادند.', rating: 5 },
  ],
  footer: {
      brandName: 'کپیتال نتورک',
      about: 'کپیتال نتورک؛ اتصال استارتاپ‌های ایرانی به شبکه جهانی سرمایه‌گذاران.',
      ctaText: 'شروع همکاری',
      ctaHref: '#contact',
      links: [
        { id: 1, label: 'درباره ما', href: '/about' },
        { id: 2, label: 'تماس با ما', href: '/contact' },
        { id: 3, label: 'بلاگ', href: '/blog' },
        { id: 4, label: 'شرایط و ضوابط کاری', href: '/terms' },
      ],
      servicesLinks: [
        { id: 1, label: 'آماده‌سازی VC-Ready', href: '/services#service-1' },
        { id: 2, label: 'معرفی به سرمایه‌گذار', href: '/services#service-2' },
        { id: 3, label: 'پشتیبانی مذاکره و بستن', href: '/services#service-3' },
        { id: 4, label: 'ارزیابی رایگان', href: '/services#service-1' },
      ],
      contact: {
        email: 'invest@capitalnetwork.ir',
        whatsapp: 'https://wa.me/989123456789',
        whatsappLabel: 'WhatsApp Business',
        location: 'دبی، امارات - لندن، UK',
        locationHref: '/contact',
        support: 'پاسخگویی: شنبه تا چهارشنبه',
        supportHref: '/contact',
      },
      newsletter: {
        title: 'Deal Flow Insights',
        description: 'ماهانه ۱ ایمیل: ترندهای جذب سرمایه، لیست VCهای فعال، و نکات Pitch.',
        placeholder: 'ایمیل کاری شما',
        submitText: 'عضویت',
      },
      social: {
        linkedin: '',
        instagram: '',
        twitter: '',
      },
      legalLinks: [
        { id: 1, label: 'حریم خصوصی', href: '/privacy' },
        { id: 2, label: 'شرایط و ضوابط کاری', href: '/terms' },
        { id: 3, label: 'سلب مسئولیت', href: '/disclaimer' },
      ],
      copyright: '© 2026 Capital Network. تمام حقوق محفوظ است.',
    },
  siteStyles: {
    cssVariables: {
      '--cn-primary': '#0A1D3D',
      '--cn-accent': '#D19C0A',
      '--cn-accent-2': '#00B2A9',
      '--cn-bg': '#ffffff',
      '--cn-text': '#0A1D3D'
    },
    customCss: ''
  }
}

export const storageKeys = {
  content: 'capitalNetworkSiteContent',
  registrations: 'capitalNetworkRegistrations',
}

const NAV_HREF_MAP = {
  services: '/services',
  process: '/process',
  blog: '/blog',
  contact: '/contact',
  about: '/about',
}

export function normalizeHeader(header = {}) {
  const merged = { ...defaultSiteContent.header, ...header }
  if (Array.isArray(merged.navItems) && merged.navItems.length > 0) {
    return merged
  }
  const nav = merged.nav || defaultSiteContent.header.nav
  merged.navItems = Object.entries(nav).map(([key, label], index) => ({
    id: index + 1,
    label,
    href: NAV_HREF_MAP[key] || `/${key}`,
    key,
  }))
  return merged
}

export function normalizeSiteContent(content = {}) {
  const merged = {
    ...defaultSiteContent,
    ...content,
    header: normalizeHeader(content.header),
    hero: normalizeHero(content.hero),
    ctaSection: { ...defaultSiteContent.ctaSection, ...(content.ctaSection || {}) },
    servicesHome: { ...defaultSiteContent.servicesHome, ...(content.servicesHome || {}) },
    processHome: {
      ...defaultSiteContent.processHome,
      ...(content.processHome || {}),
      steps: Array.isArray(content.processHome?.steps)
        ? content.processHome.steps
        : defaultSiteContent.processHome.steps,
    },
    testimonialsSection: {
      ...defaultSiteContent.testimonialsSection,
      ...(content.testimonialsSection || {}),
    },
    trust: {
      ...defaultSiteContent.trust,
      ...(content.trust || {}),
      header: {
        ...defaultSiteContent.trust.header,
        ...(content.trust?.header || {}),
      },
      continents: Array.isArray(content.trust?.continents)
        ? content.trust.continents
        : defaultSiteContent.trust.continents,
      metrics: Array.isArray(content.trust?.metrics)
        ? content.trust.metrics
        : defaultSiteContent.trust.metrics,
      cta: {
        ...defaultSiteContent.trust.cta,
        ...(content.trust?.cta || {}),
      },
    },
    testimonials: Array.isArray(content.testimonials)
      ? content.testimonials
      : defaultSiteContent.testimonials,
    footer: {
      ...defaultSiteContent.footer,
      ...(content.footer || {}),
      contact: {
        ...defaultSiteContent.footer.contact,
        ...(content.footer?.contact || {}),
      },
      newsletter: {
        ...defaultSiteContent.footer.newsletter,
        ...(content.footer?.newsletter || {}),
      },
      social: {
        ...defaultSiteContent.footer.social,
        ...(content.footer?.social || {}),
      },
      links: Array.isArray(content.footer?.links)
        ? content.footer.links
        : defaultSiteContent.footer.links,
      servicesLinks: Array.isArray(content.footer?.servicesLinks)
        ? content.footer.servicesLinks
        : defaultSiteContent.footer.servicesLinks,
      legalLinks: Array.isArray(content.footer?.legalLinks)
        ? content.footer.legalLinks
        : defaultSiteContent.footer.legalLinks,
    },
    services: Array.isArray(content.services) ? content.services : defaultSiteContent.services,
    processSteps: Array.isArray(content.processSteps)
      ? content.processSteps
      : defaultSiteContent.processSteps,
    servicesPage: { ...defaultSiteContent.servicesPage, ...(content.servicesPage || {}) },
    processPage: { ...defaultSiteContent.processPage, ...(content.processPage || {}) },
    aboutPage: {
      ...defaultSiteContent.aboutPage,
      ...(content.aboutPage || {}),
      stats: Array.isArray(content.aboutPage?.stats)
        ? content.aboutPage.stats
        : defaultSiteContent.aboutPage.stats,
    },
    blogPage: { ...defaultSiteContent.blogPage, ...(content.blogPage || {}) },
    contactPage: { ...defaultSiteContent.contactPage, ...(content.contactPage || {}) },
    termsPage: {
      ...defaultSiteContent.termsPage,
      ...(content.termsPage || {}),
      sections: Array.isArray(content.termsPage?.sections)
        ? content.termsPage.sections
        : defaultSiteContent.termsPage.sections,
    },
    privacyPage: {
      ...defaultSiteContent.privacyPage,
      ...(content.privacyPage || {}),
      sections: Array.isArray(content.privacyPage?.sections)
        ? content.privacyPage.sections
        : defaultSiteContent.privacyPage.sections,
    },
    disclaimerPage: {
      ...defaultSiteContent.disclaimerPage,
      ...(content.disclaimerPage || {}),
      sections: Array.isArray(content.disclaimerPage?.sections)
        ? content.disclaimerPage.sections
        : defaultSiteContent.disclaimerPage.sections,
    },
    loginPage: { ...defaultSiteContent.loginPage, ...(content.loginPage || {}) },
    registerPage: { ...defaultSiteContent.registerPage, ...(content.registerPage || {}) },
    requestEvaluation: {
      ...defaultSiteContent.requestEvaluation,
      ...(content.requestEvaluation || {}),
    },
  }
  return merged
}

export function getStoredSiteContent() {
  if (typeof window === 'undefined') return defaultSiteContent
  try {
    const stored = window.localStorage.getItem(storageKeys.content)
    if (!stored) return normalizeSiteContent({})

    const parsed = JSON.parse(stored)
    return normalizeSiteContent(parsed)
  } catch {
    return defaultSiteContent
  }
}

export function persistSiteContentToStorage(content) {
  if (typeof window === 'undefined') return
  const normalized = normalizeSiteContent(content)
  window.localStorage.setItem(storageKeys.content, JSON.stringify(normalized))
  window.dispatchEvent(new CustomEvent('site-content-updated', { detail: normalized }))
}

export async function fetchSiteContent() {
  try {
    const res = await fetch('/api/site-content', { cache: 'no-store' })
    if (!res.ok) throw new Error('fetch failed')
    const data = await res.json()
    const normalized = normalizeSiteContent(data.content || {})
    persistSiteContentToStorage(normalized)
    return normalized
  } catch {
    return getStoredSiteContent()
  }
}

export function nextListId(items = []) {
  const ids = items.map((item) => Number(item.id) || 0)
  return ids.length ? Math.max(...ids) + 1 : 1
}
