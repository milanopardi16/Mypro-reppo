const { logger } = require('../config/logger')

function requestLogMiddleware(req, res, next) {
  const start = Date.now()
  res.on('finish', () => {
    logger.info('http_request', {
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl || req.url,
      status: res.statusCode,
      durationMs: Date.now() - start,
    })
  })
  next()
}

module.exports = { requestLogMiddleware }
