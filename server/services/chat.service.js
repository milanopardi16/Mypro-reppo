const chatRepository = require('../repositories/chat.repository')
const { pushAdminNotification } = require('./notification.service')
const { normalizeString, generateId, nowIso } = require('../utils/helpers')

async function sendMessage(payload, emitToRoom, emitToAdmins) {
  const data = payload
  let room = await chatRepository.findById(data.roomId)
  if (!room) {
    room = await chatRepository.upsertRoom({
      id: data.roomId,
      userId: data.senderType === 'user' ? data.senderId : null,
      adminId: data.senderType === 'admin' ? data.senderId : null,
      status: 'active',
    })
  }

  const msg = await chatRepository.addMessage({
    id: generateId(),
    roomId: data.roomId,
    senderId: data.senderId,
    senderType: data.senderType,
    message: normalizeString(data.message),
    attachment: data.attachment || null,
    isRead: data.senderType === 'admin',
  })

  emitToRoom(data.roomId, 'receive_message', { message: msg })

  if (data.senderType === 'user') {
    const notif = await pushAdminNotification({
      type: 'chat',
      title: 'پیام جدید چت',
      message: msg.message ? msg.message : 'یک پیام جدید دریافت شد.',
      userId: data.senderId,
    })
    emitToAdmins('new_chat_message', { roomId: data.roomId, message: msg, notification: notif })
  }

  return msg
}

module.exports = { sendMessage }
