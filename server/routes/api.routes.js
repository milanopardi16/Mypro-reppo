const { Router } = require('express')
const multer = require('multer')
const controller = require('../controllers/api.controller')
const { requireAdmin } = require('../middlewares/auth.middleware')
const { validateBody, validateQuery } = require('../middlewares/validate.middleware')
const { auditAction } = require('../middlewares/audit.middleware')
const { asyncHandler } = require('../utils/asyncHandler')
const {
  registrationSchema,
  contactSchema,
  siteContentSectionSchema,
  evaluationsPublicQuerySchema,
  founderOnboardingSchema,
  blogCreateSchema,
  blogPostSchema,
} = require('../validators/schemas')

const ah = asyncHandler

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
})
const router = Router()

router.get('/health', ah(controller.health))
router.get('/db-health', ah(controller.dbHealth))
router.get('/version', ah(controller.version))
router.get('/ready', ah(controller.ready))
router.get('/blogs', ah(controller.listBlogsPublic))
router.get('/evaluations', validateQuery(evaluationsPublicQuerySchema), ah(controller.listEvaluationsPublic))
router.post('/registrations', validateBody(registrationSchema), ah(controller.createRegistration))
router.get('/site-content', ah(controller.getSiteContentPublic))
router.post('/contact', validateBody(contactSchema), ah(controller.createContact))
router.post('/founder-onboarding', upload.single('deck'), validateBody(founderOnboardingSchema), ah(controller.founderOnboarding))
router.get('/chat/rooms/:roomId/messages', ah(controller.getChatMessages))
router.post('/chat/uploads', upload.single('file'), ah(controller.chatUpload))

const adminRouter = Router()
adminRouter.use(requireAdmin)

adminRouter.get('/health', ah(controller.adminHealth))
adminRouter.get('/me', ah(controller.adminMe))
adminRouter.get('/dashboard/summary', ah(controller.dashboardSummary))

adminRouter.get('/blogs', ah(controller.listBlogsAdmin))
adminRouter.post('/blogs', validateBody(blogCreateSchema), auditAction('CREATE', 'blog', (_req, body) => body?.post?.id), ah(controller.createBlog))
adminRouter.put('/blogs/:id', validateBody(blogPostSchema), auditAction('UPDATE', 'blog'), ah(controller.updateBlog))
adminRouter.delete('/blogs/:id', auditAction('DELETE', 'blog'), ah(controller.deleteBlog))

adminRouter.get('/site-content', ah(controller.getSiteContentAdmin))
adminRouter.put('/site-content', auditAction('UPDATE', 'site_content'), ah(controller.putSiteContentAdmin))
adminRouter.post('/site-content/section', validateBody(siteContentSectionSchema), auditAction('UPDATE', 'site_content'), ah(controller.updateSiteContentSection))

adminRouter.get('/registrations', ah(controller.listRegistrations))
adminRouter.get('/contact-messages', ah(controller.listContactMessages))
adminRouter.put('/contact-messages/:id/read', auditAction('READ', 'contact_message'), ah(controller.markContactRead))

adminRouter.get('/notifications', ah(controller.listNotifications))
adminRouter.put('/notifications/:id/read', ah(controller.markNotificationRead))
adminRouter.put('/notifications/mark-all-read', ah(controller.markAllNotificationsRead))

adminRouter.get('/founder-submissions', ah(controller.listFounderSubmissions))
adminRouter.get('/admin-evaluations', ah(controller.listEvaluationsAdmin))
adminRouter.get('/admin-evaluations/export-excel', ah(controller.exportEvaluationsExcel))
adminRouter.put('/admin-evaluations/bulk-update', auditAction('BULK_UPDATE', 'assessment'), ah(controller.bulkUpdateEvaluations))
adminRouter.put('/admin-evaluations/:id', auditAction('UPDATE', 'assessment'), ah(controller.updateEvaluation))

adminRouter.get('/chat/rooms', ah(controller.listChatRooms))
adminRouter.get('/chat/rooms/:roomId/messages', ah(controller.getChatMessages))
adminRouter.put('/chat/rooms/:roomId/mark-read', ah(controller.markChatRoomRead))
adminRouter.post('/uploads', upload.single('file'), ah(controller.adminUpload))

router.use('/admin', adminRouter)

module.exports = router
