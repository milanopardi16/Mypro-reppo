'use client'

import { useCallback, useEffect, useState } from 'react'
import Header from '../../components/Header'
import Hero from '../../components/Hero'
import TrustSection from '../../components/TrustSection'
import Services from '../../components/Services'
import Process from '../../components/Process'
import CTASection from '../../components/CTASection'
import Testimonials from '../../components/Testimonials'
import Footer from '../../components/Footer'
import { SiteContentProvider } from '../../context/SiteContentProvider'
import { defaultSiteContent, normalizeSiteContent } from '../../data/siteContent'

const SECTION_IDS = {
  header: 'preview-section-header',
  hero: 'preview-section-hero',
  trust: 'preview-section-trust',
  services: 'preview-section-services',
  cta: 'preview-section-cta',
  process: 'preview-section-process',
  testimonials: 'preview-section-testimonials',
  footer: 'preview-section-footer',
}

export default function HomepagePreviewPage() {
  const [content, setContent] = useState(defaultSiteContent)

  const scrollToSection = useCallback((sectionId) => {
    const map = {
      header: SECTION_IDS.header,
      hero: SECTION_IDS.hero,
      trust: SECTION_IDS.trust,
      services: SECTION_IDS.services,
      cta: SECTION_IDS.cta,
      process: SECTION_IDS.process,
      testimonials: SECTION_IDS.testimonials,
      footer: SECTION_IDS.footer,
    }
    const el = document.getElementById(map[sectionId] || sectionId)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  useEffect(() => {
    const handler = (event) => {
      if (event.origin !== window.location.origin) return
      const { type, content: draft, sectionId } = event.data || {}
      if (type === 'homepage-draft-update' && draft) {
        setContent(normalizeSiteContent(draft))
      }
      if (type === 'homepage-scroll-to' && sectionId) {
        scrollToSection(sectionId)
      }
    }

    window.addEventListener('message', handler)
    window.parent.postMessage({ type: 'homepage-preview-ready' }, window.location.origin)

    return () => window.removeEventListener('message', handler)
  }, [scrollToSection])

  return (
    <SiteContentProvider content={content} previewMode>
      <main>
        <div id={SECTION_IDS.header}>
          <Header />
        </div>
        <div id={SECTION_IDS.hero}>
          <Hero />
        </div>
        <div id={SECTION_IDS.trust}>
          <TrustSection />
        </div>
        <div id={SECTION_IDS.services}>
          <Services />
        </div>
        <div id={SECTION_IDS.cta}>
          <CTASection />
        </div>
        <div id={SECTION_IDS.process}>
          <Process />
        </div>
        <div id={SECTION_IDS.testimonials}>
          <Testimonials />
        </div>
        <div id={SECTION_IDS.footer}>
          <Footer />
        </div>
      </main>
    </SiteContentProvider>
  )
}
