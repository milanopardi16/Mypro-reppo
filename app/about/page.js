'use client'

import PageLayout from '../components/PageLayout'
import { useSiteContent } from '../hooks/useSiteContent'

export default function AboutPage() {
  const siteContent = useSiteContent()

  return (
    <PageLayout title={siteContent.aboutPage.title} subtitle={siteContent.aboutPage.subtitle} badge={siteContent.aboutPage.badge}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          padding: '40px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          marginBottom: '32px'
        }}>
          <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', marginBottom: '20px' }}>{siteContent.aboutPage.storyTitle}</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', lineHeight: '2', marginBottom: '16px' }}>
            {siteContent.aboutPage.storyText}
          </p>
        </div>

        <div style={{
          padding: '40px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          marginBottom: '32px'
        }}>
          <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', marginBottom: '20px' }}>{siteContent.aboutPage.missionTitle}</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', lineHeight: '2' }}>
            {siteContent.aboutPage.missionText}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {siteContent.aboutPage.stats.map((stat, index) => (
            <div key={index} style={{
              padding: '24px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              textAlign: 'center'
            }}>
              <div style={{ color: '#D19C0A', fontSize: '36px', fontWeight: '900', marginBottom: '8px' }}>{stat.number}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}