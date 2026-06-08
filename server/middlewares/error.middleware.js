const { AppError } = require('../utils/errors')
const { logger } = require('../config/logger')

function normalizeError(err) {
  if (err instanceof AppError) {
    return {
      status: err.statusCode,
      body: { ok: false, error: err.message, code: err.code },
    }
  }

  if (err?.name === 'ZodError') {
    const message = err.issues?.[0]?.message || 'ورودی نامعتبر است'
    return { status: 400, body: { ok: false, error: message, code: 'VALIDATION_ERROR' } }
  }

  if (err?.message === 'JWT secrets missing') {
    return { status: 503, body: { ok: false, error: 'سرویس پیکربندی نشده است', code: 'CONFIG_ERROR' } }
  }

  return {
    status: 500,
    body: { ok: false, error: 'خطای داخلی سرور', code: 'INTERNAL_ERROR' },
  }
}

function errorMiddleware(err, req, res, _next) {
  const { status, body } = normalizeError(err)
  const requestId = req.requestId

  logger.error('request_failed', {
    requestId,
    method: req.method,
    path: req.originalUrl || req.url,
    status,
    code: body.code,
    err: err instanceof AppError ? err.message : err?.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err?.stack,
  })

  res.status(status).json({ ...body, requestId })
}

function notFoundMiddleware(req, res) {
  res.status(404).json({
    ok: false,
    error: 'مسیر یافت نشد',
    code: 'ROUTE_NOT_FOUND',
    requestId: req.requestId,
  })
}

module.exports = { errorMiddleware, notFoundMiddleware, normalizeError }
