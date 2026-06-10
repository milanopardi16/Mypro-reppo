const { probeDatabase } = require('../utils/db-probe')

async function checkDatabaseHealth() {
  const start = Date.now()
  try {
    const res = await probeDatabase(process.env.DATABASE_URL)
    if (res.ok) return { ok: true, latencyMs: Date.now() - start }
    return { ok: false, error: res.error || 'database_unreachable' }
  } catch (err) {
    return { ok: false, error: 'database_unreachable' }
  }
}

module.exports = { checkDatabaseHealth }
