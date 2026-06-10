const pkg = require('../../package.json')
const { prisma } = require('../prisma/client')
const authService = require('../services/auth.service')
const dashboardService = require('../services/dashboard.service')
const blogRepository = require('../repositories/blog.repository')
const userRepository = require('../repositories/user.repository')
const contactMessageRepository = require('../repositories/contactMessage.repository')
const notificationRepository = require('../repositories/notification.repository')
const assessmentRepository = require('../repositories/assessment.repository')
const founderRepository = require('../repositories/founder.repository')
const siteContentRepository = require('../repositories/siteContent.repository')
const chatRepository = require('../repositories/chat.repository')
const pushTokenRepository = require('../repositories/pushToken.repository')
const registrationService = require('../services/registration.service')
const founderService = require('../services/founder.service')
const { sendPushToAdmins } = require('../utils/firebase')
const { saveUpload } = require('../utils/upload')
const { setNoStore, normalizeString } = require('../utils/helpers')
const ExcelJS = require('exceljs')

function getEmitters(req) {
  return {
    emitToAdmins: req.app.locals.emitToAdmins || (() => {}),
    emitToRoom: req.app.locals.emitToRoom || (() => {}),
  }
}

async function health(_req, res) {
  res.status(200).json({
    ok: true,
    service: 'api-server',
    status: 'healthy',
    uptimeSeconds: Math.floor(process.uptime()),
    memoryMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
    timestamp: new Date().toISOString(),
  })
}

async function version(_req, res) {
  res.status(200).json({
    ok: true,
    name: pkg.name,
    version: pkg.version,
    node: process.version,
    env: process.env.NODE_ENV || 'development',
  })
}

async function ready(_req, res) {
  try {
    const { probeDatabase } = require('../utils/db-probe')
    const result = await probeDatabase(process.env.DATABASE_URL)
    if (result.ok) {
      res.status(200).json({ ok: true, status: 'ready', checks: { database: 'up' }, timestamp: new Date().toISOString() })
    } else {
      res.status(503).json({ ok: false, status: 'not_ready', checks: { database: 'down' }, error: result.error || 'database unavailable', timestamp: new Date().toISOString() })
    }
  } catch (err) {
    res.status(503).json({ ok: false, status: 'not_ready', checks: { database: 'down' }, error: 'database unavailable', timestamp: new Date().toISOString() })
  }
}

async function adminHealth(_req, res) {
  res.json({ ok: true })
}

async function dbHealth(_req, res) {
  try {
    const { probeDatabase } = require('../utils/db-probe')
    const result = await probeDatabase(process.env.DATABASE_URL)
    if (result.ok) return res.json({ ok: true })
    return res.status(503).json({ ok: false, error: 'database_unreachable' })
  } catch (err) {
    return res.status(503).json({ ok: false, error: 'database_unreachable' })
  }
}

async function adminMe(req, res) {
  res.json({ ok: true, admin: req.admin })
}

async function dashboardSummary(_req, res) {
  setNoStore(res)
  const summary = await dashboardService.getSummary()
  res.json({ ok: true, ...summary })
}

async function login(req, res) {
  try {
    const { username, password, email } = req.validatedBody || req.body
    const result = await authService.login({ username, password, email }, req)
    res.json({ ok: true, accessToken: result.accessToken, refreshToken: result.refreshToken })
  } catch (err) {
    // Do not expose internal errors (DB hostnames, stack traces) to the client.
    if (err.message === 'Invalid credentials') {
      return res.status(401).json({ error: 'نام کاربری یا رمز عبور اشتباه است' })
    }

    // Log error is handled by error middleware; return generic user-facing message in Persian.
    res.status(503).json({ error: 'در حال حاضر سرویس ورود در دسترس نیست. لطفاً چند دقیقه دیگر مجدداً تلاش کنید.' })
  }
}

async function refresh(req, res) {
  try {
    const refreshToken = normalizeString(req.body?.refreshToken || req.cookies?.refreshToken)
    const result = await authService.refresh(refreshToken, req)
    res.json({ ok: true, accessToken: result.accessToken, refreshToken: result.refreshToken })
  } catch {
    res.status(401).json({ error: 'refreshToken نامعتبر است' })
  }
}

