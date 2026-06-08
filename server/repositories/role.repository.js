const { prisma } = require('../prisma/client')

async function findByName(name) {
  return prisma.role.findUnique({ where: { name } })
}

async function findAll() {
  return prisma.role.findMany({ orderBy: { name: 'asc' } })
}

async function upsertByName(name, description) {
  return prisma.role.upsert({
    where: { name },
    update: { description },
    create: { name, description },
  })
}

module.exports = { findByName, findAll, upsertByName }
