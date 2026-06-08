const express = require('express')
const path = require('path')
const fs = require('fs')
const { applySecurityMiddleware } = require('./middlewares/security.middleware')
const { correlationMiddleware } = require('./middlewares/correlation.middleware')
const { requestLogMiddleware } = require('./middlewares/request-log.middleware')
const { errorMiddleware, notFoundMiddleware } = require('./middlewares/error.middleware')
const apiRoutes = require('./routes/api.routes')
const authRoutes = require('./routes/auth.routes')
const legacyRoutes = require('./routes/legacy.routes')
const { UPLOADS_DIR, ensureUploadsDir } = require('./utils/upload')

function resolveStaticDir() {
  const cwd = process.cwd()
  const distDir = path.join(cwd, 'dist')
  if (fs.existsSync(path.join(cwd, 'index.html'))) return cwd
  if (fs.existsSync(path.join(distDir, 'index.html'))) return distDir
  return null
}

function createApp() {
  const app = express()
  app.disable('x-powered-by')
  app.use(correlationMiddleware)
  app.use(requestLogMiddleware)
  applySecurityMiddleware(app)
  app.use(express.json({ limit: '20mb' }))
  ensureUploadsDir()
  
  // Protect uploads with authentication to prevent unauthorized access
  const { requireAdmin } = require('./middlewares/auth.middleware')
  app.use('/uploads', requireAdmin, express.static(UPLOADS_DIR))

  app.locals.emitToAdmins = () => {}
  app.locals.emitToRoom = () => {}

  // Auth routes must be registered before /api so /api/admin/auth/* is not caught by requireAdmin
  app.use('/api/admin', authRoutes)
  app.use('/api', apiRoutes)
  app.use('/backend', legacyRoutes)

  const STATIC_DIR = resolveStaticDir()
  const SERVE_FRONTEND =
    process.env.NODE_ENV === 'production' || String(process.env.SERVE_STATIC || '').toLowerCase() === 'true'

  function isApiPath(reqPath) {
    return (
      reqPath.startsWith('/api') ||
      reqPath.startsWith('/backend') ||
      reqPath.startsWith('/uploads') ||
      reqPath.startsWith('/socket.io')
    )
  }

  if (SERVE_FRONTEND && STATIC_DIR) {
    app.use(express.static(STATIC_DIR, { index: false, maxAge: '1d' }))
    app.get('*', (req, res, next) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') return next()
      if (isApiPath(req.path)) return next()
      res.sendFile(path.join(STATIC_DIR, 'index.html'), (err) => {
        if (err) next(err)
      })
    })
  }

  app.use(notFoundMiddleware)
  app.use(errorMiddleware)

  app.STATIC_DIR = STATIC_DIR
  app.SERVE_FRONTEND = SERVE_FRONTEND
  return app
}

module.exports = { createApp, resolveStaticDir }
