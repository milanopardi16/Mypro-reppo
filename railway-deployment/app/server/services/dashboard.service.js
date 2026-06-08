const userRepository = require('../repositories/user.repository')
const assessmentRepository = require('../repositories/assessment.repository')
const notificationRepository = require('../repositories/notification.repository')
const contactMessageRepository = require('../repositories/contactMessage.repository')
const chatRepository = require('../repositories/chat.repository')
const { buildRecentActivities } = require('../utils/helpers')

async function getSummary() {
  const today = new Date()
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const [
    registrations,
    evaluations,
    notifications,
    contactMessages,
    newUsersToday,
    pendingEvaluations,
    unreadNotifications,
    unreadContactMessages,
    unreadChatMessages,
    activeLiveChats,
    totalChatConversations,
  ] = await Promise.all([
    userRepository.findAll(),
    assessmentRepository.findAll(),
    notificationRepository.findAllRaw(),
    contactMessageRepository.findAll(),
    userRepository.countNewToday(startOfToday),
    assessmentRepository.pendingCount(),
    notificationRepository.unreadCount(),
    contactMessageRepository.unreadCount(),
    chatRepository.unreadUserMessageCount(),
    chatRepository.activeRoomCount(),
    chatRepository.totalRoomCount(),
  ])

  const latestUsers = registrations.slice(0, 8)
  const recentActivities = buildRecentActivities({
    registrations,
    evaluations,
    contactMessages,
    notifications,
  })

  return {
    totals: {
      totalUsers: registrations.length,
      newUsersToday,
      activeUsers: registrations.length,
      totalEvaluationForms: evaluations.length,
      pendingEvaluations,
      totalChatConversations,
      activeLiveChats,
      unreadMessages: unreadChatMessages + unreadContactMessages,
      unreadNotifications,
      unreadContactMessages,
    },
    latestUsers,
    recentActivities,
  }
}

module.exports = { getSummary }
