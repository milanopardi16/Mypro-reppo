const crypto = require('crypto')
const { normalizeString } = require('../utils/helpers')

const HEADER = 'x-request-id'

function correlationMiddleware(req, res, next) {
  const incoming = normalizeString(req.headers[HEADER])
  const requestId = incoming || crypto.randomUUID()
  req.requestId = requestId
  res.setHeader(HEADER, requestId)
  next()
}

module.exports = { correlationMiddleware, HEADER }
