import { adminFetch } from '../../utils/adminAuth'

export async function fetchChatRooms() {
  const res = await adminFetch('/api/admin/chat/rooms')
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.error || 'خطا در دریافت گفتگوها')
  return Array.isArray(body.rooms) ? body.rooms : []
}

export async function fetchRoomMessages(roomId) {
  const res = await adminFetch(`/api/admin/chat/rooms/${encodeURIComponent(roomId)}/messages`)
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.error || 'خطا در دریافت پیام‌ها')
  return Array.isArray(body.messages) ? body.messages : []
}

export async function markRoomRead(roomId) {
  const res = await adminFetch(`/api/admin/chat/rooms/${encodeURIComponent(roomId)}/mark-read`, { method: 'PUT' })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.error || 'خطا')
  return body
}

export async function uploadChatFile(file) {
  const data = new FormData()
  data.append('file', file)
  const res = await adminFetch('/api/admin/uploads', { method: 'POST', body: data })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.error || 'خطا در آپلود')
  return body
}
