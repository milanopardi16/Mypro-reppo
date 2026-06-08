/** ساختار کامل محتوا و انیمیشن بخش هیرو */

export const HERO_SECTIONS = [
  { id: 'background', label: 'پس‌زمینه', icon: '🌌', description: 'گرادیان، orbها و grid' },
  { id: 'particles', label: 'ذرات', icon: '✨', description: 'نقطه‌های متحرک پس‌زمینه' },
  { id: 'shapes', label: 'اشکال شناور', icon: '◇', description: 'اشکال هندسی متحرک' },
  { id: 'badge', label: 'نشان (Badge)', icon: '🏷️', description: 'برچسب بالای عنوان' },
  { id: 'title', label: 'عنوان اصلی', icon: '📌', description: 'عنوان با گرادیان متحرک' },
  { id: 'tagline', label: 'شعار', icon: '⌨️', description: 'متن تایپ‌رایتری' },
  { id: 'description', label: 'توضیحات', icon: '📝', description: 'همه پاراگراف‌های توضیحی — مجزا و قابل CRUD' },
  { id: 'cta', label: 'دکمه‌ها (CTA)', icon: '🔘', description: 'دکمه‌های اقدام' },
  { id: 'stats', label: 'آمار', icon: '📊', description: 'نوار آمار پایین' },
  { id: 'scroll', label: 'اسکرول', icon: '↓', description: 'راهنمای اسکرول' },
  { id: 'parallax', label: 'پارالاکس', icon: '🔄', description: 'حرکت هنگام اسکرول' },
]

export const defaultExtra = () => ({
  enabled: false,
  title: '',
  text: '',
})

