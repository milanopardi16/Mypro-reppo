const auditLogRepository = require('../repositories/auditLog.repository')

async function logAudit({ adminId, action, resource, resourceId, details, req }) {
  try {
    await auditLogRepository.create({
      adminId: adminId || req?.admin?.id || null,
      action,
      resource,
      resourceId: resourceId ? String(resourceId) : null,
      details: details || undefined,
      ipAddress: req?.ip || req?.headers?.['x-forwarded-for'] || null,
      userAgent: req?.headers?.['user-agent'] || null,
    })
  } catch {
    // audit must not break main flow
  }
}

function auditAction(action, resource, getResourceId) {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res)
    res.json = (body) => {
      if (res.statusCode < 400) {
        const resourceId = typeof getResourceId === 'function' ? getResourceId(req, body) : req.params?.id
        logAudit({ action, resource, resourceId, details: { method: req.method, path: req.path }, req })
      }
      return originalJson(body)
    }
    next()
  }
}

module.exports = { logAudit, auditAction }
