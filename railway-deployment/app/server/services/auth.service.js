const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const adminRepository = require('../repositories/admin.repository')
const refreshTokenRepository = require('../repositories/refreshToken.repository')
const { normalizeString } = require('../utils/helpers')
const { logAudit } = require('../middlewares/audit.middleware')

const ACCESS_TTL = '15m'
const REFRESH_TTL_DAYS = 7

function getSecrets() {
  const accessSecret = String(process.env.JWT_ACCESS_SECRET || '').trim()
  const refreshSecret = String(process.env.JWT_REFRESH_SECRET || '').trim()
  if (!accessSecret || !refreshSecret) {
    throw new Error('JWT secrets missing')
  }
  return { accessSecret, refreshSecret }
}

function issueAccessToken(admin) {
  const { accessSecret } = getSecrets()
  const now = Math.floor(Date.now() / 1000)
  return jwt.sign(
    {
      role: 'admin',
      name: admin.name,
      email: admin.email,
      iss: process.env.JWT_ISSUER || 'capital-network-api',
      aud: process.env.JWT_AUDIENCE || 'capital-network-web',
      iat: now,
      nbf: now,
    },
    accessSecret,
    { subject: admin.id, expiresIn: ACCESS_TTL }
  )
}

function issueRefreshToken(admin) {
  const { refreshSecret } = getSecrets()
  const now = Math.floor(Date.now() / 1000)
  return jwt.sign(
    {
      role: 'admin',
      name: admin.name,
      type: 'refresh',
      email: admin.email,
      iss: process.env.JWT_ISSUER || 'capital-network-api',
      aud: process.env.JWT_AUDIENCE || 'capital-network-web',
      iat: now,
      nbf: now,
    },
    refreshSecret,
    { subject: admin.id, expiresIn: `${REFRESH_TTL_DAYS}d` }
  )
}

async function verifyAccessToken(token) {
  const { accessSecret } = getSecrets()
  const payload = jwt.verify(token, accessSecret)
  if (!payload || (payload.role !== 'admin' && payload.role !== 'ADMIN')) {
    throw new Error('Invalid token')
  }
  const admin = await adminRepository.findById(payload.sub)
  if (!admin || !admin.isActive) throw new Error('Admin inactive')
  return admin
}

async function resolveAdminByLogin(username) {
  const login = normalizeString(username)
  let admin = await adminRepository.findByEmail(login)
  if (admin) return admin

  const envEmail = normalizeString(process.env.ADMIN_EMAIL || '')
  const envUser = normalizeString(process.env.ADMIN_USERNAME || 'admin')
  if (login === envUser && envEmail) {
    admin = await adminRepository.findByEmail(envEmail)
    if (admin) return admin
  }
  return null
}

async function login({ username, password, email }, req) {
  const loginId = normalizeString(email || username)
  const pass = String(password || '')
  if (!loginId || !pass) throw new Error('Invalid credentials')

  const admin = await resolveAdminByLogin(loginId)
  if (!admin || !admin.isActive) throw new Error('Invalid credentials')

  const valid = await bcrypt.compare(pass, admin.passwordHash)
  if (!valid) throw new Error('Invalid credentials')

  const accessToken = issueAccessToken(admin)
  const refreshToken = issueRefreshToken(admin)
  const expiresAt = new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000)

  try {
    await refreshTokenRepository.create({ token: refreshToken, adminId: admin.id, expiresAt })
    await refreshTokenRepository.pruneOld(admin.id, 50)
    await logAudit({ adminId: admin.id, action: 'LOGIN', resource: 'auth', req })
  } catch (err) {
    const { AppError } = require('../utils/errors')
    throw new AppError('Authentication service temporarily unavailable.', 503, 'AUTH_DB_ERROR')
  }

  return { accessToken, refreshToken, admin }
}

async function refresh(refreshToken, req) {
  const normalized = normalizeString(refreshToken)
  if (!normalized) throw new Error('refreshToken required')

  const stored = await refreshTokenRepository.findValid(normalized)
  if (!stored) throw new Error('Invalid refresh token')

  const { refreshSecret } = getSecrets()
  const payload = jwt.verify(normalized, refreshSecret)
  if (!payload || payload.role !== 'admin' || payload.type !== 'refresh') {
    throw new Error('Invalid refresh token')
  }

  await refreshTokenRepository.revoke(normalized)

  const admin = stored.admin
  const accessToken = issueAccessToken(admin)
  const newRefreshToken = issueRefreshToken(admin)
  const expiresAt = new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000)
  await refreshTokenRepository.create({ token: newRefreshToken, adminId: admin.id, expiresAt })
  await logAudit({ adminId: admin.id, action: 'TOKEN_REFRESH', resource: 'auth', req })

  return { accessToken, refreshToken: newRefreshToken }
}

async function logout(refreshToken, req) {
  const normalized = normalizeString(refreshToken)
  if (normalized) await refreshTokenRepository.revoke(normalized)
  if (req?.admin?.id) {
    await logAudit({ adminId: req.admin.id, action: 'LOGOUT', resource: 'auth', req })
  }
}

module.exports = {
  login,
  refresh,
  logout,
  verifyAccessToken,
  issueAccessToken,
}
