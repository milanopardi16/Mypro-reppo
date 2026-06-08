const ACCESS_KEY = 'cn_admin_access_token'
const REFRESH_KEY = 'cn_admin_refresh_token'

export function getAdminToken() {
  if (typeof sessionStorage === 'undefined') return ''
  return sessionStorage.getItem(ACCESS_KEY) || ''
}

export function getAdminRefreshToken() {
  if (typeof sessionStorage === 'undefined') return ''
  return sessionStorage.getItem(REFRESH_KEY) || ''
}

export function setAdminToken(accessToken, refreshToken) {
  if (typeof sessionStorage === 'undefined') return
  sessionStorage.setItem(ACCESS_KEY, accessToken || '')
  if (refreshToken) sessionStorage.setItem(REFRESH_KEY, refreshToken)
}

export function setAdminSession({ accessToken, refreshToken }) {
  setAdminToken(accessToken, refreshToken)
}

export function clearAdminToken() {
  if (typeof sessionStorage === 'undefined') return
  sessionStorage.removeItem(ACCESS_KEY)
  sessionStorage.removeItem(REFRESH_KEY)
}

export async function refreshAdminAccessToken() {
  const refreshToken = getAdminRefreshToken()
  if (!refreshToken) return false
  try {
    const res = await fetch('/api/admin/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      credentials: 'same-origin',
      cache: 'no-store',
    })
    const data = await res.json()
    if (!res.ok) {
      clearAdminToken()
      return false
    }
    setAdminToken(data.accessToken, data.refreshToken || refreshToken)
    return true
  } catch {
    clearAdminToken()
    return false
  }
}

export async function ensureAdminAuth() {
  if (getAdminToken()) return true
  return refreshAdminAccessToken()
}

export async function verifyAdminSession() {
  if (!getAdminToken()) {
    const refreshed = await refreshAdminAccessToken()
    if (!refreshed) return false
  }
  try {
    const res = await adminFetch('/api/admin/me')
    if (res.status === 401) {
      clearAdminToken()
      return false
    }
    return res.ok
  } catch {
    return false
  }
}

export function getAdminApiOfflineMessage() {
  return 'در حال حاضر سرویس ورود در دسترس نیست. لطفاً چند دقیقه دیگر مجدداً تلاش کنید.'
}

export async function checkAdminApiHealth() {
  try {
    const res = await fetch('/api/health', { cache: 'no-store' })
    const text = await res.text()
    if (/<!DOCTYPE|<html/i.test(text)) return false
    const json = JSON.parse(text)
    return json?.ok === true
  } catch {
    return false
  }
}

export function shouldShowAdminApiOfflineBanner() {
  return false
}

export async function loginAdmin(username, password) {
  try {
    const res = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'same-origin',
      cache: 'no-store',
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data.error || 'ورود ناموفق بود' }
    setAdminToken(data.accessToken, data.refreshToken)
    return { ok: true }
  } catch {
    return { ok: false, error: getAdminApiOfflineMessage() }
  }
}

export async function loginWithLegacyToken(token) {
  if (!token) return { ok: false }
  setAdminToken(token, null)
  const ok = await verifyAdminSession()
  if (!ok) clearAdminToken()
  return { ok }
}

export async function adminFetch(path, init = {}) {
  const url = String(path || '').startsWith('/') ? path : `/${path}`
  const headers = new Headers(init.headers || {})
  const token = getAdminToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (!headers.has('Content-Type') && init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  let res = await fetch(url, {
    ...init,
    headers,
    cache: 'no-store',
    credentials: 'same-origin',
  })

  if (res.status === 401) {
    const refreshed = await refreshAdminAccessToken()
    if (refreshed) {
      headers.set('Authorization', `Bearer ${getAdminToken()}`)
      res = await fetch(url, {
        ...init,
        headers,
        cache: 'no-store',
        credentials: 'same-origin',
      })
    }
  }

  return res
}

export async function adminUpload(file) {
  const data = new FormData()
  data.append('file', file)
  return adminFetch('/api/admin/uploads', { method: 'POST', body: data })
}

export async function logoutAdmin() {
  const refreshToken = getAdminRefreshToken()
  try {
    await fetch('/api/admin/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
      body: JSON.stringify({ refreshToken }),
      credentials: 'same-origin',
      cache: 'no-store',
    })
  } catch {
    // ignore
  }
  clearAdminToken()
}