export const defaultHeroContent = {
  background: {
    enabled: true,
    showOrbs: true,
    showGrid: true,
    extra: defaultExtra(),
  },
  particles: {
    enabled: true,
    mode: 'auto',
    count: 25,
    items: [],
    extra: defaultExtra(),
    animation: {
      floatY: 20,
      durationMultiplier: 2,
      ease: 'easeInOut',
    },
  },
  shapes: {
    enabled: true,
    extra: defaultExtra(),
    items: [
      {
        id: 1,
        name: 'مربع طلایی',
        type: 'rect',
        width: 40,
        height: 40,
        strokeColor: 'rgba(209,156,10,0.15)',
        strokeWidth: 2,
        positionClass: 'cn-shape-1',
        animation: { duration: 6, delay: 0, yPeak: -15, rotatePeak: 10 },
      },
      {
        id: 2,
        name: 'دایره فیروزه‌ای',
        type: 'circle',
        width: 30,
        height: 30,
        strokeColor: 'rgba(0,178,169,0.15)',
        strokeWidth: 2,
        positionClass: 'cn-shape-2',
        animation: { duration: 8, delay: 1, yPeak: 20, rotatePeak: 15 },
      },
      {
        id: 3,
        name: 'مثلث',
        type: 'triangle',
        width: 35,
        height: 35,
        strokeColor: 'rgba(209,156,10,0.12)',
        strokeWidth: 2,
        positionClass: 'cn-shape-3',
        animation: { duration: 7, delay: 2, yPeak: -18, rotatePeak: 20 },
      },
    ],
  },
  badge: {
    enabled: true,
    text: 'اتصال مستقیم به VCهای Tier-1',
    showPulse: true,
    extra: defaultExtra(),
    animation: {
      entranceDelay: 0.2,
      entranceDuration: 0.6,
      entranceX: -30,
      pulseDuration: 2,
      pulseScale: 1.5,
    },
  },
  title: {
    enabled: true,
    text: 'کپیتال نتورک',
    extra: defaultExtra(),
    animation: {
      entranceDelay: 0.4,
      entranceDuration: 0.8,
      entranceY: 40,
      gradientDuration: 4,
    },
  },
  tagline: {
    enabled: true,
    text: 'سرمایه‌گذار درست، در زمان درست',
    showCursor: true,
    cursorChar: '|',
    extra: defaultExtra(),
    animation: {
      typingSpeedMs: 80,
      cursorBlinkMs: 500,
      entranceDelay: 0.8,
      entranceDuration: 0.5,
    },
  },
  description: {
    enabled: true,
    items: [
      {
        id: 1,
        title: 'توضیح اصلی',
        text: 'ما استارتاپ‌های ممتاز را به شبکه اختصاصی سرمایه‌گذاران Tier-1 معرفی می‌کنیم. از دیزاین دیتاروم تا بستن راند، استراتژی جذب سرمایه شما را مهندسی می‌کنیم.',
        order: 1,
        enabled: true,
      },
    ],
    extra: defaultExtra(),
    animation: {
      entranceDelay: 1.2,
      entranceDuration: 0.6,
      entranceY: 30,
    },
  },
  cta: {
    enabled: true,
    extra: defaultExtra(),
    animation: {
      entranceDelay: 1.6,
      entranceDuration: 0.6,
      entranceY: 30,
    },
    items: [
      {
        id: 1,
        label: 'شروع فرآیند جذب سرمایه',
        href: '#contact',
        variant: 'primary',
        linkType: 'internal',
        iconAnimation: 'slide',
        iconDuration: 1.5,
        order: 1,
      },
      {
        id: 2,
        label: 'تماس با ما',
        href: '',
        phone: '+989123456789',
        variant: 'secondary',
        linkType: 'phone',
        iconAnimation: 'rotate',
        iconDuration: 2,
        order: 2,
      },
    ],
  },
  stats: {
    enabled: true,
    extra: defaultExtra(),
    animation: {
      entranceDelay: 2,
      entranceDuration: 0.6,
      entranceY: 30,
      hoverScale: 1.05,
      counterStepMs: 30,
      observerThreshold: 0.3,
    },
    items: [
      { id: 1, display: '+$50M', label: 'سرمایه جذب‌شده', counterTarget: 50, counterSuffix: 'M', prefix: '+$' },
      { id: 2, display: '40+ روز', label: 'میانگین بستن راند', counterTarget: 40, counterSuffix: ' روز', prefix: '' },
      { id: 3, display: 'Tier-1', label: 'شبکه انحصاری VC', counterTarget: null, counterSuffix: '', prefix: '' },
    ],
  },
  scroll: {
    enabled: true,
    text: 'اسکرول کنید',
    extra: defaultExtra(),
    animation: {
      entranceDelay: 3,
      mouseFloatY: 6,
      mouseDuration: 2,
      dotTravelY: 10,
      dotDuration: 2,
    },
  },
  parallax: {
    enabled: true,
    yMax: 150,
    opacityAtEnd: 0.5,
    opacityScrollPoint: 0.8,
    extra: defaultExtra(),
  },
}

function mergeSectionExtra(baseSection, inputSection) {
  return {
    ...baseSection,
    ...(inputSection || {}),
    extra: {
      ...defaultExtra(),
      ...(baseSection?.extra || {}),
      ...(inputSection?.extra || {}),
    },
  }
}

function mergeAnim(defaults, input) {
  return { ...defaults, ...(input || {}) }
}

