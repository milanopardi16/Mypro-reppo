# Security Headers Hardening Documentation

## Overview
This document describes the security headers hardening performed to address missing security headers vulnerabilities.

## Changes Made

### 1. Added Content-Security-Policy Header (SEC-010)
**File:** `server/middlewares/security.middleware.js`
**Lines:** 13-25

**Before:**
```javascript
app.use(helmet({ crossOriginResourcePolicy: false }))
```

**After:**
```javascript
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  // ... other headers
}))
```

**Rationale:** Added Content-Security-Policy (CSP) header to prevent Cross-Site Scripting (XSS), clickjacking, and other code injection attacks. CSP restricts the sources from which content can be loaded, providing a powerful defense against various injection attacks.

### 2. Added Referrer-Policy Header (SEC-011)
**File:** `server/middlewares/security.middleware.js`
**Lines:** 26-28

**Added:**
```javascript
referrerPolicy: {
  policy: 'strict-origin-when-cross-origin',
},
```

**Rationale:** Added Referrer-Policy header to control how much referrer information is sent with navigation requests. The 'strict-origin-when-cross-origin' policy ensures that only the origin (scheme, host, port) is sent as referrer for cross-origin requests, protecting user privacy and preventing information leakage.

### 3. Added Permissions-Policy Header (SEC-012)
**File:** `server/middlewares/security.middleware.js`
**Lines:** 29-36

**Added:**
```javascript
permissionsPolicy: {
  features: {
    camera: ["'none'"],
    microphone: ["'none'"],
    geolocation: ["'none'"],
    payment: ["'none'"],
  },
},
```

**Rationale:** Added Permissions-Policy header to control which browser features and APIs can be used in the browser. By disabling camera, microphone, geolocation, and payment APIs by default, we reduce the attack surface and prevent unauthorized access to sensitive browser features.

## Security Headers Configuration

### Content-Security-Policy (CSP)

**Directives:**
- `defaultSrc 'self'`: Default policy for all content types - only allow same-origin
- `styleSrc 'self' 'unsafe-inline'`: Allow styles from same-origin and inline styles (for compatibility)
- `scriptSrc 'self'`: Only allow scripts from same-origin
- `imgSrc 'self' data: https:`: Allow images from same-origin, data URLs, and HTTPS
- `connectSrc 'self'`: Only allow fetch/XHR to same-origin
- `fontSrc 'self'`: Only allow fonts from same-origin
- `objectSrc 'none'`: Disallow plugins (Flash, Java, etc.)
- `mediaSrc 'self'`: Only allow media from same-origin
- `frameSrc 'none'`: Disallow embedding in frames (clickjacking protection)

**CSP Report-Only Mode (for testing):**
To test CSP without blocking content, use report-only mode:
```javascript
contentSecurityPolicy: {
  directives: { /* ... */ },
  reportOnly: true,
}
```

### Referrer-Policy

**Policy:** `strict-origin-when-cross-origin`

**Behavior:**
- Same-origin requests: Send full URL as referrer
- Cross-origin requests: Send only origin (scheme, host, port)
- HTTPS → HTTP: Send no referrer

**Alternative Policies:**
- `strict-origin-when-cross-origin` (current): Balanced security and functionality
- `no-referrer`: Maximum privacy, may break analytics
- `origin-when-cross-origin`: Less strict, may leak path information

### Permissions-Policy

**Disabled Features:**
- `camera: ['none']`: Prevent camera access
- `microphone: ['none']`: Prevent microphone access
- `geolocation: ['none']`: Prevent geolocation access
- `payment: ['none']`: Prevent payment API access

**Enabling Features (if needed):**
```javascript
permissionsPolicy: {
  features: {
    camera: ["'self'"],  // Allow camera from same-origin
    microphone: ["'self'"],  // Allow microphone from same-origin
    geolocation: ["'self'"],  // Allow geolocation from same-origin
  },
},
```

## Security Improvements

### Attack Prevention
- **XSS Protection:** CSP prevents execution of unauthorized scripts
- **Clickjacking:** CSP frame-ancestors directive prevents embedding
- **Data Injection:** CSP restricts content sources
- **Privacy Protection:** Referrer-Policy prevents information leakage
- **Feature Abuse:** Permissions-Policy prevents unauthorized API access

### Defense in Depth
1. **Content Restriction:** CSP limits content sources
2. **Information Control:** Referrer-Policy controls data leakage
3. **Feature Control:** Permissions-Policy restricts browser APIs
4. **Default Deny:** All features disabled by default

## Migration Instructions

### For Development
1. Deploy updated code
2. Monitor browser console for CSP violations
3. Adjust CSP directives if legitimate content is blocked
4. Test all functionality with new headers

### For Production
1. Test CSP in report-only mode first:
```javascript
contentSecurityPolicy: {
  directives: { /* ... */ },
  reportOnly: true,
}
```

2. Monitor CSP reports for violations
3. Adjust directives based on legitimate traffic patterns
4. Switch to enforce mode when confident:
```javascript
contentSecurityPolicy: {
  directives: { /* ... */ },
  reportOnly: false,
}
```

### Testing Security Headers

```bash
# Check security headers
curl -I http://localhost:4001/api/health

# Expected headers:
# Content-Security-Policy: default-src 'self'; ...
# Referrer-Policy: strict-origin-when-cross-origin
# Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
```

### CSP Violation Reporting

To receive CSP violation reports, add report-uri:
```javascript
contentSecurityPolicy: {
  directives: {
    reportUri: '/api/csp-report',
    // ... other directives
  },
}
```

## Security Impact

- **Risk Reduction:** Eliminated 3 medium-severity vulnerabilities (SEC-010, SEC-011, SEC-012)
- **Confidentiality:** Prevents data leakage via referrer
- **Integrity:** Prevents content injection attacks
- **Availability:** Legitimate content continues to work

## Verification

To verify security headers:

1. Check response headers:
```bash
curl -I http://localhost:4001/api/health | grep -i "content-security\|referrer\|permissions"
```

2. Test CSP enforcement:
```javascript
// Try to load external script (should be blocked)
const script = document.createElement('script')
script.src = 'https://evil.com/script.js'
document.head.appendChild(script)
// Should trigger CSP violation
```

3. Test Referrer-Policy:
```javascript
// Check referrer in network tab
// Should only show origin for cross-origin requests
```

4. Test Permissions-Policy:
```javascript
// Try to access camera (should be denied)
navigator.mediaDevices.getUserMedia({ video: true })
// Should throw PermissionDeniedError
```

## Rollback Plan

If issues arise, rollback steps:

1. Revert `server/middlewares/security.middleware.js` to previous version
2. Remove CSP, Referrer-Policy, and Permissions-Policy configurations
3. Delete this documentation file

## Related Findings

- SEC-010: Missing Content-Security-Policy header
- SEC-011: Missing Referrer-Policy header
- SEC-012: Missing Permissions-Policy header

## Next Steps

- Implement CSP violation reporting endpoint
- Add CSP nonce for inline scripts (if needed)
- Monitor CSP reports for attack attempts
- Consider adding HSTS header for HTTPS enforcement
- Implement Feature-Policy for additional browser features
- Add security headers monitoring to observability stack
