const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')

const globalForPrisma = globalThis

function createClient() {
  return new PrismaClient({
    adapter: new PrismaPg(),
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })
}

const prisma = globalForPrisma.__prismaClient || createClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prismaClient = prisma
}

async function connectDatabase() {
  // Try a few times to connect (helps with Neon cold starts)
  const maxAttempts = 4
  let attempt = 0
  while (attempt < maxAttempts) {
    try {
      await prisma.$connect()
      return
    } catch (err) {
      attempt += 1
      const waitMs = 200 * Math.pow(2, attempt)
      // avoid leaking internal hostnames in thrown errors
      console.warn(`prisma connect attempt ${attempt} failed, retrying in ${waitMs}ms`)
      if (attempt >= maxAttempts) throw err
      await new Promise((r) => setTimeout(r, waitMs))
    }
  }
}

async function disconnectDatabase() {
  try {
    await prisma.$disconnect()
  } catch (err) {
    // ignore disconnect errors but log for diagnostics
    try {
      console.warn('prisma disconnect failed', err?.message)
    } catch (_) {}
  }
}

async function testConnection(timeoutMs = 3000) {
  const start = Date.now()
  try {
    // simple lightweight query
    await prisma.$queryRaw`SELECT 1`
    return { ok: true, latencyMs: Date.now() - start }
  } catch (err) {
    return { ok: false, error: 'database_unreachable' }
  }
}

function isConnected() {
  // Prisma doesn't expose connected state; use lightweight probe instead
  return testConnection().then((r) => r.ok).catch(() => false)
}

module.exports = { prisma, connectDatabase, disconnectDatabase, testConnection, isConnected }
