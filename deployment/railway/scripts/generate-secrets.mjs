#!/usr/bin/env node
/**
 * Generate cryptographically secure secrets for Railway deployment.
 * Usage: node deployment/railway/scripts/generate-secrets.mjs
 */
import { randomBytes } from 'node:crypto'

function secret(bytes = 32) {
  return randomBytes(bytes).toString('base64')
}

function password(length = 16) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%'
  const buf = randomBytes(length)
  return Array.from(buf, (b) => chars[b % chars.length]).join('')
}

console.log('# Copy these into Railway Dashboard → Variables')
console.log('# Do NOT commit real values to GitHub\n')
console.log(`NEXTAUTH_SECRET=${secret()}`)
console.log(`JWT_ACCESS_SECRET=${secret()}`)
console.log(`JWT_REFRESH_SECRET=${secret()}`)
console.log(`ADMIN_PASSWORD_SALT=${secret()}`)
console.log(`ADMIN_PASSWORD=${password()}`)
