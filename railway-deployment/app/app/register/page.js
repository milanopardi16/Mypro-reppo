'use client'

import { useEffect, useState } from 'react'
import Link from '@/src/router-shims/Link'
import { useRouter } from '@/src/router-shims/navigation'
import { motion } from 'framer-motion'
import { useSiteContent } from '../hooks/useSiteContent'
import { createUser, findUser, setCurrentUser } from '../utils/userStore'

export default function RegisterPage() {
  const siteContent = useSiteContent()

  return (
    <div className="app-register-page" style={{ minHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '520px', boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ fontSize: '36px', fontWeight: '800', color: '#000', marginBottom: '14px', fontFamily: 'BYekan, IranYekan, sans-serif' }}>
              {siteContent.registerPage.title}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ color: '#000', fontSize: '18px', lineHeight: '1.7', fontWeight: '700', fontFamily: 'BYekan, IranYekan, sans-serif' }}>
              {siteContent.registerPage.subtitle}
            </motion.p>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <RegisterForm />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid #e5e7eb', marginTop: '24px' }}>
            <p style={{ color: '#000', fontSize: '16px', fontWeight: '700', fontFamily: 'BYekan, IranYekan, sans-serif' }}>
              حساب کاربری دارید؟{' '}
              <Link href="/login" style={{ color: '#000', textDecoration: 'none', fontWeight: '800', transition: 'color 0.3s' }} className="auth-link">
                وارد شوید
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

function RegisterForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    position: '',
    industry: '',
    website: '',
    message: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const normalizePhone = (value) => {
    if (!value) return ''
    const latinDigits = value.replace(/[۰-۹]/g, d => String.fromCharCode(d.charCodeAt(0) - 1728))
    return latinDigits.replace(/[^0-9]/g, '')
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = name === 'phone' ? normalizePhone(value) : value

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : newValue
    }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    const phonePattern = /^09\d{9}$/
    const normalizedPhone = normalizePhone(formData.phone)
    const emailValue = formData.email.trim()

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'نام و نام خانوادگی الزامی است'
    }

    if (!emailValue && !normalizedPhone) {
      newErrors.general = 'لطفاً ایمیل یا شماره تلفن را وارد کنید'
    }

    if (emailValue && !/\S+@\S+\.\S+/.test(emailValue)) {
      newErrors.email = 'فرمت ایمیل صحیح نیست'
    }

    if (normalizedPhone && !phonePattern.test(normalizedPhone)) {
      newErrors.phone = 'شماره تلفن باید با ۰۹ و شامل ۱۱ رقم باشد'
    }

    if (!formData.password) {
      newErrors.password = 'رمز عبور الزامی است'
    } else if (formData.password.length < 8) {
      newErrors.password = 'رمز عبور باید حداقل ۸ کاراکتر باشد'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'تأیید رمز عبور الزامی است'
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'رمز عبور و تکرار آن مطابقت ندارند'
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'برای ادامه باید شرایط و قوانین را بپذیرید'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)

    try {
      const normalizedPhone = normalizePhone(formData.phone)
      const normalizedEmail = formData.email.trim().toLowerCase()
      const payload = {
        fullName: formData.fullName.trim(),
        email: normalizedEmail || null,
        phone: normalizedPhone || null,
        companyName: formData.companyName.trim() || null,
        position: formData.position.trim() || null,
        industry: formData.industry.trim() || null,
        website: formData.website.trim() || null,
        message: formData.message.trim() || null,
      }

      const registrationRes = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!registrationRes.ok) {
        const regError = await registrationRes.json().then(json => json.error || json.message).catch(() => null)
        const errorMessage = regError || 'خطا در ثبت نام. لطفاً دوباره تلاش کنید.'
        throw new Error(errorMessage)
      }

      try {
        const user = createUser({
          fullName: formData.fullName,
          email: normalizedEmail,
          phone: normalizedPhone,
          password: formData.password,
        })
        setCurrentUser(user)
      } catch (error) {
        const user = findUser(normalizedEmail || normalizedPhone)
        if (user) {
          setCurrentUser(user)
        } else {
          throw error
        }
      }

      router.push('/dashboard')
    } catch (error) {
      setErrors({ general: error?.message || 'ثبت‌نام با مشکل مواجه شد. لطفاً دوباره تلاش کنید.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {errors.general && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px 16px', color: '#ef4444', fontSize: '14px', fontWeight: '500', fontFamily: 'BYekan, IranYekan, sans-serif' }}>
          {errors.general}
        </div>
      )}

      <div>
        <label style={{ fontWeight: '700', color: '#000', fontSize: '16px', fontFamily: 'BYekan, IranYekan, sans-serif', display: 'block', marginBottom: '8px' }}>نام و نام خانوادگی</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="مثل: علی رضایی"
          style={{ width: '100%', padding: '14px 16px', border: errors.fullName ? '2px solid #ef4444' : '2px solid #e5e7eb', borderRadius: '10px', fontSize: '16px', fontFamily: 'BYekan, IranYekan, sans-serif', outline: 'none', boxSizing: 'border-box' }}
        />
        {errors.fullName && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.fullName}</span>}
      </div>

      <div>
        <label style={{ fontWeight: '700', color: '#000', fontSize: '16px', fontFamily: 'BYekan, IranYekan, sans-serif', display: 'block', marginBottom: '8px' }}>ایمیل</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@gmail.com"
          dir="ltr"
          style={{ width: '100%', padding: '14px 16px', border: errors.email ? '2px solid #ef4444' : '2px solid #e5e7eb', borderRadius: '10px', fontSize: '16px', fontFamily: 'BYekan, IranYekan, sans-serif', outline: 'none', boxSizing: 'border-box' }}
        />
        {errors.email && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
      </div>

      <div>
        <label style={{ fontWeight: '700', color: '#000', fontSize: '16px', fontFamily: 'BYekan, IranYekan, sans-serif', display: 'block', marginBottom: '8px' }}>شماره تلفن</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="09123456789"
          dir="ltr"
          inputMode="numeric"
          style={{ width: '100%', padding: '14px 16px', border: errors.phone ? '2px solid #ef4444' : '2px solid #e5e7eb', borderRadius: '10px', fontSize: '16px', fontFamily: 'BYekan, IranYekan, sans-serif', outline: 'none', boxSizing: 'border-box' }}
        />
        {errors.phone && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.phone}</span>}
      </div>

      <div>
        <label style={{ fontWeight: '700', color: '#000', fontSize: '16px', fontFamily: 'BYekan, IranYekan, sans-serif', display: 'block', marginBottom: '8px' }}>نام شرکت یا استارتاپ</label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="مثلاً شرکت نوآوری آریا"
          style={{ width: '100%', padding: '14px 16px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '16px', fontFamily: 'BYekan, IranYekan, sans-serif', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      <div>
        <label style={{ fontWeight: '700', color: '#000', fontSize: '16px', fontFamily: 'BYekan, IranYekan, sans-serif', display: 'block', marginBottom: '8px' }}>سمت یا نقش</label>
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="مثلاً مدیر عامل یا بنیان‌گذار"
          style={{ width: '100%', padding: '14px 16px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '16px', fontFamily: 'BYekan, IranYekan, sans-serif', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      <div>
        <label style={{ fontWeight: '700', color: '#000', fontSize: '16px', fontFamily: 'BYekan, IranYekan, sans-serif', display: 'block', marginBottom: '8px' }}>حوزه فعالیت</label>
        <input
          type="text"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          placeholder="مثلاً فین‌تک، سلامت، آموزشی"
          style={{ width: '100%', padding: '14px 16px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '16px', fontFamily: 'BYekan, IranYekan, sans-serif', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      <div>
        <label style={{ fontWeight: '700', color: '#000', fontSize: '16px', fontFamily: 'BYekan, IranYekan, sans-serif', display: 'block', marginBottom: '8px' }}>وب‌سایت</label>
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={handleChange}
          placeholder="https://example.com"
          dir="ltr"
          style={{ width: '100%', padding: '14px 16px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '16px', fontFamily: 'BYekan, IranYekan, sans-serif', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      <div>
        <label style={{ fontWeight: '700', color: '#000', fontSize: '16px', fontFamily: 'BYekan, IranYekan, sans-serif', display: 'block', marginBottom: '8px' }}>درباره خودتان و نیازتان بگویید</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="چند جمله درباره اینکه چرا نیاز به عضویت دارید..."
          rows={4}
          style={{ width: '100%', padding: '14px 16px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '16px', fontFamily: 'BYekan, IranYekan, sans-serif', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
        />
      </div>

      <div>
        <label style={{ fontWeight: '700', color: '#000', fontSize: '16px', fontFamily: 'BYekan, IranYekan, sans-serif', display: 'block', marginBottom: '8px' }}>رمز عبور</label>
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="حداقل ۸ کاراکتر"
          dir="ltr"
          style={{ width: '100%', padding: '14px 16px', border: errors.password ? '2px solid #ef4444' : '2px solid #e5e7eb', borderRadius: '10px', fontSize: '16px', fontFamily: 'BYekan, IranYekan, sans-serif', outline: 'none', boxSizing: 'border-box' }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{ marginTop: '8px', padding: '8px 16px', background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontFamily: 'BYekan, IranYekan, sans-serif' }}
        >
          {showPassword ? 'پنهان کردن' : 'نمایش'}
        </button>
        {errors.password && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.password}</span>}
      </div>

      <div>
        <label style={{ fontWeight: '700', color: '#000', fontSize: '16px', fontFamily: 'BYekan, IranYekan, sans-serif', display: 'block', marginBottom: '8px' }}>تأیید رمز عبور</label>
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="رمز عبور را تکرار کنید"
          dir="ltr"
          style={{ width: '100%', padding: '14px 16px', border: errors.confirmPassword ? '2px solid #ef4444' : '2px solid #e5e7eb', borderRadius: '10px', fontSize: '16px', fontFamily: 'BYekan, IranYekan, sans-serif', outline: 'none', boxSizing: 'border-box' }}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          style={{ marginTop: '8px', padding: '8px 16px', background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontFamily: 'BYekan, IranYekan, sans-serif' }}
        >
          {showConfirmPassword ? 'پنهان کردن' : 'نمایش'}
        </button>
        {errors.confirmPassword && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.confirmPassword}</span>}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <input
          type="checkbox"
          id="agreeTerms"
          name="agreeTerms"
          checked={formData.agreeTerms}
          onChange={handleChange}
          style={{ cursor: 'pointer', width: '20px', height: '20px', marginTop: '2px', flexShrink: 0 }}
        />
        <label htmlFor="agreeTerms" style={{ fontSize: '14px', color: '#000', fontWeight: '700', cursor: 'pointer', fontFamily: 'BYekan, IranYekan, sans-serif' }}>
          با <Link href="/terms" style={{ color: '#000', textDecoration: 'underline' }}>شرایط و قوانین</Link> موافقم
        </label>
      </div>
      {errors.agreeTerms && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.agreeTerms}</span>}

      <button
        type="submit"
        disabled={isLoading}
        style={{
          background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #D19C0A 0%, #E5B02A 100%)',
          color: '#000',
          border: 'none',
          padding: '16px 24px',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '800',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontFamily: 'BYekan, IranYekan, sans-serif',
          opacity: isLoading ? '0.7' : '1'
        }}
      >
        {isLoading ? 'در حال ثبت نام...' : 'ثبت نام'}
      </button>
    </form>
  )
}
