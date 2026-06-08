const jwt = require('jsonwebtoken')
const { normalizeString } = require('../utils/helpers')
const authService = require('../services/auth.service')
const { logger } = require('../config/logger')

function extractBearerToken(req) {
  const header = normalizeString(req.headers.authorization)
  if (header.startsWith('Bearer ')) return header.slice(7).trim()
  return normalizeString(req.headers['x-admin-token'] || req.cookies?.accessToken)
}

const ADMIN_ROLES = new Set(['Admin', 'ADMIN', 'Manager'])

async function requireAdmin(req, res, next) {
  const token = extractBearerToken(req)
  if (!token) {
    return res.status(401).json({ error: 'دسترسی غیرمجاز — توکن احراز هویت لازم است' })
  }

  try {
    const admin = await authService.verifyAccessToken(token)
    req.admin = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role?.name || 'Admin',
      auth: 'jwt',
    }
    if (!ADMIN_ROLES.has(req.admin.role)) {
      return res.status(403).json({ error: 'دسترسی کافی ندارید' })
    }
    return next()
  } catch {
    return res.status(401).json({ error: 'توکن نامعتبر یا منقضی شده است' })
  }
}

function optionalAdmin(req, _res, next) {
  const token = extractBearerToken(req)
  if (!token) return next()

  authService
    .verifyAccessToken(token)
    .then((admin) => {
      req.admin = {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role?.name || 'ADMIN',
        auth: 'jwt',
      }
      next()
    })
    .catch(() => next())
}

function safeSocketAdminAuth(socket) {
  const isProduction = process.env.NODE_ENV === 'production'
  const configuredToken = normalizeString(process.env.ADMIN_TOKEN || '')
  const token = normalizeString(socket.handshake.auth?.adminToken || socket.handshake.headers?.['x-admin-token'])

  if (configuredToken && token && token === configuredToken) {
    if (isProduction) {
      logger.warn('socket_admin_token_rejected_in_production', { socketId: socket.id })
      return false
    }
    return true
  }

  const bearer = normalizeString(socket.handshake.auth?.accessToken || '')
  const secret = String(process.env.JWT_ACCESS_SECRET || '').trim()
  if (!bearer || !secret) return false

  try {
    const payload = jwt.verify(bearer, secret)
    return payload?.role === 'admin' || payload?.role === 'ADMIN'
  } catch {
    return false
  }
}

module.exports = { requireAdmin, optionalAdmin, safeSocketAdminAuth, extractBearerToken }
