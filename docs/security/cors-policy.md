# CORS Policy Hardening Documentation

## Overview
This document describes the CORS (Cross-Origin Resource Sharing) policy hardening performed to address CORS misconfigurations.

## Changes Made

### 1. Fixed Wildcard CORS in PHP API (SEC-008)
**File:** `api/index.php`
**Lines:** 6-21

**Before:**
```php
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
```

**After:**
```php
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");

// CORS configuration - use allowlist instead of wildcard
$allowedOrigins = getenv('CORS_ORIGINS') ?: getenv('NEXT_PUBLIC_SITE_URL') ?: 'http://localhost:5173';
$originArray = array_map('trim', explode(',', $allowedOrigins));
$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($requestOrigin, $originArray)) {
    header("Access-Control-Allow-Origin: $requestOrigin");
    header("Access-Control-Allow-Credentials: true");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
```

**Rationale:** Replaced wildcard CORS origin (`*`) with allowlist-based validation. The wildcard origin allows any domain to access the API, which is a critical security vulnerability. Now only explicitly allowed origins can access the API.

### 2. Fixed Wildcard CORS in Development Mode (SEC-009)
**File:** `server/config/cors.js`
**Lines:** 17-57

**Before:**
```javascript
if (env.NODE_ENV === 'production' && allowlist.length > 0) {
  return {
    origin(origin, callback) {
      if (!origin || allowlist.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('CORS origin not allowed'))
      }
    },
    credentials: true,
  }
}

return {
  origin: true,
  credentials: true,
}
```

**After:**
```javascript
// Use allowlist in all environments for security
// In development, fallback to localhost if no allowlist configured
if (allowlist.length > 0) {
  return {
    origin(origin, callback) {
      if (!origin || allowlist.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('CORS origin not allowed'))
      }
    },
    credentials: true,
  }
}

// Fallback for development: only allow localhost
const isDev = env.NODE_ENV === 'development'
if (isDev) {
  return {
    origin(origin, callback) {
      const allowedDevOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
      ]
      if (!origin || allowedDevOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('CORS origin not allowed in development'))
      }
    },
    credentials: true,
  }
}

// Production without allowlist: deny all
return {
  origin: false,
  credentials: false,
}
```

**Rationale:** Removed wildcard CORS in development mode. Previously, development mode allowed all origins (`origin: true`), which could be exploited. Now development mode only allows localhost origins, and production without explicit allowlist denies all requests.

## CORS Configuration

### Environment Variables
Configure CORS origins via environment variables:

```bash
# .env
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,https://app.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Priority Order
1. `CORS_ORIGINS` - Explicit comma-separated allowlist (highest priority)
2. `NEXT_PUBLIC_SITE_URL` - Fallback to site URL
3. Development localhost - Fallback for development only
4. Deny all - Production without configuration (safest)

### Allowed Origins by Environment

#### Development (NODE_ENV=development)
- If `CORS_ORIGINS` set: Use explicit allowlist
- If not set: Allow localhost only (ports 3000, 5173)
- Credentials: Enabled

#### Production (NODE_ENV=production)
- If `CORS_ORIGINS` set: Use explicit allowlist
- If not set: Deny all requests (fail-safe)
- Credentials: Enabled (if allowlist configured)

## Security Improvements

### Attack Prevention
- **CSRF Protection:** Restricted origins prevent CSRF attacks
- **Data Theft:** Prevents unauthorized domains from accessing API
- **Credential Leakage:** Credentials only sent to trusted origins
- **API Abuse:** Limits attack surface to known domains

### Defense in Depth
1. **Allowlist Validation:** Only pre-approved origins allowed
2. **Environment-Specific:** Different rules for dev/prod
3. **Fail-Safe Default:** Deny all if not configured
4. **Origin Reflection:** Reflects specific origin in response

## Migration Instructions

### For Development
1. Update `.env` with your development origins:
```bash
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

2. Or rely on localhost fallback (default behavior)

### For Production
1. Set `CORS_ORIGINS` with production domains:
```bash
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

2. Ensure `NEXT_PUBLIC_SITE_URL` is set as fallback:
```bash
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

3. Deploy updated code
4. Test API access from allowed origins
5. Verify requests from other origins are blocked

### Testing CORS Configuration

```bash
# Test from allowed origin
curl -H "Origin: https://yourdomain.com" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS http://localhost:4001/api/health

# Test from disallowed origin
curl -H "Origin: https://evil.com" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS http://localhost:4001/api/health
```

## Security Impact

- **Risk Reduction:** Eliminated 2 high-severity vulnerabilities (SEC-008, SEC-009)
- **Confidentiality:** Prevents unauthorized data access
- **Integrity:** Protects against CSRF attacks
- **Availability:** Legitimate origins continue to work

## Verification

To verify CORS hardening:

1. Check PHP API:
```bash
# Test PHP API CORS headers
curl -I http://localhost/api/health
# Should not include Access-Control-Allow-Origin: *
```

2. Check Node.js API:
```bash
# Test from allowed origin
curl -H "Origin: http://localhost:5173" \
  -X OPTIONS http://localhost:4001/api/health

# Test from disallowed origin
curl -H "Origin: https://evil.com" \
  -X OPTIONS http://localhost:4001/api/health
# Should return CORS error
```

3. Verify environment variables:
```bash
# Check CORS_ORIGINS is set in production
echo $CORS_ORIGINS
```

## Rollback Plan

If issues arise, rollback steps:

1. Revert `api/index.php` to wildcard CORS
2. Revert `server/config/cors.js` to previous version
3. Delete this documentation file

## Related Findings

- SEC-008: Wildcard CORS in PHP API (api/index.php line 9)
- SEC-009: CORS allows all origins in development mode (server/config/cors.js lines 30-33)

## Next Steps

- Implement CORS preflight caching optimization
- Add CORS violation logging and monitoring
- Consider implementing CORS nonce for additional security
- Add automated CORS testing to CI/CD pipeline
- Document approved origins for each environment
