import Header from './components/Header'
import Hero from './components/Hero'
import TrustSection from './components/TrustSection'
import Services from './components/Services'
import Process from './components/Process'
import CTASection from './components/CTASection'
import Testimonials from './components/Testimonials'

export const metadata = {
  title: 'کپیتال نتورک - پلتفرم تخصصی سرمایه‌گذاری',
  description: 'پلتفرم تخصصی ارتباط سرمایه‌گذاران و کارآفرینان. خدمات مشاوره، تحلیل بازار، و تامین سرمایه برای استارتاپ‌ها',
  keywords: ['سرمایه‌گذاری', 'استارتاپ', 'تامین مالی', 'کارآفرینی', 'سرمایه‌گذار'],
  openGraph: {
    title: 'کپیتال نتورک',
    description: 'پلتفرم تخصصی ارتباط سرمایه‌گذاران و کارآفرینان',
    type: 'website',
    url: 'https://yourdomain.com',
    locale: 'fa_IR',
    siteName: 'Capital Network',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Capital Network',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'کپیتال نتورک',
    description: 'پلتفرم تخصصی سرمایه‌گذاری و کارآفرینی',
    images: ['/og-image.jpg'],
  },
  robots: 'index, follow',
  canonical: 'https://yourdomain.com',
}

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <TrustSection />
      <Services />
      <CTASection />
      <Process />
      <Testimonials />
    </main>
  )
}