const http = require('http')

const { validateEnv, getEnv } = require('./config/env')
const { logger } = require('./config/logger')
const { createApp } = require('./app')
const { attachSocket } = require('./socket')
const { ensureUploadsDir } = require('./utils/upload')
const { disconnectDatabase, connectDatabase } = require('./prisma/client')

let env = null
try {
  // validate but do not force process exit here; handle gracefully
  env = validateEnv({ exitOnError: false })
} catch (err) {
  // validation failed — log and continue with process.env fallback
  console.warn('Environment validation failed — continuing with process.env: ', err?.message)
  env = Object.assign({}, process.env)
}

const app = createApp()
// prefer REG_SERVER_PORT, then PORT, then default
const PORT = Number(env.REG_SERVER_PORT || env.PORT || process.env.PORT || 4001)
const httpServer = http.createServer(app)
const startedAt = Date.now()

let shuttingDown = false

const io = attachSocket(httpServer, app)

httpServer.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    logger.error('port_in_use', { port: PORT, err: err.message })
  } else {
    logger.error('server_listen_failed', { port: PORT, err: err.message })
  }
  process.exit(1)
})

httpServer.listen(PORT, async () => {
  ensureUploadsDir()
  try {
    await connectDatabase()
    logger.info('database_connected', { port: PORT })
  } catch (err) {
    logger.warn('database_connect_deferred', { err: err?.message, hint: 'Neon may cold-start on first request' })
  }
  logger.info('server_started', { port: PORT, nodeEnv: env.NODE_ENV })
  if (app.SERVE_FRONTEND && app.STATIC_DIR) {
    logger.info('static_frontend', { dir: app.STATIC_DIR })
  } else if (app.SERVE_FRONTEND) {
    logger.warn('static_frontend_missing', { hint: 'Run npm run build before production deploy' })
  }
})

function gracefulShutdown(signal) {
  if (shuttingDown) return
  shuttingDown = true
  logger.info('shutdown_started', { signal })

  const forceTimer = setTimeout(() => {
    logger.error('shutdown_forced', { signal })
    process.exit(1)
  }, 15000)
  forceTimer.unref()

  httpServer.close(() => {
    logger.info('http_closed')
    const finish = async () => {
      try {
        await disconnectDatabase()
        logger.info('database_closed')
      } catch (err) {
        logger.error('database_close_failed', { err: err?.message })
      }
      clearTimeout(forceTimer)
      process.exit(0)
    }

    if (io) {
      io.close(() => {
        logger.info('socket_closed')
        finish()
      })
    } else {
      finish()
    }
  })
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

process.on('unhandledRejection', (reason) => {
  try {
    logger && logger.error && logger.error('unhandled_rejection', { err: String(reason) })
  } catch (_) {
    console.error('unhandledRejection', reason)
  }
})

process.on('uncaughtException', (err) => {
  try {
    logger && logger.error && logger.error('uncaught_exception', { err: err?.message })
  } catch (_) {
    console.error('uncaughtException', err)
  }
  // give a moment for logs to flush then exit
  setTimeout(() => process.exit(1), 1000)
})

module.exports = { httpServer, startedAt }
