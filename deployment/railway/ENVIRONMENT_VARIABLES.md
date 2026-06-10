# Environment Variables Reference

**Complete inventory of all environment variables used by Capital Network API**

---

## Quick Reference

### Minimal Production Setup

```env
NODE_ENV=production
PORT=8000
DATABASE_URL=postgresql://user:pass@host:5432/dbname
DIRECT_URL=postgresql://user:pass@host:5432/dbname
JWT_ACCESS_SECRET=<32+ character random string>
JWT_REFRESH_SECRET=<32+ character random string>
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=<secure password>
ADMIN_PASSWORD_SALT=<32+ character random string>
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## Complete Variable Reference

### Runtime Environment

#### `NODE_ENV`
- **Type:** `string`
- **Required:** Yes
- **Values:** `development` | `production` | `staging`
- **Default:** `development`
- **Usage:** Determines logging level, error details, static file serving
- **Railway:** Set to `production`
- **Example:** `NODE_ENV=production`

#### `PORT` / `REG_SERVER_PORT`
- **Type:** `number`
- **Required:** No
- **Default:** `4001`
- **Usage:** Express server listen port
- **Railway Note:** Railway sets PORT automatically (e.g., 8000), code must respect it
- **Priority:** `REG_SERVER_PORT` > `PORT` > `4001`
- **Example:** `PORT=8000` (set by Railway)

---

### Database Configuration

#### `DATABASE_URL`
- **Type:** `string` (PostgreSQL connection string)
- **Required:** YES - Required for runtime
- **Format:** `postgresql://user:password@host:port/dbname?schema=public`
- **Usage:** Primary database connection (with connection pooling if using PgBouncer)
- **Railway:** Provided by Railway PostgreSQL addon
- **Example:**
  ```
  postgresql://admin:mypassword@localhost:5432/capital_network?schema=public
  ```
- **Security:** Store securely in Railway Variables, never commit

#### `DIRECT_URL`
- **Type:** `string` (PostgreSQL connection string)
- **Required:** YES - Required for Prisma migrations
- **Format:** `postgresql://user:password@host:port/dbname`
- **Usage:** Direct connection (bypasses PgBouncer) for `prisma migrate deploy`
- **Railway:** Should point to native PostgreSQL (not connection pooled)
- **Example:**
  ```
  postgresql://admin:mypassword@pghost.railway.internal:5432/capital_network
  ```
- **When Needed:** If using PgBouncer, DIRECT_URL must be separate from DATABASE_URL
- **Note:** Can be same as DATABASE_URL if not using connection pooling

---

### Authentication & Secrets

