# Railway Deployment Checklist

**Project:** Capital Network  
**Date:** 2026-06-10  
**Version:** 1.0

---

## Pre-Deployment Phase

### Repository Validation

- [ ] **Code merged to main branch**
  - All feature branches merged
  - No uncommitted changes
  - Latest code committed

- [ ] **Latest dependencies installed**
  ```bash
  npm ci
  ```
  - No outdated packages
  - All vulnerabilities patched

- [ ] **Build tests passed**
  ```bash
  npm run build
  ```
  - No build errors
  - No TypeScript errors
  - All assets generated

- [ ] **Linting passed**
  ```bash
  npm run lint
  ```
  - No ESLint errors
  - Code quality checks passed

### Git Configuration

- [ ] **`.git` folder excluded**
  - Verify in `.gitignore`
  - Not committed to repository

- [ ] **No secret files committed**
  - `.env` not in Git
  - `.env.local` not in Git
  - API keys not exposed
  - Database passwords not exposed

- [ ] **`.gitignore` is complete**
  - `node_modules/` excluded
  - `dist/` excluded
  - `.env*` files excluded
  - `uploads/` excluded

### File Validation

- [ ] **railway.json is valid JSON**
  ```bash
  cat railway.json | jq .
  ```
  - Valid build command
  - Valid start command
  - Health check path set

- [ ] **package.json is valid JSON**
  - All scripts exist
  - No circular dependencies
  - Correct Node version (>=18)

- [ ] **prisma/schema.prisma is valid**
  ```bash
  npm run validate:prisma
  ```
  - DataSource configured
  - Generator configured
  - Migrations present

---

## Environment Preparation

### Railway Project Setup

- [ ] **Railway account created**
  - Login to https://railway.app
  - Project created
  - Team member access configured

- [ ] **PostgreSQL plugin added**
  - Database instance created
  - Connection credentials ready
  - Backup configuration set

- [ ] **Environment variables prepared**
  - DATABASE_URL copied
  - DIRECT_URL copied
  - Secrets generated
  - Admin credentials created

### Secrets Generation

- [ ] **JWT_ACCESS_SECRET generated**
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
  - Minimum 32 characters
  - Cryptographically random

- [ ] **JWT_REFRESH_SECRET generated**
  - Minimum 32 characters
  - Different from access secret

- [ ] **NEXTAUTH_SECRET generated**
  - Minimum 32 characters
  - Unique value

- [ ] **ADMIN_PASSWORD_SALT generated**
  - Minimum 32 characters
  - Unique value

- [ ] **ADMIN_PASSWORD chosen**
  - Minimum 8 characters
  - Strong password criteria met
  - Not reused from other environments

### Security Audit

- [ ] **Hardcoded secrets removed**
  - Search codebase for API keys
  - Search for database passwords
  - Search for authentication tokens

- [ ] **Environment variables externalized**
  - All secrets in `.env.example`
  - Only placeholders in examples
  - No real values exposed

---

## Railway Configuration

### Variables Panel Setup

Navigate to **Settings** → **Variables** in Railway:

**Critical Variables:**

- [ ] `NODE_ENV` = `production`
- [ ] `DATABASE_URL` = `postgresql://...` (from PostgreSQL plugin)
- [ ] `DIRECT_URL` = `postgresql://...` (native connection)
- [ ] `NEXTAUTH_SECRET` = (generated)
- [ ] `JWT_ACCESS_SECRET` = (generated)
- [ ] `JWT_REFRESH_SECRET` = (generated)
- [ ] `ADMIN_PASSWORD_SALT` = (generated)
- [ ] `ADMIN_EMAIL` = (your email)
- [ ] `ADMIN_PASSWORD` = (strong password)
- [ ] `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.com`

**Recommended Variables:**

- [ ] `REG_SERVER_PORT` = `8081` (or Railway default)
- [ ] `SERVE_STATIC` = `true`
- [ ] `JWT_ISSUER` = `capital-network-api`
- [ ] `JWT_AUDIENCE` = `capital-network-web`

**Optional (if using integrations):**

- [ ] Firebase credentials (if using FCM)
- [ ] Supabase credentials (if using Supabase)