async function logout(req, res) {
  const refreshToken = normalizeString(req.body?.refreshToken || req.cookies?.refreshToken)
  await authService.logout(refreshToken, req)
  res.json({ ok: true })
}

async function savePushToken(req, res) {
  const { token, platform } = req.validatedBody || req.body
  await pushTokenRepository.upsertToken(token, platform, { adminId: req.admin?.id })
  res.json({ ok: true })
}

async function testPush(req, res) {
  const title = normalizeString(req.body?.title) || 'تست اعلان'
  const body = normalizeString(req.body?.body) || 'این یک پیام تست است.'
  await sendPushToAdmins({ title, body, data: { type: 'system' } })
  res.json({ ok: true })
}

async function listBlogsPublic(_req, res) {
  const posts = await blogRepository.findPublished()
  res.json(posts)
}

async function listBlogsAdmin(_req, res) {
  const posts = await blogRepository.findAll()
  res.json({ posts })
}

async function createBlog(req, res) {
  const body = req.validatedBody || req.body || {}
  const payload = body.post || body
  const post = await blogRepository.create(payload)
  res.json({ ok: true, post })
}

async function updateBlog(req, res) {
  const id = normalizeString(req.params.id)
  const body = req.validatedBody || req.body || {}
  const payload = body.post || body
  const post = await blogRepository.update(id, payload)
  if (!post) return res.status(404).json({ error: 'پست یافت نشد' })
  res.json({ ok: true, post })
}

async function deleteBlog(req, res) {
  const id = normalizeString(req.params.id)
  try {
    await blogRepository.remove(id)
    res.json({ ok: true })
  } catch {
    res.status(404).json({ error: 'پست یافت نشد' })
  }
}

async function getSiteContentPublic(_req, res) {
  const content = await siteContentRepository.getContent()
  res.json({ content })
}

async function getSiteContentLegacy(_req, res) {
  const content = await siteContentRepository.getContent()
  res.json(content)
}

async function getSiteContentAdmin(_req, res) {
  const content = await siteContentRepository.getContent()
  res.json({ ok: true, content })
}

async function putSiteContentAdmin(req, res) {
  const content = await siteContentRepository.setContent(req.body || {})
  res.json({ ok: true, content })
}

async function updateSiteContentSection(req, res) {
  const { section, data } = req.body || {}
  if (!section) return res.status(400).json({ error: 'بخش مشخص نشده است' })
  const content = await siteContentRepository.updateSection(section, data)
  res.json({ ok: true, content })
}

async function updateSiteContentPublic(req, res) {
  const { section, data } = req.body || {}
  if (!section) return res.status(400).json({ error: 'بخش مشخص نشده است' })
  const content = await siteContentRepository.updateSection(section, data)
  res.json({ success: true, message: 'محتوا با موفقیت بروزرسانی شد', content })
}

async function listRegistrations(_req, res) {
  const registrations = await userRepository.findAll()
  res.json({ ok: true, registrations })
}

async function createRegistration(req, res) {
  const { emitToAdmins } = getEmitters(req)
  const { entry } = await registrationService.createRegistration(req.body, emitToAdmins)
  res.json({ ok: true, registration: entry })
}

async function listContactMessages(_req, res) {
  const messages = await contactMessageRepository.findAll()
  res.json({ ok: true, messages })
}

async function markContactRead(req, res) {
  const id = normalizeString(req.params.id)
  try {
    const message = await contactMessageRepository.markRead(id)
    res.json({ ok: true, message })
  } catch {
    res.status(404).json({ error: 'پیام یافت نشد' })
  }
}

async function listNotifications(req, res) {
  const sort = normalizeString(req.query?.sort) === 'asc' ? 'asc' : 'desc'
  const page = Math.max(1, parseInt(String(req.query?.page || '1'), 10) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(String(req.query?.limit || '20'), 10) || 20))
  const result = await notificationRepository.findAll({ sort, page, limit })
  res.json({ ok: true, ...result })
}