#### `JWT_ACCESS_SECRET`
- **Type:** `string`
- **Required:** YES - Required for JWT signing
- **Minimum Length:** 32 characters
- **Constraints:** Must be cryptographically random
- **Usage:** Signs JWT access tokens for short-lived authentication
- **Lifetime:** Tokens typically valid for 15 minutes
- **Generation:**
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```
- **Rotation:** Should be rotated before production
- **Security:** Never commit, regenerate for each environment
- **Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (base64 encoded)

#### `JWT_REFRESH_SECRET`
- **Type:** `string`
- **Required:** YES - Required for refresh token signing
- **Minimum Length:** 32 characters
- **Constraints:** Must be different from JWT_ACCESS_SECRET
- **Usage:** Signs JWT refresh tokens for long-lived authentication
- **Lifetime:** Refresh tokens typically valid for 7-30 days
- **Generation:** Same as JWT_ACCESS_SECRET
- **Security:** Separate from access secret for security
- **Example:** Different 32+ character random string

#### `JWT_ISSUER`
- **Type:** `string`
- **Required:** No
- **Default:** `capital-network-api`
- **Usage:** Added to JWT `iss` claim, identifies token issuer
- **Example:** `JWT_ISSUER=capital-network-api`

#### `JWT_AUDIENCE`
- **Type:** `string`
- **Required:** No
- **Default:** `capital-network-web`
- **Usage:** Added to JWT `aud` claim, identifies intended recipient
- **Example:** `JWT_AUDIENCE=capital-network-web`

#### `NEXTAUTH_SECRET`
- **Type:** `string`
- **Required:** No (unless using NextAuth.js)
- **Minimum Length:** 32 characters
- **Usage:** NextAuth.js session encryption secret
- **Note:** Only required if using NextAuth.js for authentication
- **Generation:** `openssl rand -base64 32`
- **Example:** `NEXTAUTH_SECRET=<32+ char secret>`

---

### Admin Account (Seed Data)

These variables are used ONLY during `prisma db seed` to create the initial admin account.

#### `ADMIN_EMAIL`
- **Type:** `string` (valid email)
- **Required:** YES - For admin account creation
- **Usage:** Email address for admin login
- **Format:** Valid email format (user@domain.com)
- **Security:** Can be any email, changed after first login
- **Example:** `ADMIN_EMAIL=admin@company.com`

#### `ADMIN_USERNAME`
- **Type:** `string`
- **Required:** No
- **Default:** `admin`
- **Usage:** Username for admin login (optional if using email)
- **Example:** `ADMIN_USERNAME=admin`

#### `ADMIN_PASSWORD`
- **Type:** `string`
- **Required:** YES - For admin account creation
- **Minimum Length:** 8 characters
- **Constraints:** Must be changed after first login in production
- **Usage:** Initial password for admin account
- **CRITICAL:** Different password for each environment
- **Security:** Never reuse across dev/staging/production
- **Generation:** `openssl rand -base64 12`
- **Example:** `ADMIN_PASSWORD=SecurePass123!`
- **Note:** MUST change via admin panel immediately after first login

#### `ADMIN_PASSWORD_SALT`
- **Type:** `string`
- **Required:** YES - For password hashing
- **Minimum Length:** 32 characters
- **Constraints:** Must be cryptographically random
- **Usage:** Salt for bcryptjs password hashing
- **Generation:**
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```
- **Security:** Must NOT be committed to version control
- **Example:** `ADMIN_PASSWORD_SALT=<32+ char random string>`

#### `ADMIN_TOKEN` (Legacy)
- **Type:** `string`
- **Required:** No
- **Deprecated:** Legacy Socket.IO authentication
- **Status:** Should be disabled in production
- **Usage:** Only for development Socket.IO testing
- **Security:** DO NOT use in production
- **Default:** Empty (disabled)

---

### Frontend Configuration

