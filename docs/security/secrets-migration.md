# Secrets Migration Documentation

## Overview
This document describes the secrets migration performed to eliminate hardcoded credentials and secrets from the codebase.

## Changes Made

### 1. Removed Default Admin Credentials (SEC-001)
**File:** `prisma/seed.js`
**Lines:** 77-86

**Before:**
```javascript
async function seedAdmin(adminRole) {
  const email = String(process.env.ADMIN_EMAIL || process.env.ADMIN_USERNAME || 'admin@capitalnetwork.local').trim()
  const password = String(process.env.ADMIN_PASSWORD || 'change-me-strong-password').trim()
  const passwordHash = await bcrypt.hash(password, 12)
```

**After:**
```javascript
async function seedAdmin(adminRole) {
  const email = String(process.env.ADMIN_EMAIL || process.env.ADMIN_USERNAME || '').trim()
  const password = String(process.env.ADMIN_PASSWORD || '').trim()
  
  if (!email || !password) {
    console.warn('⚠️  ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables. Skipping admin seed.')
    return
  }
  
  const passwordHash = await bcrypt.hash(password, 12)
```

**Rationale:** Removed default credentials to prevent accidental deployment with weak default passwords. The seed script now requires explicit environment variables and skips admin creation if not provided.

### 2. Removed Default Password Salt (SEC-002)
**File:** `scripts/hash-password.js`
**Lines:** 1-17

**Before:**
```javascript
const crypto = require('crypto')
const salt = process.env.ADMIN_PASSWORD_SALT || 'your-strong-password-salt'
const password = process.argv[2]
if (!password) {
  console.error('Usage: node scripts/hash-password.js <password>')
  process.exit(1)
}
const hash = crypto.createHmac('sha256', salt).update(password).digest('hex')
console.log(hash)
```

**After:**
```javascript
const crypto = require('crypto')
const salt = process.env.ADMIN_PASSWORD_SALT
const password = process.argv[2]

if (!salt) {
  console.error('Error: ADMIN_PASSWORD_SALT environment variable is required')
  console.error('Usage: ADMIN_PASSWORD_SALT=<your-salt> node scripts/hash-password.js <password>')
  process.exit(1)
}

if (!password) {
  console.error('Usage: ADMIN_PASSWORD_SALT=<your-salt> node scripts/hash-password.js <password>')
  process.exit(1)
}

const hash = crypto.createHmac('sha256', salt).update(password).digest('hex')
console.log(hash)
```

**Rationale:** Removed default salt to prevent predictable password hashes. The script now requires explicit salt via environment variable.

### 3. Updated Environment Variables Template
**File:** `.env.example`
**Lines:** 13-19

**Added:**
```bash
# Admin account — used by prisma db seed for first admin (REQUIRED in production)
ADMIN_EMAIL=admin@capitalnetwork.local
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me-strong-password-min-8-chars

# Password salt for additional security (REQUIRED in production)
ADMIN_PASSWORD_SALT=your-random-salt-minimum-32-characters-long
```

**Rationale:** Added clear documentation for required environment variables with minimum length requirements.

## Migration Instructions

### For Development

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Generate strong secrets:
```bash
# Generate JWT secrets (min 32 chars each)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate password salt (min 32 chars)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. Update `.env` with generated values:
```bash
JWT_ACCESS_SECRET=<generated-access-secret>
JWT_REFRESH_SECRET=<generated-refresh-secret>
ADMIN_PASSWORD_SALT=<generated-salt>
ADMIN_EMAIL=your-admin@example.com
ADMIN_PASSWORD=<strong-password-min-8-chars>
```

### For Production

1. Use a secrets manager (AWS Secrets Manager, HashiCorp Vault, etc.)
2. Set environment variables from secrets manager at runtime
3. Never commit `.env` file
4. Rotate secrets regularly (recommended: every 90 days)

### Database Seeding

The seed script now requires environment variables. To seed the database:

```bash
# Set required environment variables
export ADMIN_EMAIL=admin@yourdomain.com
export ADMIN_PASSWORD=<strong-password>
export ADMIN_PASSWORD_SALT=<your-salt>

# Run seed
npx prisma db seed
```

If environment variables are not set, the admin seed will be skipped with a warning.

## Security Impact

- **Risk Reduction:** Eliminated 2 critical vulnerabilities (SEC-001, SEC-002)
- **Confidentiality:** Secrets no longer hardcoded in source code
- **Integrity:** Prevents accidental deployment with weak defaults
- **Availability:** Seed script gracefully handles missing credentials

## Verification

To verify the migration:

1. Check that no default credentials exist in code:
```bash
grep -r "change-me-strong-password" --exclude-dir=node_modules .
grep -r "your-strong-password-salt" --exclude-dir=node_modules .
```

2. Verify seed script behavior:
```bash
# Without env vars (should skip admin seed)
npx prisma db seed

# With env vars (should create admin)
ADMIN_EMAIL=test@test.com ADMIN_PASSWORD=test123 npx prisma db seed
```

## Rollback Plan

If issues arise, rollback steps:

1. Revert changes to `prisma/seed.js`
2. Revert changes to `scripts/hash-password.js`
3. Remove `ADMIN_PASSWORD_SALT` from `.env.example`
4. Delete this documentation file

## Related Findings

- SEC-001: Default admin credentials hardcoded in seed.js
- SEC-002: Default salt hardcoded in hash-password.js

## Next Steps

- Implement secrets rotation policy
- Add secrets validation at application startup
- Integrate with secrets manager for production
- Add automated secrets scanning to CI/CD pipeline
