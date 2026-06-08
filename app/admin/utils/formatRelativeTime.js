export function formatRelativeTime(dateInput, locale = 'fa-IR') {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput)
  if (!Number.isFinite(date.getTime())) return ''

  const now = Date.now()
  const diffSec = Math.round((now - date.getTime()) / 1000)

  if (diffSec < 60) return 'همین الان'
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} دقیقه پیش`
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} ساعت پیش`
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)} روز پیش`

  return date.toLocaleString(locale)
}
