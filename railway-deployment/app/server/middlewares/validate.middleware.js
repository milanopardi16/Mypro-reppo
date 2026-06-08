function validateBody(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body || {})
    if (!parsed.success) {
      const message = parsed.error.issues?.[0]?.message || 'ورودی نامعتبر است'
      return res.status(400).json({ error: message })
    }
    req.validatedBody = parsed.data
    req.body = parsed.data
    next()
  }
}

function validateQuery(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.query || {})
    if (!parsed.success) {
      const message = parsed.error.issues?.[0]?.message || 'پارامترهای درخواست نامعتبر است'
      return res.status(400).json({ error: message })
    }
    req.validatedQuery = parsed.data
    next()
  }
}

module.exports = { validateBody, validateQuery }
