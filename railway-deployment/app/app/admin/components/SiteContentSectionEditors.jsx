'use client'

import { Field, Area, Section, getByPath, updateByPath, ListCard, panelBtnStyle } from '../components/SiteContentFields'

const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }
const grid1 = { display: 'grid', gap: 12 }

export function renderSectionEditor(sectionKey, content, setField) {
  const s = (path, value) => setField(sectionKey, path, value)
  const g = (path) => getByPath(content, `${sectionKey}.${path}`) ?? getByPath(content?.[sectionKey], path)

  switch (sectionKey) {
    case 'hero':
      return (
        <>
          <div style={grid2}>
            <Field label="Badge" value={g('badge')} onChange={(v) => s('badge', v)} />
            <Field label="عنوان" value={g('title')} onChange={(v) => s('title', v)} />
            <Field label="Tagline" value={g('tagline')} onChange={(v) => s('tagline', v)} />
            <Field label="تصویر Hero" dir="ltr" value={g('heroImage')} onChange={(v) => s('heroImage', v)} />
            <Field label="متن CTA اصلی" value={g('ctaPrimary')} onChange={(v) => s('ctaPrimary', v)} />
            <Field label="لینک CTA اصلی" dir="ltr" value={g('ctaPrimaryHref')} onChange={(v) => s('ctaPrimaryHref', v)} />
            <Field label="متن CTA ثانویه" value={g('ctaSecondary')} onChange={(v) => s('ctaSecondary', v)} />
            <Field label="لینک CTA ثانویه" dir="ltr" value={g('ctaSecondaryHref')} onChange={(v) => s('ctaSecondaryHref', v)} />
          </div>
          <div style={{ marginTop: 12 }}><Area label="توضیحات" value={g('description')} onChange={(v) => s('description', v)} /></div>
        </>
      )
    case 'ctaSection':
      return (
        <>
          <div style={grid2}>
            <Field label="Badge" value={g('badge')} onChange={(v) => s('badge', v)} />
            <Field label="عنوان" value={g('title')} onChange={(v) => s('title', v)} />
            <Field label="متن دکمه اصلی" value={g('primaryButtonText')} onChange={(v) => s('primaryButtonText', v)} />
            <Field label="لینک دکمه اصلی" dir="ltr" value={g('primaryButtonLink')} onChange={(v) => s('primaryButtonLink', v)} />
            <Field label="متن دکمه ثانویه" value={g('secondaryButtonText')} onChange={(v) => s('secondaryButtonText', v)} />
            <Field label="لینک دکمه ثانویه" dir="ltr" value={g('secondaryButtonLink')} onChange={(v) => s('secondaryButtonLink', v)} />
          </div>
          <div style={{ marginTop: 12 }}><Area label="توضیحات" value={g('description')} onChange={(v) => s('description', v)} /></div>
        </>
      )
    case 'servicesHome':
    case 'processHome':
    case 'testimonialsSection':
      return (
        <>
          <div style={grid2}>
            <Field label="Badge" value={g('badge')} onChange={(v) => s('badge', v)} />
            <Field label="عنوان" value={g('title')} onChange={(v) => s('title', v)} />
            <Field label="بخش برجسته عنوان" value={g('titleHighlight')} onChange={(v) => s('titleHighlight', v)} />
            {sectionKey === 'testimonialsSection' ? (
              <Field label="پسوند عنوان" value={g('titleSuffix')} onChange={(v) => s('titleSuffix', v)} />
            ) : null}
            {sectionKey === 'processHome' ? (
              <>
                <Field label="یادداشت" value={g('note')} onChange={(v) => s('note', v)} />
                <Field label="متن CTA" value={g('ctaText')} onChange={(v) => s('ctaText', v)} />
                <Field label="لینک CTA" dir="ltr" value={g('ctaHref')} onChange={(v) => s('ctaHref', v)} />
              </>
            ) : null}
          </div>
          <div style={{ marginTop: 12 }}><Area label="توضیحات" value={g('description')} onChange={(v) => s('description', v)} /></div>
        </>
      )
    case 'trust':
      return (
        <>
          <div style={grid2}>
            <Field label="Badge" value={g('header.badge')} onChange={(v) => s('header.badge', v)} />
            <Field label="عنوان" value={g('header.title')} onChange={(v) => s('header.title', v)} />
            <Field label="زیرعنوان" value={g('header.subtitle')} onChange={(v) => s('header.subtitle', v)} />
            <Field label="یادداشت" value={g('note')} onChange={(v) => s('note', v)} />
            <Field label="متن CTA" value={g('cta.text')} onChange={(v) => s('cta.text', v)} />
            <Field label="لینک CTA" dir="ltr" value={g('cta.href')} onChange={(v) => s('cta.href', v)} />
          </div>
        </>
      )
    case 'servicesPage':
    case 'processPage':
    case 'blogPage':
      return (
        <>
          <div style={grid2}>
            <Field label="Badge" value={g('badge')} onChange={(v) => s('badge', v)} />
            <Field label="عنوان" value={g('title')} onChange={(v) => s('title', v)} />
            {sectionKey === 'blogPage' ? <Field label="متن CTA" value={g('ctaText')} onChange={(v) => s('ctaText', v)} /> : null}
          </div>
          <div style={{ marginTop: 12, ...grid1 }}>
            <Area label="زیرعنوان" value={g('subtitle')} onChange={(v) => s('subtitle', v)} />
            <Area label="متن معرفی" value={g('intro')} onChange={(v) => s('intro', v)} />
          </div>
        </>
      )
    case 'contactPage':
      return (
        <>
          <div style={grid2}>
            <Field label="Badge" value={g('badge')} onChange={(v) => s('badge', v)} />
            <Field label="عنوان" value={g('title')} onChange={(v) => s('title', v)} />
            <Field label="تلفن" value={g('phone')} onChange={(v) => s('phone', v)} />
            <Field label="ایمیل" dir="ltr" value={g('email')} onChange={(v) => s('email', v)} />
            <Field label="آدرس" value={g('address')} onChange={(v) => s('address', v)} />
            <Field label="عنوان فرم" value={g('formTitle')} onChange={(v) => s('formTitle', v)} />
          </div>
          <div style={{ marginTop: 12, ...grid1 }}>
            <Area label="زیرعنوان" value={g('subtitle')} onChange={(v) => s('subtitle', v)} />
            <Area label="پیام موفقیت فرم" value={g('formSuccessMessage')} onChange={(v) => s('formSuccessMessage', v)} />
          </div>
        </>
      )
    case 'aboutPage':
      return (
        <>
          <div style={grid2}>
            <Field label="Badge" value={g('badge')} onChange={(v) => s('badge', v)} />
            <Field label="عنوان" value={g('title')} onChange={(v) => s('title', v)} />
            <Field label="عنوان داستان" value={g('storyTitle')} onChange={(v) => s('storyTitle', v)} />
            <Field label="عنوان ماموریت" value={g('missionTitle')} onChange={(v) => s('missionTitle', v)} />
          </div>
          <div style={{ marginTop: 12, ...grid1 }}>
            <Area label="زیرعنوان" value={g('subtitle')} onChange={(v) => s('subtitle', v)} />
            <Area label="متن داستان" value={g('storyText')} onChange={(v) => s('storyText', v)} />
            <Area label="متن ماموریت" value={g('missionText')} onChange={(v) => s('missionText', v)} />
          </div>
        </>
      )
    case 'loginPage':
    case 'registerPage':
      return (
        <div style={grid2}>
          <Field label="عنوان" value={g('title')} onChange={(v) => s('title', v)} />
          <Area label="زیرعنوان" value={g('subtitle')} onChange={(v) => s('subtitle', v)} />
          {sectionKey === 'loginPage' ? (
            <>
              <Field label="برچسب ایمیل/تلفن" value={g('emailLabel')} onChange={(v) => s('emailLabel', v)} />
              <Field label="برچسب رمز" value={g('passwordLabel')} onChange={(v) => s('passwordLabel', v)} />
              <Field label="دکمه ورود" value={g('loginButton')} onChange={(v) => s('loginButton', v)} />
            </>
          ) : (
            <>
              <Field label="برچسب نام" value={g('fullNameLabel')} onChange={(v) => s('fullNameLabel', v)} />
              <Field label="دکمه ثبت‌نام" value={g('registerButton')} onChange={(v) => s('registerButton', v)} />
            </>
          )}
        </div>
      )
    case 'requestEvaluation':
      return (
        <>
          <div style={grid2}>
            <Field label="برند" value={g('brand')} onChange={(v) => s('brand', v)} />
            <Field label="عنوان" value={g('title')} onChange={(v) => s('title', v)} />
          </div>
          <div style={{ marginTop: 12, ...grid1 }}>
            <Area label="زیرعنوان" value={g('subtitle')} onChange={(v) => s('subtitle', v)} />
            <Area label="متن معرفی" value={g('intro')} onChange={(v) => s('intro', v)} />
            <Area label="پیام خوش‌آمد" value={g('welcomeMessage')} onChange={(v) => s('welcomeMessage', v)} />
          </div>
        </>
      )
    case 'termsPage':
    case 'privacyPage':
    case 'disclaimerPage':
      return (
        <>
          <div style={grid2}>
            <Field label="Badge" value={g('badge')} onChange={(v) => s('badge', v)} />
            <Field label="عنوان" value={g('title')} onChange={(v) => s('title', v)} />
          </div>
          <div style={{ marginTop: 12 }}><Area label="زیرعنوان" value={g('subtitle')} onChange={(v) => s('subtitle', v)} /></div>
          <LegalSectionsEditor sectionKey={sectionKey} content={content} setField={setField} />
        </>
      )
    case 'services':
      return <ServicesListEditor content={content} setField={setField} />
    case 'processSteps':
      return <ProcessStepsEditor content={content} setField={setField} />
    case 'testimonials':
      return <TestimonialsEditor content={content} setField={setField} />
    case 'header':
      return (
        <div style={grid2}>
          <Field label="نام برند" value={g('brand')} onChange={(v) => s('brand', v)} />
          <Field label="متن جایگزین لوگو" value={g('logoAlt')} onChange={(v) => s('logoAlt', v)} />
          <Field label="آدرس لوگو" dir="ltr" value={g('logoSrc')} onChange={(v) => s('logoSrc', v)} />
          <Field label="متن دکمه ورود" value={g('auth.login')} onChange={(v) => s('auth.login', v)} />
          <Field label="لینک ورود" dir="ltr" value={g('auth.loginHref')} onChange={(v) => s('auth.loginHref', v)} />
          <Field label="متن درخواست ارزیابی" value={g('auth.requestEvaluation')} onChange={(v) => s('auth.requestEvaluation', v)} />
          <Field label="لینک ارزیابی" dir="ltr" value={g('auth.evaluationHref')} onChange={(v) => s('auth.evaluationHref', v)} />
          <Field label="برچسب جستجو" value={g('search.label')} onChange={(v) => s('search.label', v)} />
          <Field label="Placeholder جستجو" value={g('search.placeholder')} onChange={(v) => s('search.placeholder', v)} />
        </div>
      )
    case 'footer':
      return (
        <>
          <div style={grid2}>
            <Field label="نام برند" value={g('brandName')} onChange={(v) => s('brandName', v)} />
            <Field label="متن CTA" value={g('ctaText')} onChange={(v) => s('ctaText', v)} />
            <Field label="لینک CTA" dir="ltr" value={g('ctaHref')} onChange={(v) => s('ctaHref', v)} />
            <Field label="ایمیل" dir="ltr" value={g('contact.email')} onChange={(v) => s('contact.email', v)} />
            <Field label="واتساپ" dir="ltr" value={g('contact.whatsapp')} onChange={(v) => s('contact.whatsapp', v)} />
            <Field label="لوکیشن" value={g('contact.location')} onChange={(v) => s('contact.location', v)} />
          </div>
          <div style={{ marginTop: 12, ...grid1 }}>
            <Area label="درباره فوتر" value={g('about')} onChange={(v) => s('about', v)} />
            <Area label="کپی‌رایت" value={g('copyright')} onChange={(v) => s('copyright', v)} />
          </div>
        </>
      )
    case 'siteStyles':
      return (
        <div style={grid1}>
          <Area label="CSS سفارشی" value={g('customCss')} onChange={(v) => s('customCss', v)} minHeight={160} />
        </div>
      )
    default:
      return <div style={{ color: '#a5b4fc' }}>ویرایش این بخش از همین صفحه پشتیبانی می‌شود.</div>
  }
}

