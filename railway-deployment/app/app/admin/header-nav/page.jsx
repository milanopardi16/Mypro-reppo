'use client'

import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { adminFetch } from '../../utils/adminAuth'
import { normalizeSiteContent } from '../../data/siteContent'
import { getHeaderButtons, PAGE_ID_LABELS } from '../../data/headerPageRegistry'
import { PAGE_TO_SECTIONS, SECTION_LABELS } from '../utils/headerPageContentMap'
import { Field, Section, panelBtnStyle, saveBtnStyle, ListCard } from '../components/SiteContentFields'
import { createSetField, renderSectionEditor } from '../components/SiteContentSectionEditors'

export default function AdminHeaderNavPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [content, setContent] = useState({})
  const [selectedId, setSelectedId] = useState('logo')
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
        if (mounted) setError('دریافت اطلاعات هدر انجام نشد.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const buttons = useMemo(() => getHeaderButtons(content?.header || {}), [content])
  const selected = buttons.find((b) => b.id === selectedId) || buttons[0]
  const pageSections = selected?.pageId ? PAGE_TO_SECTIONS[selected.pageId] || [] : []

  function updateHeaderField(path, value) {
    setContent((prev) => {
      const header = { ...(prev.header || {}) }
      if (path.startsWith('auth.')) {
        const key = path.replace('auth.', '')
        header.auth = { ...(header.auth || {}), [key]: value }
      } else if (path.startsWith('search.')) {
        const key = path.replace('search.', '')
        header.search = { ...(header.search || {}), [key]: value }
      } else {
        header[path] = value
      }
      return { ...prev, header }
    })
  }

  function updateNavItem(navId, field, value) {
    setContent((prev) => {
      const items = Array.isArray(prev.header?.navItems) ? [...prev.header.navItems] : []
      const idx = items.findIndex((x) => x.id === navId)
      if (idx === -1) return prev
      items[idx] = { ...items[idx], [field]: value }
      return { ...prev, header: { ...(prev.header || {}), navItems: items } }
    })
  }

  function addNavItem() {
    setContent((prev) => {
      const items = Array.isArray(prev.header?.navItems) ? [...prev.header.navItems] : []
      items.push({ id: Date.now(), label: 'منوی جدید', href: '/' })
      return { ...prev, header: { ...(prev.header || {}), navItems: items } }
    })
  }

  function removeNavItem(navId) {
    setContent((prev) => ({
      ...prev,
      header: {
        ...(prev.header || {}),
        navItems: (prev.header?.navItems || []).filter((x) => x.id !== navId),
      },
    }))
  }

  async function saveHeader() {
    setSavingSection('header')
    setSectionStatus({})
    setStatus('')
    setError('')
    try {
      const res = await adminFetch('/api/admin/site-content/section', {
        method: 'POST',
        body: JSON.stringify({ section: 'header', data: content?.header || {} }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || 'failed')
      if (json?.content) setContent(normalizeSiteContent(json.content))
      setStatus('تغییرات هدر ذخیره شد.')
    } catch (e) {
      setError(e?.message || 'ذخیره هدر انجام نشد.')
    } finally {
      setSavingSection('')
    }
  }

  async function saveSection(sectionKey) {
    setSavingSection(sectionKey)
    setSectionStatus((prev) => ({ ...prev, [sectionKey]: null }))
    try {
      const res = await adminFetch('/api/admin/site-content/section', {
        method: 'POST',
        body: JSON.stringify({ section: sectionKey, data: content?.[sectionKey] ?? {} }),
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
        [sectionKey]: { type: 'error', message: e?.message || 'خطا در ذخیره.' },
      }))
    } finally {
      setSavingSection('')
    }
  }

  function renderButtonSettings() {
    if (!selected) return null
    const type = selected.type

    if (type === 'brand') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="نام برند" value={content?.header?.brand} onChange={(v) => updateHeaderField('brand', v)} />
          <Field label="متن جایگزین لوگو" value={content?.header?.logoAlt} onChange={(v) => updateHeaderField('logoAlt', v)} />
          <Field label="آدرس لوگو" dir="ltr" value={content?.header?.logoSrc} onChange={(v) => updateHeaderField('logoSrc', v)} />
        </div>
      )
    }

    if (type === 'nav') {
      return (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="برچسب منو" value={selected.label} onChange={(v) => updateNavItem(selected.navId, 'label', v)} />
            <Field label="لینک" dir="ltr" value={selected.href} onChange={(v) => updateNavItem(selected.navId, 'href', v)} />
          </div>
          <div style={{ marginTop: 12 }}>
            <button type="button" style={{ ...panelBtnStyle, background: 'rgba(239,68,68,0.2)', color: '#fca5a5' }} onClick={() => removeNavItem(selected.navId)}>
              حذف این آیتم منو
            </button>
          </div>
        </>
      )
    }

    if (type === 'auth') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="متن دکمه ورود" value={content?.header?.auth?.login} onChange={(v) => updateHeaderField('auth.login', v)} />
          <Field label="لینک ورود" dir="ltr" value={content?.header?.auth?.loginHref} onChange={(v) => updateHeaderField('auth.loginHref', v)} />
        </div>
      )
    }

    if (type === 'cta') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="متن دکمه" value={content?.header?.auth?.requestEvaluation} onChange={(v) => updateHeaderField('auth.requestEvaluation', v)} />
          <Field label="لینک" dir="ltr" value={content?.header?.auth?.evaluationHref} onChange={(v) => updateHeaderField('auth.evaluationHref', v)} />
        </div>
      )
    }

    if (type === 'search') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="برچسب جستجو" value={content?.header?.search?.label} onChange={(v) => updateHeaderField('search.label', v)} />
          <Field label="Placeholder" value={content?.header?.search?.placeholder} onChange={(v) => updateHeaderField('search.placeholder', v)} />
          <Field label="راهنما" value={content?.header?.search?.hint} onChange={(v) => updateHeaderField('search.hint', v)} />
        </div>
      )
    }

    return null
  }

  return (
    <AdminLayout title="دکمه‌های هدر" subtitle="مدیریت دکمه‌های هدر و محتوای صفحات مرتبط">
      {error ? (
        <div style={{ marginBottom: 12, padding: '10px 12px', borderRadius: 12, background: 'rgba(239, 68, 68, 0.16)', border: '1px solid rgba(239,68,68,0.35)', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 900 }}>
          {error}
        </div>
      ) : null}
      {status ? (
        <div style={{ marginBottom: 12, padding: '10px 12px', borderRadius: 12, background: 'rgba(34, 197, 94, 0.16)', border: '1px solid rgba(34,197,94,0.35)', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 900, color: '#dcfce7' }}>
          {status}
        </div>
      ) : null}

      {loading ? (
        <div style={{ color: '#a5b4fc', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 900 }}>در حال بارگذاری...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16, alignItems: 'start' }}>
          <div style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: 12, background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ fontWeight: 1000, marginBottom: 10, color: '#e0e7ff' }}>دکمه‌های هدر</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {buttons.map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setSelectedId(btn.id)}
                  style={{
                    textAlign: 'right',
                    padding: '10px 12px',
                    borderRadius: 12,
                    border: `1px solid ${selectedId === btn.id ? 'rgba(209,156,10,0.5)' : 'rgba(255,255,255,0.10)'}`,
                    background: selectedId === btn.id ? 'rgba(209,156,10,0.15)' : 'rgba(0,0,0,0.12)',
                    color: '#fff',
                    fontFamily: 'BYekan, IranYekan, sans-serif',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ marginLeft: 8 }}>{btn.icon}</span>
                  {btn.label}
                  {btn.pageId ? (
                    <div style={{ fontSize: 11, color: '#a5b4fc', marginTop: 4 }}>
                      {PAGE_ID_LABELS[btn.pageId] || btn.pageId}
                    </div>
                  ) : null}
                </button>
              ))}
            </div>
            <button type="button" style={{ ...panelBtnStyle, width: '100%', marginTop: 12 }} onClick={addNavItem}>
              + افزودن آیتم منو
            </button>
            <button type="button" style={{ ...saveBtnStyle, width: '100%', marginTop: 10 }} disabled={savingSection === 'header'} onClick={saveHeader}>
              {savingSection === 'header' ? 'در حال ذخیره...' : 'ذخیره تنظیمات هدر'}
            </button>
          </div>

          <div style={{ display: 'grid', gap: 14 }}>
            {selected ? (
              <Section title={`تنظیمات: ${selected.label}`} subtitle={selected.pageId ? PAGE_ID_LABELS[selected.pageId] : 'تنظیمات دکمه'}>
                {renderButtonSettings()}
              </Section>
            ) : null}

            {pageSections.length > 0 ? (
              <div style={{ color: '#a5b4fc', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 900, fontSize: 13 }}>
                محتوای صفحه مرتبط — {PAGE_ID_LABELS[selected.pageId]}
              </div>
            ) : null}

            {pageSections.map((sectionKey) => (
              <Section
                key={sectionKey}
                title={SECTION_LABELS[sectionKey] || sectionKey}
                subtitle="ویرایش کلی محتوای این بخش"
                onSave={() => saveSection(sectionKey)}
                isSaving={savingSection === sectionKey}
                status={sectionStatus[sectionKey]}
              >
                {renderSectionEditor(sectionKey, content, setField)}
              </Section>
            ))}

            {selected?.type === 'nav' && pageSections.length === 0 ? (
              <ListCard title="راهنما">
                <div style={{ color: '#a5b4fc', lineHeight: 1.8, fontSize: 13 }}>
                  برای این لینک منو، سکشن محتوای اختصاصی تعریف نشده. می‌توانید label و href را ویرایش کنید.
                </div>
              </ListCard>
            ) : null}
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
