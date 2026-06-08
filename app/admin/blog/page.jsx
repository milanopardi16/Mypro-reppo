'use client'

import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { adminFetch, adminUpload } from '../../utils/adminAuth'
import MDEditor from '@uiw/react-md-editor'

function TextInput({ label, value, onChange, dir = 'rtl', placeholder = '' }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ color: '#a5b4fc', fontSize: 12, fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000 }}>{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(0,0,0,0.25)', color: '#fff', outline: 'none' }}
      />
    </label>
  )
}

export default function AdminBlogPage() {
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // post object
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)

  const draftsCount = useMemo(() => rows.filter((p) => String(p.status || '').toLowerCase() === 'draft').length, [rows])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await adminFetch('/api/admin/blogs')
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || 'failed')
      setRows(Array.isArray(json.posts) ? json.posts : [])
    } catch {
      setError('خطا در دریافت پست‌های بلاگ.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function savePost(post) {
    setBusy(true)
    setError('')
    try {
      const isNew = !post.id
      const res = isNew
        ? await adminFetch('/api/admin/blogs', { method: 'POST', body: JSON.stringify(post) })
        : await adminFetch(`/api/admin/blogs/${post.id}`, { method: 'PUT', body: JSON.stringify(post) })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || 'failed')
      setEditing(null)
      await load()
    } catch (e) {
      setError(e?.message || 'خطا در ذخیره پست.')
    } finally {
      setBusy(false)
    }
  }

  async function uploadCover(file) {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const res = await adminUpload(file)
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || 'upload_failed')
      setEditing((p) => ({ ...p, coverImage: json.url }))
    } catch (e) {
      setError(e?.message || 'خطا در آپلود فایل.')
    } finally {
      setUploading(false)
    }
  }

  async function deletePost(id) {
    if (!id) return
    if (!confirm('پست حذف شود؟')) return
    setBusy(true)
    try {
      const res = await adminFetch(`/api/admin/blogs/${id}`, { method: 'DELETE' })
      if (!res.ok) return
      await load()
    } finally {
      setBusy(false)
    }
  }

  return (
    <AdminLayout title="بلاگ" subtitle={loading ? 'در حال بارگذاری...' : `${rows.length} پست (پیش‌نویس: ${draftsCount})`}>
      {error ? (
        <div style={{ marginBottom: 12, padding: '10px 12px', borderRadius: 12, background: 'rgba(239, 68, 68, 0.16)', border: '1px solid rgba(239,68,68,0.35)', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 900 }}>
          {error}
        </div>
      ) : null}

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
        <button
          onClick={() => setEditing({ title: '', slug: '', excerpt: '', content: '', status: 'draft', tags: [], category: '' })}
          style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'linear-gradient(135deg, #D19C0A 0%, #E5B02A 100%)', color: '#000', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000, cursor: 'pointer' }}
        >
          پست جدید
        </button>
        <button
          onClick={load}
          disabled={loading || busy}
          style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000, cursor: loading || busy ? 'not-allowed' : 'pointer' }}
        >
          بروزرسانی
        </button>
      </div>

      <div style={{ border: '1px solid rgba(255,255,255,0.10)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
            <thead>
              <tr style={{ textAlign: 'right', background: 'rgba(0,0,0,0.18)' }}>
                {['عنوان', 'اسلاگ', 'وضعیت', 'تاریخ بروزرسانی', 'عملیات'].map((h) => (
                  <th key={h} style={{ padding: 12, borderBottom: '1px solid rgba(255,255,255,0.08)', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000, fontSize: 12, color: '#e0e7ff' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: 12, fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000 }}>{p.title || '-'}</td>
                  <td style={{ padding: 12 }} dir="ltr">{p.slug || '-'}</td>
                  <td style={{ padding: 12 }}>{p.status || '-'}</td>
                  <td style={{ padding: 12, whiteSpace: 'nowrap' }}>{p.updated_at ? new Date(p.updated_at).toLocaleString('fa-IR') : (p.created_at ? new Date(p.created_at).toLocaleString('fa-IR') : '-')}</td>
                  <td style={{ padding: 12, whiteSpace: 'nowrap' }}>
                    <button
                      onClick={() => setEditing(p)}
                      style={{ padding: '6px 10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000, cursor: 'pointer', marginLeft: 8 }}
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={() => deletePost(p.id)}
                      disabled={busy}
                      style={{ padding: '6px 10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: '#dc2626', color: '#fff', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000, cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.7 : 1 }}
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && rows.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: 16, color: '#a5b4fc' }}>موردی یافت نشد.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {editing ? (
        <div style={{ marginTop: 16, padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
            <div style={{ fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000 }}>
              {editing.id ? 'ویرایش پست' : 'پست جدید'}
            </div>
            <button
              onClick={() => setEditing(null)}
              style={{ padding: '8px 10px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000, cursor: 'pointer' }}
            >
              بستن
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <TextInput label="عنوان" value={editing.title || ''} onChange={(v) => setEditing((p) => ({ ...p, title: v }))} />
            <TextInput label="اسلاگ" dir="ltr" value={editing.slug || ''} onChange={(v) => setEditing((p) => ({ ...p, slug: v }))} placeholder="my-post-slug" />
            <TextInput label="دسته‌بندی" value={editing.category || ''} onChange={(v) => setEditing((p) => ({ ...p, category: v }))} />
            <TextInput label="تگ‌ها (با کاما جدا کنید)" dir="ltr" value={(editing.tags || []).join(', ')} onChange={(v) => setEditing((p) => ({ ...p, tags: v.split(',').map((x) => x.trim()).filter(Boolean) }))} placeholder="startup, vc" />
            <TextInput label="وضعیت (draft/published)" dir="ltr" value={editing.status || ''} onChange={(v) => setEditing((p) => ({ ...p, status: v }))} placeholder="draft" />
            <TextInput label="تصویر کاور (URL)" dir="ltr" value={editing.coverImage || ''} onChange={(v) => setEditing((p) => ({ ...p, coverImage: v }))} placeholder="https://..." />
          </div>

          <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center', padding: '8px 10px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', cursor: uploading ? 'not-allowed' : 'pointer' }}>
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(e) => uploadCover(e.target.files?.[0])}
                style={{ display: 'none' }}
              />
              <span style={{ fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000, color: '#fff' }}>
                {uploading ? 'در حال آپلود...' : 'آپلود تصویر کاور'}
              </span>
            </label>
            {editing.coverImage ? (
              <a href={editing.coverImage} target="_blank" rel="noreferrer" style={{ color: '#E5B02A', fontWeight: 1000 }} dir="ltr">
                مشاهده تصویر
              </a>
            ) : null}
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ color: '#a5b4fc', fontSize: 12, fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000, marginBottom: 6 }}>خلاصه</div>
            <textarea
              value={editing.excerpt || ''}
              onChange={(e) => setEditing((p) => ({ ...p, excerpt: e.target.value }))}
              style={{ width: '100%', minHeight: 80, padding: 10, borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(0,0,0,0.25)', color: '#fff', outline: 'none' }}
            />
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ color: '#a5b4fc', fontSize: 12, fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000, marginBottom: 6 }}>متن</div>
            <div data-color-mode="dark" style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)' }}>
              <MDEditor
                value={editing.content || ''}
                onChange={(v) => setEditing((p) => ({ ...p, content: v || '' }))}
                height={320}
                preview="live"
              />
            </div>
          </div>

          <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
            <button
              onClick={() => savePost(editing)}
              disabled={busy}
              style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: busy ? 'rgba(255,255,255,0.12)' : 'linear-gradient(135deg, #D19C0A 0%, #E5B02A 100%)', color: '#000', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000, cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.7 : 1 }}
            >
              {busy ? '...' : 'ذخیره'}
            </button>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  )
}

