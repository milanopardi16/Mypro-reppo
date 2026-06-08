/**
 * @typedef {Object} AdminNotification
 * @property {string} id
 * @property {string} title
 * @property {string} message
 * @property {string} type
 * @property {string|null} userId
 * @property {boolean} isRead
 * @property {string} createdAt
 */

/**
 * @typedef {Object} ChatMessage
 * @property {string} id
 * @property {string} roomId
 * @property {string} senderId
 * @property {'user'|'admin'} senderType
 * @property {string} message
 * @property {{ url: string, fileName?: string, type?: string }|null} attachment
 * @property {boolean} isRead
 * @property {string} createdAt
 */

/**
 * @typedef {Object} ChatRoom
 * @property {string} id
 * @property {string|null} userId
 * @property {string|null} adminId
 * @property {'active'|'closed'} status
 * @property {string} createdAt
 * @property {number} [unreadCount]
 * @property {string|null} [lastMessageAt]
 */

/**
 * @typedef {Object} DashboardTotals
 * @property {number} totalUsers
 * @property {number} newUsersToday
 * @property {number} totalEvaluationForms
 * @property {number} activeLiveChats
 * @property {number} totalChatConversations
 * @property {number} unreadMessages
 * @property {number} unreadNotifications
 */

export {}
