'use client'

import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { adminFetch } from '../../utils/adminAuth'

function RowBox({ children }) {
  return (
    <div style={{ padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.03)', fontFamily: 'BYekan, IranYekan, sans-serif' }}>
      {children}
    </div>
  )
}

function InfoBadge({ label, value, tone = 'default' }) {
  const tones = {
    default: { bg: 'rgba(99,102,241,0.10)', border: 'rgba(99,102,241,0.35)', color: '#c7d2fe' },
    success: { bg: 'rgba(34,197,94,0.14)', border: 'rgba(34,197,94,0.35)', color: '#bbf7d0' },
    warning: { bg: 'rgba(245,158,11,0.14)', border: 'rgba(245,158,11,0.35)', color: '#fde68a' },
  }
  const style = tones[tone] || tones.default
  return (
    <div style={{ padding: '8px 10px', borderRadius: 12, background: style.bg, border: `1px solid ${style.border}`, minWidth: 120 }}>
      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>{label}</div>
      <div style={{ fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 900, color: style.color }}>{value}</div>
    </div>
  )
}

function DetailLine({ label, value, dir = 'rtl' }) {
  if (!value) return null
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 10, alignItems: 'start' }}>
      <div style={{ color: '#a5b4fc', fontSize: 12, fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 900 }}>{label}</div>
      <div dir={dir} style={{ color: '#e5e7eb', fontSize: 13, wordBreak: 'break-word' }}>{value}</div>
    </div>
  )
}

