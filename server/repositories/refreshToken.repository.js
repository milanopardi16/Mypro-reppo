const { prisma } = require('../prisma/client')

async function create({ token, adminId, expiresAt }) {
  return prisma.refreshToken.create({
    data: { token, adminId, expiresAt },
  })
}

async function findValid(token) {
  return prisma.refreshToken.findFirst({
    where: { token, revokedAt: null, expiresAt: { gt: new Date() } },
    include: { admin: { include: { role: true } } },
  })
}

async function revoke(token) {
  return prisma.refreshToken.updateMany({
    where: { token, revokedAt: null },
    data: { revokedAt: new Date() },
  })
}

async function revokeAllForAdmin(adminId) {
  return prisma.refreshToken.updateMany({
    where: { adminId, revokedAt: null },
    data: { revokedAt: new Date() },
  })
}

async function pruneOld(adminId, keep = 50) {
  const rows = await prisma.refreshToken.findMany({
    where: { adminId, revokedAt: null },
    orderBy: { createdAt: 'desc' },
    select: { id: true },
  })
  if (rows.length <= keep) return
  const toRevoke = rows.slice(keep).map((r) => r.id)
  await prisma.refreshToken.updateMany({
    where: { id: { in: toRevoke } },
    data: { revokedAt: new Date() },
  })
}

module.exports = { create, findValid, revoke, revokeAllForAdmin, pruneOld }
