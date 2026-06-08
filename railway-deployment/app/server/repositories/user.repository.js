const { prisma } = require('../prisma/client')
const { toRegistrationDto } = require('../utils/helpers')

async function findAll() {
  const rows = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
  return rows.map(toRegistrationDto)
}

async function findById(id) {
  const row = await prisma.user.findUnique({ where: { id: String(id) } })
  return row ? toRegistrationDto(row) : null
}

async function findByAuthEmail(authEmail) {
  return prisma.user.findUnique({ where: { authEmail } })
}

async function ensureGuestUser(id, roleId) {
  if (!id) return null
  const userId = String(id)
  const row = await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      fullName: 'Guest',
      roleId: roleId || null,
    },
  })
  return toRegistrationDto(row)
}

async function create(fields) {
  const id = String(Date.now())
  const row = await prisma.user.create({
    data: {
      id,
      fullName: fields.fullName,
      email: fields.email,
      phone: fields.phone,
      companyName: fields.companyName,
      position: fields.position,
      industry: fields.industry,
      website: fields.website,
      message: fields.message,
    },
  })
  return toRegistrationDto(row)
}

async function countNewToday(startOfToday) {
  return prisma.user.count({
    where: { createdAt: { gte: startOfToday } },
  })
}

module.exports = { findAll, findById, findByAuthEmail, ensureGuestUser, create, countNewToday }
