#!/usr/bin/env node
const { URL } = require('url')
const net = require('net')

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

async function main() {
  const databaseUrl = process.env.DATABASE_URL
  console.log('[wait-for-db] Starting database connectivity checks')
  if (!databaseUrl) {
    console.error('[wait-for-db] DATABASE_URL is not set')
    process.exit(1)
  }
  const parsed = parseHostPort(databaseUrl)
  if (!parsed || !parsed.host || !parsed.port) {
    console.error('[wait-for-db] Unable to parse host/port from DATABASE_URL')
    process.exit(1)
  }
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(`[wait-for-db] Attempt ${attempt}/${MAX_RETRIES} — connecting to ${parsed.host}:${parsed.port}`)
    try {
      const ok = await checkTcp(parsed.host, parsed.port)
      if (ok) {
        console.log('[wait-for-db] Connected to database')
        process.exit(0)
      }
      console.warn('[wait-for-db] Connection attempt failed')
    } catch (err) {
      console.warn('[wait-for-db] Error during check', err?.message)
    }
    if (attempt < MAX_RETRIES) {
      console.log(`[wait-for-db] Waiting ${DELAY_MS}ms before retry`)
      await wait(DELAY_MS)
    }
  }
  console.error('[wait-for-db] All attempts failed — database unreachable')
  process.exit(1)
}

main()
