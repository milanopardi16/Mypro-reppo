'use client'

import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { adminFetch } from '../../utils/adminAuth'
import { normalizeSiteContent } from '../../data/siteContent'
import { SITE_CONTENT_SECTION_ORDER, createSetField, renderSectionEditor, Section } from '../components/SiteContentSectionEditors'

export default function AdminSiteContentPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [content, setContent] = useState({})
  const [savingSection, setSavingSection] = useState('')
  const [sectionStatus, setSectionStatus] = useState({})

  const setField = useMemo(() => createSetField(setContent), [])

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await adminFetch('/api/admin/site-content')
        const json = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(json?.error || 'failed')
        if (mounted) setContent(normalizeSiteContent(json?.content || {}))
      } catch {
        if (mounted) setError('خطا در دریافت محتوای سایت.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  async function saveSection(sectionKey) {
    setSavingSection(sectionKey)
    setSectionStatus((prev) => ({ ...prev, [sectionKey]: null }))
    try {
      const res = await adminFetch('/api/admin/site-content/section', {
        method: 'POST',
        body: JSON.stringify({
          section: sectionKey,
          data: content?.[sectionKey] ?? {},
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || 'failed')
      if (json?.content) setContent(normalizeSiteContent(json.content))
      setSectionStatus((prev) => ({
        ...prev,
        [sectionKey]: { type: 'success', message: 'بخش با موفقیت ذخیره شد.' },
      }))
    } catch (e) {
      setSectionStatus((prev) => ({
        ...prev,
        [sectionKey]: { type: 'error', message: e?.message || 'خطا در ذخیره این بخش.' },
      }))
    } finally {
      setSavingSection('')
    }
  }

  return (
    <AdminLayout title="محتوای سایت" subtitle="مدیریت تفکیک‌شده هر بخش (بدون JSON)">
      {error ? (
        <div style={{ marginBottom: 12, padding: '10px 12px', borderRadius: 12, background: 'rgba(239, 68, 68, 0.16)', border: '1px solid rgba(239,68,68,0.35)', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 900 }}>
          {error}
        </div>
      ) : null}

      {loading ? (
        <div style={{ color: '#a5b4fc', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 900 }}>در حال بارگذاری محتوا...</div>
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {SITE_CONTENT_SECTION_ORDER.map(({ key, title, subtitle }) => (
            <Section
              key={key}
              title={title}
              subtitle={subtitle}
              onSave={() => saveSection(key)}
              isSaving={savingSection === key}
              status={sectionStatus[key]}
            >
              {renderSectionEditor(key, content, setField)}
            </Section>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
