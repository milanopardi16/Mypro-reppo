const { prisma } = require('../prisma/client')
const { toContactMessageDto } = require('../utils/helpers')

async function findAll() {
  const rows = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } })
  return rows.map(toContactMessageDto)
}

async function create(data) {
  const row = await prisma.contactMessage.create({ data })
  return toContactMessageDto(row)
}

async function markRead(id) {
  const row = await prisma.contactMessage.update({ where: { id }, data: { read: true } })
  return toContactMessageDto(row)
}

async function unreadCount() {
  return prisma.contactMessage.count({ where: { read: false } })
}

module.exports = { findAll, create, markRead, unreadCount }
