'use client'

import Link from '@/src/router-shims/Link'
import { useRouter } from '@/src/router-shims/navigation'
import { logoutAdmin } from '../../utils/adminAuth'
import { disconnectAdminSocket } from '../services/socketService'
import { NotificationProvider } from '../context/NotificationContext'
import NotificationBell from './NotificationBell'

const navItems = [
  { href: '/admin/dashboard', label: 'داشبورد' },
  { href: '/admin/site-content', label: 'محتوای سایت' },
  { href: '/admin/header-nav', label: 'دکمه‌های هدر' },
  { href: '/admin/blog', label: 'بلاگ' },
  { href: '/admin/registrations', label: 'ثبت‌نام‌ها' },
  { href: '/admin/messages', label: 'پیام‌ها' },
  { href: '/admin/chat', label: 'چت پشتیبانی' },
  { href: '/admin/evaluations', label: 'ارزیابی‌ها' },
  { href: '/admin/notifications', label: 'اعلان‌ها' },
]

function AdminLayoutInner({ title, subtitle, children }) {
  const router = useRouter()

  function handleLogout() {
    disconnectAdminSocket()
    logoutAdmin()
    window.location.href = '/admin/dashboard'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A1D3D', color: '#fff' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: '100vh' }}>
        <aside style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', padding: 20 }}>
          <div style={{ padding: '8px 8px 16px', marginBottom: 12 }}>
            <div style={{ fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 900, fontSize: 18 }}>
              پنل ادمین
            </div>
            <div style={{ color: '#a5b4fc', fontSize: 12, marginTop: 6 }}>مدیریت کامل سایت</div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'block',
                  padding: '10px 12px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  color: '#e0e7ff',
                  fontFamily: 'BYekan, IranYekan, sans-serif',
                  fontWeight: 800,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(0,0,0,0.12)',
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => router.push('/')}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#fff',
                  fontFamily: 'BYekan, IranYekan, sans-serif',
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                سایت
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/dashboard')}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#fff',
                  fontFamily: 'BYekan, IranYekan, sans-serif',
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                داشبورد
              </button>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid rgba(239,68,68,0.35)',
                background: 'rgba(220, 38, 38, 0.2)',
                color: '#fecaca',
                fontFamily: 'BYekan, IranYekan, sans-serif',
                fontWeight: 900,
                cursor: 'pointer',
              }}
            >
              خروج
            </button>
          </div>
        </aside>

        <main style={{ padding: 24 }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <header style={{ marginBottom: 18, display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 900, fontSize: 24 }}>
                  {title}
                </div>
                {subtitle ? (
                  <div style={{ marginTop: 6, color: '#a5b4fc', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 800 }}>
                    {subtitle}
                  </div>
                ) : null}
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <NotificationBell />
              </div>
            </header>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout(props) {
  return (
    <NotificationProvider>
      <AdminLayoutInner {...props} />
    </NotificationProvider>
  )
}
