const { Server: SocketIOServer } = require('socket.io')
const { z } = require('zod')
const { safeSocketAdminAuth } = require('./middlewares/auth.middleware')
const chatService = require('./services/chat.service')
const { normalizeString } = require('./utils/helpers')
const { logger } = require('./config/logger')
const { resolveCorsOptions } = require('./config/cors')

function attachSocket(httpServer, app) {
  const corsOptions = resolveCorsOptions()
  const io = new SocketIOServer(httpServer, {
    cors: corsOptions,
    pingTimeout: 60000,
    pingInterval: 25000,
  })

  function emitToAdmins(event, payload) {
    io.to('admins').emit(event, payload)
  }

  function emitToRoom(roomId, event, payload) {
    io.to(`room:${roomId}`).emit(event, payload)
  }

  app.locals.emitToAdmins = emitToAdmins
  app.locals.emitToRoom = emitToRoom

  io.on('connection', (socket) => {
    const role = normalizeString(socket.handshake.auth?.role || '')
    const userId = normalizeString(socket.handshake.auth?.userId || '')
    const joinedRooms = new Set()

    logger.info('socket_connected', { socketId: socket.id, role: role || 'anonymous' })

    if (role === 'admin') {
      if (!safeSocketAdminAuth(socket)) {
        logger.warn('socket_admin_auth_failed', { socketId: socket.id })
        socket.disconnect(true)
        return
      }
      socket.join('admins')
      socket.emit('admin_connected', { ok: true })
    } else if (role === 'user' && userId) {
      socket.join(`user:${userId}`)
      socket.emit('user_connected', { ok: true, userId })
    }

    socket.on('join_room', (payload = {}) => {
      const roomId = normalizeString(payload.roomId)
      if (!roomId) return
      const key = `room:${roomId}`
      socket.join(key)
      joinedRooms.add(key)
    })

    socket.on('leave_room', (payload = {}) => {
      const roomId = normalizeString(payload.roomId)
      if (!roomId) return
      const key = `room:${roomId}`
      socket.leave(key)
      joinedRooms.delete(key)
    })

    socket.on('typing_start', (payload = {}) => {
      const roomId = normalizeString(payload.roomId)
      if (!roomId) return
      emitToRoom(roomId, 'typing_start', { roomId, senderType: role === 'admin' ? 'admin' : 'user' })
    })

    socket.on('typing_stop', (payload = {}) => {
      const roomId = normalizeString(payload.roomId)
      if (!roomId) return
      emitToRoom(roomId, 'typing_stop', { roomId, senderType: role === 'admin' ? 'admin' : 'user' })
    })

    socket.on('send_message', async (payload = {}) => {
      const schema = z.object({
        roomId: z.string().min(1),
        senderId: z.string().min(1),
        senderType: z.enum(['user', 'admin']),
        message: z.string().optional().default(''),
        attachment: z.any().optional().nullable(),
      })
      const parsed = schema.safeParse(payload)
      if (!parsed.success) return

      try {
        await chatService.sendMessage(parsed.data, emitToRoom, emitToAdmins)
      } catch (err) {
        logger.warn('socket_send_message_failed', {
          socketId: socket.id,
          roomId: parsed.data.roomId,
          err: err?.message,
        })
      }
    })

    socket.on('disconnect', (reason) => {
      for (const key of joinedRooms) {
        socket.leave(key)
      }
      joinedRooms.clear()
      logger.info('socket_disconnected', { socketId: socket.id, reason })
    })
  })

  return io
}

module.exports = { attachSocket }
