const userRepository = require('../repositories/user.repository')
const { normalizeString } = require('../utils/helpers')
const { pushAdminNotification } = require('./notification.service')

function normalizeRegistrationBody(body) {
  const raw = body && typeof body === 'object' ? body : {}
  const nested = raw.data && typeof raw.data === 'object' ? raw.data : raw
  return {
    fullName: normalizeString(nested.fullName || nested.name) || null,
    email: normalizeString(nested.email) || null,
    phone: normalizeString(nested.phone) || null,
    companyName: normalizeString(nested.companyName) || null,
    position: normalizeString(nested.position) || null,
    industry: normalizeString(nested.industry) || null,
    website: normalizeString(nested.website) || null,
    message: normalizeString(nested.message) || null,
  }
}

async function createRegistration(body, emitToAdmins) {
  const fields = normalizeRegistrationBody(body)
  const entry = await userRepository.create(fields)
  const notif = await pushAdminNotification({
    type: 'registration',
    title: 'ثبت‌نام کاربر جدید',
    message: entry?.email
      ? `کاربر جدید با موفقیت ثبت‌نام کرد: ${entry.email}`
      : entry?.fullName
        ? `کاربر جدید با موفقیت ثبت‌نام کرد: ${entry.fullName}`
        : 'کاربر جدید با موفقیت ثبت‌نام کرد.',
    userId: entry?.id ? String(entry.id) : null,
  })
  if (emitToAdmins) emitToAdmins('user_registered', { registration: entry, notification: notif })
  return { entry, notif }
}

module.exports = { createRegistration, normalizeRegistrationBody }
