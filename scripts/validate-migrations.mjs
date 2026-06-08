/**
 * Ensures prisma/migrations exist and schema.prisma reflects applied migration columns.
 * Run: node scripts/validate-migrations.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const root = process.cwd()
const migrationsDir = path.join(root, 'prisma', 'migrations')
const schemaPath = path.join(root, 'prisma', 'schema.prisma')

if (!fs.existsSync(migrationsDir)) {
  console.error('Missing prisma/migrations directory')
  process.exit(1)
}

const migrationFolders = fs
  .readdirSync(migrationsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort()

if (migrationFolders.length === 0) {
  console.error('No migration folders found')
  process.exit(1)
}

for (const folder of migrationFolders) {
  const sqlPath = path.join(migrationsDir, folder, 'migration.sql')
  if (!fs.existsSync(sqlPath)) {
    console.error(`Missing migration.sql in ${folder}`)
    process.exit(1)
  }
}

const schema = fs.readFileSync(schemaPath, 'utf8')
const requiredFields = [
  { model: 'User', field: 'authEmail' },
  { model: 'Notification', field: 'actorRef' },
  { model: 'Notification', field: 'user' },
  { model: 'ChatRoom', field: 'user' },
  { model: 'ChatRoom', field: 'admin' },
  { model: 'PushToken', field: 'userId' },
  { model: 'PushToken', field: 'adminId' },
]

const errors = []
for (const { model, field } of requiredFields) {
  const block = schema.match(new RegExp(`model\\s+${model}\\s*\\{([^}]+)\\}`, 's'))
  if (!block) {
    errors.push(`Model ${model} not found in schema.prisma`)
    continue
  }
  if (!new RegExp(`\\b${field}\\b`).test(block[1])) {
    errors.push(`Field/relation ${model}.${field} missing from schema.prisma (expected after migrations)`)
  }
}

if (errors.length) {
  console.error('Schema/migration drift detected:')
  for (const e of errors) console.error(' -', e)
  process.exit(1)
}

try {
  execSync('npx prisma validate', { stdio: 'pipe', cwd: root })
} catch (err) {
  console.error('prisma validate failed:', err.stderr?.toString() || err.message)
  process.exit(1)
}

console.log(`OK: ${migrationFolders.length} migration(s) present; schema aligned with phase-2 relations`)
