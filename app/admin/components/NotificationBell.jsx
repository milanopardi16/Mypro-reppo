'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from '@/src/router-shims/Link'
import { useNotificationContext } from '../context/NotificationContext'
import { formatRelativeTime } from '../utils/formatRelativeTime'

const btnStyle = {
  padding: '8px 10px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.06)',
  color: '#fff',
  fontFamily: 'BYekan, IranYekan, sans-serif',
  fontWeight: 900,
  cursor: 'pointer',
  fontSize: 12,
}

export default function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead, load } = useNotificationContext()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  const preview = notifications.slice(0, 8)

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button
        type="button"
        aria-label={`اعلان‌ها${unreadCount ? `، ${unreadCount} خوانده‌نشده` : ''}`}
        aria-expanded={open}
        onClick={() => {
          setOpen((v) => !v)
          if (!open) load(1)
        }}
        style={{
          position: 'relative',
          padding: '10px 12px',
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(255,255,255,0.06)',
          color: '#fff',
          fontFamily: 'BYekan, IranYekan, sans-serif',
          fontWeight: 900,
          cursor: 'pointer',
          fontSize: 18,
        }}
      >
        🔔
        {unreadCount > 0 ? (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              minWidth: 18,
              height: 18,
              padding: '0 5px',
              borderRadius: 999,
              background: '#dc2626',
              color: '#fff',
              fontSize: 11,
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            width: 360,
            maxHeight: 400,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.12)',
            background: '#0A1D3D',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            zIndex: 200,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontWeight: 900 }}>
            <span>اعلان‌ها</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {unreadCount > 0 ? (
                <button type="button" style={btnStyle} onClick={markAllRead}>
                  همه خوانده شد
                </button>
              ) : null}
              <Link href="/admin/notifications" style={{ ...btnStyle, textDecoration: 'none', display: 'inline-block' }} onClick={() => setOpen(false)}>
                مشاهده همه
              </Link>
            </div>
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {preview.length === 0 ? (
              <div style={{ color: '#a5b4fc', padding: 20, textAlign: 'center' }}>اعلانی وجود ندارد</div>
            ) : (
              preview.map((n) => (
                <div
                  key={n.id}
                  role="menuitem"
                  onClick={() => { if (!n.isRead) markRead(n.id) }}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                    background: n.isRead ? 'transparent' : 'rgba(59,130,246,0.10)',
                  }}
                >
                  <div style={{ fontWeight: 900, fontSize: 13 }}>{n.title || 'اعلان'}</div>
                  {n.message ? <div style={{ fontSize: 12, color: '#a5b4fc', marginTop: 4, lineHeight: 1.6 }}>{n.message}</div> : null}
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>
                    {n.createdAt ? formatRelativeTime(n.createdAt) : ''}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
