'use client'

import PageLayout from './PageLayout'
import { defaultSiteContent } from '../data/siteContent'
import { useSiteContent } from '../hooks/useSiteContent'

export default function LegalContentPage({ pageKey }) {
  const siteContent = useSiteContent()
  const page = siteContent[pageKey] || defaultSiteContent[pageKey] || {}

  return (
    <PageLayout title={page.title} subtitle={page.subtitle} badge={page.badge}>
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '24px' }}>
        <div
          style={{
            background: 'rgba(255,255,255,0.02)',
            padding: '28px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {(page.sections || []).map((section) => (
            <div key={section.id} style={{ marginBottom: '24px' }}>
              <h3 style={{ color: 'rgba(255,255,255,0.95)', marginBottom: '12px' }}>{section.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: '1.8' }}>{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