function LegalSectionsEditor({ sectionKey, content, setField }) {
  const sections = Array.isArray(content?.[sectionKey]?.sections) ? content[sectionKey].sections : []

  function updateSection(idx, field, value) {
    const next = sections.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    setField(sectionKey, 'sections', next)
  }

  function addSection() {
    setField(sectionKey, 'sections', [...sections, { id: Date.now(), title: 'بخش جدید', body: '' }])
  }

  function removeSection(idx) {
    setField(sectionKey, 'sections', sections.filter((_, i) => i !== idx))
  }

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontWeight: 900, color: '#e0e7ff' }}>بخش‌های صفحه</div>
        <button type="button" style={panelBtnStyle} onClick={addSection}>+ افزودن بخش</button>
      </div>
      {sections.map((row, idx) => (
        <ListCard key={row.id || idx} title={`بخش ${idx + 1}`} onRemove={() => removeSection(idx)}>
          <Field label="عنوان" value={row.title} onChange={(v) => updateSection(idx, 'title', v)} />
          <div style={{ marginTop: 8 }}><Area label="متن" value={row.body} onChange={(v) => updateSection(idx, 'body', v)} /></div>
        </ListCard>
      ))}
    </div>
  )
}

function ServicesListEditor({ content, setField }) {
  const items = Array.isArray(content?.services) ? content.services : []
  function updateItem(idx, field, value) {
    setContentArray(setField, 'services', items.map((row, i) => (i === idx ? { ...row, [field]: value } : row)))
  }
  return (
    <ListEditor
      items={items}
      onAdd={() => setContentArray(setField, 'services', [...items, { id: Date.now(), title: 'خدمت جدید', description: '', tag: '', featured: false }])}
      onRemove={(idx) => setContentArray(setField, 'services', items.filter((_, i) => i !== idx))}
      renderItem={(row, idx) => (
        <>
          <Field label="عنوان" value={row.title} onChange={(v) => updateItem(idx, 'title', v)} />
          <div style={{ marginTop: 8 }}><Area label="توضیحات" value={row.description} onChange={(v) => updateItem(idx, 'description', v)} /></div>
          <div style={{ marginTop: 8, ...grid2 }}>
            <Field label="برچسب" value={row.tag} onChange={(v) => updateItem(idx, 'tag', v)} />
            <Field label="رنگ" dir="ltr" value={row.color} onChange={(v) => updateItem(idx, 'color', v)} />
          </div>
        </>
      )}
    />
  )
}

