import fs from 'fs'
import path from 'path'
import { normalizeSiteContent } from '../data/siteContent'

const DATA_DIR = path.join(process.cwd(), 'data')
const SITE_CONTENT_FILE = path.join(DATA_DIR, 'site-content.json')

export function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

export function readSiteContent() {
  ensureDataDir()
  try {
    const raw = fs.readFileSync(SITE_CONTENT_FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    return mergeSiteContent(parsed)
  } catch {
    return mergeSiteContent({})
  }
}

export function writeSiteContent(content) {
  ensureDataDir()
  const merged = mergeSiteContent(content)
  fs.writeFileSync(SITE_CONTENT_FILE, JSON.stringify(merged, null, 2), 'utf-8')
  return merged
}

export function mergeSiteContent(partial) {
  return normalizeSiteContent(partial && typeof partial === 'object' ? partial : {})
}
