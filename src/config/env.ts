import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  PORT: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
})

export function validateEnv(options: { exitOnError?: boolean } = { exitOnError: false }) {
  const { exitOnError = false } = options
  try {
    const parsed = envSchema.parse(process.env)
    return parsed
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (exitOnError) {
      console.error('[env] Environment validation failed:', message)
      process.exit(1)
    }
    console.warn('[env] Environment validation warnings/errors:', message)
    return process.env as any
  }
}

export const env = validateEnv()
