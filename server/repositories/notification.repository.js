const { prisma } = require('../prisma/client')
const { toNotificationDto } = require('../utils/helpers')

async function resolveUserLink(userId) {
  if (!userId) return { userId: null, actorRef: null }
  const ref = String(userId)
  const user = await prisma.user.findUnique({ where: { id: ref } })
  if (user) return { userId: user.id, actorRef: null }
  return { userId: null, actorRef: ref }
}

async function findAll({ sort = 'desc', page = 1, limit = 20 } = {}) {
  const order = sort === 'asc' ? 'asc' : 'desc'
  const skip = (page - 1) * limit
  const [rows, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({ orderBy: { createdAt: order }, skip, take: limit }),
    prisma.notification.count(),
    prisma.notification.count({ where: { isRead: false } }),
  ])
  return {
    notifications: rows.map(toNotificationDto),
    total,
    page,
    limit,
    unreadCount,
  }
}

async function findAllRaw() {
  const rows = await prisma.notification.findMany({ orderBy: { createdAt: 'desc' } })
  return rows.map(toNotificationDto)
}

async function create({ title, message, type, userId }) {
  const link = await resolveUserLink(userId)
  const row = await prisma.notification.create({
    data: {
      title,
      message,
      type: type || 'system',
      userId: link.userId,
      actorRef: link.actorRef,
    },
  })
  return toNotificationDto(row)
}

async function markRead(id) {
  const row = await prisma.notification.update({ where: { id }, data: { isRead: true } })
  return toNotificationDto(row)
}

async function markAllRead() {
  await prisma.notification.updateMany({ where: { isRead: false }, data: { isRead: true } })
}

async function unreadCount() {
  return prisma.notification.count({ where: { isRead: false } })
}

module.exports = { findAll, findAllRaw, create, markRead, markAllRead, unreadCount, resolveUserLink }
