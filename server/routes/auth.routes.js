const { Router } = require('express')
const controller = require('../controllers/api.controller')
const { loginSchema, pushTokenSchema } = require('../validators/schemas')
const { requireAdmin } = require('../middlewares/auth.middleware')
const { validateBody } = require('../middlewares/validate.middleware')
const { asyncHandler } = require('../utils/asyncHandler')

const ah = asyncHandler
const router = Router()

router.post('/auth/login', validateBody(loginSchema), ah(controller.login))
router.post('/auth/refresh', ah(controller.refresh))
router.post('/auth/logout', ah(controller.logout))

router.post('/push/tokens', requireAdmin, validateBody(pushTokenSchema), ah(controller.savePushToken))
router.post('/push/test', requireAdmin, ah(controller.testPush))

module.exports = router