function EvaluationCard({ ev, notesDraft, setNotesDraft, busyId, saveAdminEval, compact = false, selected, onToggleSelect, onDownloadSingle }) {
  const confirmAccuracyText =
    ev.confirm_accuracy === true ? 'بله' : ev.confirm_accuracy === false ? 'خیر' : '-'

  return (
    <div key={ev.id} style={{ padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: ev.reviewed ? 'rgba(0,0,0,0.18)' : 'rgba(209,156,10,0.10)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000 }}>
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleSelect?.(ev.id)}
            style={{ width: 16, height: 16, cursor: 'pointer' }}
          />
          <span>{ev.full_name || ev.fullName || '-'}</span>
        </div>
        <div style={{ color: ev.reviewed ? '#86efac' : '#a5b4fc', fontSize: 12, whiteSpace: 'nowrap', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000 }}>
          {ev.reviewed ? 'بررسی شده' : ev.created_at ? new Date(ev.created_at).toLocaleString('fa-IR') : ''}
        </div>
      </div>
      <div style={{ marginTop: 8, display: 'grid', gap: 6 }}>
        <DetailLine label="شناسه پرونده" value={ev.id || '-'} dir="ltr" />
        <DetailLine label="تاریخ ثبت" value={ev.created_at ? new Date(ev.created_at).toLocaleString('fa-IR') : '-'} />
        <DetailLine label="آخرین بروزرسانی" value={ev.updated_at ? new Date(ev.updated_at).toLocaleString('fa-IR') : '-'} />
        <DetailLine label="نوع پروفایل" value={ev.profile_type || '-'} />
        <DetailLine label="نام کامل" value={ev.full_name || ev.fullName || '-'} />
        <DetailLine label="نام کسب‌وکار" value={ev.company_name || ev.org_name || '-'} />
        <DetailLine label="نام صندوق/سازمان" value={ev.org_name || '-'} />
        <DetailLine label="ایمیل" value={ev.email || '-'} dir="ltr" />
        <DetailLine label="تلفن / واتس‌اپ" value={ev.phone || '-'} dir="ltr" />
        <DetailLine label="لینکدین / وب‌سایت" value={ev.linkedin || '-'} dir="ltr" />
        <DetailLine label="حوزه فعالیت" value={ev.sector || '-'} />
        <DetailLine label="مرحله فعلی" value={ev.stage || '-'} />
        <DetailLine label="سرمایه مورد نیاز" value={ev.capital_required || '-'} />
        <DetailLine label="Ticket Size" value={ev.ticket_size || '-'} />
        <DetailLine label="Stage مورد علاقه" value={ev.stage_pref || '-'} />
        <DetailLine label="جغرافیای هدف" value={ev.geo_pref || '-'} />
        <DetailLine label="سطح اطمینان ارائه‌دهنده" value={ev.confidence || '-'} />
        <DetailLine label="تایید صحت اطلاعات" value={confirmAccuracyText} />
        <DetailLine label="خلاصه معرفی" value={ev.one_liner || '-'} />
        <DetailLine label="آخرین یادداشت" value={ev.notes || '-'} />
      </div>
      {ev.deck_file ? (
        <div style={{ marginTop: 8, color: '#e0e7ff' }} dir="ltr">
          فایل: <a href={`/uploads/${ev.deck_file}`} target="_blank" rel="noreferrer" style={{ color: '#E5B02A', fontWeight: 900 }}>{ev.deck_file}</a>
        </div>
      ) : null}
      {ev.message ? (
        <div style={{ marginTop: 8 }}>
          <div style={{ color: '#a5b4fc', fontSize: 12, marginBottom: 4 }}>توضیحات تکمیلی متقاضی</div>
          <div style={{ whiteSpace: 'pre-wrap' }}>{ev.message}</div>
        </div>
      ) : null}

      {!compact ? (
        <>
          <div style={{ marginTop: 10 }}>
            <div style={{ color: '#a5b4fc', fontSize: 12, marginBottom: 6 }}>یادداشت کارشناسی ادمین</div>
            <textarea
              value={notesDraft[ev.id] ?? ''}
              onChange={(e) => setNotesDraft((p) => ({ ...p, [ev.id]: e.target.value }))}
              placeholder="نتیجه بررسی، ریسک‌ها، نکات قوت، پیشنهاد مرحله بعد و تصمیم نهایی را ثبت کنید."
              style={{
                width: '100%',
                minHeight: 86,
                padding: 10,
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(0,0,0,0.25)',
                color: '#e5e7eb',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => saveAdminEval(ev.id, { notes: notesDraft[ev.id] ?? '' })}
              disabled={busyId === ev.id}
              style={{ padding: '8px 10px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000, cursor: busyId === ev.id ? 'not-allowed' : 'pointer', opacity: busyId === ev.id ? 0.7 : 1 }}
            >
              ذخیره یادداشت کارشناسی
            </button>
            <button
              onClick={() => saveAdminEval(ev.id, { reviewed: true, notes: notesDraft[ev.id] ?? '' })}
              disabled={busyId === ev.id || ev.reviewed}
              style={{ padding: '8px 10px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: '#16a34a', color: '#fff', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000, cursor: busyId === ev.id || ev.reviewed ? 'not-allowed' : 'pointer', opacity: busyId === ev.id || ev.reviewed ? 0.7 : 1 }}
            >
              ثبت به‌عنوان بررسی‌شده
            </button>
            <button
              onClick={() => onDownloadSingle?.(ev.id)}
              disabled={busyId === ev.id}
              style={{ padding: '8px 10px', borderRadius: 12, border: '1px solid rgba(37,99,235,0.5)', background: 'rgba(37,99,235,0.2)', color: '#dbeafe', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000, cursor: busyId === ev.id ? 'not-allowed' : 'pointer', opacity: busyId === ev.id ? 0.7 : 1 }}
            >
              دانلود اکسل تکی
            </button>
          </div>
        </>
      ) : (
        <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => onDownloadSingle?.(ev.id)}
            disabled={busyId === ev.id}
            style={{ padding: '8px 10px', borderRadius: 12, border: '1px solid rgba(37,99,235,0.5)', background: 'rgba(37,99,235,0.2)', color: '#dbeafe', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000, cursor: busyId === ev.id ? 'not-allowed' : 'pointer', opacity: busyId === ev.id ? 0.7 : 1 }}
          >
            دانلود اکسل تکی
          </button>
        </div>
      )}
    </div>
  )
}

export default function AdminEvaluationsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [adminRows, setAdminRows] = useState([])
  const [busyId, setBusyId] = useState('')
  const [exporting, setExporting] = useState(false)
  const [bulkBusy, setBulkBusy] = useState(false)
  const [notesDraft, setNotesDraft] = useState({})
  const [selectedIds, setSelectedIds] = useState([])

  const pendingRows = useMemo(() => adminRows.filter((r) => !r.reviewed), [adminRows])
  const reviewedRows = useMemo(() => adminRows.filter((r) => !!r.reviewed), [adminRows])
  const pendingCount = pendingRows.length
  const reviewedCount = reviewedRows.length
  const withDeckCount = useMemo(() => adminRows.filter((r) => !!r.deck_file).length, [adminRows])
  const allPendingSelected = pendingRows.length > 0 && pendingRows.every((row) => selectedIds.includes(row.id))

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await adminFetch('/api/admin/admin-evaluations')
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body?.error || 'failed')
      const items = Array.isArray(body.evaluations) ? body.evaluations : []
      setAdminRows(items)
      setNotesDraft(Object.fromEntries(items.map((x) => [x.id, x.notes || ''])))
      setSelectedIds([])
    } catch {
      setError('خطا در دریافت ارزیابی‌ها.')
    } finally {
      setLoading(false)
    }
  }

  function toggleSelect(id) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function toggleSelectAllPending() {
    if (allPendingSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pendingRows.some((row) => row.id === id)))
      return
    }
    setSelectedIds((prev) => Array.from(new Set([...prev, ...pendingRows.map((row) => row.id)])))
  }

  async function bulkMarkReviewed() {
    if (selectedIds.length === 0) return
    setBulkBusy(true)
    try {
      const res = await adminFetch('/api/admin/admin-evaluations/bulk-update', {
        method: 'PUT',
        body: JSON.stringify({ ids: selectedIds, reviewed: true }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) return
      const items = Array.isArray(body.evaluations) ? body.evaluations : []
      setAdminRows(items)
      setNotesDraft(Object.fromEntries(items.map((x) => [x.id, x.notes || ''])))
      setSelectedIds([])
    } finally {
      setBulkBusy(false)
    }
  }

  async function bulkMarkPending() {
    if (selectedIds.length === 0) return
    setBulkBusy(true)
    try {
      const res = await adminFetch('/api/admin/admin-evaluations/bulk-update', {
        method: 'PUT',
        body: JSON.stringify({ ids: selectedIds, reviewed: false }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) return
      const items = Array.isArray(body.evaluations) ? body.evaluations : []
      setAdminRows(items)
      setNotesDraft(Object.fromEntries(items.map((x) => [x.id, x.notes || ''])))
      setSelectedIds([])
    } finally {
      setBulkBusy(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function saveAdminEval(id, patch) {
    setBusyId(id)
    setError('')
    setNotice('')
    try {
      const res = await adminFetch(`/api/admin/admin-evaluations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(patch),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(body?.error || 'ذخیره تغییرات انجام نشد. لطفا دوباره تلاش کنید.')
        return
      }
      if (body?.evaluation?.id) {
        const updated = body.evaluation
        setAdminRows((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
        setNotesDraft((prev) => ({ ...prev, [updated.id]: updated.notes || '' }))
        setNotice(patch.reviewed ? 'وضعیت پرونده با موفقیت به بررسی‌شده تغییر کرد.' : 'یادداشت کارشناسی با موفقیت ذخیره شد.')
      }
    } catch {
      setError('ارتباط با سرور برقرار نشد. لطفا دوباره تلاش کنید.')
    } finally {
      setBusyId('')
    }
  }

  async function exportAllAsExcel() {
    setExporting(true)
    setError('')
    try {
      const res = await adminFetch('/api/admin/admin-evaluations/export-excel')
      if (!res.ok) throw new Error('failed')
      const blob = await res.blob()
      const objectUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = `admin-evaluations-${new Date().toISOString().slice(0, 10)}.xlsx`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(objectUrl)
    } catch {
      setError('دانلود فایل اکسل انجام نشد. لطفا دوباره تلاش کنید.')
    } finally {
      setExporting(false)
    }
  }

  async function exportSelectedAsExcel() {
    if (selectedIds.length === 0) return
    setExporting(true)
    setError('')
    try {
      const query = encodeURIComponent(selectedIds.join(','))
      const res = await adminFetch(`/api/admin/admin-evaluations/export-excel?ids=${query}`)
      if (!res.ok) throw new Error('failed')
      const blob = await res.blob()
      const objectUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = `selected-evaluations-${selectedIds.length}-${new Date().toISOString().slice(0, 10)}.xlsx`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(objectUrl)
    } catch {
      setError('دانلود فایل اکسل انتخابی انجام نشد. لطفا دوباره تلاش کنید.')
    } finally {
      setExporting(false)
    }
  }

  async function exportSingleAsExcel(id) {
    if (!id) return
    setExporting(true)
    setError('')
    setNotice('')
    try {
      const res = await adminFetch(`/api/admin/admin-evaluations/export-excel?ids=${encodeURIComponent(id)}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || 'failed')
      }
      const blob = await res.blob()
      if (!blob || blob.size === 0) {
        throw new Error('empty-file')
      }
      const objectUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = `evaluation-${id}.xlsx`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(objectUrl)
      setNotice('دانلود فایل اکسل تکی با موفقیت شروع شد.')
    } catch {
      setError('دانلود فایل تکی انجام نشد. لطفا دوباره تلاش کنید.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <AdminLayout
      title="ارزیابی‌ها"
      subtitle={loading ? 'در حال بارگذاری اطلاعات ارزیابی‌ها...' : `کل ارزیابی‌های ادمین: ${adminRows.length} | در انتظار بررسی: ${pendingCount} | بررسی‌شده: ${reviewedCount}`}
    >
      {error ? (
        <div style={{ marginBottom: 12, padding: '10px 12px', borderRadius: 12, background: 'rgba(239, 68, 68, 0.16)', border: '1px solid rgba(239,68,68,0.35)', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 900 }}>
          {error}
        </div>
      ) : null}
      {notice ? (
        <div style={{ marginBottom: 12, padding: '10px 12px', borderRadius: 12, background: 'rgba(34, 197, 94, 0.16)', border: '1px solid rgba(34,197,94,0.35)', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 900, color: '#dcfce7' }}>
          {notice}
        </div>
      ) : null}

      <RowBox>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
          <div>
            <div style={{ color: '#e0e7ff', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000, fontSize: 18 }}>
              مرکز مدیریت ارزیابی‌ها
            </div>
            <div style={{ marginTop: 6, color: '#a5b4fc', fontSize: 13, maxWidth: 920, lineHeight: 1.9 }}>
              در این صفحه پرونده‌ها به صورت حرفه‌ای و تفکیک‌شده نمایش داده می‌شوند تا تصمیم‌گیری، پیگیری و گزارش‌گیری برای تیم ادمین کاملا شفاف و دقیق باشد.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <InfoBadge label="کل پرونده‌ها" value={String(adminRows.length)} />
            <InfoBadge label="پرونده دارای فایل" value={String(withDeckCount)} />
            <InfoBadge label="نیازمند بررسی" value={String(pendingCount)} tone={pendingCount > 0 ? 'warning' : 'success'} />
            <InfoBadge label="تکمیل بررسی" value={String(reviewedCount)} tone="success" />
          </div>
        </div>
      </RowBox>

      <div style={{ marginTop: 14 }}>
        <RowBox>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
            <div style={{ color: '#a5b4fc', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000 }}>
              پرونده‌های قابل مدیریت ادمین (`admin-evaluations.json`)
            </div>
            <button
              onClick={exportAllAsExcel}
              disabled={exporting || adminRows.length === 0}
              style={{
                padding: '8px 12px',
                borderRadius: 12,
                border: '1px solid rgba(37,99,235,0.55)',
                background: 'rgba(37,99,235,0.26)',
                color: '#dbeafe',
                fontFamily: 'BYekan, IranYekan, sans-serif',
                fontWeight: 1000,
                cursor: exporting || adminRows.length === 0 ? 'not-allowed' : 'pointer',
                opacity: exporting || adminRows.length === 0 ? 0.7 : 1,
              }}
            >
              {exporting ? 'در حال آماده‌سازی فایل اکسل...' : 'اکسل (دانلود همه ارزیابی‌ها)'}
            </button>
          </div>
          <div style={{ color: '#e0e7ff', fontSize: 12, marginBottom: 10, lineHeight: 1.8 }}>
            پرونده‌ها در دو بخش «در انتظار بررسی» و «بررسی‌شده‌ها» نمایش داده می‌شوند. پس از کلیک روی دکمه ثبت، پرونده بلافاصله به بخش بررسی‌شده‌ها منتقل می‌شود.
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <button
              onClick={toggleSelectAllPending}
              disabled={pendingRows.length === 0 || bulkBusy}
              style={{ padding: '8px 10px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000, cursor: pendingRows.length === 0 || bulkBusy ? 'not-allowed' : 'pointer', opacity: pendingRows.length === 0 || bulkBusy ? 0.7 : 1 }}
            >
              {allPendingSelected ? 'لغو انتخاب همه پرونده‌های در انتظار' : 'انتخاب همه پرونده‌های در انتظار'}
            </button>
            <button
              onClick={bulkMarkReviewed}
              disabled={selectedIds.length === 0 || bulkBusy}
              style={{ padding: '8px 10px', borderRadius: 12, border: '1px solid rgba(34,197,94,0.55)', background: 'rgba(34,197,94,0.22)', color: '#dcfce7', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000, cursor: selectedIds.length === 0 || bulkBusy ? 'not-allowed' : 'pointer', opacity: selectedIds.length === 0 || bulkBusy ? 0.7 : 1 }}
            >
              {bulkBusy ? 'در حال ثبت دسته‌جمعی...' : `ثبت بررسی‌شده برای موارد انتخابی (${selectedIds.length})`}
            </button>
            <button
              onClick={bulkMarkPending}
              disabled={selectedIds.length === 0 || bulkBusy}
              style={{ padding: '8px 10px', borderRadius: 12, border: '1px solid rgba(245,158,11,0.55)', background: 'rgba(245,158,11,0.22)', color: '#fef3c7', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000, cursor: selectedIds.length === 0 || bulkBusy ? 'not-allowed' : 'pointer', opacity: selectedIds.length === 0 || bulkBusy ? 0.7 : 1 }}
            >
              {bulkBusy ? 'در حال بروزرسانی...' : `برگشت به در انتظار بررسی (${selectedIds.length})`}
            </button>
            <button
              onClick={exportSelectedAsExcel}
              disabled={selectedIds.length === 0 || exporting}
              style={{ padding: '8px 10px', borderRadius: 12, border: '1px solid rgba(37,99,235,0.5)', background: 'rgba(37,99,235,0.2)', color: '#dbeafe', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000, cursor: selectedIds.length === 0 || exporting ? 'not-allowed' : 'pointer', opacity: selectedIds.length === 0 || exporting ? 0.7 : 1 }}
            >
              {exporting ? 'در حال آماده‌سازی...' : `دانلود اکسل انتخابی (${selectedIds.length})`}
            </button>
          </div>

          <div style={{ marginBottom: 10, padding: 10, borderRadius: 10, border: '1px dashed rgba(245,158,11,0.45)', background: 'rgba(245,158,11,0.08)' }}>
            <div style={{ fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000, color: '#fcd34d', marginBottom: 6 }}>در انتظار بررسی ({pendingRows.length})</div>
          </div>
          <div style={{ maxHeight: 420, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
            {pendingRows.map((ev) => (
              <EvaluationCard key={ev.id} ev={ev} notesDraft={notesDraft} setNotesDraft={setNotesDraft} busyId={busyId} saveAdminEval={saveAdminEval} selected={selectedIds.includes(ev.id)} onToggleSelect={toggleSelect} onDownloadSingle={exportSingleAsExcel} />
            ))}
            {!loading && pendingRows.length === 0 ? <div style={{ color: '#a5b4fc' }}>پرونده‌ای در انتظار بررسی نیست.</div> : null}
          </div>

          <div style={{ marginBottom: 10, padding: 10, borderRadius: 10, border: '1px dashed rgba(34,197,94,0.45)', background: 'rgba(34,197,94,0.08)' }}>
            <div style={{ fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000, color: '#86efac', marginBottom: 6 }}>بررسی‌شده‌ها ({reviewedRows.length})</div>
          </div>
          <div style={{ maxHeight: 420, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {reviewedRows.map((ev) => (
              <EvaluationCard key={ev.id} ev={ev} notesDraft={notesDraft} setNotesDraft={setNotesDraft} busyId={busyId} saveAdminEval={saveAdminEval} selected={selectedIds.includes(ev.id)} onToggleSelect={toggleSelect} onDownloadSingle={exportSingleAsExcel} />
            ))}
            {!loading && reviewedRows.length === 0 ? <div style={{ color: '#a5b4fc' }}>هنوز پرونده بررسی‌شده‌ای ثبت نشده است.</div> : null}
          </div>
        </RowBox>
      </div>
    </AdminLayout>
  )
}