function ProcessStepsEditor({ content, setField }) {
  const items = Array.isArray(content?.processSteps) ? content.processSteps : []
  function updateItem(idx, field, value) {
    setContentArray(setField, 'processSteps', items.map((row, i) => (i === idx ? { ...row, [field]: value } : row)))
  }
  return (
    <ListEditor
      items={items}
      onAdd={() => setContentArray(setField, 'processSteps', [...items, { id: Date.now(), title: 'مرحله جدید', duration: '', description: '' }])}
      onRemove={(idx) => setContentArray(setField, 'processSteps', items.filter((_, i) => i !== idx))}
      renderItem={(row, idx) => (
        <>
          <div style={grid2}>
            <Field label="عنوان" value={row.title} onChange={(v) => updateItem(idx, 'title', v)} />
            <Field label="مدت" value={row.duration} onChange={(v) => updateItem(idx, 'duration', v)} />
          </div>
          <div style={{ marginTop: 8 }}><Area label="توضیحات" value={row.description} onChange={(v) => updateItem(idx, 'description', v)} /></div>
        </>
      )}
    />
  )
}

function TestimonialsEditor({ content, setField }) {
  const items = Array.isArray(content?.testimonials) ? content.testimonials : []
  function updateItem(idx, field, value) {
    setContentArray(setField, 'testimonials', items.map((row, i) => (i === idx ? { ...row, [field]: value } : row)))
  }
  return (
    <ListEditor
      items={items}
      onAdd={() => setContentArray(setField, 'testimonials', [...items, { id: Date.now(), author: '', role: '', text: '', rating: 5 }])}
      onRemove={(idx) => setContentArray(setField, 'testimonials', items.filter((_, i) => i !== idx))}
      renderItem={(row, idx) => (
        <>
          <div style={grid2}>
            <Field label="نام" value={row.author} onChange={(v) => updateItem(idx, 'author', v)} />
            <Field label="نقش" value={row.role} onChange={(v) => updateItem(idx, 'role', v)} />
          </div>
          <div style={{ marginTop: 8 }}><Area label="متن نظر" value={row.text} onChange={(v) => updateItem(idx, 'text', v)} /></div>
        </>
      )}
    />
  )
}

