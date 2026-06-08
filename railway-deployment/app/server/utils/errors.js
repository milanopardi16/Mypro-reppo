class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.code = code
    this.isOperational = true
  }
}

function notFound(message = 'منبع یافت نشد') {
  return new AppError(message, 404, 'NOT_FOUND')
}

function badRequest(message = 'ورودی نامعتبر است') {
  return new AppError(message, 400, 'BAD_REQUEST')
}

function unauthorized(message = 'دسترسی غیرمجاز') {
  return new AppError(message, 401, 'UNAUTHORIZED')
}

module.exports = { AppError, notFound, badRequest, unauthorized }
