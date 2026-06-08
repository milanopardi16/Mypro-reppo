'use client'

import { useState } from 'react'
import Link from '@/src/router-shims/Link'
import { useRouter } from '@/src/router-shims/navigation'

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const validateForm = () => {
    const newErrors = {}
    const phonePattern = /^09\d{9}$/

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'نام و نام خانوادگی الزامی است'
    }

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
      let savedOnServer = false
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
      }

      try {
        const res = await fetch('/api/registrations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (res.ok) savedOnServer = true
      } catch {
        // network / server error — we'll fallback below
      }

      if (!savedOnServer && typeof window !== 'undefined') {
        const storageKey = 'capitalNetworkRegistrations'
        const existing = JSON.parse(window.localStorage.getItem(storageKey) || '[]')
        const newRegistration = {
          id: Date.now(),
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          createdAt: new Date().toISOString(),
          reviewed: false,
        }
        existing.push(newRegistration)
        window.localStorage.setItem(storageKey, JSON.stringify(existing))
      }

      router.push('/login')
    } catch (error) {
      setErrors({ general: 'ثبت‌نام با مشکل مواجه شد. لطفاً دوباره تلاش کنید.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

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
        <label htmlFor="fullName" className="cn-form-label">
          نام و نام خانوادگی <span className="cn-required">*</span>
        </label>
        <div className="cn-input-wrapper">
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`cn-form-input ${errors.fullName ? 'cn-input-error' : ''}`}
            placeholder="مثلاً علی محمدی"
            autoComplete="name"
          />
        </div>
        {errors.fullName && <span className="cn-error-message">{errors.fullName}</span>}
      </div>

      <div className="cn-form-group">
        <label htmlFor="email" className="cn-form-label">
          ایمیل
        </label>
        <div className="cn-input-wrapper">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`cn-form-input ${errors.email ? 'cn-input-error' : ''}`}
            placeholder="example@email.com"
            dir="ltr"
            autoComplete="email"
          />
        </div>
        {errors.email && <span className="cn-error-message">{errors.email}</span>}
      </div>

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
            placeholder="حداقل ۸ کاراکتر"
            dir="ltr"
            autoComplete="new-password"
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

      <div className="cn-form-group">
        <label htmlFor="confirmPassword" className="cn-form-label">
          تکرار رمز عبور <span className="cn-required">*</span>
        </label>
        <div className="cn-input-wrapper">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`cn-form-input ${errors.confirmPassword ? 'cn-input-error' : ''}`}
            placeholder="رمز عبور را دوباره وارد کنید"
            dir="ltr"
            autoComplete="new-password"
          />
          <button
            type="button"
            className="cn-password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? 'مخفی کردن رمز عبور' : 'نمایش رمز عبور'}
          >
            {showConfirmPassword ? (
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
        {errors.confirmPassword && <span className="cn-error-message">{errors.confirmPassword}</span>}
      </div>

      <label className="cn-checkbox-label">
        <input
          type="checkbox"
          name="agreeTerms"
          checked={formData.agreeTerms}
          onChange={handleChange}
          className="cn-checkbox"
        />
        <span className="cn-checkbox-custom"></span>
        قوانین و مقررات کپیتال نتورک را خوانده و قبول دارم.
      </label>
      {errors.agreeTerms && <span className="cn-error-message">{errors.agreeTerms}</span>}

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
            در حال ثبت‌نام...
          </>
        ) : (
          'ثبت‌نام'
        )}
      </button>

      <div className="cn-form-footer">
        <p>
          قبلا ثبت‌نام کرده‌اید؟
          <Link href="/login" className="cn-register-link"> وارد شوید</Link>
        </p>
      </div>
    </form>
  )
}
