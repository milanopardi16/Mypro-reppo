'use client'

import { useState } from 'react'
import Link from '@/src/router-shims/Link'
import { useRouter } from '@/src/router-shims/navigation'
import { authenticateUser, setCurrentUser, addUserAction } from '../utils/userStore'

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const validateForm = () => {
    const newErrors = {}
    const phonePattern = /^09\d{9}$/

    if (!formData.email && !formData.phone) {
      newErrors.general = 'لطفاً ایمیل یا شماره تلفن را وارد کنید'
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'فرمت ایمیل صحیح نیست'
    }

    if (formData.phone && !phonePattern.test(formData.phone)) {
      newErrors.phone = 'شماره تلفن باید با ۰۹ و شامل ۱۱ رقم باشد'
    }

    if (!formData.password) {
      newErrors.password = 'رمز عبور الزامی است'
    } else if (formData.password.length < 6) {
      newErrors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const identifier = formData.email || formData.phone
      const user = authenticateUser(identifier, formData.password)

      if (!user) {
        setErrors({ general: 'ایمیل/شماره تلفن یا رمز عبور اشتباه است' })
        setIsLoading(false)
        return
      }

      setCurrentUser(user)
      addUserAction(user.id, 'ورود', 'کاربر با موفقیت وارد شد.', { source: 'login' })
      router.push('/dashboard')

    } catch (error) {
      setErrors({ general: 'خطا در ورود به سیستم. لطفا دوباره تلاش کنید.' })
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))


    // پاک کردن خطا هنگام تایپ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="cn-login-form">
      {errors.general && (
        <div className="cn-error-message cn-error-general">
          {errors.general}
        </div>
      )}

      <div className="cn-form-group">
        <label htmlFor="phone" className="cn-form-label">
          شماره تلفن
        </label>
        <div className="cn-input-wrapper">
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`cn-form-input ${errors.phone ? 'cn-input-error' : ''}`}
            placeholder="09123456789"
            dir="ltr"
            autoComplete="tel"
          />
          <svg className="cn-input-icon" viewBox="0 0 24 24" fill="none">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {errors.phone && <span className="cn-error-message">{errors.phone}</span>}
      </div>

      <div className="cn-form-group">
        <label htmlFor="password" className="cn-form-label">
          رمز عبور <span className="cn-required">*</span>
        </label>
        <div className="cn-input-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`cn-form-input ${errors.password ? 'cn-input-error' : ''}`}
            placeholder="رمز عبور خود را وارد کنید"
            dir="ltr"
            autoComplete="current-password"
          />
          <button
            type="button"
            className="cn-password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'مخفی کردن رمز عبور' : 'نمایش رمز عبور'}
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M2.45703 12C3.73128 7.94291 7.52159 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C20.2672 16.0571 16.4769 19 11.9992 19C7.52159 19 3.73128 16.0571 2.45703 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.9992 15C13.6561 15 14.9992 13.6569 14.9992 12C14.9992 10.3431 13.6561 9 11.9992 9C10.3424 9 8.99924 10.3431 8.99924 12C8.99924 13.6569 10.3424 15 11.9992 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
        {errors.password && <span className="cn-error-message">{errors.password}</span>}
      </div>

      <div className="cn-form-options">
        <label className="cn-checkbox-label">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="cn-checkbox"
          />
          <span className="cn-checkbox-custom"></span>
          مرا به خاطر بسپار
        </label>

        <Link href="/forgot-password" className="cn-forgot-password">
          رمز عبور را فراموش کرده‌اید؟
        </Link>
      </div>

      <button
        type="submit"
        className={`cn-submit-btn ${isLoading ? 'cn-loading' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <svg className="cn-spinner" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="31.416" strokeDashoffset="31.416">
                <animate attributeName="stroke-dashoffset" dur="1s" repeatCount="indefinite" values="31.416;0"/>
              </circle>
            </svg>
            در حال ورود...
          </>
        ) : (
          'ورود به حساب'
        )}
      </button>

      <div className="cn-form-footer">
        <p>
          حساب کاربری ندارید؟
          <Link href="/register" className="cn-register-link"> ثبت نام کنید</Link>
        </p>
      </div>

      <div className="cn-social-login">
        <div className="cn-divider">
          <span>یا</span>
        </div>

        <div className="cn-social-buttons">
          <button type="button" className="cn-social-btn cn-google-btn">
            <svg viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            ادامه با گوگل
          </button>

          <button type="button" className="cn-social-btn cn-linkedin-btn">
            <svg viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            ادامه با لینکدین
          </button>
        </div>
      </div>
    </form>
  )
}