#### `NEXT_PUBLIC_SITE_URL`
- **Type:** `string` (absolute URL)
- **Required:** YES - Required for CORS and redirects
- **Format:** Full URL with protocol (https:// in production)
- **Usage:** Public-facing site URL, added to Vite build
- **CORS:** Added to allowed origins automatically
- **Cookies:** Used for SameSite cookie domain
- **Redirects:** Used for post-login redirects
- **Development:** `http://localhost:5173` or `http://localhost:3000`
- **Production:** `https://yourdomain.com` (must be HTTPS)
- **Example:** `NEXT_PUBLIC_SITE_URL=https://capital-network.com`
- **Security:** Must be HTTPS in production

---

### Optional Configuration

#### `CORS_ORIGINS`
- **Type:** `string` (comma-separated URLs)
- **Required:** No
- **Default:** Uses NEXT_PUBLIC_SITE_URL
- **Usage:** Additional CORS allowed origins
- **Format:** `https://domain1.com,https://domain2.com`
- **Example:**
  ```
  CORS_ORIGINS=https://admin.example.com,https://app.example.com
  ```

#### `SERVE_STATIC`
- **Type:** `boolean` | `string`
- **Required:** No
- **Default:** `true` (in production)
- **Usage:** Serve Vite-built frontend from Express
- **Values:** `true` | `false` | `"true"` | `"false"`
- **Production:** Should be `true` (serve frontend and API together)
- **Separate Frontend:** Set to `false` if frontend served elsewhere
- **Example:** `SERVE_STATIC=true`

#### `API_URL`
- **Type:** `string` (absolute URL)
- **Required:** No
- **Default:** Uses REG_SERVER_PORT or PORT
- **Usage:** Override for API endpoint URL
- **Use Case:** External API gateway or proxy
- **Example:** `API_URL=https://api.example.com`

---

### Optional External Services

#### Firebase Cloud Messaging

**`FIREBASE_PROJECT_ID`**
- **Type:** `string`
- **Required:** No (only if using Firebase)
- **Usage:** Firebase project ID for push notifications
- **Source:** Firebase Console → Project Settings
- **Example:** `FIREBASE_PROJECT_ID=my-project-12345`

**`FIREBASE_CLIENT_EMAIL`**
- **Type:** `string` (email)
- **Required:** No (only if using Firebase)
- **Usage:** Firebase service account email
- **Source:** Firebase Console → Service Account Key
- **Format:** `firebase-adminsdk-...@your-project.iam.gserviceaccount.com`
- **Example:** `FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc@my-project.iam.gserviceaccount.com`

**`FIREBASE_PRIVATE_KEY`**
- **Type:** `string` (PEM-formatted private key)
- **Required:** No (only if using Firebase)
- **Usage:** Firebase service account private key
- **Source:** Firebase Console → Service Account Key (JSON download)
- **Security:** Must NOT be committed, store securely
- **Format:** Multiline key, often stored as JSON escaped string
- **Example:**
  ```
  FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
  ```

---

#### Supabase Configuration

**`NEXT_PUBLIC_SUPABASE_URL`**
- **Type:** `string` (absolute URL)
- **Required:** No (only if using Supabase)
- **Usage:** Supabase project URL (exposed to client)
- **Source:** Supabase Dashboard → Project Settings
- **Format:** `https://[project-id].supabase.co`
- **Example:** `NEXT_PUBLIC_SUPABASE_URL=https://myproject.supabase.co`

**`NEXT_PUBLIC_SUPABASE_ANON_KEY`**
- **Type:** `string` (API key)
- **Required:** No (only if using Supabase)
- **Usage:** Supabase anonymous key for client-side access
- **Source:** Supabase Dashboard → Project Settings → API Keys
- **Security:** Public key, safe to expose
- **Example:** `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...`

**`SUPABASE_SERVICE_ROLE_KEY`**
- **Type:** `string` (API key)
- **Required:** No (only if using Supabase)
- **Usage:** Supabase service role key for server-side access
- **Source:** Supabase Dashboard → Project Settings → API Keys
- **Security:** Secret key, must NOT be exposed to client
- **Restrictions:** Server-side only, never commit
- **Example:** `SUPABASE_SERVICE_ROLE_KEY=eyJ...`

---

## Environment-Specific Configurations

### Development

```env
NODE_ENV=development
PORT=4001
DATABASE_URL=postgresql://user:pass@localhost:5432/capital_dev
DIRECT_URL=postgresql://user:pass@localhost:5432/capital_dev
JWT_ACCESS_SECRET=dev-access-secret-minimum-32-characters-required
JWT_REFRESH_SECRET=dev-refresh-secret-minimum-32-characters-required
ADMIN_EMAIL=admin@dev.local
ADMIN_PASSWORD=DevPassword123
ADMIN_PASSWORD_SALT=dev-salt-minimum-32-characters-required
NEXT_PUBLIC_SITE_URL=http://localhost:5173
SERVE_STATIC=false
```

### Staging

```env
NODE_ENV=production
PORT=8000
DATABASE_URL=postgresql://user:pass@staging-host:5432/capital_staging
DIRECT_URL=postgresql://user:pass@staging-host:5432/capital_staging
JWT_ACCESS_SECRET=<staging-secret-32+chars>
JWT_REFRESH_SECRET=<staging-secret-32+chars>
ADMIN_EMAIL=admin@staging.company.com
ADMIN_PASSWORD=<staging-password>
ADMIN_PASSWORD_SALT=<staging-salt-32+chars>
NEXT_PUBLIC_SITE_URL=https://staging.company.com
SERVE_STATIC=true
```

### Production

```env
NODE_ENV=production
PORT=8000
DATABASE_URL=postgresql://user:pass@prod-host:5432/capital
DIRECT_URL=postgresql://user:pass@prod-host:5432/capital
JWT_ACCESS_SECRET=<prod-secret-32+chars>
JWT_REFRESH_SECRET=<prod-secret-32+chars>
ADMIN_EMAIL=admin@company.com
ADMIN_PASSWORD=<prod-password-12+chars>
ADMIN_PASSWORD_SALT=<prod-salt-32+chars>
NEXT_PUBLIC_SITE_URL=https://company.com
SERVE_STATIC=true
CORS_ORIGINS=https://company.com,https://www.company.com
```

---

## Secret Generation Guide

### Generate 32-character random string (JWT secrets)

**Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**OpenSSL:**
```bash
openssl rand -base64 32
```

**Python:**
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Generate admin password

```bash
openssl rand -base64 12
# Result: Example output like "a1B2c3D4e5F6g7H8"
```

### Verify secret strength

Use this Node.js script:
```bash
node -e "
const secret = process.argv[1];
console.log('Length:', secret.length);
console.log('Is 32+ chars:', secret.length >= 32);
console.log('Has entropy:', /[A-Z]/.test(secret) && /[a-z]/.test(secret) && /[0-9]/.test(secret));
" "YOUR_SECRET_HERE"
```

---

## Security Best Practices

✅ **DO:**
- Store secrets in Railway Variables dashboard
- Rotate secrets periodically (recommended: quarterly)
- Use different secrets for each environment
- Use cryptographically random generation
- Keep DIRECT_URL separate if using PgBouncer
- Use HTTPS URLs in production
- Change admin password immediately after first login

❌ **DON'T:**
- Commit real secrets to version control
- Reuse passwords across environments
- Hardcode secrets in source code
- Expose service keys to frontend
- Use short or weak passwords
- Share environment files between environments
- Log secrets in error messages

---

## Troubleshooting

### "DATABASE_URL not set"
- Ensure DATABASE_URL is set in Railway Variables
- Restart application after setting variables
- Check PostgreSQL addon is running

### "JWT token validation failed"
- Verify JWT_ACCESS_SECRET is set
- Ensure secret is at least 32 characters
- Check token hasn't expired
- Verify secret is same across deployment restarts

### "Admin login fails"
- Verify ADMIN_EMAIL and ADMIN_PASSWORD are correct
- Run `prisma db seed` to recreate admin account
- Check ADMIN_PASSWORD_SALT is set

### "CORS errors in browser"
- Verify NEXT_PUBLIC_SITE_URL matches frontend URL
- Add frontend URL to CORS_ORIGINS if needed
- Ensure HTTPS in production (http blocked by browsers)

---

## Complete Variable Checklist for Deployment

### Before Railway Deployment

- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL` set (PostgreSQL connection)
- [ ] `DIRECT_URL` set (direct DB connection)
- [ ] `JWT_ACCESS_SECRET` generated (32+ chars)
- [ ] `JWT_REFRESH_SECRET` generated (32+ chars)
- [ ] `ADMIN_EMAIL` set to valid email
- [ ] `ADMIN_PASSWORD` set to secure password (12+ chars)
- [ ] `ADMIN_PASSWORD_SALT` generated (32+ chars)
- [ ] `NEXT_PUBLIC_SITE_URL` set to production domain (HTTPS)
- [ ] All secrets are unique per environment
- [ ] No hardcoded secrets in source code
- [ ] All passwords changed from defaults

---

**Last Updated:** 2026-06-10  
**Status:** ✅ Production Ready
