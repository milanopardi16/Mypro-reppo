const { prisma } = require('../prisma/client')
const { normalizeString } = require('../utils/helpers')

async function upsertToken(token, platform, { adminId, userId } = {}) {
  const normalized = normalizeString(token)
  await prisma.pushToken.upsert({
    where: { token: normalized },
    update: {
      platform: platform || null,
      adminId: adminId || null,
      userId: userId || null,
    },
    create: {
      token: normalized,
      platform: platform || null,
      adminId: adminId || null,
      userId: userId || null,
    },
  })
}

async function getAllTokens({ adminId } = {}) {
  const where = adminId
    ? { adminId }
    : {
        OR: [{ adminId: { not: null } }, { adminId: null, userId: null }],
      }
  const rows = await prisma.pushToken.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 200,
  })
  return rows.map((r) => r.token).filter(Boolean)
}

async function getTokensByUser(userId) {
  const rows = await prisma.pushToken.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
  return rows.map((r) => r.token)
}

module.exports = { upsertToken, getAllTokens, getTokensByUser }
