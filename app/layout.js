// app/layout.js
import './globals.css'
import './mobile-responsive.css'
import ScrollToTop from './components/ScrollToTop'
import ConditionalFooter from './components/ConditionalFooter'
import PlatformDetector from './components/PlatformDetector'

export const metadata = {
  title: 'خانه - کپیتال نتورک',
  description: 'اتصال مستقیم به VCهای Tier-1 | جذب سرمایه حرفه‌ای از Seed تا Series B',
  keywords: 'جذب سرمایه, سرمایه‌گذار, استارتاپ, VC, سرمایه‌گذاری خطرپذیر',
  openGraph: {
    title: 'کپیتال نتورک - شبکه جهانی سرمایه‌گذاران',
    description: 'ما استارتاپ‌های ممتاز را به شبکه اختصاصی سرمایه‌گذاران Tier-1 معرفی می‌کنیم.',
    type: 'website',
    locale: 'fa_IR',
    siteName: 'کپیتال نتورک',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'کپیتال نتورک - شبکه جهانی سرمایه‌گذاران',
    description: 'ما استارتاپ‌های ممتاز را به شبکه اختصاصی سرمایه‌گذاران Tier-1 معرفی می‌کنیم.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html dir="rtl" lang="fa-IR" suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0A1D3D" />
        <meta name="author" content="کپیتال نتورک" />
        <meta name="language" content="fa-IR" />
      </head>
      <body className="cn-site-shell">
        <PlatformDetector />
        <div className="cn-site-background" aria-hidden="true">
          <span className="cn-gradient-orb cn-orb-1"></span>
          <span className="cn-gradient-orb cn-orb-2"></span>
          <span className="cn-grid-pattern"></span>
        </div>
        {children}
        <ConditionalFooter />
        <ScrollToTop />
      </body>
    </html>
  )
}