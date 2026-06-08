'use client'

import { useState, useEffect } from 'react'
import Link from '@/src/router-shims/Link'
import { useRouter } from '@/src/router-shims/navigation'
import PageLayout from '../components/PageLayout'
import { getCurrentUser, clearCurrentUser, getActionLabel } from '../utils/userStore'

function EvalField({ label, value }) {
  if (!value && value !== 0) return null
  return (
    <div style={{ fontSize: '13px', color: '#e0e7ff', lineHeight: 1.8 }}>
      <strong>{label}:</strong> {String(value)}
    </div>
  )
}

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [evaluations, setEvaluations] = useState([])
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push('/login')
      return
    }
    setUser(currentUser)
    setIsLoading(false)
  }, [router])

  useEffect(() => {
    if (!user) return
    const fetchEvals = async () => {
      try {
        const params = new URLSearchParams()
        if (user.email) params.set('email', user.email)
        if (user.phone) params.set('phone', user.phone)
        if (user.fullName) params.set('fullName', user.fullName)
        if ([...params.keys()].length === 0) return

        const res = await fetch(`/api/evaluations?${params.toString()}&t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
        })
        if (!res.ok) return
        const data = await res.json()
        const matched = Array.isArray(data.evaluations) ? data.evaluations : []
        matched.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        setEvaluations(matched)
      } catch (err) {
        console.warn('Failed to load evaluations for user', err)
      }
    }
    fetchEvals()
  }, [user])

  const handleLogout = () => {
    clearCurrentUser()
    router.push('/')
  }

  if (isLoading) {
    return (
      <PageLayout title="داشبورد کاربری" subtitle="بارگذاری...">
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ display: 'inline-block' }}>لطفا منتظر بمانید...</div>
        </div>
      </PageLayout>
    )
  }

  if (!user) {
    return (
      <PageLayout title="داشبورد کاربری" subtitle="خطا">
        <div className="cn-auth-card" style={{ textAlign: 'center' }}>
          <p>لطفاً ابتدا وارد شوید</p>
          <Link href="/login" className="cn-submit-btn" style={{ marginTop: 16 }}>
            ورود
          </Link>
        </div>
      </PageLayout>
    )
  }

  const initials = user.fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <PageLayout title="داشبورد کاربری" subtitle={`خوش‌آمدید، ${user.fullName}`}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {/* Profile Card */}
        <div style={{ background: '#1E3A8A', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', border: '1px solid #1e40af' }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #D19C0A 0%, #E5B02A 100%)',
                color: '#000',
                fontWeight: '700',
                fontSize: '32px',
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#fff', fontFamily: 'BYekan, IranYekan, sans-serif' }}>
                {user.fullName}
              </h2>
              <p style={{ margin: '0 0 12px 0', color: '#a5b4fc', fontSize: '14px', fontFamily: 'BYekan, IranYekan, sans-serif' }}>
                @{user.username}
              </p>
              
              <div style={{ display: 'flex', gap: '24px', marginTop: '16px', flexWrap: 'wrap' }}>
                {user.email && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#a5b4fc', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase', fontFamily: 'BYekan, IranYekan, sans-serif' }}>
                      ایمیل
                    </div>
                    <div style={{ fontSize: '14px', color: '#e0e7ff', fontWeight: '500', fontFamily: 'BYekan, IranYekan, sans-serif', wordBreak: 'break-all' }}>
                      {user.email}
                    </div>
                  </div>
                )}
                {user.phone && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#a5b4fc', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase', fontFamily: 'BYekan, IranYekan, sans-serif' }}>
                      شماره تلفن
                    </div>
                    <div style={{ fontSize: '14px', color: '#e0e7ff', fontWeight: '500', fontFamily: 'BYekan, IranYekan, sans-serif' }}>
                      {user.phone}
                    </div>
                  </div>
                )}
                <div>
                  <div style={{ fontSize: '12px', color: '#a5b4fc', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase', fontFamily: 'BYekan, IranYekan, sans-serif' }}>
                    تاریخ ثبت‌نام
                  </div>
                  <div style={{ fontSize: '14px', color: '#e0e7ff', fontWeight: '500', fontFamily: 'BYekan, IranYekan, sans-serif' }}>
                    {new Date(user.createdAt).toLocaleDateString('fa-IR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  marginTop: '16px',
                  padding: '8px 16px',
                  background: '#dc2626',
                  color: '#fff',
                  border: '1px solid #b91c1c',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'BYekan, IranYekan, sans-serif',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#ef4444'
                  e.target.style.color = 'white'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#dc2626'
                  e.target.style.color = '#fff'
                }}
              >
                خروج از حساب
              </button>
            </div>
          </div>
        </div>

        {/* Evaluation Submissions (user-specific) */}
        {evaluations && evaluations.length > 0 && (
          <div style={{ background: '#1E3A8A', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', border: '1px solid #1e40af' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#e0e7ff', fontFamily: 'BYekan, IranYekan, sans-serif' }}>
              درخواست‌های ارزیابی ارسال‌شده
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {evaluations.map((ev) => (
                <div key={ev.id} style={{ padding: '16px', background: '#2E5090', borderRadius: '8px', border: '1px solid #3b5998', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '14px', color: '#e0e7ff', fontWeight: '700', fontFamily: 'BYekan, IranYekan, sans-serif' }}>{ev.profile_type === 'entrepreneur' ? 'استارت‌آپی' : ev.profile_type === 'investor' ? 'سرمایه‌گذار' : ev.profile_type}</div>
                    <div style={{ fontSize: '12px', color: ev.reviewed ? '#86efac' : '#fcd34d', fontWeight: '700' }}>
                      {ev.reviewed ? 'وضعیت: بررسی‌شده' : 'وضعیت: در انتظار بررسی'}
                    </div>
                  </div>
                  <EvalField label="تاریخ ثبت" value={new Date(ev.created_at || ev.createdAt || Date.now()).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} />
                  <EvalField label="نام کامل" value={ev.full_name || ev.fullName} />
                  <EvalField label="ایمیل" value={ev.email} />
                  <EvalField label="تلفن" value={ev.phone} />
                  <EvalField label="نام کسب‌وکار" value={ev.company_name || ev.org_name} />
                  <EvalField label="حوزه فعالیت" value={ev.sector} />
                  <EvalField label="مرحله فعلی" value={ev.stage} />
                  <EvalField label="سرمایه مورد نیاز" value={ev.capital_required} />
                  <EvalField label="سطح اطمینان" value={ev.confidence} />
                  <EvalField label="خلاصه معرفی" value={ev.one_liner} />
                  <EvalField label="توضیحات" value={ev.message} />
                  <EvalField label="یادداشت ادمین" value={ev.notes} />
                  {ev.deck_file ? (
                    <a href={`/uploads/${ev.deck_file}`} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#D19C0A', fontWeight: '700' }}>دانلود فایل ضمیمه</a>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Database Info */}
        {user.database && (
          <div style={{ background: '#1E3A8A', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', border: '1px solid #1e40af' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#e0e7ff', fontFamily: 'BYekan, IranYekan, sans-serif' }}>
              دیتابیس اختصاصی
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '16px', background: '#2E5090', borderRadius: '8px', border: '1px solid #3b5998' }}>
                <div style={{ fontSize: '12px', color: '#a5b4fc', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase', fontFamily: 'BYekan, IranYekan, sans-serif' }}>
                  شناسه دیتابیس
                </div>
                <div style={{ fontSize: '14px', color: '#e0e7ff', fontWeight: '500', fontFamily: 'BYekan, IranYekan, sans-serif', wordBreak: 'break-all' }}>
                  {user.database.id}
                </div>
              </div>
              <div style={{ padding: '16px', background: '#2E5090', borderRadius: '8px', border: '1px solid #3b5998' }}>
                <div style={{ fontSize: '12px', color: '#a5b4fc', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase', fontFamily: 'BYekan, IranYekan, sans-serif' }}>
                  تاریخ ایجاد
                </div>
                <div style={{ fontSize: '14px', color: '#e0e7ff', fontWeight: '500', fontFamily: 'BYekan, IranYekan, sans-serif' }}>
                  {new Date(user.database.createdAt).toLocaleDateString('fa-IR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions History */}
        {user.database && user.database.actions && user.database.actions.length > 0 && (
          <div style={{ background: '#1E3A8A', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', border: '1px solid #1e40af' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#e0e7ff', fontFamily: 'BYekan, IranYekan, sans-serif' }}>
              فعالیت‌های اخیر
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {user.database.actions.map((action) => (
                <div
                  key={action.id}
                  style={{
                    padding: '16px',
                    background: '#2E5090',
                    borderRadius: '8px',
                    border: '1px solid #3b5998',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', color: '#e0e7ff', fontWeight: '500', fontFamily: 'BYekan, IranYekan, sans-serif' }}>
                      {action.description}
                    </div>
                    <div style={{ fontSize: '12px', color: '#a5b4fc', marginTop: '4px', fontFamily: 'BYekan, IranYekan, sans-serif' }}>
                      {new Date(action.createdAt).toLocaleDateString('fa-IR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', background: '#D19C0A', color: '#000', padding: '4px 8px', borderRadius: '4px', fontWeight: '700', fontFamily: 'BYekan, IranYekan, sans-serif' }}>
                    {getActionLabel(action.type)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
          <Link href="/" className="cn-submit-btn" style={{ justifyContent: 'center', flex: 1, minWidth: '150px' }}>
            بازگشت به سایت
          </Link>
        </div>
      </div>
    </PageLayout>
  )
}

