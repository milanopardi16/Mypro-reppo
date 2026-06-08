'use client'

import Link from '@/src/router-shims/Link'
import { useEffect } from 'react'
import Header from './components/Header'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <>
      <Header />
      <main className="cn-page">
        <div className="cn-page-container">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 300px)',
            textAlign: 'center',
            gap: '32px'
          }}>
            <div style={{
              fontSize: '140px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #EF4444, #DC2626)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1
            }}>
              ⚠️
            </div>

            <div>
              <h1 style={{
                color: '#fff',
                fontSize: '48px',
                fontWeight: '900',
                marginBottom: '12px'
              }}>
                خطای سرور
              </h1>
              <p style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '16px',
                maxWidth: '500px',
                margin: '0 auto'
              }}>
                متأسفانه یک خطای غیرمنتظره رخ داده است. 
                لطفاً دوباره تلاش کنید یا به صفحه اصلی برگردید.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => reset()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '14px 32px',
                  background: 'linear-gradient(135deg, #D19C0A, #B8860B)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: 'Beirut, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(209, 156, 10, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                تلاش دوباره
              </button>
              <Link href="/" style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '14px 32px',
                background: 'rgba(0, 178, 169, 0.1)',
                color: '#00B2A9',
                border: '1.5px solid rgba(0, 178, 169, 0.3)',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 178, 169, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 178, 169, 0.1)'
              }}
              >
                صفحه اصلی
              </Link>
            </div>

            <div style={{
              marginTop: '32px',
              padding: '24px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '16px',
              maxWidth: '500px'
            }}>
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '14px',
                margin: 0,
                lineHeight: '1.8'
              }}>
                <strong>ℹ️ اطلاعات:</strong> خطایی در سرور رخ داده است. 
                اگر مشکل ادامه داشت، لطفاً با تیم پشتیبانی تماس بگیرید.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
