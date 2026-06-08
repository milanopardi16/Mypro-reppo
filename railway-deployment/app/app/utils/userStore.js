'use client'

const USERS_KEY = 'capitalNetworkUsers'
const CURRENT_USER_KEY = 'capitalNetworkCurrentUser'

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback
  } catch (error) {
    return fallback
  }
}

function dispatchCurrentUserChanged() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event('capitalNetworkUserChanged'))
}

export function getStoredUsers() {
  if (typeof window === 'undefined') return []
  return safeParse(window.localStorage.getItem(USERS_KEY), [])
}

export function saveStoredUsers(users) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getCurrentUser() {
  if (typeof window === 'undefined') return null
  return safeParse(window.localStorage.getItem(CURRENT_USER_KEY), null)
}

export function setCurrentUser(user) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  dispatchCurrentUserChanged()
}

export function clearCurrentUser() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(CURRENT_USER_KEY)
  dispatchCurrentUserChanged()
}

function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return String(Date.now())
}

function generateUsername(fullName, email, phone) {
  if (fullName) {
    return fullName.trim().split(' ')[0].toLowerCase()
  }
  if (email) {
    return email.split('@')[0].toLowerCase()
  }
  return phone ? phone.replace(/\D/g, '') : 'user'
}

export function findUser(identifier) {
  const users = getStoredUsers()
  return users.find((user) => {
    const normalized = identifier.trim().toLowerCase()
    return (user.email && user.email.toLowerCase() === normalized) || (user.phone && user.phone.toLowerCase() === normalized)
  })
}

export function authenticateUser(identifier, password) {
  const user = findUser(identifier)
  if (!user) return null
  if (user.password !== password) return null
  return user
}

export function createUser({ fullName, email, phone, password }) {
  const users = getStoredUsers()
  const normalizedEmail = email ? email.trim().toLowerCase() : ''
  const normalizedPhone = phone ? phone.trim() : ''

  const duplicate = users.find((user) => {
    return (normalizedEmail && user.email && user.email.trim().toLowerCase() === normalizedEmail) ||
      (normalizedPhone && user.phone && user.phone.trim() === normalizedPhone)
  })

  if (duplicate) {
    throw new Error('کاربری با ایمیل یا شماره تلفن وارد شده قبلاً ثبت شده است.')
  }

  const id = generateId()
  const username = generateUsername(fullName, normalizedEmail, normalizedPhone)
  const database = {
    id: `db_${id}`,
    tenantId: id,
    createdAt: new Date().toISOString(),
    actions: [],
    meta: {
      owner: username,
      title: `${username} database`,
    }
  }

  const newUser = {
    id,
    fullName: fullName.trim(),
    username,
    email: normalizedEmail || null,
    phone: normalizedPhone || null,
    password,
    createdAt: new Date().toISOString(),
    database,
  }

  users.push(newUser)
  saveStoredUsers(users)
  addUserAction(id, 'ثبت نام', 'ثبت نام شما با موفقیت ثبت شد و دیتابیس اختصاصی شما ایجاد شد.', { source: 'register' })
  return newUser
}

export function addUserAction(userId, type, description, context = {}) {
  const users = getStoredUsers()
  const index = users.findIndex((user) => user.id === userId)
  if (index === -1) return null

  const action = {
    id: generateId(),
    type,
    description,
    createdAt: new Date().toISOString(),
    context,
  }

  users[index].database = users[index].database || {
    id: `db_${users[index].id}`,
    tenantId: users[index].id,
    createdAt: new Date().toISOString(),
    actions: [],
    meta: {
      owner: users[index].username || users[index].fullName,
    }
  }
  users[index].database.actions.unshift(action)
  saveStoredUsers(users)

  const current = getCurrentUser()
  if (current && current.id === userId) {
    setCurrentUser(users[index])
  }

  return action
}

export function getActionLabel(type) {
  if (!type) return ''
  const map = {
    'database_created': 'ثبت نام',
    'database_oreated': 'ثبت نام',
    'ثبت نام': 'ثبت نام',
    'ورود': 'ورود',
    'login': 'ورود',
    'درخواست ارزیابی': 'درخواست ارزیابی',
    'request_evaluation': 'درخواست ارزیابی',
  }
  return map[type] || String(type)
}
