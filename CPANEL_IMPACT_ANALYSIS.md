# CPANEL IMPACT ANALYSIS REPORT

Generated: 2025-06-07
Phase: 2 - Impact Analysis

## EXECUTIVE SUMMARY

All cPanel artifacts have been verified as **SAFE TO REMOVE**. The main application uses a Node.js/Express/PostgreSQL stack with Docker deployment, and has no dependencies on cPanel-specific files, folders, or build scripts.

**Key Findings**:
- ✅ No source code imports from cPanel folders
- ✅ No CI/CD references to cPanel builds
- ✅ No runtime dependencies on cPanel artifacts
- ✅ Docker and Dockerfile use only Node.js stack
- ✅ Main application uses `server/` folder (Node.js), not `api/` folder (PHP)

---

## IMPACT ANALYSIS BY CATEGORY

### 1. SOURCE CODE REFERENCES

#### Analysis:
- Searched for references to: `FINAL-CPANEL-VERSION`, `FINAL_CPANEL_BUILD`, `cpanel-backend`, `deploy/cpanel`, `deploy/staging-cpanel`, `deploy/cpanel-flat`
- **Result**: **0 matches** in source code (*.js, *.jsx, *.ts, *.tsx, *.json)

#### Conclusion:
**SAFE_TO_REMOVE** - No source code references to cPanel folders

---

### 2. PACKAGE.JSON SCRIPTS

#### Analysis:
- `package.json` contains two cPanel build scripts:
  - `build:cpanel`: `node scripts/build-cpanel-package.mjs`
  - `build:final-cpanel`: `node scripts/build-final-cpanel.mjs`

#### Impact:
- These scripts are ONLY used for cPanel deployment
- Main application uses `npm run build` (Vite build)
- Removing these scripts will NOT affect main application

#### Conclusion:
**SAFE_TO_REMOVE** - Scripts must be removed from package.json along with the script files

---

### 3. CI/CD CONFIGURATIONS

