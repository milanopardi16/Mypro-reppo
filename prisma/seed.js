const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

require('dotenv').config({ path: path.join(process.cwd(), '.env.local') })
require('dotenv').config({ path: path.join(process.cwd(), '.env') })

const prisma = new PrismaClient()
const DATA_DIR = path.join(process.cwd(), 'data')

const ROLES = [
  { name: 'Admin', description: 'Administrator with full access' },
  { name: 'Manager', description: 'Manager with limited admin access' },
  { name: 'User', description: 'Registered site user' },
]

function readJson(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback
    const raw = fs.readFileSync(filePath, 'utf8')
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function collectGuestUserIds() {
  const ids = new Set()
  const rooms = readJson(path.join(DATA_DIR, 'chat-rooms.json'), [])
  const notifications = readJson(path.join(DATA_DIR, 'admin-notifications.json'), [])
  const messages = readJson(path.join(DATA_DIR, 'chat-messages.json'), [])

  if (Array.isArray(rooms)) {
    for (const r of rooms) {
      if (r.userId) ids.add(String(r.userId))
    }
  }
  if (Array.isArray(notifications)) {
    for (const n of notifications) {
      if (n.userId) ids.add(String(n.userId))
    }
  }
  if (Array.isArray(messages)) {
    for (const m of messages) {
      if (m.senderType === 'user' && m.senderId) ids.add(String(m.senderId))
    }
  }
  return ids
}

function resolveNotificationUserId(rawUserId, userIds) {
  if (!rawUserId) return { userId: null, actorRef: null }
  const ref = String(rawUserId)
  if (userIds.has(ref)) return { userId: ref, actorRef: null }
  return { userId: null, actorRef: ref }
}

function resolveAdminId(rawAdminId, adminIds) {
  if (!rawAdminId) return null
  const ref = String(rawAdminId)
  return adminIds.has(ref) ? ref : null
}

async function ensureRoles() {
  const map = {}
  for (const role of ROLES) {
    map[role.name] = await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    })
  }
  return map
}

async function seedAdmin(adminRole) {
  const email = String(process.env.ADMIN_EMAIL || process.env.ADMIN_USERNAME || '').trim()
  const password = String(process.env.ADMIN_PASSWORD || '').trim()
  
  if (!email || !password) {
    console.warn('⚠️  ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables. Skipping admin seed.')
    return
  }
  
  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash, name: 'Admin', roleId: adminRole.id, isActive: true },
    create: {
      email,
      passwordHash,
      name: 'Admin',
      roleId: adminRole.id,
      isActive: true,
    },
  })
  console.log(`Default admin seeded: ${email}`)
}

async function ensureGuestUser(id, userRole) {
  if (!id) return
  await prisma.user.upsert({
    where: { id: String(id) },
    update: {},
    create: { id: String(id), fullName: 'Guest', roleId: userRole.id },
  })
}

async function seedGuestUsers(userRole) {
  const ids = collectGuestUserIds()
  for (const id of ids) {
    await ensureGuestUser(id, userRole)
  }
  if (ids.size > 0) console.log(`Ensured ${ids.size} guest user(s) for chat FK relations`)
}

async function importUsers(userRole) {
  const rows = readJson(path.join(DATA_DIR, 'registrations.json'), [])
  if (!Array.isArray(rows) || rows.length === 0) return
  for (const r of rows) {
    const id = String(r.id)
    await prisma.user.upsert({
      where: { id },
      update: {
        fullName: r.fullName || null,
        email: r.email || null,
        phone: r.phone || null,
        companyName: r.companyName || null,
        position: r.position || null,
        industry: r.industry || null,
        website: r.website || null,
        message: r.message || null,
        roleId: userRole.id,
      },
      create: {
        id,
        fullName: r.fullName || null,
        email: r.email || null,
        phone: r.phone || null,
        companyName: r.companyName || null,
        position: r.position || null,
        industry: r.industry || null,
        website: r.website || null,
        message: r.message || null,
        roleId: userRole.id,
        createdAt: r.created_at ? new Date(r.created_at) : undefined,
      },
    })
  }
  console.log(`Imported ${rows.length} registrations`)
}

async function importSiteContent() {
  const content = readJson(path.join(DATA_DIR, 'site-content.json'), null)
  if (!content || typeof content !== 'object') return
  await prisma.siteContent.upsert({
    where: { id: 'main' },
    update: { content },
    create: { id: 'main', content },
  })
  console.log('Imported site content')
}

