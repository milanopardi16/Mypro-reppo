const notificationRepository = require('../repositories/notification.repository')
const { sendPushToAdmins } = require('../utils/firebase')

async function pushAdminNotification({ title, message, type, userId }) {
  const n = await notificationRepository.create({ title, message, type, userId })
  sendPushToAdmins({ title: n.title, body: n.message, data: { type: n.type, notificationId: n.id } }).catch(() => {})
  return n
}

module.exports = { pushAdminNotification }
