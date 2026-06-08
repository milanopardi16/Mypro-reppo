'use client'

import Link from '@/src/router-shims/Link'
import { motion } from 'framer-motion'
import LoginForm from '../components/LoginForm'
import { useSiteContent } from '../hooks/useSiteContent'

export default function LoginPage() {
  const siteContent = useSiteContent()

  return (
    <div className="app-login-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '480px', boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ fontSize: '32px', fontWeight: '700', color: '#000', marginBottom: '12px', fontFamily: 'BYekan, IranYekan, sans-serif' }}
            >
              {siteContent.loginPage.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ color: '#000', fontSize: '16px', lineHeight: '1.5', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: '700' }}
            >
              {siteContent.loginPage.subtitle}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <LoginForm />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid #e5e7eb', marginTop: '24px' }}
          >
            <p style={{ color: '#000', fontSize: '14px', fontWeight: '700', fontFamily: 'BYekan, IranYekan, sans-serif' }}>
              حساب کاربری ندارید؟{' '}
              <Link href="/register" style={{ color: '#000', textDecoration: 'none', fontWeight: '700', transition: 'color 0.3s' }} className="auth-link">
                ثبت نام کنید
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}