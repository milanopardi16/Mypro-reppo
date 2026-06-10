# 🚀 DEPLOYMENT_READY - Production Deployment Guide

**Project:** Capital Network  
**Version:** 0.1.0  
**Target:** Railway + GitHub  
**Node Version:** >=18  
**Last Updated:** 2026-06-10

---

## ✅ Pre-Deployment Checklist

All critical production deployment requirements have been addressed:

- ✅ Security cleanup: All hardcoded secrets removed from source control
- ✅ Git configuration: .gitignore updated to production standards
- ✅ Environment files: .env, .env.local cleaned of secrets
- ✅ Environment template: .env.example ready for deployment
- ✅ Docker configuration: Dockerfile optimized for Railway
- ✅ Docker ignore: .dockerignore excludes sensitive files
- ✅ Health endpoint: GET /health returning HTTP 200
- ✅ Port configuration: Respects dynamic PORT injection
- ✅ Prisma setup: Database configuration uses environment variables
- ✅ Package scripts: Build and start commands validated
- ✅ Database ready: Migrations and seeding configured

---

## 🔑 Required Railway Environment Variables

**Set these in Railway Dashboard → Project Settings → Variables**

### Critical Secrets (Generate new values for production)

```bash
# Database (PostgreSQL via Neon or Railway)
DATABASE_URL=postgresql://user:password@host:5432/dbname?schema=public
DIRECT_URL=postgresql://user:password@host:5432/dbname?schema=public

# JWT Authentication Secrets (min 32 chars each, cryptographically random)
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
JWT_ACCESS_SECRET=YOUR_GENERATED_SECRET_MIN_32_CHARS
JWT_REFRESH_SECRET=YOUR_GENERATED_SECRET_MIN_32_CHARS

# NextAuth Secret (min 32 chars)
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
NEXTAUTH_SECRET=YOUR_GENERATED_SECRET_MIN_32_CHARS

# Admin Account (used only for initial seed during deployment)
# CRITICAL: Change password immediately after first login via admin panel
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=STRONG_PASSWORD_MIN_8_CHARS_CHANGE_IMMEDIATELY
ADMIN_PASSWORD_SALT=YOUR_GENERATED_SALT_MIN_32_CHARS
```

### Production Configuration

```bash
# Runtime Environment
NODE_ENV=production
PORT=4001
REG_SERVER_PORT=4001

# Public URL (no localhost)
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com

# Optional: JWT Claims Configuration
JWT_ISSUER=capital-network-api
JWT_AUDIENCE=capital-network-web

# Optional: CORS Origins (comma-separated if multiple)
CORS_ORIGINS=https://your-production-domain.com

# Optional: Firebase Cloud Messaging
# FIREBASE_PROJECT_ID=
# FIREBASE_CLIENT_EMAIL=
# FIREBASE_PRIVATE_KEY=

# Optional: Supabase
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
# SUPABASE_SERVICE_ROLE_KEY=

# Optional: Admin Token for Socket.IO (disable if unused)
# ADMIN_TOKEN=

# Optional: Serve Static Frontend
SERVE_STATIC=true
```

---

## 🏗️ Build and Start Commands

### Build Command
```bash
npm ci --include=dev && npm run build
```

**What it does:**
- Installs dependencies with package-lock.json
- Generates Prisma client
- Builds frontend assets with Vite
- Creates optimized distribution

### Start Command
```bash
npm run start:prod
```

**What it does:**
- Sets NODE_ENV to production
- Reads environment variables from Railway
- Starts Express server on dynamic PORT
- Connects to PostgreSQL database
- Serves static frontend if built
- Listens on /health endpoint

---

## 📋 Deployment Steps (Railway)

