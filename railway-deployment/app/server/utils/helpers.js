function generateId() {
  try {
    if (global.crypto && typeof global.crypto.randomUUID === 'function') return global.crypto.randomUUID()
  } catch {}
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`
}

function normalizeString(value) {
  return String(value || '').trim()
}

function normalizeStatus(value) {
  return normalizeString(value).toLowerCase()
}

function setNoStore(res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  res.setHeader('Surrogate-Control', 'no-store')
}

function nowIso() {
  return new Date().toISOString()
}

function activityTimestamp(item) {
  const raw = item?.createdAt || item?.created_at || ''
  const ts = Date.parse(raw)
  return Number.isFinite(ts) ? ts : 0
}

function toRegistrationDto(row) {
  if (!row) return null
  return {
    id: row.id.includes?.('-') ? row.id : Number(row.id) || row.id,
    created_at: row.createdAt?.toISOString?.() || row.created_at,
    fullName: row.fullName,
    email: row.email,
    phone: row.phone,
    companyName: row.companyName,
    position: row.position,
    industry: row.industry,
    website: row.website,
    message: row.message,
  }
}

function toAssessmentDto(row) {
  if (!row) return null
  return {
    id: row.id,
    profile_type: row.profileType,
    full_name: row.fullName,
    fullName: row.fullName,
    email: row.email,
    phone: row.phone,
    linkedin: row.linkedin,
    company_name: row.companyName,
    companyName: row.companyName,
    sector: row.sector,
    stage: row.stage,
    capital_required: row.capitalRequired,
    one_liner: row.oneLiner,
    org_name: row.orgName,
    ticket_size: row.ticketSize,
    stage_pref: row.stagePref,
    geo_pref: row.geoPref,
    confidence: row.confidence,
    message: row.message,
    confirm_accuracy: row.confirmAccuracy,
    deck_file: row.deckFile,
    reviewed: row.reviewed,
    notes: row.notes || '',
    created_at: row.createdAt?.toISOString?.() || row.created_at,
    updated_at: row.updatedAt?.toISOString?.() || row.updated_at,
  }
}

function toFounderDto(row) {
  const base = toAssessmentDto(row)
  if (!base) return null
  delete base.notes
  delete base.reviewed
  return base
}

function toNotificationDto(row) {
  if (!row) return null
  return {
    id: row.id,
    title: row.title || 'اعلان جدید',
    message: row.message || '',
    type: row.type || 'system',
    userId: row.userId || row.actorRef || null,
    isRead: Boolean(row.isRead),
    createdAt: row.createdAt?.toISOString?.() || row.createdAt,
  }
}

function toContactMessageDto(row) {
  if (!row) return null
  return {
    id: row.id,
    fullName: row.fullName,
    email: row.email,
    subject: row.subject,
    message: row.message,
    createdAt: row.createdAt?.toISOString?.() || row.createdAt,
    read: row.read,
  }
}

function toBlogPostDto(row) {
  if (!row) return null
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.coverImage,
    tags: row.tags || [],
    category: row.category,
    status: row.status,
    created_at: row.createdAt?.toISOString?.() || row.created_at,
    updated_at: row.updatedAt?.toISOString?.() || row.updated_at,
  }
}

function toChatRoomDto(row) {
  if (!row) return null
  return {
    id: row.id,
    userId: row.userId,
    adminId: row.adminId,
    status: row.status,
    createdAt: row.createdAt?.toISOString?.() || row.createdAt,
  }
}

function toChatMessageDto(row) {
  if (!row) return null
  return {
    id: row.id,
    roomId: row.roomId,
    senderId: row.senderId,
    senderType: row.senderType,
    message: row.message || '',
    attachment: row.attachment || null,
    isRead: row.isRead,
    createdAt: row.createdAt?.toISOString?.() || row.createdAt,
  }
}

function buildRecentActivities({ registrations = [], evaluations = [], contactMessages = [], notifications = [] }) {
  const items = []

  for (const r of registrations) {
    const label = [r.fullName || r.name, r.email].filter(Boolean).join(' — ')
    items.push({
      id: `reg-${r.id}`,
      type: 'registration',
      title: 'ثبت‌نام کاربر جدید',
      message: label || 'کاربر جدید ثبت‌نام کرد.',
      createdAt: r.created_at || r.createdAt || nowIso(),
    })
  }

  for (const e of evaluations) {
    const label = [e.full_name || e.fullName, e.email, e.company_name || e.companyName].filter(Boolean).join(' — ')
    items.push({
      id: `eval-${e.id}`,
      type: 'evaluation',
      title: 'فرم ارزیابی جدید',
      message: label || 'فرم ارزیابی جدید ارسال شد.',
      createdAt: e.created_at || e.createdAt || nowIso(),
    })
  }

  for (const m of contactMessages) {
    items.push({
      id: `msg-${m.id}`,
      type: 'contact',
      title: m.fullName ? `پیام تماس از ${m.fullName}` : 'پیام تماس جدید',
      message: m.subject ? `${m.subject}: ${m.message}` : m.message || '',
      createdAt: m.createdAt || m.created_at || nowIso(),
    })
  }

  for (const n of notifications) {
    items.push({
      id: normalizeString(n.id) || generateId(),
      type: n.type || 'system',
      title: n.title || 'اعلان',
      message: n.message || '',
      createdAt: n.createdAt || n.created_at || nowIso(),
    })
  }

  return items.sort((a, b) => activityTimestamp(b) - activityTimestamp(a)).slice(0, 15)
}

module.exports = {
  generateId,
  normalizeString,
  normalizeStatus,
  setNoStore,
  nowIso,
  activityTimestamp,
  toRegistrationDto,
  toAssessmentDto,
  toFounderDto,
  toNotificationDto,
  toContactMessageDto,
  toBlogPostDto,
  toChatRoomDto,
  toChatMessageDto,
  buildRecentActivities,
}
