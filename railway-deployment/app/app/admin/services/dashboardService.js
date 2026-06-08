import { adminFetch } from '../../utils/adminAuth'

export async function fetchDashboardSummary() {
  const res = await adminFetch('/api/admin/dashboard/summary')
  const raw = await res.text()
  let body = {}
  try {
    body = raw ? JSON.parse(raw) : {}
  } catch {
    body = {}
  }
  if (!res.ok) {
    if (res.status === 401) throw new Error('دسترسی API رد شد.')
    if (/<!DOCTYPE|<html/i.test(raw)) {
      throw new Error('API پاسخ نمی‌دهد. npm run dev:api را اجرا کنید.')
    }
    const detail = body?.detail ? ` (${body.detail})` : ''
    throw new Error(body?.error ? `${body.error}${detail}` : `خطا در دریافت خلاصه داشبورد (HTTP ${res.status})`)
  }
  if (body?.ok !== true) {
    throw new Error(body?.error || 'پاسخ داشبورد نامعتبر است')
  }
  return body
}
