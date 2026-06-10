import path from 'node:path'
import { config } from 'dotenv'
import { defineConfig, env } from 'prisma/config'

const root = process.cwd()
config({ path: path.join(root, '.env.local') })
config({ path: path.join(root, '.env') })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node prisma/seed.js',
  },
  datasource: {
    provider: 'postgresql',
    url: env('DATABASE_URL'),
    directUrl: env('DIRECT_URL'),
  },
})
