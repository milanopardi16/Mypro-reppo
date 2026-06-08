export function scrollToElementById(id, options = {}) {
  if (typeof window === 'undefined' || !id) return
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start', ...options })
}
