/**
 * Validates environment configuration without starting the API server.
 * Run: node scripts/validate-env.mjs
 */
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { validateEnv } = require('../server/config/env.js')

try {
  validateEnv({ exitOnError: false })
  console.log('OK: environment variables passed validation')
} catch (err) {
  console.error('Environment validation failed:', err.message)
  process.exit(1)
}
