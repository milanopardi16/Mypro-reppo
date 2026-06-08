'use client'

export function Field({ label, value, onChange, placeholder = '', dir = 'rtl' }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ color: '#a5b4fc', fontSize: 12, fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 900 }}>{label}</div>
      <input
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        style={{
          padding: '10px 12px',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(0,0,0,0.25)',
          color: '#fff',
          outline: 'none',
        }}
      />
    </label>
  )
}

export function Area({ label, value, onChange, placeholder = '', minHeight = 100 }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ color: '#a5b4fc', fontSize: 12, fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 900 }}>{label}</div>
      <textarea
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          minHeight,
          padding: '10px 12px',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(0,0,0,0.25)',
          color: '#fff',
          outline: 'none',
          resize: 'vertical',
        }}
      />
    </label>
  )
}

export function Section({ title, subtitle, children, onSave, isSaving, status }) {
  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: 16, background: 'rgba(255,255,255,0.03)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 1000, fontSize: 18 }}>{title}</div>
          {subtitle ? <div style={{ color: '#a5b4fc', marginTop: 4, fontSize: 12 }}>{subtitle}</div> : null}
        </div>
        {onSave ? (
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            style={{
              padding: '8px 12px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.12)',
              background: isSaving ? 'rgba(255,255,255,0.12)' : 'linear-gradient(135deg, #D19C0A 0%, #E5B02A 100%)',
              color: '#000',
              fontFamily: 'BYekan, IranYekan, sans-serif',
              fontWeight: 1000,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            {isSaving ? 'در حال ذخیره...' : 'ذخیره این بخش'}
          </button>
        ) : null}
      </div>
      {status ? (
        <div style={{ marginBottom: 12, color: status.type === 'error' ? '#fca5a5' : '#86efac', fontSize: 12, fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 900 }}>
          {status.message}
        </div>
      ) : null}
      {children}
    </div>
  )
}

export function updateByPath(obj, path, value) {
  const keys = path.split('.')
  const next = { ...(obj || {}) }
  let cursor = next
  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i]
    cursor[key] = { ...(cursor[key] || {}) }
    cursor = cursor[key]
  }
  cursor[keys[keys.length - 1]] = value
  return next
}

export function getByPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc != null ? acc[key] : undefined), obj)
}

export const saveBtnStyle = {
  padding: '10px 14px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'linear-gradient(135deg, #D19C0A 0%, #E5B02A 100%)',
  color: '#000',
  fontFamily: 'BYekan, IranYekan, sans-serif',
  fontWeight: 1000,
  cursor: 'pointer',
}

export const panelBtnStyle = {
  padding: '8px 12px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.06)',
  color: '#fff',
  fontFamily: 'BYekan, IranYekan, sans-serif',
  fontWeight: 900,
  cursor: 'pointer',
}

export function ListCard({ title, onRemove, children }) {
  return (
    <div style={{ padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(0,0,0,0.12)', marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontWeight: 900, color: '#e0e7ff' }}>{title}</div>
        {onRemove ? (
          <button type="button" onClick={onRemove} style={{ ...panelBtnStyle, background: 'rgba(239,68,68,0.2)', color: '#fca5a5' }}>
            حذف
          </button>
        ) : null}
      </div>
      {children}
    </div>
  )
}