### Build Configuration

- [ ] **Build command verified in railway.json**
  ```json
  "buildCommand": "npm ci && npm run build"
  ```

- [ ] **Start command verified in railway.json**
  ```json
  "startCommand": "npm run start:prod"
  ```

- [ ] **Health check path verified**
  ```json
  "healthCheckPath": "/health"
  ```

### Domain & Network

- [ ] **Custom domain configured**
  - Domain added to Railway project
  - DNS records updated
  - HTTPS enabled

- [ ] **CORS configured**
  - Frontend domain in environment variables
  - API accepts requests from frontend

---

## Deployment Phase

### Pre-Deployment Checklist

- [ ] **Final code review completed**
  - No console.logs left in code
  - No TODO/FIXME comments blocking deployment
  - Production configuration applied

- [ ] **Database backups created** (if migrating)
  - PostgreSQL dump taken
  - Backup stored securely
  - Recovery procedure documented

- [ ] **Rollback plan ready**
  - Previous version accessible
  - Rollback procedure documented
  - Team notified of deployment

### Deployment Execution

- [ ] **Click "Deploy" in Railway**
  - New deployment initiated
  - Build logs monitored
  - No errors in build output

### Build Phase Monitoring

- [ ] **Build started successfully**
  ```
  Building with buildCommand: npm ci && npm run build
  ```

- [ ] **Dependencies installed**
  ```
  npm ci
  ```
  - All packages downloaded
  - No network errors

- [ ] **Vite build executed**
  ```
  node ./node_modules/vite/bin/vite.js build
  ```
  - No bundle errors
  - Asset files generated
  - Source maps created (if configured)

- [ ] **Prisma client generated**
  ```
  postinstall: prisma generate
  ```
  - No Prisma errors

- [ ] **Build completed successfully**
  - No failed steps
  - Artifacts ready for deployment

### Deployment Phase Monitoring

- [ ] **Service started**
  ```
  npm run start:prod
  ```
  - Express server listening
  - Port 8081 active

- [ ] **Database connected**
  - Prisma client initialized
  - PostgreSQL connection established
  - Logs show `database_connected`

- [ ] **Server ready**
  - API server started
  - Static frontend served
  - Ready for requests

### Post-Deployment Validation

- [ ] **Health check passes**
  ```bash
  curl https://yourdomain.com/health
  ```
  - Returns 200 OK
  - Includes app version info

- [ ] **Frontend loads**
  ```bash
  curl https://yourdomain.com
  ```
  - HTML returned
  - No 404 errors
  - Assets load correctly

- [ ] **API endpoints respond**
  ```bash
  curl https://yourdomain.com/api/health
  ```
  - Database checks pass
  - Environment info returned

- [ ] **Admin login works**
  - Navigate to `/admin`
  - Login with admin credentials
  - Dashboard loads
  - User can navigate

- [ ] **User registration works**
  - Navigate to `/register`
  - Complete registration form
  - User created in database

- [ ] **Database operations work**
  - Check admin dashboard
  - Verify data displays correctly
  - Test CRUD operations

---

## Post-Deployment Phase

### Monitoring & Logs

- [ ] **Enable Railway logs**
  - Open Railway project dashboard
  - View logs in real-time
  - Monitor for errors

- [ ] **Monitor application logs**
  ```
  [info] server_started { port: 8081 }
  [info] database_connected {}
  [info] static_frontend {}
  ```
  - No error messages
  - Normal startup sequence

- [ ] **Monitor error rates**
  - Check for 5xx errors
  - Review error logs
  - No database connection errors

- [ ] **Monitor performance**
  - Check response times
  - Monitor CPU usage
  - Monitor memory usage
  - Monitor database connections

### Security Verification

- [ ] **HTTPS enforced**
  - All requests redirect to HTTPS
  - Mixed content warnings absent

- [ ] **CORS properly configured**
  - Browser console shows no CORS errors
  - API accepts requests from frontend

- [ ] **Admin credentials secured**
  - Password set via environment variable
  - Not accessible in frontend
  - Not exposed in logs