async function markNotificationRead(req, res) {
  const id = normalizeString(req.params.id)
  try {
    const notification = await notificationRepository.markRead(id)
    res.json({ ok: true, notification })
  } catch {
    res.status(404).json({ error: 'اعلان یافت نشد' })
  }
}

async function markAllNotificationsRead(_req, res) {
  await notificationRepository.markAllRead()
  res.json({ ok: true })
}

async function listFounderSubmissions(_req, res) {
  const submissions = await founderRepository.findAll()
  res.json({ ok: true, submissions })
}

async function listEvaluationsPublic(req, res) {
  setNoStore(res)
  const query = req.validatedQuery || req.query || {}
  const email = normalizeString(query.email).toLowerCase()
  const phone = normalizeString(query.phone)
  const fullName = normalizeString(query.fullName || query.name).toLowerCase()

  const all = await assessmentRepository.findAll()
  const evaluations = all.filter((ev) => {
    const evEmail = normalizeString(ev.email).toLowerCase()
    const evPhone = normalizeString(ev.phone)
    const evName = normalizeString(ev.full_name || ev.fullName).toLowerCase()
    return (
      (email && evEmail && evEmail === email) ||
      (phone && evPhone && evPhone === phone) ||
      (fullName && evName && evName === fullName)
    )
  })

  res.json({ ok: true, evaluations })
}

async function listEvaluationsAdmin(_req, res) {
  setNoStore(res)
  const evaluations = await assessmentRepository.findAll()
  res.json({ ok: true, evaluations })
}

async function exportEvaluationsExcel(req, res) {
  setNoStore(res)
  const allEvaluations = await assessmentRepository.findAll()
  const idsRaw = normalizeString(req.query.ids)
  const ids = idsRaw ? idsRaw.split(',').map((id) => normalizeString(id)).filter(Boolean) : []
  const idSet = new Set(ids)
  const evaluations = ids.length > 0 ? allEvaluations.filter((row) => idSet.has(normalizeString(row.id))) : allEvaluations

  const exportRows = evaluations.map((row, idx) => ({
    ردیف: idx + 1,
    شناسه: normalizeString(row.id),
    'نام کامل': normalizeString(row.full_name || row.fullName),
    ایمیل: normalizeString(row.email),
    تلفن: normalizeString(row.phone),
    'نوع پروفایل': normalizeString(row.profile_type),
    'نام کسب و کار': normalizeString(row.company_name || row.org_name),
    'حوزه فعالیت': normalizeString(row.sector),
    'مرحله فعلی': normalizeString(row.stage),
    'سرمایه مورد نیاز': normalizeString(row.capital_required),
    لینکدین: normalizeString(row.linkedin),
    'سطح اطمینان': normalizeString(row.confidence),
    'خلاصه معرفی': normalizeString(row.one_liner),
    'توضیحات متقاضی': normalizeString(row.message),
    'فایل پیوست': normalizeString(row.deck_file),
    'وضعیت بررسی': row.reviewed ? 'بررسی شده' : 'در انتظار بررسی',
    'یادداشت ادمین': normalizeString(row.notes),
    'تاریخ ثبت': normalizeString(row.created_at),
    'آخرین بروزرسانی': normalizeString(row.updated_at),
  }))

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Evaluations')

  if (exportRows.length > 0) {
    worksheet.columns = Object.keys(exportRows[0]).map((key) => ({ header: key, key, width: 32 }))
  }

  worksheet.addRows(exportRows)
  const buffer = await workbook.xlsx.writeBuffer()
  const suffix = ids.length > 0 ? `selected-${ids.length}` : 'all'
  const fileName = `admin-evaluations-${suffix}-${new Date().toISOString().slice(0, 10)}.xlsx`

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
  return res.send(buffer)
}

async function bulkUpdateEvaluations(req, res) {
  const body = req.body || {}
  const ids = Array.isArray(body.ids) ? body.ids.map((id) => normalizeString(id)).filter(Boolean) : []
  if (ids.length === 0) return res.status(400).json({ error: 'حداقل یک شناسه ارسال کنید' })
  const result = await assessmentRepository.bulkUpdate(ids, { reviewed: body.reviewed, notes: body.notes })
  setNoStore(res)
  res.json({ ok: true, ...result })
}

