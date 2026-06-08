const { getEnv } = require('./env')

function parseCorsOrigins(raw) {
  if (!raw || !String(raw).trim()) return []
  return String(raw)
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)
}

function resolveCorsOptions() {
  const env = getEnv()
  const origins = parseCorsOrigins(env.CORS_ORIGINS)
  const siteUrl = env.NEXT_PUBLIC_SITE_URL ? [env.NEXT_PUBLIC_SITE_URL] : []
  const allowlist = [...new Set([...origins, ...siteUrl])]

  // Use allowlist in all environments for security
  // In development, fallback to localhost if no allowlist configured
  if (allowlist.length > 0) {
    return {
      origin(origin, callback) {
        if (!origin || allowlist.includes(origin)) {
          callback(null, true)
        } else {
          callback(new Error('CORS origin not allowed'))
        }
      },
      credentials: true,
    }
  }

  // Fallback for development: only allow localhost
  const isDev = env.NODE_ENV === 'development'
  if (isDev) {
    return {
      origin(origin, callback) {
        const allowedDevOrigins = [
          'http://localhost:5173',
          'http://localhost:3000',
          'http://127.0.0.1:5173',
          'http://127.0.0.1:3000',
        ]
        if (!origin || allowedDevOrigins.includes(origin)) {
          callback(null, true)
        } else {
          callback(new Error('CORS origin not allowed in development'))
        }
      },
      credentials: true,
    }
  }

  // Production without allowlist: deny all
  return {
    origin: false,
    credentials: false,
  }
}

module.exports = { parseCorsOrigins, resolveCorsOptions }
