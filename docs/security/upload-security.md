# Upload Security Hardening Documentation

## Overview
This document describes the upload security hardening performed to address file upload vulnerabilities.

## Changes Made

### 1. Added MIME Type Validation (SEC-006)
**File:** `server/utils/upload.js`
**Lines:** 14-26, 59-63

**Added:**
```javascript
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
```

**Added to assertUploadAllowed:**
```javascript
// Validate MIME type
const expectedMime = MIME_TYPE_MAP[ext]
if (expectedMime && file.mimetype !== expectedMime) {
  throw new Error('MIME type mismatch')
}
```

**Rationale:** Added MIME type validation to ensure uploaded files match their declared content type, preventing MIME type spoofing attacks.

### 2. Added Magic Byte Validation (SEC-006)
**File:** `server/utils/upload.js`
**Lines:** 28-39, 41-47, 65-68

**Added:**
```javascript
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
```

**Added to assertUploadAllowed:**
```javascript
// Validate magic bytes
if (file.buffer && !validateMagicBytes(file.buffer, expectedMime)) {
  throw new Error('File content does not match extension')
}
```

**Rationale:** Added magic byte (file signature) validation to ensure uploaded files' actual content matches their declared type, preventing file extension spoofing attacks.

### 3. Improved Filename Randomization (SEC-007)
**File:** `server/utils/upload.js`
**Lines:** 3, 71-82

**Before:**
```javascript
function saveUpload(file) {
  assertUploadAllowed(file)
  ensureUploadsDir()
  const safeName = file.originalname.replace(/[^a-z0-9.\-_]/gi, '-')
  const outName = `${Date.now()}_${safeName}`
  const outPath = path.join(UPLOADS_DIR, outName)
  fs.writeFileSync(outPath, file.buffer)
  return { fileName: outName, url: `/uploads/${outName}` }
}
```

**After:**
```javascript
const crypto = require('crypto')

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
```

**Rationale:** Replaced weak timestamp-based filename generation with cryptographically secure UUID v4, preventing filename prediction and enumeration attacks.

### 4. Protected Uploads Directory (SEC-016)
**File:** `server/app.js`
**Lines:** 30-32

**Before:**
```javascript
ensureUploadsDir()
app.use('/uploads', express.static(UPLOADS_DIR))
```

**After:**
```javascript
ensureUploadsDir()

// Protect uploads with authentication to prevent unauthorized access
const { requireAdmin } = require('./middlewares/auth.middleware')
app.use('/uploads', requireAdmin, express.static(UPLOADS_DIR))
```

**Rationale:** Added authentication middleware to protect the uploads directory, preventing unauthorized access to uploaded files. Only authenticated admins can now access uploaded files.

## Security Improvements

### Multi-Layer File Validation
1. **Extension Validation:** Only allowed file extensions accepted
2. **MIME Type Validation:** File MIME type must match extension
3. **Magic Byte Validation:** File content must match declared type
4. **Size Validation:** Files limited to 10MB maximum

### Secure File Storage
1. **Cryptographic Randomization:** UUID v4 for unpredictable filenames
2. **Access Control:** Authentication required to access uploads
3. **Directory Isolation:** Uploads stored in dedicated directory

### Attack Prevention
- **MIME Spoofing:** Prevented by MIME type validation
- **Extension Spoofing:** Prevented by magic byte validation
- **Filename Enumeration:** Prevented by UUID randomization
- **Unauthorized Access:** Prevented by authentication middleware
- **File Size Attacks:** Prevented by size limits

## Migration Instructions

### For Development
No migration required - existing files will continue to work. New uploads will use the enhanced security measures.

### For Production
1. Deploy updated code
2. Existing uploaded files remain accessible to authenticated admins
3. New uploads will have UUID-based filenames
4. All upload access now requires authentication

### Accessing Uploaded Files
Previously: `GET /uploads/filename.ext` (public)
Now: `GET /uploads/filename.ext` (requires admin authentication)

## Security Impact

- **Risk Reduction:** Eliminated 3 high-severity vulnerabilities (SEC-006, SEC-007, SEC-016)
- **Confidentiality:** Uploads protected by authentication
- **Integrity:** Multi-layer validation prevents malicious uploads
- **Availability:** Legitimate uploads remain accessible to authorized users

## Verification

To verify upload security:

1. Test MIME type validation:
```bash
# Try to upload a file with wrong MIME type
curl -X POST http://localhost:4001/api/admin/uploads \
  -H "Authorization: Bearer <token>" \
  -F "file=@test.txt" \
  # Should fail with MIME type mismatch
```

2. Test magic byte validation:
```bash
# Try to upload a file with wrong magic bytes
# Should fail with content mismatch error
```

3. Test filename randomization:
```bash
# Upload a file and check filename format
# Should be UUID.ext (e.g., 550e8400-e29b-41d4-a716-446655440000.pdf)
```

4. Test access control:
```bash
# Try to access uploads without authentication
curl http://localhost:4001/uploads/filename.ext
# Should return 401 Unauthorized
```

## Rollback Plan

If issues arise, rollback steps:

1. Revert `server/utils/upload.js` to previous version
2. Revert `server/app.js` uploads middleware to public access
3. Delete this documentation file

## Related Findings

- SEC-006: No MIME type validation, no magic byte validation for file uploads
- SEC-007: Weak filename randomization (timestamp + sanitized name)
- SEC-016: Uploads directory served publicly via express.static

## Next Steps

- Consider implementing virus scanning for uploaded files
- Add file content sanitization for images
- Implement file retention policy
- Add upload rate limiting per user
- Consider storing files in object storage (S3, etc.) for production
- Implement file access logging and monitoring