/** تبدیل ساختار قدیمی (تخت) به ساختار جدید */
export function normalizeHero(hero = {}) {
  const base = defaultHeroContent
  const h = hero && typeof hero === 'object' ? hero : {}

  const badgeText = h.badge?.text ?? h.badge ?? base.badge.text
  const titleText = h.title?.text ?? h.title ?? base.title.text
  const taglineText = h.tagline?.text ?? h.tagline ?? base.tagline.text
  const legacyDescText =
    typeof h.description === 'string'
      ? h.description
      : h.description?.text ?? base.description.items[0]?.text
  const scrollText = h.scroll?.text ?? h.scrollText ?? base.scroll.text

  let descriptionItems = h.description?.items
  if (!Array.isArray(descriptionItems) || descriptionItems.length === 0) {
    descriptionItems = [
      {
        id: 1,
        title: 'توضیح اصلی',
        text: legacyDescText,
        order: 1,
        enabled: true,
      },
    ]
  }

  let ctaItems = h.cta?.items
  if (!Array.isArray(ctaItems) || ctaItems.length === 0) {
    ctaItems = [
      {
        id: 1,
        label: h.ctaPrimary ?? base.cta.items[0].label,
        href: h.ctaPrimaryHref ?? base.cta.items[0].href,
        variant: 'primary',
        linkType: 'internal',
        iconAnimation: 'slide',
        iconDuration: 1.5,
        order: 1,
      },
      {
        id: 2,
        label: h.ctaSecondary ?? base.cta.items[1].label,
        phone: h.contactPhone ?? base.cta.items[1].phone,
        href: '',
        variant: 'secondary',
        linkType: 'phone',
        iconAnimation: 'rotate',
        iconDuration: 2,
        order: 2,
      },
    ]
  }

  let statItems = h.stats?.items ?? h.stats
  if (!Array.isArray(statItems)) statItems = base.stats.items

  let shapeItems = h.shapes?.items
  if (!Array.isArray(shapeItems) || shapeItems.length === 0) shapeItems = base.shapes.items

  return {
    background: mergeSectionExtra(base.background, h.background),
    particles: mergeSectionExtra(
      {
        ...base.particles,
        ...(h.particles || {}),
        animation: mergeAnim(base.particles.animation, h.particles?.animation),
        items: Array.isArray(h.particles?.items) ? h.particles.items : base.particles.items,
      },
      h.particles
    ),
    shapes: mergeSectionExtra({ ...base.shapes, ...(h.shapes || {}), items: shapeItems }, h.shapes),
    badge: mergeSectionExtra(
      {
        ...base.badge,
        ...(typeof h.badge === 'object' ? h.badge : {}),
        text: badgeText,
        animation: mergeAnim(base.badge.animation, typeof h.badge === 'object' ? h.badge.animation : {}),
      },
      typeof h.badge === 'object' ? h.badge : {}
    ),
    title: mergeSectionExtra(
      {
        ...base.title,
        ...(typeof h.title === 'object' ? h.title : {}),
        text: titleText,
        animation: mergeAnim(base.title.animation, typeof h.title === 'object' ? h.title.animation : {}),
      },
      typeof h.title === 'object' ? h.title : {}
    ),
    tagline: mergeSectionExtra(
      {
        ...base.tagline,
        ...(typeof h.tagline === 'object' ? h.tagline : {}),
        text: taglineText,
        animation: mergeAnim(base.tagline.animation, typeof h.tagline === 'object' ? h.tagline.animation : {}),
      },
      typeof h.tagline === 'object' ? h.tagline : {}
    ),
    description: mergeSectionExtra(
      {
        ...base.description,
        ...(typeof h.description === 'object' ? h.description : {}),
        items: descriptionItems,
        animation: mergeAnim(
          base.description.animation,
          typeof h.description === 'object' ? h.description.animation : {}
        ),
      },
      typeof h.description === 'object' ? h.description : {}
    ),
    cta: mergeSectionExtra(
      {
        ...base.cta,
        ...(h.cta || {}),
        animation: mergeAnim(base.cta.animation, h.cta?.animation),
        items: ctaItems,
      },
      h.cta
    ),
    stats: mergeSectionExtra(
      {
        ...base.stats,
        ...(typeof h.stats === 'object' && !Array.isArray(h.stats) ? h.stats : {}),
        animation: mergeAnim(
          base.stats.animation,
          typeof h.stats === 'object' && !Array.isArray(h.stats) ? h.stats.animation : {}
        ),
        items: statItems,
      },
      typeof h.stats === 'object' && !Array.isArray(h.stats) ? h.stats : {}
    ),
    scroll: mergeSectionExtra(
      {
        ...base.scroll,
        ...(h.scroll || {}),
        text: scrollText,
        animation: mergeAnim(base.scroll.animation, h.scroll?.animation),
      },
      h.scroll
    ),
    parallax: mergeSectionExtra(base.parallax, h.parallax),
  }
}

const LEGACY_HERO_KEYS = [
  'badge_legacy',
  'title_legacy',
  'tagline_legacy',
  'description_legacy',
  'scrollText',
  'ctaPrimary',
  'ctaPrimaryHref',
  'ctaSecondary',
  'contactPhone',
]

export function exportHeroForSave(hero) {
  const normalized = normalizeHero(hero)
  const out = { ...normalized }
  LEGACY_HERO_KEYS.forEach((key) => delete out[key])
  return out
}
