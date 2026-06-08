'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AdminLayout from './components/AdminLayout'
import { fetchDashboardSummary } from './services/dashboardService'
import { getAdminSocket } from './services/socketService'

function StatCard({ title, value, hint }) {
  return (
    <div style={{ padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.04)' }}>
      <div style={{ color: '#a5b4fc', fontSize: 12, fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 900 }}>{title}</div>
      <div style={{ marginTop: 8, fontSize: 26, fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000 }}>{value}</div>
      {hint ? <div style={{ marginTop: 6, color: '#e0e7ff', opacity: 0.9, fontSize: 12 }}>{hint}</div> : null}
    </div>
  )
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')
  const mountedRef = useRef(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchDashboardSummary()
      if (mountedRef.current) setSummary(data)
    } catch (err) {
      if (mountedRef.current) {
        setSummary(null)
        setError(err?.message || 'خطا در بارگذاری داشبورد')
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    load()

    const pollId = window.setInterval(load, 30000)

    const socket = getAdminSocket()
    const refresh = () => load()
    const socketEvents = ['user_registered', 'evaluation_submitted', 'new_chat_message', 'system_notification', 'receive_message']

    if (socket) {
      socketEvents.forEach((event) => socket.on(event, refresh))
    }

    return () => {
      mountedRef.current = false
      window.clearInterval(pollId)
      if (socket) socketEvents.forEach((event) => socket.off(event, refresh))
    }
  }, [load])

  const subtitle = useMemo(() => {
    if (loading) return 'در حال بارگذاری...'
    if (error) return 'خطا در دریافت داده‌ها'
    return 'خلاصه وضعیت سیستم'
  }, [loading, error])
  const totals = summary?.totals || {}
  const latestUsers = Array.isArray(summary?.latestUsers) ? summary.latestUsers : []
  const recentActivities = Array.isArray(summary?.recentActivities) ? summary.recentActivities : []

  return (
    <AdminLayout title="داشبورد ادمین" subtitle={subtitle}>
      {error ? (
        <div style={{ marginBottom: 14, padding: '12px 14px', borderRadius: 12, background: 'rgba(239, 68, 68, 0.16)', border: '1px solid rgba(239,68,68,0.35)', color: '#fecaca', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 900 }}>
          {error}
          <button type="button" onClick={load} style={{ marginRight: 12, marginTop: 8, padding: '6px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
            تلاش مجدد
          </button>
        </div>
      ) : null}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 14 }}>
        <StatCard title="کل کاربران" value={totals.totalUsers ?? 0} />
        <StatCard title="کاربران جدید امروز" value={totals.newUsersToday ?? 0} />
        <StatCard title="کل فرم‌های ارزیابی" value={totals.totalEvaluationForms ?? 0} />
        <StatCard title="چت‌های فعال" value={totals.activeLiveChats ?? totals.totalChatConversations ?? 0} />
        <StatCard title="پیام‌های خوانده‌نشده" value={totals.unreadMessages ?? 0} />
        <StatCard title="اعلان‌های خوانده‌نشده" value={totals.unreadNotifications ?? 0} />
        <StatCard title="ارزیابی‌های در انتظار" value={totals.pendingEvaluations ?? 0} />
        <StatCard title="گفتگوهای چت" value={totals.totalChatConversations ?? 0} />
      </div>

      <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.04)' }}>
          <div style={{ fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000, marginBottom: 10, color: '#e0e7ff' }}>آخرین کاربران ثبت‌نام شده</div>
          {latestUsers.length === 0 ? (
            <div style={{ color: '#a5b4fc' }}>داده‌ای وجود ندارد.</div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {latestUsers.map((u) => (
                <div key={u.id} style={{ padding: 10, borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.12)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                    <div style={{ fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000 }}>{u.fullName || u.name || u.email || 'کاربر'}</div>
                    <div style={{ fontSize: 12, color: '#a5b4fc' }}>{u.created_at ? new Date(u.created_at).toLocaleString('fa-IR') : ''}</div>
                  </div>
                  {u.email ? <div style={{ marginTop: 6, fontSize: 12, color: '#e0e7ff' }} dir="ltr">{u.email}</div> : null}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.04)' }}>
          <div style={{ fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000, marginBottom: 10, color: '#e0e7ff' }}>فعالیت‌های اخیر</div>
          {recentActivities.length === 0 ? (
            <div style={{ color: '#a5b4fc' }}>فعالیتی ثبت نشده است.</div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {recentActivities.map((a) => (
                <div key={a.id} style={{ padding: 10, borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.12)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000 }}>{a.title || 'فعالیت'}</div>
                    <div style={{ fontSize: 12, color: '#a5b4fc', whiteSpace: 'nowrap' }}>{a.createdAt ? new Date(a.createdAt).toLocaleString('fa-IR') : ''}</div>
                  </div>
                  {a.message ? <div style={{ marginTop: 6, color: '#e0e7ff', fontSize: 12, lineHeight: 1.8 }}>{a.message}</div> : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
