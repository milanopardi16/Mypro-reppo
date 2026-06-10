const { URL } = require('url')
const net = require('net')

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

function checkTcp(host, port, timeout = 3000) {
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

async function probeDatabase(databaseUrl) {
  if (!databaseUrl) return { ok: false, error: 'DATABASE_URL_NOT_SET' }
  const parsed = parseHostPort(databaseUrl)
  if (!parsed) return { ok: false, error: 'INVALID_DATABASE_URL' }
  const ok = await checkTcp(parsed.host, parsed.port)
  return ok ? { ok: true } : { ok: false, error: 'UNREACHABLE' }
}

module.exports = { probeDatabase }
