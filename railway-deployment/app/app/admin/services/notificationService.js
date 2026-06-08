import { adminFetch } from '../../utils/adminAuth'

export async function fetchNotifications({ page = 1, limit = 20, sort = 'desc' } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit), sort })
  const res = await adminFetch(`/api/admin/notifications?${params}`)
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.error || 'خطا در دریافت اعلان‌ها')
  return {
    notifications: Array.isArray(body.notifications) ? body.notifications : [],
    total: body.total ?? 0,
    page: body.page ?? page,
    limit: body.limit ?? limit,
    unreadCount: body.unreadCount ?? 0,
  }
}

export async function markNotificationRead(id) {
  const res = await adminFetch(`/api/admin/notifications/${id}/read`, { method: 'PUT' })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.error || 'خطا')
  return body.notification
}

export async function markAllNotificationsRead() {
  const res = await adminFetch('/api/admin/notifications/mark-all-read', { method: 'PUT' })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.error || 'خطا')
  return body
}
