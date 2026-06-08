# CPANEL DISCOVERY REPORT

Generated: 2025-06-07
Phase: 1 - Discovery

## EXECUTIVE SUMMARY

This report identifies ALL cPanel-specific deployment artifacts in the repository. The main application uses a **Node.js/Express/PostgreSQL stack** (Vite + React), while cPanel deployment artifacts include a **PHP backend wrapper** and multiple build outputs.

**Key Finding**: The `api/` folder at the root contains PHP files for cPanel deployment ONLY. The main application uses the `server/` folder (Node.js/Express) for its backend.

---

## CPANEL-RELATED FOLDERS

### 1. FINAL-CPANEL-VERSION/
- **Path**: `my-next-app/FINAL-CPANEL-VERSION/`
- **Purpose**: Final cPanel deployment package with public_html structure
- **Contents**: 
  - `public_html/` (71 items) - Complete cPanel deployment structure
  - `README_DEPLOY.md` - Deployment instructions
  - `capital-network-cpanel.zip` - Deployment ZIP
- **Referenced by**: 
  - `scripts/build-final-cpanel.mjs` (creates this folder)
  - No source code references
- **Safe to remove**: **YES**

### 2. FINAL_CPANEL_BUILD/
- **Path**: `my-next-app/FINAL_CPANEL_BUILD/`
- **Purpose**: Complete cPanel build with PHP backend, database, and public_html
- **Contents**:
  - `api/` (38 items) - PHP backend
  - `classes/` (9 items) - PHP classes
  - `config/` (2 items) - PHP config
  - `database/` - Database files
  - `public_html/` (71 items) - Frontend build
  - `reports/` (14 items) - Migration reports
  - `.htaccess` - Apache config
  - `database.sql` - Database schema
- **Referenced by**:
  - No source code references
  - Appears to be a standalone build output
- **Safe to remove**: **YES**

### 3. cpanel-backend/
- **Path**: `my-next-app/cpanel-backend/`
- **Purpose**: PHP backend source code for cPanel deployment
- **Contents**:
  - `api/` (6 items) - PHP API endpoints
  - `config/` (2 items) - PHP configuration
  - `database/` - Database schema
  - `lib/` (24 items) - PHP libraries
  - `public_html/` - Empty (placeholder)
  - `.htaccess` - Apache config
  - `README_DEPLOY.md` - Deployment docs
- **Referenced by**:
  - `scripts/build-final-cpanel.mjs` (copies from this folder)
- **Safe to remove**: **YES**

### 4. deploy/cpanel/
- **Path**: `my-next-app/deploy/cpanel/`
- **Purpose**: cPanel deployment configuration and proxy scripts
- **Contents**:
  - `.htaccess` - Apache rewrite rules
  - `README-FA.md` - Persian deployment instructions
  - `cn-api-proxy.php` - API proxy script
  - `cn-config.example.php` - Configuration template
- **Referenced by**:
  - `scripts/build-cpanel-package.mjs` (copies from this folder)
- **Safe to remove**: **YES**

### 5. deploy/cpanel-flat/
- **Path**: `my-next-app/deploy/cpanel-flat/`
- **Purpose**: Flat cPanel deployment structure (single public_html root)
- **Contents**:
  - `api/` (31 items) - PHP backend
  - `assets/` (4 items) - Frontend assets
  - `fonts/` (28 items) - Font files
  - `.htaccess` - Apache config
  - `README-FA.txt` - Persian deployment instructions
  - `database.sql` - Database schema
  - Various SVG files
- **Referenced by**:
  - `scripts/build-final-cpanel.mjs` (creates this folder)
- **Safe to remove**: **YES**

### 6. deploy/staging-cpanel/
- **Path**: `my-next-app/deploy/staging-cpanel/`
- **Purpose**: Staging cPanel deployment
- **Contents**:
  - `assets/` (4 items) - Frontend assets
  - `fonts/` (28 items) - Font files
  - `.htaccess` - Apache config
  - `README-FA.md` - Persian deployment instructions
  - `cn-api-proxy.php` - API proxy script
  - `cn-config.example.php` - Configuration template
  - `ADMIN-LOGIN.txt` - Admin credentials
- **Referenced by**:
  - `scripts/build-cpanel-package.mjs` (creates this folder)
- **Safe to remove**: **YES**

### 7. api/ (ROOT FOLDER)
- **Path**: `my-next-app/api/`
- **Purpose**: PHP backend for cPanel deployment (NOT used by main Node.js app)
- **Contents**:
  - `index.php` - Main PHP API entry point
  - `sse.php` - Server-sent events endpoint
  - `_config/` (2 items) - PHP configuration
  - `lib/` (17 items) - PHP libraries
  - `uploads/` - Upload directory
  - `.htaccess` - Apache config
- **Referenced by**:
  - NOT referenced by main application code
  - Main app uses `server/` folder (Node.js/Express)
  - Only used by cPanel deployment builds
- **Safe to remove**: **YES**

---

## CPANEL-RELATED FILES

### 1. capital-network-cpanel.zip
- **Path**: `my-next-app/capital-network-cpanel.zip`
- **Purpose**: cPanel deployment ZIP package
- **Size**: ~1.9 MB
- **Referenced by**: None (build output)
- **Safe to remove**: **YES**

