const { getEnv } = require('./env')

function timestamp() {
  return new Date().toISOString()
}

function baseFields(level, message, meta = {}) {
  const env = (() => {
    try {
      return getEnv()
    } catch {
      return { NODE_ENV: process.env.NODE_ENV || 'development' }
    }
  })()

  return {
    ts: timestamp(),
    level,
    msg: message,
    service: 'api-server',
    env: env.NODE_ENV,
    ...meta,
  }
}

function write(level, message, meta) {
  const line = JSON.stringify(baseFields(level, message, meta))
  if (level === 'error') {
    console.error(line)
  } else {
    console.log(line)
  }
}

const logger = {
  info: (message, meta) => write('info', message, meta),
  warn: (message, meta) => write('warn', message, meta),
  error: (message, meta) => write('error', message, meta),
  debug: (message, meta) => {
    const env = process.env.NODE_ENV || 'development'
    if (env !== 'production') write('debug', message, meta)
  },
}

module.exports = { logger }
