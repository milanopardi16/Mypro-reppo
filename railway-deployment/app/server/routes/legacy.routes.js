const { Router } = require('express')
const controller = require('../controllers/api.controller')
const { requireAdmin } = require('../middlewares/auth.middleware')
const { validateBody } = require('../middlewares/validate.middleware')
const { auditAction } = require('../middlewares/audit.middleware')
const { asyncHandler } = require('../utils/asyncHandler')
const { registrationSchema } = require('../validators/schemas')

const ah = asyncHandler
const router = Router()

router.post('/registrations', validateBody(registrationSchema), ah(controller.createRegistration))
router.get('/site-content', ah(controller.getSiteContentLegacy))
router.put('/site-content', requireAdmin, auditAction('UPDATE', 'site_content'), ah(controller.putSiteContentAdmin))

module.exports = router
