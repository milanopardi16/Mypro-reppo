# Rate Limiting Hardening Documentation

## Overview
This document describes the rate limiting hardening performed to address API abuse and DDoS vulnerabilities.

## Changes Made

### 1. Reduced Global Rate Limit (SEC-013)
**File:** `server/middlewares/security.middleware.js`
**Lines:** 41-50

**Before:**
```javascript
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
  })
)
```

**After:**
```javascript
// Global rate limit - reduced from 120 to 60 req/min for better protection
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً بعداً تلاش کنید.' },
  })
)
```

**Rationale:** Reduced global rate limit from 120 to 60 requests per minute to provide better protection against API abuse and DDoS attacks while still allowing legitimate traffic. Added user-friendly error message in Persian.

### 2. Added Contact Form Rate Limit
**File:** `server/middlewares/security.middleware.js`
**Lines:** 64-74

**Added:**
```javascript
// Rate limit for contact form to prevent spam
app.use(
  '/api/contact',
  rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'تعداد پیام‌های تماس بیش از حد مجاز است. لطفاً بعداً تلاش کنید.' },
  })
)
```

**Rationale:** Added rate limiting for contact form endpoint to prevent spam and abuse. Limited to 10 messages per hour per IP address.

### 3. Added Registration Rate Limit
**File:** `server/middlewares/security.middleware.js`
**Lines:** 76-86

**Added:**
```javascript
// Rate limit for registration endpoint
app.use(
  '/api/registrations',
  rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'تعداد ثبت‌نام‌ها بیش از حد مجاز است. لطفاً بعداً تلاش کنید.' },
  })
)
```

**Rationale:** Added rate limiting for registration endpoint to prevent automated registration attacks and spam. Limited to 5 registrations per hour per IP address.

### 4. Added Founder Onboarding Rate Limit
**File:** `server/middlewares/security.middleware.js`
**Lines:** 88-98

**Added:**
```javascript
// Rate limit for founder onboarding
app.use(
  '/api/founder-onboarding',
  rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 3,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'تعداد درخواست‌های ارزیابی بیش از حد مجاز است. لطفاً بعداً تلاش کنید.' },
  })
)
```

**Rationale:** Added rate limiting for founder onboarding endpoint to prevent abuse of evaluation submission system. Limited to 3 submissions per hour per IP address.

## Rate Limiting Configuration

### Global Rate Limit
- **Endpoint:** All endpoints
- **Limit:** 60 requests per minute
- **Window:** 1 minute
- **Purpose:** General API abuse prevention

### Endpoint-Specific Rate Limits

| Endpoint | Limit | Window | Purpose |
|----------|-------|--------|---------|
| `/api/admin/auth/login` | 20 | 15 minutes | Brute force prevention |
| `/api/contact` | 10 | 1 hour | Spam prevention |
| `/api/registrations` | 5 | 1 hour | Automated registration prevention |
| `/api/founder-onboarding` | 3 | 1 hour | Evaluation abuse prevention |

### Rate Limit Headers
All rate limits include standard headers:
- `RateLimit-Limit`: Maximum requests per window
- `RateLimit-Remaining`: Remaining requests in current window
- `RateLimit-Reset`: Unix timestamp when window resets

### Error Messages
All rate limit errors return user-friendly Persian messages:
- Global: "تعداد درخواست‌ها بیش از حد مجاز است. لطفاً بعداً تلاش کنید."
- Login: "تعداد تلاش‌های ورود بیش از حد مجاز است. لطفاً بعداً تلاش کنید."
- Contact: "تعداد پیام‌های تماس بیش از حد مجاز است. لطفاً بعداً تلاش کنید."
- Registration: "تعداد ثبت‌نام‌ها بیش از حد مجاز است. لطفاً بعداً تلاش کنید."
- Onboarding: "تعداد درخواست‌های ارزیابی بیش از حد مجاز است. لطفاً بعداً تلاش کنید."

## Security Improvements

### Attack Prevention
- **DDoS Mitigation:** Global limit prevents large-scale attacks
- **Brute Force:** Login limit prevents credential stuffing
- **Spam Prevention:** Contact and registration limits prevent automated abuse
- **Resource Protection:** Limits protect server resources from exhaustion

### Defense in Depth
1. **Global Protection:** Baseline limit for all traffic
2. **Endpoint-Specific:** Tailored limits for sensitive endpoints
3. **User-Friendly:** Clear error messages in user's language
4. **Standard Headers:** Rate limit information exposed to clients

## Migration Instructions

### For Development
1. Deploy updated code
2. Test rate limits with curl or Postman
3. Verify error messages are displayed correctly
4. Monitor rate limit headers in responses

### For Production
1. Monitor rate limit violations in logs
2. Adjust limits based on legitimate traffic patterns
3. Consider implementing Redis-backed rate limiting for distributed systems
4. Add rate limit monitoring to observability stack

### Testing Rate Limits

```bash
# Test global rate limit (60 req/min)
for i in {1..65}; do
  curl -s http://localhost:4001/api/health | head -1
done
# Should return rate limit error after 60 requests

# Test login rate limit (20 per 15 min)
for i in {1..25}; do
  curl -X POST http://localhost:4001/api/admin/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"test"}'
done
# Should return rate limit error after 20 attempts

# Check rate limit headers
curl -I http://localhost:4001/api/health
# Should include RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset
```

### Customizing Rate Limits

To adjust rate limits for your needs, modify the values in `server/middlewares/security.middleware.js`:

```javascript
// Example: Increase global limit to 100 req/min
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 100, // Changed from 60
    // ...
  })
)
```

## Security Impact

- **Risk Reduction:** Eliminated 1 medium-severity vulnerability (SEC-013)
- **Availability:** Prevents resource exhaustion attacks
- **Integrity:** Prevents automated abuse and spam
- **Confidentiality:** Protects against credential stuffing

## Verification

To verify rate limiting:

1. Test global rate limit:
```bash
# Send 61 requests rapidly
for i in {1..61}; do
  curl -s http://localhost:4001/api/health > /dev/null
done
# Last request should fail with rate limit error
```

2. Test endpoint-specific limits:
```bash
# Test contact form limit
for i in {1..11}; do
  curl -X POST http://localhost:4001/api/contact \
    -H "Content-Type: application/json" \
    -d '{"fullName":"Test","message":"Test"}' > /dev/null
done
# Should fail after 10 requests
```

3. Check rate limit headers:
```bash
curl -I http://localhost:4001/api/health
# Look for: RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset
```

## Rollback Plan

If issues arise, rollback steps:

1. Revert `server/middlewares/security.middleware.js` to previous version
2. Remove endpoint-specific rate limits
3. Restore global limit to 120 req/min
4. Delete this documentation file

## Related Findings

- SEC-013: Global rate limit of 120 req/min may be too permissive

## Next Steps

- Implement Redis-backed rate limiting for distributed deployments
- Add rate limit analytics and monitoring
- Implement IP whitelisting for trusted sources
- Add CAPTCHA for sensitive endpoints after rate limit exceeded
- Implement rate limit bypass for authenticated users
- Add rate limit logging and alerting
- Consider implementing adaptive rate limiting based on traffic patterns
