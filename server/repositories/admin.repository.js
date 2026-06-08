const { prisma } = require('../prisma/client')
const { AppError } = require('../utils/errors')

async function findByEmail(email) {
  try {
    return await prisma.admin.findUnique({ where: { email }, include: { role: true } })
  } catch (err) {
    throw new AppError('Authentication service temporarily unavailable.', 503, 'DB_ERROR')
  }
}

async function findById(id) {
  try {
    return await prisma.admin.findUnique({ where: { id }, include: { role: true } })
  } catch (err) {
    throw new AppError('Authentication service temporarily unavailable.', 503, 'DB_ERROR')
  }
}

async function create(data) {
  try {
    return await prisma.admin.create({ data, include: { role: true } })
  } catch (err) {
    throw new AppError('Authentication service temporarily unavailable.', 503, 'DB_ERROR')
  }
}

async function upsertByEmail(email, data) {
  try {
    return await prisma.admin.upsert({
      where: { email },
      update: data,
      create: { email, ...data },
      include: { role: true },
    })
  } catch (err) {
    throw new AppError('Authentication service temporarily unavailable.', 503, 'DB_ERROR')
  }
}

module.exports = { findByEmail, findById, create, upsertByEmail }
