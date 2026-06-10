#!/usr/bin/env node
const { URL } = require('url')
const net = require('net')
const { execSync } = require('child_process')

const MAX_RETRIES = 10
const DELAY_MS = 5000

function parseHostPort(databaseUrl) {
  if (!databaseUrl) return null
  try {
    const u = new URL(databaseUrl)
    const host = u.hostname
    let port = u.port
    if (!port) {
      if (u.protocol === 'postgres:') port = '5432'
      else if (u.protocol === 'mysql:') port = '3306'
    }
    return { host, port: Number(port) }
  } catch (err) {
    return null
  }
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function checkTcp(host, port, timeout = 3000) {
  return new Promise((resolve) => {
    const socket = new net.Socket()
    let called = false
    socket.setTimeout(timeout)
    socket.on('connect', () => {
      if (!called) {
        called = true
        socket.destroy()
        resolve(true)
      }
    })
    socket.on('timeout', () => {
      if (!called) {
        called = true
        socket.destroy()
        resolve(false)
      }
    })
    socket.on('error', () => {
      if (!called) {
        called = true
        socket.destroy()
        resolve(false)
      }
    })
    socket.connect(port, host)
  })
}

async function waitForDb(databaseUrl) {
  console.log('[release] Validating database connectivity')
  const parsed = parseHostPort(databaseUrl)
  if (!parsed || !parsed.host || !parsed.port) {
    throw new Error('Unable to parse host/port from DATABASE_URL')
  }
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(`[release] Attempt ${attempt}/${MAX_RETRIES} — connecting to ${parsed.host}:${parsed.port}`)
    try {
      const ok = await checkTcp(parsed.host, parsed.port)
      if (ok) {
        console.log('[release] Database reachable')
        return
      }
      console.warn('[release] Connection attempt failed')
    } catch (err) {
      console.warn('[release] Error during check', err?.message)
    }
    if (attempt < MAX_RETRIES) {
      console.log(`[release] Waiting ${DELAY_MS}ms before retry`)
      await wait(DELAY_MS)
    }
  }
  throw new Error('All attempts failed — database unreachable')
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL
  console.log('[release] Starting release script')
  if (!databaseUrl) {
    console.error('[release] DATABASE_URL is not set')
    process.exit(1)
  }

  try {
    await waitForDb(databaseUrl)
  } catch (err) {
    console.error('[release] Database connectivity check failed:', err?.message)
    process.exit(1)
  }

  try {
    console.log('[release] Generating Prisma client')
    execSync('npx prisma generate', { stdio: 'inherit' })
  } catch (err) {
    console.error('[release] prisma generate failed')
    console.error(err?.message || err)
    process.exit(1)
  }

  try {
    console.log('[release] Running Prisma migrations')
    execSync('npx prisma migrate deploy', { stdio: 'inherit' })
  } catch (err) {
    console.error('[release] prisma migrate deploy failed')
    console.error(err?.message || err)
    process.exit(1)
  }

  console.log('[release] Release script completed successfully')
  process.exit(0)
}

main()
