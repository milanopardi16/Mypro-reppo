const { z } = require('zod')

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

const pushTokenSchema = z.object({
  token: z.string().min(10),
  platform: z.string().optional(),
})

const registrationSchema = z
  .object({
    fullName: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    companyName: z.string().optional(),
    position: z.string().optional(),
    industry: z.string().optional(),
    website: z.string().optional(),
    message: z.string().optional(),
    data: z.record(z.any()).optional(),
  })
  .passthrough()

const contactSchema = z
  .object({
    fullName: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    subject: z.string().optional(),
    topic: z.string().optional(),
    message: z.string().min(1),
  })
  .refine((d) => String(d.fullName || d.name || '').trim().length > 0, {
    message: 'نام و پیام الزامی است',
  })

const siteContentSectionSchema = z.object({
  section: z.string().min(1),
  data: z.any(),
})

const evaluationsPublicQuerySchema = z
  .object({
    email: z.string().optional(),
    phone: z.string().optional(),
    fullName: z.string().optional(),
    name: z.string().optional(),
  })
  .refine((d) => Boolean(d.email?.trim() || d.phone?.trim() || d.fullName?.trim() || d.name?.trim()), {
    message: 'حداقل یکی از پارامترهای email، phone یا fullName الزامی است',
  })

const founderOnboardingSchema = z
  .object({
    profile_type: z.string().optional(),
    full_name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    linkedin: z.string().optional(),
    company_name: z.string().optional(),
    sector: z.string().optional(),
    stage: z.string().optional(),
    capital_required: z.string().optional(),
    one_liner: z.string().optional(),
    org_name: z.string().optional(),
    ticket_size: z.string().optional(),
    stage_pref: z.string().optional(),
    geo_pref: z.string().optional(),
    confidence: z.string().optional(),
    message: z.string().optional(),
    confirm_accuracy: z.union([z.string(), z.boolean()]).optional(),
  })
  .passthrough()

const blogPostSchema = z
  .object({
    id: z.string().optional(),
    slug: z.string().optional().nullable(),
    title: z.string().min(1).optional(),
    excerpt: z.string().optional(),
    content: z.string().optional(),
    coverImage: z.string().optional().nullable(),
    tags: z.array(z.string()).optional(),
    category: z.string().optional().nullable(),
    status: z.string().optional(),
  })
  .passthrough()

const blogCreateSchema = z.object({
  post: blogPostSchema.optional(),
}).passthrough()

module.exports = {
  loginSchema,
  pushTokenSchema,
  registrationSchema,
  contactSchema,
  siteContentSectionSchema,
  evaluationsPublicQuerySchema,
  founderOnboardingSchema,
  blogPostSchema,
  blogCreateSchema,
}
