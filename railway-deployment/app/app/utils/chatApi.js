import { getAdminToken } from './adminAuth'

export async function fetchChatMessages(roomId) {
  const res = await fetch(`/api/chat/rooms/${encodeURIComponent(roomId)}/messages`, {
    cache: 'no-store',
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json?.error || 'خطا در دریافت پیام‌ها')
  return Array.isArray(json?.messages) ? json.messages : []
}

export async function sendChatMessage({ roomId, senderId, senderType, message, attachment = null }) {
  const headers = { 'Content-Type': 'application/json' }
  if (senderType === 'admin') {
    const token = getAdminToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }
  const res = await fetch(`/api/chat/rooms/${encodeURIComponent(roomId)}/messages`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ senderId, senderType, message, attachment }),
    cache: 'no-store',
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json?.error || 'ارسال پیام ناموفق بود')
  return json?.message || null
}
