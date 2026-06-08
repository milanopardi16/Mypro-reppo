const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const cookieParser = require('cookie-parser')
const { resolveCorsOptions } = require('../config/cors')

function applySecurityMiddleware(app) {
  app.use(cors(resolveCorsOptions()))
  
  // Enhanced security headers
  app.use(helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },
    permissionsPolicy: {
      features: {
        camera: ["'none'"],
        microphone: ["'none'"],
        geolocation: ["'none'"],
        payment: ["'none'"],
      },
    },
  }))
  
  app.use(cookieParser())
  app.set('trust proxy', 1)
  // Global rate limit - reduced from 120 to 60 req/min for better protection
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      limit: 60,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً بعداً تلاش کنید.' },
    })
  )
  
  // Strict rate limit for login endpoint
  app.use(
    '/api/admin/auth/login',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 20,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'تعداد تلاش‌های ورود بیش از حد مجاز است. لطفاً بعداً تلاش کنید.' },
    })
  )
  
  // Rate limit for contact form to prevent spam
  app.use(
    '/api/contact',
    rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      limit: 10,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'تعداد پیام‌های تماس بیش از حد مجاز است. لطفاً بعداً تلاش کنید.' },
    })
  )
  
  // Rate limit for registration endpoint
  app.use(
    '/api/registrations',
    rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      limit: 5,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'تعداد ثبت‌نام‌ها بیش از حد مجاز است. لطفاً بعداً تلاش کنید.' },
    })
  )
  
  // Rate limit for founder onboarding
  app.use(
    '/api/founder-onboarding',
    rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      limit: 3,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'تعداد درخواست‌های ارزیابی بیش از حد مجاز است. لطفاً بعداً تلاش کنید.' },
    })
  )
}

module.exports = { applySecurityMiddleware }
