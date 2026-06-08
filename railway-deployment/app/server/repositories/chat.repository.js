const { prisma } = require('../prisma/client')
const { toChatRoomDto, toChatMessageDto } = require('../utils/helpers')
const userRepository = require('./user.repository')
const roleRepository = require('./role.repository')

let cachedUserRoleId = null

async function getUserRoleId() {
  if (cachedUserRoleId) return cachedUserRoleId
  const role = await roleRepository.findByName('User')
  cachedUserRoleId = role?.id || null
  return cachedUserRoleId
}

async function findAll() {
  const rows = await prisma.chatRoom.findMany({ orderBy: { createdAt: 'desc' } })
  return rows.map(toChatRoomDto)
}

async function findById(id) {
  const row = await prisma.chatRoom.findUnique({ where: { id } })
  return row ? toChatRoomDto(row) : null
}

async function upsertRoom(data) {
  const userRoleId = await getUserRoleId()
  if (data.userId) await userRepository.ensureGuestUser(data.userId, userRoleId)

  const row = await prisma.chatRoom.upsert({
    where: { id: data.id },
    update: {
      userId: data.userId ?? undefined,
      adminId: data.adminId ?? undefined,
      status: data.status ?? undefined,
    },
    create: {
      id: data.id,
      userId: data.userId || null,
      adminId: data.adminId || null,
      status: data.status || 'active',
    },
  })
  return toChatRoomDto(row)
}

async function getMessagesByRoom(roomId) {
  const rows = await prisma.chatMessage.findMany({
    where: { roomId },
    orderBy: { createdAt: 'asc' },
  })
  return rows.map(toChatMessageDto)
}

async function addMessage(data) {
  const row = await prisma.chatMessage.create({ data })
  return toChatMessageDto(row)
}

async function markRoomRead(roomId) {
  await prisma.chatMessage.updateMany({
    where: { roomId, senderType: { not: 'admin' }, isRead: false },
    data: { isRead: true },
  })
}

async function getEnrichedRooms() {
  const rooms = await findAll()
  const enriched = []
  for (const room of rooms) {
    const messages = await getMessagesByRoom(room.id)
    const unreadCount = messages.filter((m) => m.senderType === 'user' && !m.isRead).length
    const lastMsg = messages[messages.length - 1]
    enriched.push({
      ...room,
      unreadCount,
      lastMessageAt: lastMsg?.createdAt || room.createdAt || null,
    })
  }
  enriched.sort((a, b) => Date.parse(b.lastMessageAt || '') - Date.parse(a.lastMessageAt || ''))
  return enriched
}

async function unreadUserMessageCount() {
  return prisma.chatMessage.count({
    where: { senderType: 'user', isRead: false },
  })
}

async function activeRoomCount() {
  return prisma.chatRoom.count({ where: { status: 'active' } })
}

async function totalRoomCount() {
  return prisma.chatRoom.count()
}

module.exports = {
  findAll,
  findById,
  upsertRoom,
  getMessagesByRoom,
  addMessage,
  markRoomRead,
  getEnrichedRooms,
  unreadUserMessageCount,
  activeRoomCount,
  totalRoomCount,
}
