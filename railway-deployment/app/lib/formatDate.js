export function toJalali(dateInput) {
  if (!dateInput) return ''
  try {
    const s = String(dateInput)
    // If it's already Persian (contains Persian digits) return as-is
    if (/[\u06F0-\u06F9]/.test(s)) return s
    const d = new Date(s)
    if (Number.isNaN(d.getTime())) return s
    let out = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)
    const persianDigits = ['\u06F0','\u06F1','\u06F2','\u06F3','\u06F4','\u06F5','\u06F6','\u06F7','\u06F8','\u06F9']
    out = out.replace(/\d/g, (m) => persianDigits[Number(m)])
    return out
  } catch (e) {
    return String(dateInput)
  }
}

