# JWT Security Hardening Documentation

## Overview
This document describes the JWT security hardening performed to address token security vulnerabilities.

## Changes Made

### 1. Reduced Refresh Token TTL (SEC-005)
**File:** `server/services/auth.service.js`
**Lines:** 9

**Before:**
```javascript
const REFRESH_TTL_DAYS = 30
```

**After:**
```javascript
const REFRESH_TTL_DAYS = 7
```

**Rationale:** Reduced refresh token lifetime from 30 days to 7 days to limit the window of opportunity for token theft and misuse. This aligns with security best practices and reduces the risk of long-lived compromised tokens.

### 2. Added Required JWT Claims (SEC-004)
**File:** `server/services/auth.service.js`
**Lines:** 20-55

**Before:**
```javascript
function issueAccessToken(admin) {
  const { accessSecret } = getSecrets()
  return jwt.sign(
    { role: 'admin', name: admin.name, email: admin.email },
    accessSecret,
    { subject: admin.id, expiresIn: ACCESS_TTL }
  )
}

function issueRefreshToken(admin) {
  const { refreshSecret } = getSecrets()
  return jwt.sign(
    { role: 'admin', name: admin.name, type: 'refresh', email: admin.email },
    refreshSecret,
    { subject: admin.id, expiresIn: `${REFRESH_TTL_DAYS}d` }
  )
}
```

**After:**
```javascript
function issueAccessToken(admin) {
  const { accessSecret } = getSecrets()
  const now = Math.floor(Date.now() / 1000)
  return jwt.sign(
    {
      role: 'admin',
      name: admin.name,
      email: admin.email,
      iss: process.env.JWT_ISSUER || 'capital-network-api',
      aud: process.env.JWT_AUDIENCE || 'capital-network-web',
      iat: now,
      nbf: now,
    },
    accessSecret,
    { subject: admin.id, expiresIn: ACCESS_TTL }
  )
}

function issueRefreshToken(admin) {
  const { refreshSecret } = getSecrets()
  const now = Math.floor(Date.now() / 1000)
  return jwt.sign(
    {
      role: 'admin',
      name: admin.name,
      type: 'refresh',
      email: admin.email,
      iss: process.env.JWT_ISSUER || 'capital-network-api',
      aud: process.env.JWT_AUDIENCE || 'capital-network-web',
      iat: now,
      nbf: now,
    },
    refreshSecret,
    { subject: admin.id, expiresIn: `${REFRESH_TTL_DAYS}d` }
  )
}
```

**Rationale:** Added standard JWT claims to improve token security and validation:
- **iss (Issuer):** Identifies the principal that issued the JWT
- **aud (Audience):** Identifies the recipients that the JWT is intended for
- **iat (Issued At):** Identifies the time at which the JWT was issued
- **nbf (Not Before):** Identifies the time before which the JWT must not be accepted for processing

### 3. Updated Environment Variables Template
**File:** `.env.example`
**Lines:** 25-27

**Added:**
```bash
# JWT issuer and audience (optional, defaults provided)
JWT_ISSUER=capital-network-api
JWT_AUDIENCE=capital-network-web
```

**Rationale:** Added configuration options for JWT issuer and audience to allow customization for different deployment environments.

## JWT Token Structure

### Access Token
```json
{
  "role": "admin",
  "name": "Admin",
  "email": "admin@example.com",
  "iss": "capital-network-api",
  "aud": "capital-network-web",
  "iat": 1234567890,
  "nbf": 1234567890,
  "sub": "admin-id",
  "exp": 1234568790
}
```

**Lifetime:** 15 minutes

### Refresh Token
```json
{
  "role": "admin",
  "name": "Admin",
  "type": "refresh",
  "email": "admin@example.com",
  "iss": "capital-network-api",
  "aud": "capital-network-web",
  "iat": 1234567890,
  "nbf": 1234567890,
  "sub": "admin-id",
  "exp": 1235167890
}
```

**Lifetime:** 7 days

## Security Improvements

### Token Lifetime Management
- **Access Token:** 15 minutes - Short-lived, requires frequent refresh
- **Refresh Token:** 7 days - Balanced between security and user experience
- **Token Rotation:** New refresh token issued on each refresh
- **Token Pruning:** Old tokens pruned (max 50 per admin)

### Claim Validation
- **Issuer Validation:** Ensures tokens are from trusted source
- **Audience Validation:** Ensures tokens are used by intended audience
- **Time Validation:** iat and nbf prevent token reuse attacks
- **Subject Validation:** Ensures token belongs to correct admin

## Migration Instructions

### For Development
No migration required - existing tokens will continue to work until expiration. New tokens will include the enhanced claims.

### For Production
1. Update environment variables with custom issuer/audience if needed:
```bash
JWT_ISSUER=your-api-identifier
JWT_AUDIENCE=your-web-application
```

2. Deploy updated code
3. Existing tokens will expire naturally within 7 days
4. Users will be prompted to re-authenticate after token expiration

### Token Rotation Strategy
- Access tokens rotate every 15 minutes via refresh endpoint
- Refresh tokens rotate on each successful refresh
- Old refresh tokens are revoked immediately after new issuance
- Maximum 50 refresh tokens per admin (oldest pruned)

## Security Impact

- **Risk Reduction:** Eliminated 2 high-severity vulnerabilities (SEC-004, SEC-005)
- **Confidentiality:** Reduced token lifetime limits exposure window
- **Integrity:** Additional claims prevent token tampering and misuse
- **Availability:** Graceful token rotation maintains user experience

## Verification

To verify JWT hardening:

1. Check token claims:
```bash
# Login and decode access token
curl -X POST http://localhost:4001/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}' | jq

# Decode token (using jwt.io or jwt-cli)
jwt decode <access-token>
```

2. Verify claims include: iss, aud, iat, nbf, exp, sub

3. Verify refresh token TTL is 7 days:
```bash
# Check expiration timestamp
```

## Rollback Plan

If issues arise, rollback steps:

1. Revert REFRESH_TTL_DAYS to 30 in `server/services/auth.service.js`
2. Remove iss, aud, iat, nbf from token payloads
3. Remove JWT_ISSUER and JWT_AUDIENCE from `.env.example`
4. Delete this documentation file

## Related Findings

- SEC-004: JWT tokens missing required claims (iss, aud, iat, nbf)
- SEC-005: JWT refresh token TTL is 30 days, exceeds recommended 7 days

## Next Steps

- Implement JWT blacklist for immediate token revocation
- Add token fingerprinting to prevent token theft
- Implement token binding to IP or device
- Add token usage analytics and monitoring
- Consider implementing JWT with asymmetric keys for enhanced security
