'use client'

import { usePathname } from '@/src/router-shims/navigation'
import Footer from './Footer'

export default function ConditionalFooter() {
  const pathname = usePathname()
  if (!pathname) return null

  // admin routes removed — footer shows for all non-preview pages

  if (pathname.startsWith('/preview')) {
    return null
  }

  return <Footer />
}
