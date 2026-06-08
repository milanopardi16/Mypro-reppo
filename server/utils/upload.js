const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const UPLOADS_DIR = path.join(process.cwd(), 'uploads')

function ensureUploadsDir() {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}

const ALLOWED_EXTENSIONS = new Set(['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.doc', '.docx', '.xls', '.xlsx'])
const MAX_BYTES = 10 * 1024 * 1024

// MIME type mapping for validation
const MIME_TYPE_MAP = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}

// Magic byte signatures for file type validation
const MAGIC_BYTES = {
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/png': [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
  'image/gif': [0x47, 0x49, 0x46, 0x38],
  'image/webp': [0x52, 0x49, 0x46, 0x46],
  'application/pdf': [0x25, 0x50, 0x44, 0x46],
  'application/msword': [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [0x50, 0x4B, 0x03, 0x04],
  'application/vnd.ms-excel': [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [0x50, 0x4B, 0x03, 0x04]
}

function validateMagicBytes(buffer, expectedMime) {
  const expectedBytes = MAGIC_BYTES[expectedMime]
  if (!expectedBytes) return true // Skip validation if no magic bytes defined
  
  const fileBytes = Array.from(buffer.slice(0, expectedBytes.length))
  return expectedBytes.every((byte, index) => fileBytes[index] === byte)
}

function assertUploadAllowed(file) {
  if (!file?.buffer?.length) throw new Error('فایل ارسال نشده است')
  if (file.size > MAX_BYTES || file.buffer.length > MAX_BYTES) {
    throw new Error('حجم فایل بیش از حد مجاز است (حداکثر ۱۰ مگابایت)')
  }
  const ext = path.extname(String(file.originalname || '')).toLowerCase()
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error('نوع فایل مجاز نیست')
  }
  
  // Validate MIME type
  const expectedMime = MIME_TYPE_MAP[ext]
  if (expectedMime && file.mimetype !== expectedMime) {
    throw new Error('MIME type mismatch')
  }
  
  // Validate magic bytes
  if (file.buffer && !validateMagicBytes(file.buffer, expectedMime)) {
    throw new Error('File content does not match extension')
  }
}

function saveUpload(file) {
  assertUploadAllowed(file)
  ensureUploadsDir()
  
  // Use crypto.randomUUID() for secure filename randomization
  const ext = path.extname(String(file.originalname || '')).toLowerCase()
  const randomId = crypto.randomUUID()
  const outName = `${randomId}${ext}`
  const outPath = path.join(UPLOADS_DIR, outName)
  
  fs.writeFileSync(outPath, file.buffer)
  return { fileName: outName, url: `/uploads/${outName}` }
}

module.exports = { UPLOADS_DIR, ensureUploadsDir, saveUpload, assertUploadAllowed, MAX_BYTES }