async function importBlogPosts() {
  const rows = readJson(path.join(DATA_DIR, 'blog-posts.json'), [])
  if (!Array.isArray(rows) || rows.length === 0) return
  for (const p of rows) {
    await prisma.blogPost.upsert({
      where: { id: String(p.id) },
      update: {
        slug: p.slug || null,
        title: p.title || 'بدون عنوان',
        excerpt: p.excerpt || '',
        content: p.content || '',
        coverImage: p.coverImage || null,
        tags: Array.isArray(p.tags) ? p.tags : [],
        category: p.category || null,
        status: p.status || 'draft',
        updatedAt: p.updated_at ? new Date(p.updated_at) : undefined,
      },
      create: {
        id: String(p.id),
        slug: p.slug || null,
        title: p.title || 'بدون عنوان',
        excerpt: p.excerpt || '',
        content: p.content || '',
        coverImage: p.coverImage || null,
        tags: Array.isArray(p.tags) ? p.tags : [],
        category: p.category || null,
        status: p.status || 'draft',
        createdAt: p.created_at ? new Date(p.created_at) : undefined,
        updatedAt: p.updated_at ? new Date(p.updated_at) : undefined,
      },
    })
  }
  console.log(`Imported ${rows.length} blog posts`)
}

async function importContactMessages() {
  const rows = readJson(path.join(DATA_DIR, 'admin-messages.json'), [])
  if (!Array.isArray(rows) || rows.length === 0) return
  for (const m of rows) {
    await prisma.contactMessage.upsert({
      where: { id: String(m.id) },
      update: {
        fullName: m.fullName || 'ناشناس',
        email: m.email || null,
        subject: m.subject || null,
        message: m.message || '',
        read: Boolean(m.read),
      },
      create: {
        id: String(m.id),
        fullName: m.fullName || 'ناشناس',
        email: m.email || null,
        subject: m.subject || null,
        message: m.message || '',
        read: Boolean(m.read),
        createdAt: m.createdAt ? new Date(m.createdAt) : undefined,
      },
    })
  }
  console.log(`Imported ${rows.length} contact messages`)
}

async function importNotifications(userIds) {
  const rows = readJson(path.join(DATA_DIR, 'admin-notifications.json'), [])
  if (!Array.isArray(rows) || rows.length === 0) return
  for (const n of rows) {
    const id = String(n.id)
    const { userId, actorRef } = resolveNotificationUserId(n.userId, userIds)
    await prisma.notification.upsert({
      where: { id },
      update: {
        title: n.title || 'اعلان',
        message: n.message || '',
        type: n.type || 'system',
        userId,
        actorRef,
        isRead: Boolean(n.isRead ?? n.read ?? false),
      },
      create: {
        id,
        title: n.title || 'اعلان',
        message: n.message || '',
        type: n.type || 'system',
        userId,
        actorRef,
        isRead: Boolean(n.isRead ?? n.read ?? false),
        createdAt: n.createdAt ? new Date(n.createdAt) : undefined,
      },
    })
  }
  console.log(`Imported ${rows.length} notifications`)
}

async function importAssessments() {
  const rows = readJson(path.join(DATA_DIR, 'admin-evaluations.json'), [])
  if (!Array.isArray(rows) || rows.length === 0) return
  for (const e of rows) {
    await prisma.assessment.upsert({
      where: { id: String(e.id) },
      update: {
        profileType: e.profile_type || null,
        fullName: e.full_name || null,
        email: e.email || null,
        phone: e.phone || null,
        linkedin: e.linkedin || null,
        companyName: e.company_name || null,
        sector: e.sector || null,
        stage: e.stage || null,
        capitalRequired: e.capital_required || null,
        oneLiner: e.one_liner || null,
        orgName: e.org_name || null,
        ticketSize: e.ticket_size || null,
        stagePref: e.stage_pref || null,
        geoPref: e.geo_pref || null,
        confidence: e.confidence || null,
        message: e.message || null,
        confirmAccuracy: Boolean(e.confirm_accuracy),
        deckFile: e.deck_file || null,
        reviewed: Boolean(e.reviewed),
        notes: e.notes || '',
        updatedAt: e.updated_at ? new Date(e.updated_at) : undefined,
      },
      create: {
        id: String(e.id),
        profileType: e.profile_type || null,
        fullName: e.full_name || null,
        email: e.email || null,
        phone: e.phone || null,
        linkedin: e.linkedin || null,
        companyName: e.company_name || null,
        sector: e.sector || null,
        stage: e.stage || null,
        capitalRequired: e.capital_required || null,
        oneLiner: e.one_liner || null,
        orgName: e.org_name || null,
        ticketSize: e.ticket_size || null,
        stagePref: e.stage_pref || null,
        geoPref: e.geo_pref || null,
        confidence: e.confidence || null,
        message: e.message || null,
        confirmAccuracy: Boolean(e.confirm_accuracy),
        deckFile: e.deck_file || null,
        reviewed: Boolean(e.reviewed),
        notes: e.notes || '',
        createdAt: e.created_at ? new Date(e.created_at) : undefined,
        updatedAt: e.updated_at ? new Date(e.updated_at) : undefined,
      },
    })
  }
  console.log(`Imported ${rows.length} assessments`)
}