function setContentArray(setField, key, value) {
  setField(key, '__root__', value)
}

function ListEditor({ items, onAdd, onRemove, renderItem }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        <button type="button" style={panelBtnStyle} onClick={onAdd}>+ افزودن</button>
      </div>
      {items.map((row, idx) => (
        <ListCard key={row.id || idx} title={`مورد ${idx + 1}`} onRemove={() => onRemove(idx)}>
          {renderItem(row, idx)}
        </ListCard>
      ))}
    </div>
  )
}

export const SITE_CONTENT_SECTION_ORDER = [
  { key: 'header', title: 'هدر', subtitle: 'برند، لوگو و دکمه‌های هدر' },
  { key: 'hero', title: 'بخش Hero صفحه اصلی', subtitle: 'عنوان اصلی و CTAهای ابتدای سایت' },
  { key: 'ctaSection', title: 'CTA میانی صفحه اصلی', subtitle: 'بخش دعوت به اقدام' },
  { key: 'servicesHome', title: 'خدمات (صفحه اصلی)', subtitle: 'معرفی خدمات در صفحه اول' },
  { key: 'processHome', title: 'فرآیند (صفحه اصلی)', subtitle: 'مراحل همکاری در صفحه اول' },
  { key: 'testimonialsSection', title: 'بخش نظرات (صفحه اصلی)', subtitle: 'عنوان بخش نظرات' },
  { key: 'trust', title: 'شبکه جهانی / اعتماد', subtitle: 'بخش اعتماد و شبکه سرمایه‌گذاران' },
  { key: 'testimonials', title: 'لیست نظرات', subtitle: 'نظرات کاربران' },
  { key: 'servicesPage', title: 'صفحه خدمات', subtitle: 'متون ابتدای صفحه خدمات' },
  { key: 'services', title: 'لیست خدمات', subtitle: 'کارت‌های خدمات' },
  { key: 'processPage', title: 'صفحه فرآیند', subtitle: 'متون ابتدای صفحه فرآیند' },
  { key: 'processSteps', title: 'مراحل فرآیند', subtitle: 'لیست مراحل' },
  { key: 'blogPage', title: 'صفحه بلاگ', subtitle: 'هدر صفحه مقالات' },
  { key: 'contactPage', title: 'صفحه تماس', subtitle: 'اطلاعات تماس و متن فرم' },
  { key: 'aboutPage', title: 'صفحه درباره ما', subtitle: 'متون داستان و ماموریت' },
  { key: 'loginPage', title: 'صفحه ورود', subtitle: 'متون صفحه login' },
  { key: 'registerPage', title: 'صفحه ثبت‌نام', subtitle: 'متون صفحه register' },
  { key: 'requestEvaluation', title: 'درخواست ارزیابی', subtitle: 'متون صفحه founder onboarding' },
  { key: 'privacyPage', title: 'حریم خصوصی', subtitle: 'صفحه privacy' },
  { key: 'disclaimerPage', title: 'سلب مسئولیت', subtitle: 'صفحه disclaimer' },
  { key: 'termsPage', title: 'شرایط و ضوابط', subtitle: 'صفحه terms' },
  { key: 'footer', title: 'فوتر', subtitle: 'متون پایین سایت' },
  { key: 'siteStyles', title: 'استایل سایت', subtitle: 'CSS سفارشی' },
]

export function createSetField(setContent) {
  return function setField(sectionKey, path, value) {
    setContent((prev) => {
      if (path === '__root__') {
        return { ...prev, [sectionKey]: value }
      }
      return {
        ...prev,
        [sectionKey]: updateByPath(prev?.[sectionKey] || {}, path, value),
      }
    })
  }
}

export { Section }
