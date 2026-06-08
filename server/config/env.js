const path = require('path')
const { z } = require('zod')

function loadEnvFiles() {
  const root = process.cwd()
  require('dotenv').config({ path: path.join(root, '.env.local') })
  require('dotenv').config({ path: path.join(root, '.env') })
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_URL: z.string().min(1, 'DIRECT_URL is required'),
  NEXTAUTH_SECRET: z.string().min(1, 'NEXTAUTH_SECRET is required'),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  REG_SERVER_PORT: z.coerce.number().int().positive().optional(),
  PORT: z.coerce.number().int().positive().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_USERNAME: z.string().min(1).optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
  ADMIN_TOKEN: z.string().optional(),
  SERVE_STATIC: z.string().optional(),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  CORS_ORIGINS: z.string().optional(),
})

let cached = null

function validateEnv(options = {}) {
  const { exitOnError = true } = options
  loadEnvFiles()

  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    const lines = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`)
    const message = `Environment validation failed:\n${lines.join('\n')}`
    if (exitOnError) {
      console.error(message)
      process.exit(1)
    }
    throw new Error(message)
  }

  cached = parsed.data
  return cached
}

function getEnv() {
  if (!cached) return validateEnv({ exitOnError: true })
  return cached
}

module.exports = { loadEnvFiles, validateEnv, getEnv }
