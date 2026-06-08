'use client'

import { useState, useEffect } from 'react'
import Link from '@/src/router-shims/Link'
import { useRouter } from '@/src/router-shims/navigation'
import { getCurrentUser, clearCurrentUser } from '../utils/userStore'
import { defaultSiteContent, getStoredSiteContent } from '../data/siteContent'

export default function ProfileButton() {
  const [user, setUser] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loginLabel, setLoginLabel] = useState(defaultSiteContent.header.auth.login)
  const [loginHref, setLoginHref] = useState(defaultSiteContent.header.auth.loginHref)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    const applyHeader = () => {
      const content = getStoredSiteContent()
      setLoginLabel(content.header?.auth?.login || 'ورود')
      setLoginHref(content.header?.auth?.loginHref || '/login')
    }
    applyHeader()

    const handleUserChanged = () => {
      setUser(getCurrentUser())
    }
    const handleContentUpdated = () => applyHeader()

    window.addEventListener('capitalNetworkUserChanged', handleUserChanged)
    window.addEventListener('site-content-updated', handleContentUpdated)
    return () => {
      window.removeEventListener('capitalNetworkUserChanged', handleUserChanged)
      window.removeEventListener('site-content-updated', handleContentUpdated)
    }
  }, [])

  const handleLogout = () => {
    clearCurrentUser()
    setUser(null)
    setIsOpen(false)
    router.push('/')
  }

  if (!user) {
    return (
      <Link href={loginHref} className="cn-header-link" style={{ marginLeft: 'auto' }}>
        {loginLabel}
      </Link>
    )
  }

  const initials = user.fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div style={{ position: 'relative', marginLeft: 'auto' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'linear-gradient(135deg, #D19C0A 0%, #E5B02A 100%)',
          color: '#000',
          border: 'none',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '700',
          fontFamily: 'BYekan, IranYekan, sans-serif',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(209, 156, 10, 0.2)',
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)'
          e.target.style.boxShadow = '0 6px 16px rgba(209, 156, 10, 0.3)'
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)'
          e.target.style.boxShadow = '0 4px 12px rgba(209, 156, 10, 0.2)'
        }}
        aria-label={`منو کاربری ${user.fullName}`}
      >
        {initials}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            background: '#1a3a52',
            border: '1px solid #0f2438',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
            minWidth: '280px',
            overflow: 'hidden',
            fontFamily: 'BYekan, IranYekan, sans-serif',
          }}
        >
          {/* User Info Header */}
          <div style={{ padding: '16px', borderBottom: '1px solid #0f2438', background: '#0f1f2e' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #D19C0A 0%, #E5B02A 100%)',
                  color: '#000',
                  fontWeight: '700',
                  fontSize: '14px',
                }}
              >
                {initials}
              </div>
              <div>
                <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '14px' }}>
                  {user.fullName}
                </div>
                <div style={{ color: '#cbd5e1', fontSize: '12px', marginTop: '2px' }}>
                  @{user.username}
                </div>
              </div>
            </div>
            {user.email && (
              <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px', wordBreak: 'break-all' }}>
                {user.email}
              </div>
            )}
          </div>

          {/* Actions / Divider */}
          {user.database && user.database.actions && user.database.actions.length > 0 && (
            <>
              <div style={{ padding: '12px 16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                  فعالیت‌های اخیر
                </div>
                <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                  {user.database.actions.slice(0, 5).map((action) => (
                    <div
                      key={action.id}
                      style={{
                        fontSize: '13px',
                        color: '#cbd5e1',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        background: '#0f2438',
                        marginBottom: '6px',
                        lineHeight: '1.4',
                      }}
                    >
                      {action.description}
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        {new Date(action.createdAt).toLocaleDateString('fa-IR', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ borderTop: '1px solid #0f2438' }}></div>
            </>
          )}

          {/* Menu Items */}
          <div style={{ padding: '8px 0' }}>
            <Link
              href="/dashboard"
              style={{
                display: 'block',
                padding: '10px 16px',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#0f2438'
                e.currentTarget.style.color = '#D19C0A'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#ffffff'
              }}
              onClick={() => setIsOpen(false)}
            >
              داشبورد
            </Link>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '10px 16px',
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '500',
                textAlign: 'right',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'BYekan, IranYekan, sans-serif',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#ff5252'
                e.target.style.color = '#ffffff'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent'
                e.target.style.color = '#ffffff'
              }}
            >
              خروج
            </button>
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
        />
      )}
    </div>
  )
}
