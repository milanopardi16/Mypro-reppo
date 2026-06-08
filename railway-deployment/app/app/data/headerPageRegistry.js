/** نگاشت لینک دکمه‌های هدر به شناسه صفحه و کلیدهای محتوا */

export const HREF_TO_PAGE_ID = {
  '/': 'home',
  '/services': 'services',
  '/process': 'process',
  '/about': 'about',
  '/contact': 'contact',
  '/blog': 'blog',
  '/terms': 'terms',
  '/privacy': 'privacy',
  '/disclaimer': 'disclaimer',
  '/login': 'login',
  '/register': 'register',
  '/founder_onboarding': 'evaluation',
}

export function normalizeHref(href = '') {
  if (!href) return ''
  let path = String(href).trim().split('?')[0].split('#')[0]
  if (!path.startsWith('/')) path = `/${path}`
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)
  return path
}

export function resolvePageIdFromHref(href) {
  const path = normalizeHref(href)
  if (HREF_TO_PAGE_ID[path]) return HREF_TO_PAGE_ID[path]
  if (path.startsWith('/blog')) return 'blog'
  if (path.startsWith('/services')) return 'services'
  if (path.startsWith('/process')) return 'process'
  return null
}

export const PAGE_ID_LABELS = {
  home: 'صفحه اصلی (هیرو)',
  services: 'خدمات',
  process: 'فرآیند',
  about: 'درباره ما',
  contact: 'تماس',
  blog: 'بلاگ',
  terms: 'شرایط',
  privacy: 'حریم خصوصی',
  disclaimer: 'سلب مسئولیت',
  login: 'ورود',
  register: 'ثبت‌نام',
  evaluation: 'درخواست ارزیابی',
  search: 'جستجو',
  external: 'لینک خارجی',
}

export const INNER_PAGE_KEYS = [
  'servicesPage',
  'services',
  'processPage',
  'processSteps',
  'aboutPage',
  'blogPage',
  'contactPage',
  'termsPage',
  'privacyPage',
  'disclaimerPage',
  'loginPage',
  'registerPage',
  'requestEvaluation',
  'hero',
]

export function pickInnerContent(content) {
  const picked = {}
  for (const key of INNER_PAGE_KEYS) {
    if (content?.[key] !== undefined) picked[key] = content[key]
  }
  return picked
}

/** لیست همه دکمه‌های قابل مدیریت در هدر */
export function getHeaderButtons(header = {}) {
  const buttons = [
    {
      id: 'logo',
      type: 'brand',
      label: header.brand || 'لوگو / برند',
      href: '/',
      pageId: 'home',
      icon: '🏠',
      editable: true,
      deletable: false,
    },
  ]

  for (const item of header.navItems || []) {
    buttons.push({
      id: `nav-${item.id}`,
      type: 'nav',
      navId: item.id,
      label: item.label || 'منو',
      href: item.href || '/',
      pageId: resolvePageIdFromHref(item.href),
      icon: '🔗',
      editable: true,
      deletable: true,
    })
  }

  buttons.push({
    id: 'login',
    type: 'auth',
    label: header.auth?.login || 'ورود',
    href: header.auth?.loginHref || '/login',
    pageId: 'login',
    icon: '🔐',
    editable: true,
    deletable: false,
  })

  buttons.push({
    id: 'evaluation',
    type: 'cta',
    label: header.auth?.requestEvaluation || 'درخواست ارزیابی',
    href: header.auth?.evaluationHref || '/founder_onboarding',
    pageId: resolvePageIdFromHref(header.auth?.evaluationHref) || 'evaluation',
    icon: '📊',
    editable: true,
    deletable: false,
  })

  buttons.push({
    id: 'search',
    type: 'search',
    label: header.search?.label || 'جستجو',
    href: null,
    pageId: 'search',
    icon: '🔍',
    editable: true,
    deletable: false,
  })

  return buttons
}
