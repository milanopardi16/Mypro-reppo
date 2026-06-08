'use client'

import PageLayout from '../components/PageLayout'
import { useSiteContent } from '../hooks/useSiteContent'

export default function ProcessPage() {
  const siteContent = useSiteContent()

  const steps = siteContent.processSteps || []

  return (
    <PageLayout title={siteContent.processPage.title} subtitle={siteContent.processPage.subtitle} badge={siteContent.processPage.badge}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {steps.map((step, index) => (
          <div key={index} style={{
            display: 'flex',
            gap: '24px',
            padding: '32px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'rgba(209,156,10,0.1)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: '900',
              color: '#D19C0A',
              flexShrink: 0
            }}>
              {step.number}
            </div>
            <div>
              <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>{step.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: '1.8' }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  )
}