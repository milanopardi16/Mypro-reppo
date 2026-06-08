'use client'

import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useNotificationContext } from '../context/NotificationContext'
import { formatRelativeTime } from '../utils/formatRelativeTime'

export default function AdminNotificationsPage() {
  const { notifications, loading, total, limit, load, markRead, markAllRead, unreadCount } = useNotificationContext()
  const [sort, setSort] = useState('desc')
  const [busyId, setBusyId] = useState('')
  const [localPage, setLocalPage] = useState(1)
  const [error, setError] = useState('')

  useEffect(() => {
    load(localPage).catch(() => setError('خطا در دریافت اعلان‌ها.'))
  }, [localPage, load])

  const sorted = useMemo(() => {
    const list = [...notifications]
    list.sort((a, b) => {
      const ta = Date.parse(a.createdAt || '')
      const tb = Date.parse(b.createdAt || '')
      return sort === 'desc' ? tb - ta : ta - tb
    })
    return list
  }, [notifications, sort])

  const totalPages = Math.max(1, Math.ceil(total / limit))

  async function handleMarkRead(id) {
    setBusyId(id)
    try {
      await markRead(id)
    } finally {
      setBusyId('')
    }
  }

  const filterBtn = (active) => ({
    padding: '8px 12px',
    borderRadius: 12,
    border: `1px solid ${active ? 'rgba(209,156,10,0.5)' : 'rgba(255,255,255,0.12)'}`,
    background: active ? 'rgba(209,156,10,0.15)' : 'rgba(255,255,255,0.06)',
    color: active ? '#E5B02A' : '#fff',
    fontFamily: 'BYekan, IranYekan, sans-serif',
    fontWeight: 900,
    cursor: 'pointer',
    fontSize: 13,
  })

  return (
    <AdminLayout title="اعلان‌ها" subtitle="اعلان‌های سیستمی ادمین">
      {error ? (
        <div style={{ marginBottom: 12, padding: '10px 12px', borderRadius: 12, background: 'rgba(239, 68, 68, 0.16)', border: '1px solid rgba(239,68,68,0.35)', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 900 }}>
          {error}
        </div>
      ) : null}

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ color: '#a5b4fc', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 900 }}>
          {loading ? 'در حال بارگذاری...' : `${total} اعلان · ${unreadCount} خوانده‌نشده`}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" style={filterBtn(sort === 'desc')} onClick={() => setSort('desc')}>جدیدترین</button>
          <button type="button" style={filterBtn(sort === 'asc')} onClick={() => setSort('asc')}>قدیمی‌ترین</button>
          {unreadCount > 0 ? (
            <button type="button" style={{ ...filterBtn(false), background: '#16a34a', borderColor: '#16a34a' }} onClick={markAllRead}>
              همه خوانده شد
            </button>
          ) : null}
          <button type="button" style={filterBtn(false)} disabled={loading} onClick={() => load(localPage)}>
            بروزرسانی
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sorted.map((n) => (
          <div
            key={n.id}
            style={{
              padding: 16,
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.10)',
              background: n.isRead ? 'rgba(255,255,255,0.03)' : 'rgba(59,130,246,0.10)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000 }}>
                {n.title || 'اعلان'}
              </div>
              <div style={{ color: '#a5b4fc', fontSize: 12, whiteSpace: 'nowrap' }}>
                {n.createdAt ? formatRelativeTime(n.createdAt) : ''}
              </div>
            </div>
            {n.message ? (
              <div style={{ marginTop: 8, color: '#e0e7ff', whiteSpace: 'pre-wrap', lineHeight: 1.9 }}>
                {n.message}
              </div>
            ) : null}
            <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ color: '#a5b4fc', fontSize: 12 }}>نوع: {n.type || '-'}</div>
              <div style={{ marginRight: 'auto' }} />
              {!n.isRead ? (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  disabled={busyId === n.id}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: '#16a34a',
                    color: '#fff',
                    fontFamily: 'BYekan, IranYekan, sans-serif',
                    fontWeight: 1000,
                    cursor: busyId === n.id ? 'not-allowed' : 'pointer',
                    opacity: busyId === n.id ? 0.7 : 1,
                  }}
                >
                  {busyId === n.id ? '...' : 'خوانده شد'}
                </button>
              ) : (
                <div style={{ color: '#86efac', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000 }}>خوانده‌شده</div>
              )}
            </div>
          </div>
        ))}
        {!loading && sorted.length === 0 ? <div style={{ color: '#a5b4fc' }}>اعلانی وجود ندارد.</div> : null}
      </div>

      {totalPages > 1 ? (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
          <button type="button" style={filterBtn(false)} disabled={localPage <= 1} onClick={() => setLocalPage((p) => Math.max(1, p - 1))}>قبلی</button>
          <span style={{ padding: '8px 12px', color: '#a5b4fc' }}>صفحه {localPage} از {totalPages}</span>
          <button type="button" style={filterBtn(false)} disabled={localPage >= totalPages} onClick={() => setLocalPage((p) => p + 1)}>بعدی</button>
        </div>
      ) : null}
    </AdminLayout>
  )
}