### 2. capital-network-cpanel-deploy.zip
- **Path**: `my-next-app/capital-network-cpanel-deploy.zip`
- **Purpose**: cPanel deployment ZIP package (alternate)
- **Size**: ~1.9 MB
- **Referenced by**: None (build output)
- **Safe to remove**: **YES**

### 3. FINAL-CPANEL-VERSION.zip
- **Path**: `my-next-app/FINAL-CPANEL-VERSION.zip`
- **Purpose**: cPanel deployment ZIP package (final version)
- **Size**: ~1.9 MB
- **Referenced by**: None (build output)
- **Safe to remove**: **YES**

### 4. scripts/build-cpanel-package.mjs
- **Path**: `my-next-app/scripts/build-cpanel-package.mjs`
- **Purpose**: Build script for cPanel deployment package
- **Referenced by**: `package.json` (script: `build:cpanel`)
- **Safe to remove**: **YES** (with package.json cleanup)

### 5. scripts/build-final-cpanel.mjs
- **Path**: `my-next-app/scripts/build-final-cpanel.mjs`
- **Purpose**: Build script for final cPanel deployment package
- **Referenced by**: `package.json` (script: `build:final-cpanel`)
- **Safe to remove**: **YES** (with package.json cleanup)

---

## PACKAGE.JSON REFERENCES

### Scripts to Remove:
```json
"build:cpanel": "node scripts/build-cpanel-package.mjs",
"build:final-cpanel": "node scripts/build-final-cpanel.mjs",
```

### Impact:
- These scripts are ONLY used for cPanel deployment
- Main application uses `npm run build` (Vite build)
- Safe to remove these scripts

---

## DOCUMENTATION WITH CPANEL REFERENCES

### 1. DEPLOYMENT.md
- **Path**: `my-next-app/DEPLOYMENT.md`
- **cPanel references**: None found
- **Purpose**: Main deployment guide (Docker/Node.js)
- **Action**: Keep (no cPanel content)

### 2. docs/DEPLOYMENT_CHECKLIST.md
- **Path**: `my-next-app/docs/DEPLOYMENT_CHECKLIST.md`
- **cPanel references**: None found
- **Purpose**: Deployment checklist (Docker/Node.js)
- **Action**: Keep (no cPanel content)

### 3. MIGRATION_PLAN.md
- **Path**: `my-next-app/MIGRATION_PLAN.md`
- **cPanel references**: 1 match
- **Purpose**: Migration plan
- **Action**: Review and clean if needed

### 4. XSS_AUDIT_REPORT.md
- **Path**: `my-next-app/XSS_AUDIT_REPORT.md`
- **cPanel references**: 1 match
- **Purpose**: Security audit report
- **Action**: Review and clean if needed

---

## .HTACCESS FILES

### cPanel .htaccess files (Safe to Remove):
1. `api/.htaccess` - PHP backend Apache config
2. `cpanel-backend/.htaccess` - PHP backend Apache config
3. `deploy/cpanel/.htaccess` - cPanel deployment Apache config
4. `deploy/cpanel-flat/.htaccess` - cPanel flat deployment Apache config
5. `deploy/staging-cpanel/.htaccess` - staging cPanel Apache config
6. `FINAL-CPANEL-VERSION/public_html/.htaccess` - cPanel public_html Apache config
7. `FINAL_CPANEL_BUILD/.htaccess` - cPanel build Apache config
8. `FINAL_CPANEL_BUILD/public_html/.htaccess` - cPanel public_html Apache config

### Main Application .htaccess:
- **Path**: `my-next-app/.htaccess` (if exists)
- **Action**: Review - may be needed for Vercel/VPS deployment

---

## DATABASE.SQL FILES

### cPanel database.sql files (Safe to Remove):
1. `cpanel-backend/database/database.sql` - PHP backend schema
2. `deploy/cpanel-flat/database.sql` - cPanel deployment schema
3. `FINAL-CPANEL-VERSION/public_html/database.sql` - cPanel deployment schema
4. `FINAL_CPANEL_BUILD/database.sql` - cPanel build schema
5. `FINAL_CPANEL_BUILD/database/database.sql` - cPanel build schema

### Main Application database.sql:
- **Path**: `my-next-app/database.sql`
- **Purpose**: Main application database schema
- **Action**: **KEEP** - Used by Prisma migrations

---

## SUMMARY STATISTICS

- **Total cPanel folders**: 7
- **Total cPanel files**: 3 ZIP files + 2 build scripts
- **Total .htaccess files**: 8 (cPanel-specific)
- **Total database.sql files**: 5 (cPanel-specific)
- **Documentation with cPanel refs**: 2 files to review

---

## ARCHITECTURE CLARIFICATION

### Main Application Stack:
- **Frontend**: Vite + React
- **Backend**: Node.js + Express (in `server/` folder)
- **Database**: PostgreSQL via Prisma
- **Deployment**: Docker / Node.js runtime / Vercel / VPS

### cPanel Deployment Stack (TO BE REMOVED):
- **Frontend**: Same Vite build
- **Backend**: PHP (in `api/` and `cpanel-backend/` folders)
- **Database**: MySQL (via PHP PDO)
- **Deployment**: cPanel shared hosting

---

## NEXT PHASE

Proceed to **Phase 2: Impact Analysis** to verify:
- No source code imports from cPanel folders
- No CI/CD references to cPanel builds
- No runtime dependencies on cPanel artifacts
