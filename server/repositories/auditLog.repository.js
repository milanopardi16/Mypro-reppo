const { prisma } = require('../prisma/client')

async function create(data) {
  return prisma.auditLog.create({ data })
}

async function findByAdmin(adminId, { limit = 50 } = {}) {
  return prisma.auditLog.findMany({
    where: { adminId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

async function findByResource(resource, { limit = 50 } = {}) {
  return prisma.auditLog.findMany({
    where: { resource },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

module.exports = { create, findByAdmin, findByResource }