### Step 1: Create Railway Project
1. Go to [railway.app](https://railway.app)
2. Create new project → GitHub
3. Connect your repository
4. Select the main branch

### Step 2: Configure PostgreSQL Database
1. Add service → PostgreSQL
2. Railway automatically creates DATABASE_URL
3. Copy DIRECT_URL from database settings for migrations

### Step 3: Set Environment Variables
1. Railway → Project → Variables
2. Add all **Critical Secrets** from section above
3. Add all **Production Configuration** variables

### Step 4: Configure Deploy Settings
1. Build Command: `npm ci --include=dev && npm run build`
2. Start Command: `npm run start:prod`
3. Node Version: >=18 (uses default if not specified)

### Step 5: Configure Health Checks
1. Railway → Service Settings
2. Health Check URL: `/health`
3. Health Check Interval: 30s
4. Health Check Timeout: 5s

### Step 6: Deploy
1. Railway automatically deploys on git push to main
2. Or manually click "Deploy" button
3. Monitor build and startup logs
4. Verify health checks passing

### Step 7: Database Setup
Railway automatically runs on first deploy:
```bash
npm run db:setup  # runs: prisma migrate deploy && prisma db seed
```

---

## 🔐 Security Changes Made

### Files Secured
- ✅ `.env` → Cleaned, now contains only placeholders
- ✅ `.env.local` → Cleaned, now contains only placeholders
- ✅ `.env.example` → Updated with secure template
- ✅ `.gitignore` → Expanded with comprehensive rules
- ✅ `.dockerignore` → Optimized for production

### Data Protection
- ✅ Runtime JSON files excluded from git:
  - `data/registrations.json`
  - `data/admin-refresh-tokens.json`
  - `data/admin-messages.json`
  - `data/admin-notifications.json`
  - `data/chat-messages.json`
  - `data/chat-rooms.json`
  - `data/evaluations.json`
  - `data/founder-submissions.json`

### Secrets Excluded from Version Control
- ✅ Database credentials
- ✅ JWT secrets
- ✅ Admin passwords
- ✅ API keys (Firebase, Supabase)
- ✅ SSL certificates
- ✅ SSH keys

### Environment Variable Strategy
- Production secrets **never** stored in repository
- All secrets injected via Railway environment variables
- Example template provided for developers
- Local development values in `.env.local` (ignored by git)

---

## 🏥 Health Check Endpoint

### Endpoint
```
GET /health
```

### Response (HTTP 200)
```json
{
  "status": "ok"
}
```

### Used By
- Railway health checks (automatic restart if failing)
- Kubernetes probes (if using Kubernetes)
- Load balancer status checks
- Monitoring systems

**Configured in:** `server/app.js` (lightweight, no middleware)

---

## 🗄️ Database Configuration

### PostgreSQL Connection
- **Provider:** PostgreSQL (via Prisma)
- **Connection Pooling:** Optional (PgBouncer for high-traffic)
- **Migrations:** Automatic on deploy via `prisma migrate deploy`
- **Seeding:** Automatic first-time via `prisma db seed`

### Environment Variables
```
DATABASE_URL      → Connection string for application
DIRECT_URL        → Direct connection for migrations (bypasses pooling)
```

### Prisma Migration Strategy
1. **First Deploy:** `prisma migrate deploy` runs automatically
2. **First Deploy:** `prisma db seed` creates initial admin account
3. **Subsequent Deploys:** Migrations run automatically if new ones exist

### Neon Database (Recommended for Railway)
- Serverless PostgreSQL
- Auto-scaling
- Built-in connection pooling
- Cold start optimization in Dockerfile

---

## 📦 Docker Image Details

### Base Image
- `node:22-bullseye-slim` (production-optimized)

### Multi-Stage Build
1. **deps stage:** Installs production dependencies
2. **build stage:** Installs all deps, builds frontend
3. **runner stage:** Production image with minimal footprint

### Image Size Optimization
- ✅ Excludes node_modules from dependencies stage
- ✅ Uses slim base image (~150MB)
- ✅ Removes unnecessary files via .dockerignore
- ✅ Creates non-root user for security

### User Permissions
- Non-root user: `app`
- Uploads directory created with proper permissions
- `/app` owned by app user

---

## 🚀 Performance Optimization

### Frontend
- Vite build optimization
- Asset compression
- Static file caching (1 day max-age)
- Index.html served from dist/

### Backend
- Express rate limiting enabled
- Helmet security headers
- CORS properly configured
- Database connection pooling

### Node.js
- Production-optimized startup
- Graceful shutdown (15s timeout)
- Health check endpoint lightweight
- Error handling robust

---

## 📊 Monitoring and Logs

### Application Logs
- Structured JSON logging
- Correlation IDs for request tracing
- Separate handling for development/production
- Access logs for API requests

### Railroad Health Monitoring
```
GET /health → HTTP 200
```

**Log locations:**
- Railway Dashboard → Service → Logs
- Real-time streaming available
- Automatic log retention

### Key Metrics to Monitor
- Startup time: <10s
- Health check: 100% pass rate
- Memory usage: Stable after 1min
- Database connections: Stable after seed
- Error rate: Near 0% in healthy state

---

## 🐛 Troubleshooting

### Deploy Fails
1. Check Railway build logs
2. Verify all required env vars set
3. Ensure DATABASE_URL is correct
4. Check Node version compatibility (≥18)

### Health Checks Failing
1. Verify PORT environment variable set
2. Check server startup logs
3. Ensure database connection working
4. Verify /health endpoint accessible

### Database Connection Issues
1. Verify DATABASE_URL and DIRECT_URL
2. Check PostgreSQL service running
3. Verify IP whitelist (if applicable)
4. Check connection pool limits

### Deployment Loops
1. Check for infinite restart loops in logs
2. Verify SERVE_STATIC setting
3. Check for unhandled promise rejections
4. Review error middleware logs

---

## ✨ Changes Summary

### Git & Security
- Updated `.gitignore` with comprehensive production rules
- Excluded all environment files from git
- Excluded all runtime data files
- Excluded user uploads from git

### Environment Configuration
- Cleaned `.env` of secrets
- Cleaned `.env.local` of secrets
- Enhanced `.env.example` with security guidance
- Documented all required variables

### Docker
- Updated `.dockerignore` to production standards
- Verified Dockerfile multi-stage build
- Confirmed health check configuration
- Validated node user security

### Code Review
- Verified no hardcoded secrets in source
- Confirmed PORT configuration uses environment variable
- Validated /health endpoint availability
- Confirmed Prisma uses DATABASE_URL from env

---

## 📝 Next Steps After Deployment

### Immediate (Within 1 hour)
1. Access admin dashboard at `/admin`
2. Login with credentials from Railway variables
3. Change ADMIN_PASSWORD immediately
4. Set up SMTP for email notifications
5. Configure Firebase/Supabase if using

### Short Term (Within 24 hours)
1. Test all critical user flows
2. Verify database backups enabled
3. Set up error tracking (Sentry, etc.)
4. Configure custom domain
5. Enable SSL/TLS certificate

### Medium Term (Within 1 week)
1. Set up CI/CD for deployments
2. Configure automated backups
3. Implement monitoring alerts
4. Set up log aggregation
5. Plan disaster recovery

### Ongoing
1. Monitor health checks daily
2. Review error logs weekly
3. Rotate secrets quarterly
4. Keep dependencies updated
5. Monitor costs on Railway

---

## 📞 Support Resources

- [Railway Documentation](https://docs.railway.app)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com)
- [Vite Documentation](https://vitejs.dev)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides)

---

**Status:** ✅ READY FOR PRODUCTION  
**Security Review:** ✅ PASSED  
**Documentation:** ✅ COMPLETE
