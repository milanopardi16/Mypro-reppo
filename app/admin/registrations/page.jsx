'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { adminFetch } from '../../utils/adminAuth'

export default function AdminRegistrationsPage() {
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await adminFetch('/api/admin/registrations')
        const json = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(json?.error || 'failed')
        const items = Array.isArray(json.registrations) ? json.registrations : []
        if (mounted) setRows(items)
      } catch {
        if (mounted) setError('خطا در دریافت ثبت‌نام‌ها.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <AdminLayout title="ثبت‌نام‌ها" subtitle="اطلاعات ارسال شده از فرم ثبت‌نام">
      {error ? (
        <div style={{ marginBottom: 12, padding: '10px 12px', borderRadius: 12, background: 'rgba(239, 68, 68, 0.16)', border: '1px solid rgba(239,68,68,0.35)', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 900 }}>
          {error}
        </div>
      ) : null}

      <div style={{ border: '1px solid rgba(255,255,255,0.10)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: 12, background: 'rgba(255,255,255,0.04)', color: '#a5b4fc', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 900 }}>
          {loading ? 'در حال بارگذاری...' : `${rows.length} مورد`}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
            <thead>
              <tr style={{ textAlign: 'right', background: 'rgba(0,0,0,0.18)' }}>
                {['نام', 'ایمیل', 'تلفن', 'شرکت', 'سمت', 'حوزه', 'وب‌سایت', 'تاریخ'].map((h) => (
                  <th key={h} style={{ padding: 12, borderBottom: '1px solid rgba(255,255,255,0.08)', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000, fontSize: 12, color: '#e0e7ff' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: 12 }}>{r.fullName || '-'}</td>
                  <td style={{ padding: 12 }} dir="ltr">{r.email || '-'}</td>
                  <td style={{ padding: 12 }} dir="ltr">{r.phone || '-'}</td>
                  <td style={{ padding: 12 }}>{r.companyName || '-'}</td>
                  <td style={{ padding: 12 }}>{r.position || '-'}</td>
                  <td style={{ padding: 12 }}>{r.industry || '-'}</td>
                  <td style={{ padding: 12 }} dir="ltr">{r.website || '-'}</td>
                  <td style={{ padding: 12, whiteSpace: 'nowrap' }}>{r.created_at ? new Date(r.created_at).toLocaleString('fa-IR') : '-'}</td>
                </tr>
              ))}
              {!loading && rows.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: 16, color: '#a5b4fc' }}>موردی یافت نشد.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