- [ ] **Secrets not exposed**
  - No secrets in logs
  - No secrets in API responses
  - No secrets in error messages

### Data Integrity

- [ ] **Database seed completed**
  - Admin user created
  - Initial data populated
  - Migrations applied

- [ ] **Uploads directory functional**
  - Upload endpoint works
  - Files saved to filesystem
  - Files accessible via API

- [ ] **File permissions correct**
  - Uploaded files readable
  - Permissions not too permissive
  - No security issues

### Team Communication

- [ ] **Deployment announced**
  - Slack/Teams notification sent
  - Team knows deployment is live
  - Rollback window communicated

- [ ] **Production URL shared**
  - Team given URL
  - Updated in documentation
  - Shared in team channel

- [ ] **On-call rotation updated**
  - On-call engineer assigned
  - Escalation path clear
  - Contact info shared

---

## Continuous Monitoring

### Daily Checks (First Week)

- [ ] Error logs reviewed
- [ ] Application uptime verified
- [ ] Database performance checked
- [ ] User reports addressed

### Weekly Checks

- [ ] Performance metrics reviewed
- [ ] Log aggregation checked
- [ ] Security alerts reviewed
- [ ] Database backup verified

### Monthly Reviews

- [ ] Deployment success documented
- [ ] Performance baselines established
- [ ] Security audit performed
- [ ] Improvements identified

---

## Rollback Procedures

### If Critical Issues Found

**Option 1: Revert to Previous Deployment**

1. Go to Railway project
2. Find previous successful deployment
3. Click "Restore" on that deployment
4. Wait for rollback to complete
5. Verify application is stable

**Option 2: Manual Rollback**

1. Document the issue
2. Revert code changes (git)
3. Re-deploy from main branch
4. Notify team of rollback
5. Investigate root cause

### Incident Response

- [ ] **Issue documented**
  - What went wrong
  - When it was discovered
  - Impact assessment

- [ ] **Rollback executed**
  - Previous version deployed
  - Verified stable
  - Users notified

- [ ] **Root cause analysis**
  - Investigation completed
  - Root cause identified
  - Preventive measures taken

- [ ] **Post-incident review**
  - Team debriefs
  - Process improvements documented
  - Lessons learned shared

---

## Maintenance Schedule

### Before Next Deployment

- [ ] Update dependencies
  ```bash
  npm update
  npm audit
  ```

- [ ] Test locally
  ```bash
  npm run dev
  npm run build
  npm run validate
  ```

- [ ] Code review completed
  - Peer reviewed
  - Security check passed
  - Tests passing

---

## Quick Reference

### Critical Commands

```bash
# Build locally
npm run build

# Start production server locally
npm run start:prod

# Validate configuration
npm run validate

# Check environment
npm run validate:env

# Check Prisma
npm run validate:prisma
```

### Railway URLs

- **Dashboard:** https://railway.app/dashboard
- **Project Settings:** https://railway.app/project/[PROJECT_ID]/settings
- **Variables Panel:** https://railway.app/project/[PROJECT_ID]/settings#variables
- **Deployments:** https://railway.app/project/[PROJECT_ID]/deployments
- **Logs:** https://railway.app/project/[PROJECT_ID]/logs

### Important Files

- `railway.json` — Deployment configuration
- `package.json` — Build and start scripts
- `.env.example` — Environment variable template
- `prisma/schema.prisma` — Database schema
- `server/api-server.js` — Server entry point

---

## Sign-Off

- [ ] **Deployment Approved By:** _______________
- [ ] **Date:** _______________
- [ ] **Time:** _______________
- [ ] **Deployed By:** _______________

---

## Notes

```
[Space for deployment notes, issues encountered, solutions applied]




```

---

**Keep this checklist updated after each deployment.**  
**Update version number when checklist changes.**  
**Last Updated:** 2026-06-10
# Railway Deployment Checklist

**Pre-deployment verification checklist for Capital Network API**

---

## Pre-Deployment Phase

### Repository Setup

- [ ] Repository cloned locally
- [ ] All branches up to date
- [ ] No uncommitted changes
- [ ] `.env` and `.env.local` NOT in repository
- [ ] All files committed to git
- [ ] Repository is public or Railway has access

