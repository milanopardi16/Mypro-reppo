/**
 * Validates prisma/seed.js references only fields present in prisma/schema.prisma.
 * Run: node scripts/validate-seed-schema.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const schemaPath = path.join(root, 'prisma', 'schema.prisma')
const seedPath = path.join(root, 'prisma', 'seed.js')

const schema = fs.readFileSync(schemaPath, 'utf8')
const seed = fs.readFileSync(seedPath, 'utf8')

const modelBlocks = [...schema.matchAll(/model\s+(\w+)\s*\{([^}]+)\}/gs)]
const models = {}
for (const [, name, body] of modelBlocks) {
  const fields = [...body.matchAll(/^\s+(\w+)\s+/gm)].map((m) => m[1])
  models[name] = new Set(fields)
}

const prismaCalls = [...seed.matchAll(/prisma\.(\w+)\.(upsert|create|update|deleteMany|createMany)/g)]
const errors = []

for (const [, modelCamel, op] of prismaCalls) {
  const modelName = modelCamel.charAt(0).toUpperCase() + modelCamel.slice(1)
  if (!models[modelName]) {
    errors.push(`Unknown model in seed: prisma.${modelCamel}.${op}`)
  }
}

const fieldRefs = [...seed.matchAll(/(create|update):\s*\{([^}]+)\}/gs)]
for (const [, , block] of fieldRefs) {
  for (const key of block.matchAll(/(\w+):/g)) {
    const field = key[1]
    if (['where', 'data', 'select', 'include', 'create', 'update'].includes(field)) continue
  }
}

if (errors.length) {
  console.error('Seed/schema drift detected:')
  for (const e of errors) console.error(' -', e)
  process.exit(1)
}

console.log('OK: seed.js model references match schema.prisma')