async function updateEvaluation(req, res) {
  const id = normalizeString(req.params.id)
  const body = req.body || {}
  const evaluation = await assessmentRepository.update(id, { reviewed: body.reviewed, notes: body.notes })
  if (!evaluation) return res.status(404).json({ error: 'مورد یافت نشد' })
  res.json({ ok: true, evaluation })
}

async function createContact(req, res) {
  const body = req.body || {}
  const fullName = String(body.fullName || body.name || '').trim()
  const message = String(body.message || '').trim()
  if (!fullName || !message) return res.status(400).json({ error: 'نام و پیام الزامی است' })

  const email = body.email ? String(body.email).trim() : ''
  const subject = String(body.subject || body.topic || '').trim()
  const newMsg = await contactMessageRepository.create({
    fullName,
    email: email || null,
    subject: subject || null,
    message,
  })

  const { pushAdminNotification } = require('../services/notification.service')
  const notif = await pushAdminNotification({
    type: 'system',
    title: `پیام تماس از ${newMsg.fullName}`,
    message: newMsg.subject ? `${newMsg.subject}: ${newMsg.message}` : newMsg.message,
    userId: null,
  })

  const { emitToAdmins } = getEmitters(req)
  emitToAdmins('system_notification', { notification: notif })
  res.json({ success: true, id: newMsg.id })
}

async function founderOnboarding(req, res) {
  const file = req.file
  let deckFileName = null
  if (file && file.originalname) {
    const saved = saveUpload(file)
    deckFileName = saved.fileName
  }
  const { emitToAdmins } = getEmitters(req)
  await founderService.submitFounder(req.body || {}, deckFileName, emitToAdmins)
  res.json({ success: true, message: 'درخواست شما ثبت شد! از شما متشکریم.' })
}

async function getChatMessages(req, res) {
  const roomId = normalizeString(req.params.roomId)
  if (!roomId) return res.status(400).json({ error: 'roomId لازم است' })
  const messages = await chatRepository.getMessagesByRoom(roomId)
  res.json({ ok: true, messages })
}

async function chatUpload(req, res) {
  try {
    const file = req.file
    if (!file || !file.originalname) return res.status(400).json({ error: 'فایل ارسال نشده است' })
    const saved = saveUpload(file)
    res.json({ ok: true, fileName: saved.fileName, url: saved.url })
  } catch (error) {
    res.status(500).json({ error: error.message || 'خطا در آپلود' })
  }
}

async function listChatRooms(_req, res) {
  const rooms = await chatRepository.getEnrichedRooms()
  res.json({ ok: true, rooms })
}

async function markChatRoomRead(req, res) {
  const roomId = normalizeString(req.params.roomId)
  await chatRepository.markRoomRead(roomId)
  const { emitToRoom } = getEmitters(req)
  emitToRoom(roomId, 'message_read', { roomId })
  res.json({ ok: true })
}

async function adminUpload(req, res) {
  return chatUpload(req, res)
}

module.exports = {
  health,
  version,
  ready,
  adminHealth,
  adminMe,
  dashboardSummary,
  login,
  refresh,
  logout,
  savePushToken,
  testPush,
  listBlogsPublic,
  listBlogsAdmin,
  createBlog,
  updateBlog,
  deleteBlog,
  getSiteContentPublic,
  getSiteContentLegacy,
  getSiteContentAdmin,
  putSiteContentAdmin,
  updateSiteContentSection,
  updateSiteContentPublic,
  listRegistrations,
  createRegistration,
  listContactMessages,
  markContactRead,
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  listFounderSubmissions,
  listEvaluationsPublic,
  listEvaluationsAdmin,
  exportEvaluationsExcel,
  bulkUpdateEvaluations,
  updateEvaluation,
  createContact,
  founderOnboarding,
  getChatMessages,
  chatUpload,
  listChatRooms,
  markChatRoomRead,
  adminUpload,
}
