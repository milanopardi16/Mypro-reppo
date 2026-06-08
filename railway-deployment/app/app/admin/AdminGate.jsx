'use client'

import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { loginAdmin, verifyAdminSession } from '../utils/adminAuth'
import AdminAuthLoading from './components/AdminAuthLoading'

export default function AdminGate() {
  const [checking, setChecking] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let active = true
    verifyAdminSession().then((ok) => {
      if (!active) return
      setAuthenticated(ok)
      setChecking(false)
    })
    return () => {
      active = false
    }
  }, [])

  async function handleLogin(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const result = await loginAdmin(username, password)
    setSubmitting(false)
    if (result.ok) {
      setAuthenticated(true)
      return
    }
    setError(result.error || 'ورود ناموفق بود')
  }

  if (checking) return <AdminAuthLoading />

  if (!authenticated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0A1D3D',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{
            width: '100%',
            maxWidth: 420,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div style={{ fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 900, fontSize: 20 }}>
            ورود به پنل ادمین
          </div>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, color: '#a5b4fc' }}>نام کاربری</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(0,0,0,0.2)',
                color: '#fff',
              }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, color: '#a5b4fc' }}>رمز عبور</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(0,0,0,0.2)',
                color: '#fff',
              }}
            />
          </label>
          {error ? <div style={{ color: '#fca5a5', fontSize: 13 }}>{error}</div> : null}
          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: 4,
              padding: '12px 14px',
              borderRadius: 10,
              border: 'none',
              background: '#D19C0A',
              color: '#0A1D3D',
              fontFamily: 'BYekan, IranYekan, sans-serif',
              fontWeight: 900,
              cursor: submitting ? 'wait' : 'pointer',
            }}
          >
            {submitting ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>
      </div>
    )
  }

  return <Outlet />
}
