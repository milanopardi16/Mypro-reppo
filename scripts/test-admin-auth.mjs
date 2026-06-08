/**
 * Smoke tests for admin auth API (run: node scripts/test-admin-auth.mjs)
 * Requires: API running, ADMIN_USERNAME, ADMIN_PASSWORD, JWT_* in environment.
 */
import path from 'node:path'
import { config } from 'dotenv'

const root = process.cwd()
config({ path: path.join(root, '.env.local') })
config({ path: path.join(root, '.env') })

const BASE = process.env.API_URL || `http://localhost:${process.env.REG_SERVER_PORT || 4001}`

function requireEnv(name) {
  const value = process.env[name]
  if (!value) {
    console.error(`FAIL: missing required env ${name}`)
    process.exit(1)
  }
  return value
}

async function request(path, init = {}) {
  const res = await fetch(`${BASE}${path}`, init)
  const json = await res.json().catch(() => ({}))
  return { res, json }
}

async function main() {
  console.log('Testing admin auth at', BASE)

  const health = await request('/api/health')
  if (!health.res.ok) {
    console.error('FAIL: /api/health', health.res.status, health.json)
    process.exit(1)
  }
  console.log('OK: /api/health')

  const ready = await request('/api/ready')
  if (!ready.res.ok) {
    console.error('FAIL: /api/ready (database)', ready.res.status, ready.json)
    process.exit(1)
  }
  console.log('OK: /api/ready')

  const username = requireEnv('ADMIN_USERNAME')
  const password = requireEnv('ADMIN_PASSWORD')

  const login = await request('/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!login.res.ok || !login.json.accessToken) {
    console.error('FAIL: login', login.res.status, login.json)
    process.exit(1)
  }
  console.log('OK: login → accessToken received')

  const me = await request('/api/admin/me', {
    headers: { Authorization: `Bearer ${login.json.accessToken}` },
  })
  if (!me.res.ok || !me.json.ok) {
    console.error('FAIL: /api/admin/me', me.res.status, me.json)
    process.exit(1)
  }
  console.log('OK: /api/admin/me')

  const refresh = await request('/api/admin/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: login.json.refreshToken }),
  })
  if (!refresh.res.ok || !refresh.json.accessToken) {
    console.error('FAIL: refresh', refresh.res.status, refresh.json)
    process.exit(1)
  }
  console.log('OK: refresh → new accessToken')

  console.log('\nAll admin auth tests passed.')
}

main().catch((err) => {
  console.error('ERROR:', err.message)
  process.exit(1)
})
