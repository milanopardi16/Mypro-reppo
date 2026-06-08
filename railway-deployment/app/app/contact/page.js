'use client'

import { useEffect, useState } from 'react'
import PageLayout from '../components/PageLayout'
import { useSiteContent } from '../hooks/useSiteContent'

export default function ContactPage() {
  const siteContent = useSiteContent()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')

  return (
    <PageLayout title={siteContent.contactPage.title} subtitle={siteContent.contactPage.subtitle} badge={siteContent.contactPage.badge}>
      <div className="cn-contact-page-grid">
        <div className="cn-contact-info">
          <div className="cn-contact-item">
            <div className="cn-contact-item-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h4>تلفن تماس</h4>
              <p>{siteContent.contactPage.phone}</p>
            </div>
          </div>

          <div className="cn-contact-item">
            <div className="cn-contact-item-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h4>ایمیل</h4>
              <p>{siteContent.contactPage.email}</p>
            </div>
          </div>

          <div className="cn-contact-item">
            <div className="cn-contact-item-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div>
              <h4>آدرس</h4>
              <p>{siteContent.contactPage.address}</p>
            </div>
          </div>
        </div>

        <div className="cn-contact-form">
          <h3>{siteContent.contactPage.formTitle}</h3>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              setSubmitError('')
              setSubmitSuccess('')

              if (!fullName.trim()) {
                setSubmitError('نام و نام خانوادگی الزامی است')
                return
              }
              if (!message.trim()) {
                setSubmitError('پیام الزامی است')
                return
              }

              setSubmitting(true)
              try {
                const res = await fetch('/api/contact', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    fullName,
                    email: email.trim() || null,
                    subject: subject.trim() || null,
                    message,
                  }),
                })
                const data = await res.json().catch(() => null)
                if (!res.ok || !data?.success) {
                  throw new Error(data?.error || 'ارسال پیام با مشکل مواجه شد')
                }

                setSubmitSuccess(siteContent.contactPage.formSuccessMessage || 'پیام با موفقیت ارسال شد.')
                setFullName('')
                setEmail('')
                setSubject('')
                setMessage('')
              } catch (err) {
                console.error(err)
                setSubmitError(err?.message || 'خطا در ارسال پیام')
              } finally {
                setSubmitting(false)
              }
            }}
          >
            <div className="cn-form-group">
              <label>نام و نام خانوادگی</label>
              <input type="text" placeholder="نام خود را وارد کنید" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={submitting} />
            </div>
            <div className="cn-form-group">
              <label>ایمیل</label>
              <input type="email" placeholder="ایمیل خود را وارد کنید" value={email} onChange={(e) => setEmail(e.target.value)} disabled={submitting} />
            </div>
            <div className="cn-form-group">
              <label>موضوع</label>
              <input type="text" placeholder="موضوع پیام" value={subject} onChange={(e) => setSubject(e.target.value)} disabled={submitting} />
            </div>
            <div className="cn-form-group">
              <label>پیام</label>
              <textarea placeholder="پیام خود را بنویسید..." value={message} onChange={(e) => setMessage(e.target.value)} disabled={submitting}></textarea>
            </div>
            {submitError && <div style={{ marginTop: 12, color: '#b91c1c' }}>{submitError}</div>}
            {submitSuccess && <div style={{ marginTop: 12, color: '#047857' }}>{submitSuccess}</div>}
            <button type="submit" className="cn-submit-btn" disabled={submitting}>
              {submitting ? 'در حال ارسال...' : 'ارسال پیام'}
            </button>
          </form>
        </div>
      </div>
    </PageLayout>
  )
}