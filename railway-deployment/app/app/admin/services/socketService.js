import { getAdminToken } from '../../utils/adminAuth'

/**
 * SSE-based realtime shim — provides fallback when Socket.IO is unavailable.
 * Preserves the same on/emit/off/disconnect API used by chat & admin panels.
 */

function createSseSocket({ channel, roomId, token, role, userId }) {
  const handlers = new Map()
  let connected = false
  let es = null
  let since = 0

  const socket = {
    connected: false,
    on(event, handler) {
      if (!handlers.has(event)) handlers.set(event, new Set())
      handlers.get(event).add(handler)
      return socket
    },
    off(event, handler) {
      handlers.get(event)?.delete(handler)
      return socket
    },
    emit(event, payload = {}) {
      if (event === 'join_room' || event === 'leave_room') return socket
      if (event === 'send_message') {
        fetch(`/api/chat/rooms/${encodeURIComponent(payload.roomId)}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
          credentials: 'same-origin',
        }).catch(() => {})
        return socket
      }
      if (event === 'typing_start' || event === 'typing_stop') {
        fetch(`/api/chat/rooms/${encodeURIComponent(payload.roomId)}/typing`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            active: event === 'typing_start',
            senderType: role === 'admin' ? 'admin' : 'user',
          }),
          credentials: 'same-origin',
        }).catch(() => {})
      }
      return socket
    },
    disconnect() {
      connected = false
      socket.connected = false
      es?.close()
      es = null
    },
  }

  function fire(event, payload) {
    handlers.get(event)?.forEach((fn) => {
      try {
        fn(payload)
      } catch {
        // ignore
      }
    })
  }

  function connect() {
    const params = new URLSearchParams({ channel, since: String(since) })
    if (roomId) params.set('roomId', roomId)
    if (token) params.set('accessToken', token)
    const url = `/api/sse.php?${params.toString()}`
    es = new EventSource(url)

    es.onopen = () => {
      connected = true
      socket.connected = true
      fire('connect')
      if (role === 'admin') fire('admin_connected', { ok: true })
      if (role === 'user') fire('user_connected', { ok: true, userId })
    }

    es.onerror = () => {
      if (connected) fire('disconnect')
      connected = false
      socket.connected = false
    }

    es.addEventListener('reconnect', (e) => {
      try {
        const data = JSON.parse(e.data || '{}')
        since = data.since || since
      } catch {
        // ignore
      }
      es?.close()
      setTimeout(connect, 500)
    })

    ;[
      'receive_message',
      'new_chat_message',
      'typing_start',
      'typing_stop',
      'message_read',
      'user_registered',
      'evaluation_submitted',
      'system_notification',
    ].forEach((eventName) => {
      es.addEventListener(eventName, (e) => {
        if (e.lastEventId) since = Math.max(since, parseInt(e.lastEventId, 10) || 0)
        try {
          fire(eventName, JSON.parse(e.data || '{}'))
        } catch {
          fire(eventName, {})
        }
      })
    })
  }

  if (typeof EventSource !== 'undefined') {
    connect()
  }

  return socket
}

let adminSocket = null
let adminSocketToken = ''

export function getAdminSocket() {
  if (typeof window === 'undefined') return null

  const token = getAdminToken()
  if (!token) return null

  if (adminSocket && adminSocketToken !== token) {
    adminSocket.disconnect()
    adminSocket = null
  }

  if (!adminSocket) {
    adminSocketToken = token
    adminSocket = createSseSocket({ channel: 'admins', token, role: 'admin' })
  }

  return adminSocket
}

export function disconnectAdminSocket() {
  if (adminSocket) {
    adminSocket.disconnect()
    adminSocket = null
  }
  adminSocketToken = ''
}

let userSocket = null
let userSocketUserId = ''

export function getUserSocket(userId) {
  if (typeof window === 'undefined' || !userId) return null

  if (userSocket && userSocketUserId !== userId) {
    userSocket.disconnect()
    userSocket = null
  }

  if (!userSocket) {
    userSocketUserId = userId
    const roomId = `room_${userId}`
    userSocket = createSseSocket({ channel: 'room', roomId, role: 'user', userId })
  }

  return userSocket
}

export function disconnectUserSocket() {
  if (userSocket) {
    userSocket.disconnect()
    userSocket = null
  }
  userSocketUserId = ''
}
