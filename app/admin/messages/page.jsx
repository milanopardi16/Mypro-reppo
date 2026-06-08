'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { adminFetch } from '../../utils/adminAuth'

export default function AdminMessagesPage() {
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await adminFetch('/api/admin/contact-messages')
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || 'failed')
      setRows(Array.isArray(json.messages) ? json.messages : [])
    } catch {
      setError('خطا در دریافت پیام‌ها.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function markRead(id) {
    setBusyId(id)
    try {
      const res = await adminFetch(`/api/admin/contact-messages/${id}/read`, { method: 'PUT' })
      if (!res.ok) return
      await load()
    } finally {
      setBusyId('')
    }
  }

  return (
    <AdminLayout title="پیام‌ها" subtitle="پیام‌های فرم تماس">
      {error ? (
        <div style={{ marginBottom: 12, padding: '10px 12px', borderRadius: 12, background: 'rgba(239, 68, 68, 0.16)', border: '1px solid rgba(239,68,68,0.35)', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 900 }}>
          {error}
        </div>
      ) : null}

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
        <div style={{ color: '#a5b4fc', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 900 }}>
          {loading ? 'در حال بارگذاری...' : `${rows.length} پیام`}
        </div>
        <button
          onClick={load}
          disabled={loading}
          style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          بروزرسانی
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map((m) => (
          <div key={m.id} style={{ padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.10)', background: m.read ? 'rgba(255,255,255,0.03)' : 'rgba(209,156,10,0.10)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000 }}>
                {m.fullName || 'بدون نام'} {m.subject ? <span style={{ color: '#a5b4fc', fontWeight: 900 }}>— {m.subject}</span> : null}
              </div>
              <div style={{ color: '#a5b4fc', fontSize: 12, whiteSpace: 'nowrap' }}>
                {m.createdAt ? new Date(m.createdAt).toLocaleString('fa-IR') : ''}
              </div>
            </div>
            <div style={{ marginTop: 8, color: '#e0e7ff', whiteSpace: 'pre-wrap', lineHeight: 1.9 }}>
              {m.message}
            </div>
            <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              {m.email ? <div style={{ color: '#a5b4fc' }} dir="ltr">{m.email}</div> : null}
              <div style={{ marginRight: 'auto' }} />
              {!m.read ? (
                <button
                  onClick={() => markRead(m.id)}
                  disabled={busyId === m.id}
                  style={{ padding: '8px 10px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: '#16a34a', color: '#fff', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000, cursor: busyId === m.id ? 'not-allowed' : 'pointer', opacity: busyId === m.id ? 0.7 : 1 }}
                >
                  {busyId === m.id ? '...' : 'علامت‌گذاری به‌عنوان خوانده‌شده'}
                </button>
              ) : (
                <div style={{ color: '#86efac', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000 }}>خوانده‌شده</div>
              )}
            </div>
          </div>
        ))}
        {!loading && rows.length === 0 ? <div style={{ color: '#a5b4fc' }}>پیامی وجود ندارد.</div> : null}
      </div>
    </AdminLayout>
  )
}

