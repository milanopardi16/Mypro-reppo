const crypto = require('crypto')
const salt = process.env.ADMIN_PASSWORD_SALT
const password = process.argv[2]

if (!salt) {
  console.error('Error: ADMIN_PASSWORD_SALT environment variable is required')
  console.error('Usage: ADMIN_PASSWORD_SALT=<your-salt> node scripts/hash-password.js <password>')
  process.exit(1)
}

if (!password) {
  console.error('Usage: ADMIN_PASSWORD_SALT=<your-salt> node scripts/hash-password.js <password>')
  process.exit(1)
}

const hash = crypto.createHmac('sha256', salt).update(password).digest('hex')
console.log(hash)
