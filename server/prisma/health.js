const { prisma } = require('./client')

async function checkDatabaseHealth() {
  const start = Date.now()
  try {
    await prisma.$queryRaw`SELECT 1`
    return { ok: true, latencyMs: Date.now() - start }
  } catch (err) {
    return { ok: false, error: 'database_unreachable' }
  }
}

module.exports = { checkDatabaseHealth }