### Code Quality

- [ ] Run `npm run validate` successfully
- [ ] Run `npm run lint` with no errors
- [ ] Run `npm run build` successfully
- [ ] No TypeScript compilation errors
- [ ] No unresolved imports
- [ ] No console.warn or console.error in critical paths

### Dependencies

- [ ] Run `npm install` successfully
- [ ] Run `npm ci` successfully (production install)
- [ ] No audit vulnerabilities (npm audit)
- [ ] No dependency conflicts
- [ ] All peer dependencies satisfied
- [ ] Vite build completes without errors

---

## Railway Account Setup

### Railway Project

- [ ] Railway account created
- [ ] Project created in Railway dashboard
- [ ] Project name set: "capital-network" (or preferred name)
- [ ] Environment set to production
- [ ] Billing method configured
- [ ] Team members added if needed

### Database Setup

- [ ] PostgreSQL addon added to project
- [ ] Database created and running
- [ ] Connection string copied (DATABASE_URL)
- [ ] Direct URL obtained (DIRECT_URL)
- [ ] Database user and password set
- [ ] Network policies configured (if using private network)

---

## Environment Variables Configuration

### Required Variables (Set in Railway Dashboard)

- [ ] `NODE_ENV=production`
- [ ] `PORT=8000` (auto-set by Railway, verify it's used in code)
- [ ] `DATABASE_URL=postgresql://...` (from PostgreSQL addon)
- [ ] `DIRECT_URL=postgresql://...` (from PostgreSQL addon)

### Authentication Secrets (Generate and Set)

- [ ] `JWT_ACCESS_SECRET` - 32+ character random string
- [ ] `JWT_REFRESH_SECRET` - 32+ character random string (different from access)
- [ ] `ADMIN_PASSWORD_SALT` - 32+ character random string

### Admin Account (Set or Change After Deployment)

- [ ] `ADMIN_EMAIL` - Valid email address
- [ ] `ADMIN_PASSWORD` - Secure password (12+ characters)
- [ ] Verify admin password meets security requirements

### Frontend Configuration

- [ ] `NEXT_PUBLIC_SITE_URL` - Production domain (https://yourdomain.com)
- [ ] Ensure HTTPS protocol
- [ ] Verify domain is correct

### Optional Variables

- [ ] `NEXTAUTH_SECRET` (if using NextAuth.js) - 32+ chars
- [ ] `CORS_ORIGINS` (if multiple frontend domains)
- [ ] `SERVE_STATIC=true` (serve frontend from Express)

### Firebase (If Used)

- [ ] `FIREBASE_PROJECT_ID` - Set if Firebase is required
- [ ] `FIREBASE_CLIENT_EMAIL` - Set if Firebase is required
- [ ] `FIREBASE_PRIVATE_KEY` - Set if Firebase is required

### Supabase (If Used)

- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Set if Supabase is required
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Set if Supabase is required
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Set if Supabase is required

### All Variables Verification

- [ ] All 10+ required variables set
- [ ] All secrets are 32+ characters (except passwords)
- [ ] No typos in variable names
- [ ] Values don't contain quotes or escaping
- [ ] Secrets are unique (not copy-pasted)
- [ ] Railroad variables view shows all variables

---

## Application Configuration Files

### railway.json

- [ ] File exists in root directory
- [ ] `rootDirectory: "."` is set
- [ ] `buildCommand: "npm ci && npm run build"` is correct
- [ ] `startCommand: "npm run start:prod"` is correct
- [ ] `healthCheckPath: "/health"` is set
- [ ] JSON syntax is valid
- [ ] File is committed to git (not ignored)

### package.json

- [ ] `"build"` script runs Vite build
- [ ] `"start:prod"` script sets NODE_ENV=production
- [ ] `"postinstall"` script runs `prisma generate`
- [ ] All dependencies are pinned to versions
- [ ] No local file references in dependencies
- [ ] `"engines": { "node": ">=18" }` is set

### prisma/schema.prisma

- [ ] `datasource db` uses `env("DATABASE_URL")`
- [ ] `provider = "postgresql"` is set
- [ ] `generator client` is configured
- [ ] No hardcoded database connection strings
- [ ] Schema is valid Prisma syntax
- [ ] All migrations are in `prisma/migrations/` folder

### vite.config.js

- [ ] Uses `process.env.REG_SERVER_PORT || 4001` for API port
- [ ] Proxy settings are correct
- [ ] Build configuration is appropriate
- [ ] No localhost-only configurations

---

## Security Verification

### Secrets Management

- [ ] No secrets in `.env`, `.env.local`, `.env.production`
- [ ] No hardcoded API keys in source code
- [ ] No hardcoded database passwords
- [ ] No hardcoded JWT secrets
- [ ] Database credentials only in environment variables
- [ ] `.gitignore` excludes `.env*` files
- [ ] No secrets in git history (use BFG or git filter-branch if needed)

### Code Security

- [ ] SQL injection protection (using Prisma)
- [ ] CSRF protection configured
- [ ] XSS protection enabled (Helmet.js)
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Authentication required for admin routes
- [ ] Password hashing implemented (bcryptjs)
- [ ] JWT token validation enabled

### Database Security

- [ ] Database connection requires password
- [ ] Database user has minimal required permissions
- [ ] Migrations are tracked and versioned
- [ ] Database backups are configured
- [ ] SSL/TLS connection for database

---

## Build & Deploy Testing

### Local Pre-deployment Test

- [ ] Run `npm ci` successfully
- [ ] Run `npm run build` completes without errors
- [ ] Build creates `/dist` directory
- [ ] Vite output shows successful build
- [ ] Prisma client generation succeeds
- [ ] No missing dependencies

### Deployment Readiness

- [ ] Node.js version is 18 or higher
- [ ] All build tools are in `devDependencies`
- [ ] No global CLI requirements
- [ ] No native modules requiring compilation
- [ ] Startup script handles Railway PORT environment variable
- [ ] Health check endpoint is operational
- [ ] Graceful shutdown is implemented

---

## Post-Deployment Verification

### Application Startup

- [ ] Deployment succeeds (no build errors)
- [ ] Application starts without errors
- [ ] Server listens on correct port
- [ ] No "cannot find module" errors
- [ ] Logs show successful startup
- [ ] Health check endpoint responds (GET /health → 200 OK)

### Database Connection

- [ ] Application connects to PostgreSQL
- [ ] No connection timeouts
- [ ] Prisma client loads successfully
- [ ] Database migrations apply successfully
- [ ] Seed data is created (initial admin account)

### API Functionality

- [ ] Health check endpoint: `GET /health` → 200 OK
- [ ] Admin login endpoint: `POST /api/admin/auth/login` → works
- [ ] JWT token generation works
- [ ] Token refresh works
- [ ] Protected endpoints require valid JWT
- [ ] CORS headers are present

### Frontend

- [ ] Frontend loads successfully
- [ ] Static assets are served
- [ ] API endpoints are accessible
- [ ] Login page appears
- [ ] No 404 errors for assets

### Admin Dashboard

- [ ] Admin login page accessible
- [ ] Login with seed admin credentials succeeds
- [ ] Dashboard loads after login
- [ ] Admin functions are operational
- [ ] Database queries work

### Monitoring

- [ ] Logs are visible in Railway dashboard
- [ ] No repeated error messages
- [ ] Application memory usage is stable
- [ ] CPU usage is reasonable
- [ ] Request/response times are acceptable
- [ ] Deployment metrics show healthy status

---

## Documentation & Handoff

### Documentation

- [ ] `DEPLOYMENT_REPORT.md` reviewed
- [ ] `ENVIRONMENT_VARIABLES.md` reviewed
- [ ] `RAILWAY_CHECKLIST.md` completed (this file)
- [ ] `BUILD_FIXES.md` reviewed for changes made
- [ ] `SECURITY_REPORT.md` reviewed
- [ ] Team members have access to documentation

### Access & Credentials

- [ ] Railway team members invited to project
- [ ] Database credentials secured
- [ ] Admin password changed from default (if seed password used)
- [ ] SSH keys configured (if using Railway CLI)
- [ ] Backup of environment variables saved securely
- [ ] Disaster recovery plan documented

### Monitoring Setup

- [ ] Error tracking configured (if using external service)
- [ ] Log aggregation configured (if needed)
- [ ] Uptime monitoring configured
- [ ] Alert notifications configured
- [ ] Backup schedule verified
- [ ] Rollback plan documented

---

## Sign-Off

### Pre-Deployment Sign-Off

- [ ] Tech lead reviewed configuration
- [ ] Security team reviewed secrets management
- [ ] Database admin verified schema
- [ ] DevOps engineer verified deployment config
- [ ] All items in this checklist completed

### Post-Deployment Sign-Off

- [ ] All endpoints tested and verified
- [ ] Performance metrics acceptable
- [ ] Security checks passed
- [ ] Monitoring active
- [ ] Rollback plan ready
- [ ] Team notified of deployment

---

## Rollback Plan

In case of critical issues after deployment:

### Quick Rollback Steps

1. [ ] Stop application deployment in Railway
2. [ ] Identify issue from logs
3. [ ] Revert to previous commit if needed
4. [ ] Redeploy from known-good state
5. [ ] Verify application stability
6. [ ] Notify team of incident

### Database Rollback (if needed)

1. [ ] Stop application to prevent writes
2. [ ] Restore database from backup
3. [ ] Verify data integrity
4. [ ] Restart application
5. [ ] Test critical functionality
6. [ ] Document incident

### Emergency Contacts

- [ ] Tech Lead: [name] [contact]
- [ ] DevOps Engineer: [name] [contact]
- [ ] Database Admin: [name] [contact]
- [ ] Security Team: [name] [contact]

---

## Common Issues & Solutions

### Build Fails with "Cannot find module"
- [ ] Run `npm ci` to install all dependencies
- [ ] Check for missing packages in package.json
- [ ] Verify postinstall hook runs `prisma generate`

### Startup Fails with "PORT already in use"
- [ ] Verify code respects Railway's PORT environment variable
- [ ] Check server.js uses correct port variable
- [ ] Ensure `REG_SERVER_PORT || PORT || 4001` is in place

### Database Connection Fails
- [ ] Verify DATABASE_URL is set in Railway Variables
- [ ] Check PostgreSQL addon is running
- [ ] Verify DIRECT_URL is set (for migrations)
- [ ] Test connection string locally first

### Health Check Fails
- [ ] Verify `/health` endpoint exists
- [ ] Check endpoint doesn't require authentication
- [ ] Verify endpoint returns 200 OK status

### Prisma Migration Fails
- [ ] Ensure DIRECT_URL is set to direct connection
- [ ] Run migrations locally first with same DATABASE_URL
- [ ] Check for conflicts in migration files
- [ ] Use `prisma migrate resolve` if needed

---

## Quick Command Reference

### Railway CLI Commands

```bash
# Login to Railway
railway login

# Initialize project
railway init

# Set environment variable
railway variables set KEY=value

# Run command in Railway environment
railway run npm run db:setup

# View logs
railway logs

# Deploy
railway up

# Check deployment status
railway status
```

### Local Verification Commands

```bash
# Install dependencies
npm install

# Production install test
npm ci

# Run validation
npm run validate

# Build frontend
npm run build

# Start server
npm run start:prod

# Test health check (after server starts)
curl http://localhost:4001/health

# Initialize database
npm run db:setup
```

---

## Final Verification

- [ ] All checklist items completed
- [ ] No open action items
- [ ] Application is stable
- [ ] Team is notified
- [ ] Documentation is complete
- [ ] Support plan is in place

**Status:** ✅ Ready for Production

**Deployed By:** ________________  
**Date:** ________________  
**Version:** ________________

---

**Next Review Date:** [30 days after deployment]

For issues or questions, refer to:
- `DEPLOYMENT_REPORT.md` - Complete audit details
- `ENVIRONMENT_VARIABLES.md` - Variable reference
- `BUILD_FIXES.md` - Changes applied
- `SECURITY_REPORT.md` - Security details
