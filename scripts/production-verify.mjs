/**
 * Final production verification smoke tests.
 * Run with API server already listening (or set API_URL).
 */
import path from 'node:path'
import fs from 'node:fs'
import { config } from 'dotenv'
import { io } from 'socket.io-client'

const root = process.cwd()
config({ path: path.join(root, '.env.local') })
config({ path: path.join(root, '.env') })

const BASE = process.env.API_URL || `http://localhost:${process.env.REG_SERVER_PORT || 4001}`
const PORT = Number(process.env.REG_SERVER_PORT || process.env.PORT || 4001)

const results = []
let criticalCount = 0
let highCount = 0

function pass(name, detail = '') {
  results.push({ name, status: 'PASS', detail })
  console.log(`PASS: ${name}${detail ? ` — ${detail}` : ''}`)
}

function fail(name, detail = '', severity = 'critical') {
  results.push({ name, status: 'FAIL', detail, severity })
  if (severity === 'critical') criticalCount += 1
  else highCount += 1
  console.error(`FAIL [${severity}]: ${name}${detail ? ` — ${detail}` : ''}`)
}

async function request(urlPath, init = {}, retries = 3) {
  let last
  for (let i = 0; i < retries; i += 1) {
    const res = await fetch(`${BASE}${urlPath}`, init)
    const json = await res.json().catch(() => null)
    last = { res, json }
    if (res.ok || res.status < 500) return last
    await new Promise((r) => setTimeout(r, 1500 * (i + 1)))
  }
  return last
}

async function testHealth() {
  const health = await request('/api/health')
  if (!health.res.ok || health.json?.status !== 'healthy') {
    fail('health endpoint', `status=${health.res.status}`)
    return
  }
  pass('health endpoint', `uptime=${health.json.uptimeSeconds ?? health.json.uptime}s`)

  const ready = await request('/api/ready')
  if (!ready.res.ok || ready.json?.status !== 'ready') {
    fail('ready endpoint', `status=${ready.res.status} db=${ready.json?.checks?.database}`)
    return
  }
  pass('ready endpoint', `db=${ready.json.checks?.database}`)

  const version = await request('/api/version')
  if (!version.res.ok || !version.json?.version) {
    fail('version endpoint', `status=${version.res.status}`)
    return
  }
  pass('version endpoint', `v${version.json.version}`)
}

async function testBlog() {
  const pub = await request('/api/blogs')
  if (!pub.res.ok || !Array.isArray(pub.json)) {
    fail('blog public endpoint', `status=${pub.res.status}`)
    return
  }
  pass('blog public endpoint', `${pub.json.length} post(s)`)
}

async function testSiteContent() {
  const pub = await request('/api/site-content')
  if (!pub.res.ok || pub.json?.content === undefined) {
    fail('site-content public endpoint', `status=${pub.res.status}`)
    return
  }
  pass('site-content public endpoint', `keys=${Object.keys(pub.json.content || {}).length}`)
}

async function testUpload() {
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64'
  )
  const boundary = '----verify' + Date.now()
  const body = Buffer.concat([
    Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="verify.png"\r\nContent-Type: image/png\r\n\r\n`
    ),
    png,
    Buffer.from(`\r\n--${boundary}--\r\n`),
  ])

  const res = await fetch(`${BASE}/api/chat/uploads`, {
    method: 'POST',
    headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
    body,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || !json.url) {
    fail('upload endpoint', `status=${res.status} ${json.error || ''}`)
    return
  }
  pass('upload endpoint', json.url)
}

async function testWebSocket() {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      socket.disconnect()
      fail('websocket connection', 'timeout after 8s')
      resolve()
    }, 8000)

    const socket = io(BASE, {
      transports: ['websocket'],
      auth: { role: 'user', userId: 'verify-user' },
    })

    socket.on('connect', () => {
      clearTimeout(timer)
      pass('websocket connection', `id=${socket.id}`)
      socket.disconnect()
      resolve()
    })

    socket.on('connect_error', (err) => {
      clearTimeout(timer)
      fail('websocket connection', err.message)
      resolve()
    })
  })
}

async function testEnvValidationScript() {
  const { execSync } = await import('node:child_process')
  try {
    execSync('node scripts/validate-env.mjs', { cwd: root, stdio: 'pipe' })
    pass('environment validation script')
  } catch (err) {
    fail('environment validation script', err.stderr?.toString() || err.message)
  }
}

async function main() {
  console.log('Production verification against', BASE)
  console.log('---')

  await testEnvValidationScript()
  await testHealth()
  await testBlog()
  await testSiteContent()
  await testUpload()
  await testWebSocket()

  console.log('---')
  const passed = results.filter((r) => r.status === 'PASS').length
  const failed = results.filter((r) => r.status === 'FAIL').length
  console.log(`Results: ${passed} passed, ${failed} failed, ${criticalCount} critical`)

  const reportPath = path.join(root, 'scripts', '.production-verify-result.json')
  fs.writeFileSync(
    reportPath,
    JSON.stringify({ base: BASE, port: PORT, results, criticalCount, highCount, passed, failed, at: new Date().toISOString() }, null, 2)
  )

  process.exit(criticalCount > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error('Verification crashed:', err)
  process.exit(1)
})