#### Analysis:
- **.github/**: Does not exist
- **.gitlab-ci.yml**: Does not exist
- **vercel.json**: Does not exist
- **netlify.toml**: Does not exist
- **docker-compose.yml**: Exists, uses Docker with PostgreSQL, NO cPanel references
- **Dockerfile**: Exists, uses Node.js 20, NO cPanel references

#### Conclusion:
**SAFE_TO_REMOVE** - No CI/CD references to cPanel builds

---

### 4. DOCKER CONFIGURATION

#### docker-compose.yml Analysis:
```yaml
services:
  db:
    image: postgres:16-alpine  # PostgreSQL (not MySQL)
  api:
    build: .
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://...  # PostgreSQL (not MySQL)
```

#### Dockerfile Analysis:
```dockerfile
FROM node:20-alpine
RUN npx prisma generate && npm run build
CMD ["node", "server/api-server.js"]  # Uses Node.js server (not PHP)
```

#### Conclusion:
**SAFE_TO_REMOVE** - Docker configuration uses only Node.js/PostgreSQL stack

---

### 5. MAIN APPLICATION ARCHITECTURE

#### Backend Architecture:
- **Main Backend**: `server/` folder (Node.js + Express + Prisma)
- **cPanel Backend**: `api/` folder (PHP + PDO + MySQL) - TO BE REMOVED

#### Verification:
- `server/api-server.js` - Main Node.js API server
- `server/app.js` - Express application
- `vite.config.js` - Proxies `/api` to Node.js server (port 4001)
- No source code imports from `api/` folder

#### Conclusion:
**SAFE_TO_REMOVE** - `api/` folder is PHP backend for cPanel only, not used by main app

---

### 6. DOCUMENTATION REFERENCES

#### MIGRATION_PLAN.md
- **Path**: `my-next-app/MIGRATION_PLAN.md`
- **Content**: Persian document about migrating from Node.js to PHP for cPanel deployment
- **Purpose**: cPanel migration plan
- **Action**: **REMOVE** - This is cPanel-specific documentation

#### XSS_AUDIT_REPORT.md
- **Path**: `my-next-app/XSS_AUDIT_REPORT.md`
- **Content**: Security audit report
- **cPanel Reference**: Mentions `FINAL-CPANEL-VERSION/public_html/assets/*.js` in excluded files
- **Action**: **UPDATE** - Remove cPanel reference from excluded files list

#### DEPLOYMENT.md
- **Path**: `my-next-app/DEPLOYMENT.md`
- **cPanel References**: None
- **Action**: **KEEP** - No cPanel content

#### docs/DEPLOYMENT_CHECKLIST.md
- **Path**: `my-next-app/docs/DEPLOYMENT_CHECKLIST.md`
- **cPanel References**: None
- **Action**: **KEEP** - No cPanel content

---

## DETAILED ITEM-BY-ITEM ANALYSIS

### FOLDERS

| Folder | Referenced by Source Code | Referenced by CI/CD | Referenced by Docker | Safe to Remove |
|--------|---------------------------|-------------------|---------------------|----------------|
| FINAL-CPANEL-VERSION/ | ❌ No | ❌ No | ❌ No | ✅ **YES** |
| FINAL_CPANEL_BUILD/ | ❌ No | ❌ No | ❌ No | ✅ **YES** |
| cpanel-backend/ | ❌ No | ❌ No | ❌ No | ✅ **YES** |
| deploy/cpanel/ | ❌ No | ❌ No | ❌ No | ✅ **YES** |
| deploy/cpanel-flat/ | ❌ No | ❌ No | ❌ No | ✅ **YES** |
| deploy/staging-cpanel/ | ❌ No | ❌ No | ❌ No | ✅ **YES** |
| api/ (root) | ❌ No | ❌ No | ❌ No | ✅ **YES** |

### FILES

| File | Referenced by Source Code | Referenced by CI/CD | Referenced by Scripts | Safe to Remove |
|------|---------------------------|-------------------|----------------------|----------------|
| capital-network-cpanel.zip | ❌ No | ❌ No | ❌ No | ✅ **YES** |
| capital-network-cpanel-deploy.zip | ❌ No | ❌ No | ❌ No | ✅ **YES** |
| FINAL-CPANEL-VERSION.zip | ❌ No | ❌ No | ❌ No | ✅ **YES** |
| scripts/build-cpanel-package.mjs | ❌ No | ❌ No | ✅ package.json | ✅ **YES** |
| scripts/build-final-cpanel.mjs | ❌ No | ❌ No | ✅ package.json | ✅ **YES** |
| MIGRATION_PLAN.md | ❌ No | ❌ No | ❌ No | ✅ **YES** |

### PACKAGE.JSON SCRIPTS

| Script | Used by Main App | Used by cPanel | Safe to Remove |
|--------|------------------|----------------|----------------|
| build:cpanel | ❌ No | ✅ Yes | ✅ **YES** |
| build:final-cpanel | ❌ No | ✅ Yes | ✅ **YES** |

---

## DEPENDENCY ANALYSIS

### No Additional Dependencies Required
- The cPanel build scripts use only Node.js built-in modules:
  - `child_process` (spawnSync)
  - `fs` (file system)
  - `path` (path handling)
- No npm packages need to be removed

### Main Application Dependencies
- All main application dependencies are in `dependencies` and `devDependencies`
- None are specific to cPanel deployment
- **Action**: No dependency cleanup required

---

## RISK ASSESSMENT

### Low Risk ✅
- No source code dependencies
- No CI/CD dependencies
- No runtime dependencies
- Clear separation between Node.js stack (main) and PHP stack (cPanel)

### Mitigation Strategies
- Backup repository before deletion
- Commit changes in phases
- Run validation tests after each phase

---

## REMAINING DEPLOYMENT STRATEGY

After cPanel removal, the project will support:

### Primary Deployment Methods:
1. **Docker** - `docker-compose.yml` + `Dockerfile`
2. **Node.js Runtime** - Manual deployment with PM2/systemd
3. **Vercel** - Frontend deployment (with external API)
4. **VPS** - Any VPS provider with Node.js support
5. **Railway** - Platform as a Service
6. **Render** - Platform as a Service

---

## FINAL VERDICT

### SAFE_TO_REMOVE Items:
- ✅ All 7 cPanel folders
- ✅ All 3 cPanel ZIP files
- ✅ 2 cPanel build scripts
- ✅ 2 package.json scripts
- ✅ MIGRATION_PLAN.md documentation

### REQUIRES_MANUAL_REVIEW Items:
- ⚠️ XSS_AUDIT_REPORT.md (update cPanel reference)

### DO_NOT_REMOVE Items:
- ❌ DEPLOYMENT.md (no cPanel content)
- ❌ docs/DEPLOYMENT_CHECKLIST.md (no cPanel content)
- ❌ docker-compose.yml (Docker deployment)
- ❌ Dockerfile (Docker deployment)
- ❌ package.json (main dependencies)
- ❌ database.sql (main schema)
- ❌ server/ folder (main backend)
- ❌ app/ folder (main frontend)

---

## NEXT PHASE

Proceed to **Phase 3: Remove cPanel Artifacts** to delete all verified safe-to-remove items.