async function importFounderSubmissions() {
  const rows = readJson(path.join(DATA_DIR, 'founder-submissions.json'), [])
  if (!Array.isArray(rows) || rows.length === 0) return
  for (const f of rows) {
    await prisma.founderSubmission.upsert({
      where: { id: String(f.id) },
      update: {
        profileType: f.profile_type || null,
        fullName: f.full_name || null,
        email: f.email || null,
        phone: f.phone || null,
        linkedin: f.linkedin || null,
        companyName: f.company_name || null,
        sector: f.sector || null,
        stage: f.stage || null,
        capitalRequired: f.capital_required || null,
        oneLiner: f.one_liner || null,
        orgName: f.org_name || null,
        ticketSize: f.ticket_size || null,
        stagePref: f.stage_pref || null,
        geoPref: f.geo_pref || null,
        confidence: f.confidence || null,
        message: f.message || null,
        confirmAccuracy: Boolean(f.confirm_accuracy),
        deckFile: f.deck_file || null,
        reviewed: Boolean(f.reviewed),
      },
      create: {
        id: String(f.id),
        profileType: f.profile_type || null,
        fullName: f.full_name || null,
        email: f.email || null,
        phone: f.phone || null,
        linkedin: f.linkedin || null,
        companyName: f.company_name || null,
        sector: f.sector || null,
        stage: f.stage || null,
        capitalRequired: f.capital_required || null,
        oneLiner: f.one_liner || null,
        orgName: f.org_name || null,
        ticketSize: f.ticket_size || null,
        stagePref: f.stage_pref || null,
        geoPref: f.geo_pref || null,
        confidence: f.confidence || null,
        message: f.message || null,
        confirmAccuracy: Boolean(f.confirm_accuracy),
        deckFile: f.deck_file || null,
        reviewed: Boolean(f.reviewed),
        createdAt: f.created_at ? new Date(f.created_at) : undefined,
      },
    })
  }
  console.log(`Imported ${rows.length} founder submissions`)
}

async function importChat(adminIds) {
  const rooms = readJson(path.join(DATA_DIR, 'chat-rooms.json'), [])
  const messages = readJson(path.join(DATA_DIR, 'chat-messages.json'), [])

  if (Array.isArray(rooms)) {
    for (const r of rooms) {
      const userId = r.userId ? String(r.userId) : null
      const adminId = resolveAdminId(r.adminId, adminIds)
      await prisma.chatRoom.upsert({
        where: { id: String(r.id) },
        update: {
          userId,
          adminId,
          status: r.status || 'active',
        },
        create: {
          id: String(r.id),
          userId,
          adminId,
          status: r.status || 'active',
          createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
        },
      })
    }
    console.log(`Imported ${rooms.length} chat rooms`)
  }

  if (Array.isArray(messages)) {
    for (const m of messages) {
      await prisma.chatMessage.upsert({
        where: { id: String(m.id) },
        update: {
          roomId: String(m.roomId),
          senderId: String(m.senderId),
          senderType: m.senderType,
          message: m.message || '',
          attachment: m.attachment ?? null,
          isRead: Boolean(m.isRead),
        },
        create: {
          id: String(m.id),
          roomId: String(m.roomId),
          senderId: String(m.senderId),
          senderType: m.senderType,
          message: m.message || '',
          attachment: m.attachment ?? null,
          isRead: Boolean(m.isRead),
          createdAt: m.createdAt ? new Date(m.createdAt) : undefined,
        },
      })
    }
    console.log(`Imported ${messages.length} chat messages`)
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to run seed')
  }
  const roles = await ensureRoles()
  await seedAdmin(roles.Admin)
  await importSiteContent()
  await importUsers(roles.User)
  await seedGuestUsers(roles.User)

  const [users, admins] = await Promise.all([
    prisma.user.findMany({ select: { id: true } }),
    prisma.admin.findMany({ select: { id: true } }),
  ])
  const userIds = new Set(users.map((u) => u.id))
  const adminIds = new Set(admins.map((a) => a.id))

  await importBlogPosts()
  await importContactMessages()
  await importNotifications(userIds)
  await importAssessments()
  await importFounderSubmissions()
  await importChat(adminIds)
  console.log('Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
