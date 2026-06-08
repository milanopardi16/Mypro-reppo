'use client'

import { useEffect } from 'react'
import { getCurrentUser, addUserAction } from '../utils/userStore'

export default function FounderOnboarding() {
  useEffect(() => {
    const form = document.getElementById('cn-onboard-form')
    const steps = Array.from(document.querySelectorAll('.cn-step'))
    const progressSteps = Array.from(document.querySelectorAll('.cn-progress-step'))
    const progressFill = document.getElementById('cn-progress-fill')
    const prevBtn = document.getElementById('cn-prev-btn')
    const nextBtn = document.getElementById('cn-next-btn')
    const submitBtn = document.getElementById('cn-submit-btn')
    const step1Error = document.getElementById('step1-error')
    const profileHidden = document.getElementById('profile_type_hidden')

    let currentStep = 1
    let profileType = ''
    const totalSteps = 5

    const setError = (field, msg) => {
      const holder = field?.closest('.cn-field') || field?.parentElement
      const error = holder?.querySelector('.cn-error')
      if (field) field.classList.toggle('error', !!msg)
      if (error) error.textContent = msg || ''
    }

    const updateProgress = () => {
      if (progressFill) progressFill.style.width = ((currentStep / totalSteps) * 100) + '%'
      progressSteps?.forEach((s, i) => s.classList.toggle('active', i + 1 <= currentStep))
    }

    const showStep = (step) => {
      steps.forEach(item => {
        item.classList.remove('active')
        const stepNum = Number(item.dataset.step)
        const showFor = item.dataset.show
        if (stepNum === step && (!showFor || showFor === profileType)) {
          item.classList.add('active')
        }
      })
      if (prevBtn) prevBtn.style.display = step > 1 && step < 5 ? 'block' : 'none'
      if (nextBtn) nextBtn.style.display = step < 4 ? 'block' : 'none'
      if (submitBtn) submitBtn.style.display = step === 4 ? 'block' : 'none'
      if (step === 5) {
        const nav = document.querySelector('.cn-nav')
        if (nav) nav.style.display = 'none'
      }
      updateProgress()
      document.getElementById('cn-onboard')?.scrollIntoView({ behavior: 'smooth' })
    }

    const validateStep = () => {
      const activeStep = document.querySelector('.cn-step.active')
      let valid = true

      if (currentStep === 1) {
        const selected = form?.querySelector('input[name="profile_type"]:checked')
        if (!selected) {
          if (step1Error) step1Error.textContent = 'لطفاً نوع پروفایل را انتخاب کنید'
          return false
        }
        profileType = selected.value
        if (profileHidden) profileHidden.value = selected.value
        if (step1Error) step1Error.textContent = ''
        return true
      }

      activeStep?.querySelectorAll('[required]').forEach(field => {
        let value = ''
        if (field.type === 'radio') {
          const checked = activeStep.querySelector(`input[name="${field.name}"]:checked`)
          value = checked?.value || ''
        } else if (field.type === 'checkbox') {
          value = field.checked ? field.value : ''
        } else {
          value = String(field.value || '').trim()
        }

        if (!value) {
          setError(field, 'این فیلد الزامی است')
          valid = false
        } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          setError(field, 'ایمیل معتبر وارد کنید')
          valid = false
        } else {
          setError(field, '')
        }
      })
      return valid
    }

    form?.querySelectorAll('input[name="profile_type"]').forEach(input => {
      input.addEventListener('change', function() {
        profileType = this.value
        if (profileHidden) profileHidden.value = this.value
        if (step1Error) step1Error.textContent = ''
      })
    })

    nextBtn?.addEventListener('click', () => {
      if (validateStep()) {
        currentStep = Math.min(currentStep + 1, totalSteps)
        showStep(currentStep)
      }
    })

    prevBtn?.addEventListener('click', () => {
      currentStep = Math.max(currentStep - 1, 1)
      showStep(currentStep)
    })

    const showSuccessStep = (message) => {
      const successText = document.getElementById('cn-success-message')
      if (successText) successText.textContent = message || 'درخواست شما با موفقیت ارسال شد.'
      currentStep = 5
      showStep(currentStep)
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)
    }

    form?.addEventListener('submit', async (e) => {
      e.preventDefault()
      if (!validateStep()) return

      if (submitBtn) {
        submitBtn.disabled = true
        submitBtn.textContent = 'در حال ارسال...'
      }

      const submitData = new FormData(form)
      try {
        const response = await fetch('/api/founder-onboarding', {
          method: 'POST',
          body: submitData,
        })
        const result = await response.json()

        if (response.ok) {
          const currentUser = getCurrentUser()
          if (currentUser) {
            addUserAction(currentUser.id, 'درخواست ارزیابی', 'درخواست ارزیابی شما با موفقیت ارسال شد.', { source: 'founder_onboarding' })
          }
          showSuccessStep(result.message || 'ارسال با موفقیت انجام شد. از شما متشکریم.')
        } else {
          alert('خطا در ارسال: ' + (result.error || 'لطفاً دوباره تلاش کنید.'))
        }
      } catch (error) {
        console.error('Submit error:', error)
        alert('خطا در ارسال فرم. لطفاً اتصال اینترنت خود را بررسی کنید.')
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false
          submitBtn.textContent = 'ارسال نهایی'
        }
      }
    })

    const uploadArea = document.getElementById('cn-upload-area')
    const fileInput = document.getElementById('cn-file-input')
    const filePreview = document.getElementById('cn-file-preview')

    const handleFile = (file) => {
      if (!file || !filePreview) return
      if (file.type !== 'application/pdf') {
        filePreview.textContent = 'فقط فایل PDF مجاز است'
        filePreview.classList.add('show')
        if (fileInput) fileInput.value = ''
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        filePreview.textContent = 'حجم فایل نباید بیشتر از 10MB باشد'
        filePreview.classList.add('show')
        if (fileInput) fileInput.value = ''
        return
      }
      filePreview.textContent = file.name
      filePreview.classList.add('show')
    }

    uploadArea?.addEventListener('click', () => fileInput?.click())
    uploadArea?.addEventListener('dragover', (e) => {
      e.preventDefault()
      uploadArea.classList.add('dragover')
    })
    uploadArea?.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'))
    uploadArea?.addEventListener('drop', (e) => {
      e.preventDefault()
      uploadArea.classList.remove('dragover')
      const file = e.dataTransfer.files[0]
      if (file && fileInput) {
        const dt = new DataTransfer()
        dt.items.add(file)
        fileInput.files = dt.files
        handleFile(file)
      }
    })
    fileInput?.addEventListener('change', () => handleFile(fileInput.files[0]))

    const params = new URLSearchParams(window.location.search)
    currentStep = params.get('sent') === '1' ? 5 : 1
    showStep(currentStep)

    const header = document.getElementById('cn-header')
    const toggle = document.getElementById('cn-menu-toggle')
    const mobileMenu = document.getElementById('cn-mobile-menu')

    window.addEventListener('scroll', () => {
      if (header) header.classList.toggle('scrolled', window.scrollY > 10)
    })
    toggle?.addEventListener('click', () => {
      toggle.classList.toggle('active')
      mobileMenu?.classList.toggle('open')
    })
  }, [])

  const htmlContent = `<!doctype html>
<html dir="rtl" lang="fa-IR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>جذب بنیان‌گذار - کپیتال نتورک</title>
<meta name="description" content="برای شروع، نوع همکاری خود را انتخاب کنید."/>
<style>
body{margin:0;padding:0;background:#0A1D3D;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
.cn-header{direction:rtl;position:fixed;top:0;left:0;right:0;z-index:9999;background:rgba(10,29,61,0.9);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,0.08);transition:all 0.3s ease}
.cn-header.scrolled{background:rgba(10,29,61,0.98);box-shadow:0 4px 24px rgba(0,0,0,0.15)}
.cn-header-container{max-width:1280px;margin:0 auto;padding:0 24px;height:70px;display:flex;align-items:center;justify-content:space-between;gap:32px}
.cn-header-logo{display:flex;align-items:center;text-decoration:none;flex-shrink:0}
.cn-logo-img{width:180px;height:auto;object-fit:contain;display:block}
.cn-nav-desktop{display:flex;align-items:center;gap:28px;flex:1;justify-content:center}
.cn-nav-link{color:rgba(255,255,255,0.85);font-size:14.5px;font-weight:500;text-decoration:none;position:relative;transition:color 0.2s}
.cn-nav-link::after{content:'';position:absolute;bottom:-8px;right:0;width:0;height:2px;background:#D19C0A;transition:width 0.3s}
.cn-nav-link:hover{color:#fff}.cn-nav-link:hover::after{width:100%}
.cn-header-actions{display:flex;align-items:center;gap:18px}
.cn-header-link{color:rgba(255,255,255,0.75);font-size:14px;text-decoration:none;transition:color 0.2s}
.cn-header-link:hover{color:#fff}
.cn-header-btn{display:inline-flex;align-items:center;gap:6px;background:#D19C0A;color:#0A1D3D;padding:10px 18px;border-radius:9px;font-weight:700;text-decoration:none;transition:all 0.25s;white-space:nowrap}
.cn-header-btn:hover{background:#E5B02A;transform:translateY(-1px)}
.cn-menu-toggle{display:none;flex-direction:column;gap:4px;background:none;border:none;cursor:pointer;padding:8px;width:36px;height:36px}
.cn-menu-toggle span{width:20px;height:2px;background:#fff;border-radius:2px;transition:all 0.3s}
.cn-menu-toggle.active span:nth-child(1){transform:rotate(45deg) translate(3px,3px)}
.cn-menu-toggle.active span:nth-child(2){opacity:0}
.cn-menu-toggle.active span:nth-child(3){transform:rotate(-45deg) translate(3px,-3px)}
.cn-mobile-menu{position:absolute;top:100%;left:0;right:0;background:rgba(10,29,61,0.98);max-height:0;overflow:hidden;transition:max-height 0.3s}
.cn-mobile-menu.open{max-height:400px;border-bottom:1px solid rgba(255,255,255,0.08)}
.cn-mobile-nav{padding:20px;display:flex;flex-direction:column;gap:2px}
.cn-mobile-link{color:rgba(255,255,255,0.85);font-size:15px;text-decoration:none;padding:12px 14px;border-radius:8px}
.cn-mobile-link:hover{background:rgba(255,255,255,0.06)}
.cn-mobile-divider{height:1px;background:rgba(255,255,255,0.08);margin:10px 0}
.cn-mobile-btn{background:#D19C0A;color:#0A1D3D;font-weight:700;padding:12px;border-radius:8px;text-align:center;margin-top:6px}
@media(max-width:1024px){.cn-nav-desktop,.cn-header-link{display:none}.cn-menu-toggle{display:flex}.cn-header-container{height:64px}.cn-logo-img{width:140px}}
body{padding-top:70px}
@media(max-width:1024px){body{padding-top:64px}}
.cn-onboard-wrapper{direction:rtl;background:#0A1D3D;min-height:100vh;padding:0 20px 80px;box-sizing:border-box}
.cn-onboard-wrapper *{box-sizing:border-box}
.cn-onboard-header{padding:24px 0;text-align:center;border-bottom:1px solid rgba(255,255,255,.1);margin-bottom:40px}
.cn-logo{color:#D19C0A;font-size:28px;font-weight:900;text-decoration:none}
.cn-progress-wrap{max-width:800px;margin:0 auto 48px}
.cn-progress-steps{display:flex;justify-content:space-between;gap:10px;margin-bottom:16px}
.cn-progress-step{color:rgba(255,255,255,.45);font-size:13px;font-weight:700}
.cn-progress-step.active{color:#D19C0A}
.cn-progress-bar{width:100%;height:4px;background:rgba(255,255,255,.1);border-radius:999px;overflow:hidden}
.cn-progress-fill{height:100%;width:20%;background:linear-gradient(90deg,#D19C0A,#00B2A9);transition:width .35s ease}
.cn-form-container{max-width:800px;margin:0 auto;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:48px}
.cn-step{display:none}.cn-step.active{display:block}
.cn-step-header{text-align:center;margin-bottom:36px}
.cn-step-title{color:#fff;font-size:32px;font-weight:800;margin:0 0 12px}
.cn-step-desc{color:rgba(255,255,255,.72);font-size:16px;margin:0}
.cn-profile-select,.cn-field-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
.cn-profile-card{cursor:pointer}.cn-profile-card input{position:absolute;opacity:0}
.cn-profile-content{min-height:150px;background:rgba(255,255,255,.04);border:2px solid rgba(255,255,255,.12);border-radius:16px;padding:34px 22px;text-align:center;transition:.25s ease}
.cn-profile-card input:checked+.cn-profile-content{background:rgba(209,156,10,.12);border-color:#D19C0A}
.cn-profile-content h3{color:#fff;font-size:20px;margin:0 0 10px}
.cn-profile-content p{color:rgba(255,255,255,.65);margin:0}
.cn-field{margin-bottom:22px}
.cn-label{display:block;color:#fff;font-size:15px;font-weight:700;margin-bottom:10px}
.cn-label span{color:#D19C0A}
.cn-input,.cn-select,.cn-textarea{width:100%;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.16);border-radius:12px;padding:14px 16px;color:#fff;font-size:15px;font-family:inherit}
.cn-input::placeholder,.cn-textarea::placeholder{color:rgba(255,255,255,.4)}
.cn-input:focus,.cn-select:focus,.cn-textarea:focus{outline:none;border-color:#D19C0A;box-shadow:0 0 0 3px rgba(209,156,10,.16)}
.cn-input.error,.cn-select.error,.cn-textarea.error{border-color:#EF4444}
.cn-error,.cn-step-error{display:block;color:#EF4444;font-size:13px;margin-top:7px;min-height:18px}
.cn-checkbox,.cn-radio-item{display:flex;align-items:flex-start;gap:12px;background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.12);border-radius:12px;padding:14px 16px;color:rgba(255,255,255,.9);cursor:pointer}
.cn-checkbox{padding:18px 16px;line-height:1.8}
.cn-checkbox input,.cn-radio-item input{width:20px;height:20px;accent-color:#D19C0A;margin-top:4px}
.cn-checkbox span,.cn-radio-item span{display:block}
.cn-radio-group{display:flex;flex-direction:column;gap:12px}
.cn-confirm-checkbox-panel{background:rgba(255,255,255,.06);border:2px solid rgba(209,156,10,.35);border-radius:16px;padding:24px;margin-top:24px}
.cn-confirm-checkbox{display:flex;align-items:flex-start;gap:14px;color:rgba(255,255,255,.95);cursor:pointer;padding:0;background:none;border:none}
.cn-confirm-checkbox input{width:24px;height:24px;accent-color:#D19C0A;margin-top:3px;flex-shrink:0}
.cn-confirm-checkbox span{display:block;font-size:15px;line-height:1.7;color:rgba(255,255,255,.9);font-weight:600}
.cn-confirm-checkbox-panel .cn-error{color:#EF4444;font-size:13px;margin-top:10px;display:block}
.cn-upload-area{border:2px dashed rgba(209,156,10,.45);border-radius:16px;padding:42px 24px;text-align:center;cursor:pointer;background:rgba(209,156,10,.06);transition:all .25s}
.cn-upload-area:hover{background:rgba(209,156,10,.12)}
.cn-upload-area.dragover{border-color:#00B2A9;background:rgba(0,178,169,.1)}
.cn-upload-text{color:#fff;font-weight:700;margin:0 0 8px}
.cn-upload-hint{color:rgba(255,255,255,.55);margin:0}
.cn-file-preview{display:none;margin-top:14px;padding:12px 16px;background:rgba(0,178,169,.1);border:1px solid rgba(0,178,169,.3);border-radius:12px;color:#00B2A9}
.cn-file-preview.show{display:block}
.cn-confirm-section{display:grid;gap:16px;margin-top:16px}
.cn-confirm-panel{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:24px}
.cn-confirm-panel p{color:rgba(255,255,255,.78);margin:0 0 10px;line-height:1.8}
.cn-success-message{color:#A7F3D0;font-size:16px;margin-top:20px;text-align:center}
.cn-nav{display:flex;align-items:center;gap:16px;margin-top:36px;padding-top:28px;border-top:1px solid rgba(255,255,255,.1)}
.cn-nav-spacer{flex:1}
.cn-btn{padding:15px 34px;border-radius:12px;border:2px solid transparent;font-size:16px;font-weight:800;cursor:pointer;text-decoration:none;text-align:center}
.cn-btn-primary{background:#D19C0A;color:#0A1D3D}
.cn-btn-primary:disabled{opacity:.65;cursor:wait}
.cn-btn-secondary{background:transparent;color:#fff;border-color:rgba(255,255,255,.25)}
.cn-success{text-align:center;padding:40px 20px}
.cn-success-title{color:#fff;font-size:34px;margin:0 0 18px}
.cn-success-text{color:rgba(255,255,255,.8);font-size:17px;line-height:1.8}
@media(max-width:768px){.cn-onboard-wrapper{padding:32px 16px 56px}.cn-form-container{padding:32px 20px}.cn-step-title{font-size:25px}.cn-profile-select,.cn-field-grid{grid-template-columns:1fr}.cn-nav{flex-direction:column-reverse}.cn-btn{width:100%}}
.cn-footer{direction:rtl;background:#0A1D3D;position:relative;overflow:hidden}
.cn-footer-container{max-width:1200px;margin:0 auto;padding:80px 20px 40px}
.cn-footer-top{display:flex;justify-content:space-between;padding-bottom:48px;border-bottom:1px solid rgba(255,255,255,0.08);margin-bottom:48px;flex-wrap:wrap;gap:40px}
.cn-footer-brand{flex:1;min-width:300px}
.cn-footer-logo{display:flex;align-items:center;gap:8px;margin-bottom:16px}
.cn-logo-text{color:#fff;font-size:28px;font-weight:900}
.cn-logo-dot{width:8px;height:8px;background:#D19C0A;border-radius:50%}
.cn-footer-tagline{color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0;max-width:420px}
.cn-footer-btn{display:inline-flex;align-items:center;gap:8px;background:#D19C0A;color:#0A1D3D;padding:14px 28px;border-radius:12px;font-weight:700;text-decoration:none;transition:all 0.3s}
.cn-footer-btn:hover{background:#A07808;transform:translateY(-2px)}
.cn-footer-middle{display:grid;grid-template-columns:repeat(4,1fr);gap:48px;padding-bottom:48px;border-bottom:1px solid rgba(255,255,255,0.08);margin-bottom:32px}
.cn-footer-title{color:#fff;font-size:16px;font-weight:700;margin:0 0 20px}
.cn-footer-links{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px}
.cn-footer-links a{color:rgba(255,255,255,0.65);font-size:14px;text-decoration:none;transition:color 0.2s}
.cn-footer-links a:hover{color:#D19C0A}
.cn-footer-bottom{display:flex;justify-content:space-between;gap:24px;flex-wrap:wrap}
.cn-footer-social{display:flex;gap:16px}
.cn-footer-social a{width:36px;height:36px;background:rgba(255,255,255,0.06);border-radius:8px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.6);transition:all 0.2s;text-decoration:none}
.cn-footer-social a:hover{background:rgba(209,156,10,0.2);color:#D19C0A}
.cn-footer-legal{color:rgba(255,255,255,0.5);font-size:13px}
.cn-footer-legal-links{display:flex;align-items:center;gap:12px}
</style>
</head>
<body>
<header class="cn-header" id="cn-header">
  <div class="cn-header-container">
    <a href="/" class="cn-header-logo"><img src="/capital_network_logo.jpg" alt="Capital Network" class="cn-logo-img"></a>
    <nav class="cn-nav-desktop">
      <a href="/#services" class="cn-nav-link">خدمات</a>
      <a href="/#process" class="cn-nav-link">فرآیند</a>
      <a href="/#cases" class="cn-nav-link">کیس استادی</a>
      <a href="/blog" class="cn-nav-link">بلاگ</a>
      <a href="/#about" class="cn-nav-link">درباره ما</a>
    </nav>
    <div class="cn-header-actions">
      <a href="/login" class="cn-header-link">ورود</a>
      <a href="/founder_onboarding/" class="cn-header-btn"><span>درخواست ارزیابی</span></a>
      <button class="cn-menu-toggle" id="cn-menu-toggle"><span></span><span></span><span></span></button>
    </div>
  </div>
  <div class="cn-mobile-menu" id="cn-mobile-menu">
    <nav class="cn-mobile-nav">
      <a href="/#services" class="cn-mobile-link">خدمات</a>
      <a href="/#process" class="cn-mobile-link">فرآیند</a>
      <a href="/#cases" class="cn-mobile-link">کیس استادی</a>
      <a href="/blog" class="cn-mobile-link">بلاگ</a>
      <a href="/#about" class="cn-mobile-link">درباره ما</a>
      <div class="cn-mobile-divider"></div>
      <a href="/login" class="cn-mobile-link">ورود</a>
      <a href="/founder_onboarding/" class="cn-mobile-btn">درخواست ارزیابی</a>
    </nav>
  </div>
</header>

<div class="cn-onboard-wrapper" id="cn-onboard">
  <header class="cn-onboard-header"><a href="/" class="cn-logo">Capital Network</a></header>
  <div class="cn-progress-wrap">
    <div class="cn-progress-steps">
      <div class="cn-progress-step active">پروفایل</div>
      <div class="cn-progress-step">اطلاعات</div>
      <div class="cn-progress-step">جزئیات</div>
      <div class="cn-progress-step">مستندات</div>
      <div class="cn-progress-step">تأیید</div>
    </div>
    <div class="cn-progress-bar"><div class="cn-progress-fill" id="cn-progress-fill"></div></div>
  </div>
  <div class="cn-form-container">
    <form id="cn-onboard-form" method="post" action="/api/founder-onboarding" enctype="multipart/form-data" novalidate>
      <input type="hidden" name="action" value="cn_intake">
      <input type="hidden" name="profile_type_hidden" id="profile_type_hidden">
      <div class="cn-step active" data-step="1">
        <div class="cn-step-header">
          <h1 class="cn-step-title">به کپیتال نتورک خوش آمدید</h1>
          <p class="cn-step-desc">برای شروع، نوع همکاری خود را انتخاب کنید.</p>
        </div>
        <div class="cn-profile-select">
          <label class="cn-profile-card">
            <input type="radio" name="profile_type" value="founder" required>
            <div class="cn-profile-content"><h3>فاندر / استارتاپ</h3><p>به دنبال جذب سرمایه Seed تا Series B هستم</p></div>
          </label>
          <label class="cn-profile-card">
            <input type="radio" name="profile_type" value="investor" required>
            <div class="cn-profile-content"><h3>سرمایه‌گذار / VC</h3><p>به دنبال Deal Flow باکیفیت هستم</p></div>
          </label>
        </div>
        <div class="cn-step-error" id="step1-error"></div>
      </div>
      <div class="cn-step" data-step="2">
        <div class="cn-step-header"><h2 class="cn-step-title">اطلاعات تماس</h2><p class="cn-step-desc">برای هماهنگی جلسه استراتژی با شما در ارتباط خواهیم بود</p></div>
        <div class="cn-field-grid">
          <div class="cn-field"><label class="cn-label">نام و نام خانوادگی <span>*</span></label><input class="cn-input" name="full_name" type="text" required placeholder="مثل: علی رضایی"><span class="cn-error"></span></div>
          <div class="cn-field"><label class="cn-label">ایمیل کاری <span>*</span></label><input class="cn-input" name="email" type="email" required placeholder="name@company.com"><span class="cn-error"></span></div>
          <div class="cn-field"><label class="cn-label">شماره تماس / WhatsApp</label><input class="cn-input" name="phone" type="tel" placeholder="+98 912 0000"></div>
          <div class="cn-field"><label class="cn-label">لینکدین / وب‌سایت</label><input class="cn-input" name="linkedin" type="url" placeholder="https://linkedin.com/in/..."></div>
        </div>
      </div>
      <div class="cn-step" data-step="3" data-show="founder">
        <div class="cn-step-header"><h2 class="cn-step-title">درباره استارتاپ شما</h2><p class="cn-step-desc">این اطلاعات به ما کمک می‌کند VC مناسب را مچ کنیم</p></div>
        <div class="cn-field-grid">
          <div class="cn-field"><label class="cn-label">نام شرکت <span>*</span></label><input class="cn-input" name="company_name" type="text" required placeholder="نام استارتاپ"><span class="cn-error"></span></div>
          <div class="cn-field"><label class="cn-label">حوزه فعالیت <span>*</span></label><select class="cn-select" name="sector" required><option value="">انتخاب کنید</option><option>SaaS / B2B Software</option><option>Fintech / Payment</option><option>AI / Data / ML</option><option>HealthTech / BioTech</option><option>E-commerce / D2C</option><option>Marketplace</option><option>Other</option></select><span class="cn-error"></span></div>
          <div class="cn-field"><label class="cn-label">مرحله فعلی <span>*</span></label><select class="cn-select" name="stage" required><option value="">انتخاب کنید</option><option>Pre-Seed / MVP</option><option>Seed</option><option>Series A</option><option>Series B</option></select><span class="cn-error"></span></div>
          <div class="cn-field"><label class="cn-label">مبلغ سرمایه مورد نیاز <span>*</span></label><input class="cn-input" name="capital_required" type="text" required placeholder="مثل: €2.5M"><span class="cn-error"></span></div>
        </div>
        <div class="cn-field"><label class="cn-label">توضیح کوتاه درباره استارتاپ <span>*</span></label><textarea class="cn-textarea" name="one_liner" rows="3" required placeholder="چه مشکلی را برای چه کسی حل می‌کنید؟"></textarea><span class="cn-error"></span></div>
      </div>
      <div class="cn-step" data-step="3" data-show="investor">
        <div class="cn-step-header"><h2 class="cn-step-title">پروفایل سرمایه‌گذاری</h2><p class="cn-step-desc">تا Deal Flow مرتبط برای شما ارسال کنیم</p></div>
        <div class="cn-field-grid">
          <div class="cn-field"><label class="cn-label">نام صندوق / سازمان <span>*</span></label><input class="cn-input" name="org_name" type="text" required placeholder="نام VC یا شرکت"><span class="cn-error"></span></div>
          <div class="cn-field"><label class="cn-label">Ticket Size معمول <span>*</span></label><select class="cn-select" name="ticket_size" required><option value="">انتخاب کنید</option><option>€500K – €2M</option><option>€2M – €5M</option><option>€5M – €15M</option><option>€15M+</option></select><span class="cn-error"></span></div>
          <div class="cn-field"><label class="cn-label">Stage مورد علاقه <span>*</span></label><select class="cn-select" name="stage_pref" required><option value="">انتخاب کنید</option><option>Seed</option><option>Series A</option><option>Series B</option><option>Growth</option><option>Flexible</option></select><span class="cn-error"></span></div>
          <div class="cn-field"><label class="cn-label">جغرافیای هدف</label><input class="cn-input" name="geo_pref" type="text" placeholder="مثل: اروپا، MENA، آمریکا"></div>
        </div>
      </div>
      <div class="cn-step" data-step="4">
        <div class="cn-step-header"><h2 class="cn-step-title">مستندات و آمادگی</h2><p class="cn-step-desc">آپلود Pitch Deck بررسی را سریع‌تر می‌کند</p></div>
        <div class="cn-field">
          <label class="cn-label">آپلود Pitch Deck / Business Plan</label>
          <div class="cn-upload-area" id="cn-upload-area">
            <p class="cn-upload-text">فایل PDF را اینجا رها کنید یا کلیک کنید</p>
            <p class="cn-upload-hint">حداکثر 10MB</p>
            <input type="file" id="cn-file-input" name="deck" accept="application/pdf,.pdf" hidden>
          </div>
          <div class="cn-file-preview" id="cn-file-preview"></div>
        </div>
        <div class="cn-confirm-section">
          <div class="cn-confirm-panel">
            <p><strong>چقدر برای قدم بعدی آماده‌اید؟</strong></p>
            <div class="cn-radio-group">
              <label class="cn-radio-item"><input type="radio" name="confidence" value="high" required><span>کاملاً آماده‌ام / می‌دانم چه می‌خواهم</span></label>
              <label class="cn-radio-item"><input type="radio" name="confidence" value="low" required><span>نیاز به راهنمایی دارم / مطمئن نیستم</span></label>
            </div>
            <span class="cn-error"></span>
          </div>
          <div class="cn-field">
            <label class="cn-label">توضیحات تکمیلی</label>
            <textarea class="cn-textarea" name="message" rows="4" placeholder="هر نکته مهمی که فکر می‌کنید باید بدانیم..."></textarea>
          </div>
          <div class="cn-confirm-checkbox-panel">
            <label class="cn-confirm-checkbox"><input type="checkbox" name="confirm_accuracy" value="1" required><span>تأیید می‌کنم اطلاعات ارائه‌شده صحیح است و با قوانین موافقم.</span></label>
            <span class="cn-error"></span>
          </div>
        </div>
      </div>
      <div class="cn-step" data-step="5">
        <div class="cn-success"><h2 class="cn-success-title">ارسال با موفقیت انجام شد!</h2><p class="cn-success-text" id="cn-success-message">در حال انتقال به صفحه اصلی...</p><a href="/" class="cn-btn cn-btn-primary">بازگشت فوری به صفحه اصلی</a></div>
      </div>
    </form>
    <div class="cn-nav">
      <button type="button" class="cn-btn cn-btn-secondary" id="cn-prev-btn" style="display:none;">مرحله قبل</button>
      <div class="cn-nav-spacer"></div>
      <button type="button" class="cn-btn cn-btn-primary" id="cn-next-btn">ادامه</button>
      <button type="submit" class="cn-btn cn-btn-primary" id="cn-submit-btn" style="display:none;" form="cn-onboard-form">ارسال نهایی</button>
    </div>
  </div>
</div>

<footer class="cn-footer">
  <div class="cn-footer-container">
    <div class="cn-footer-top">
      <div class="cn-footer-brand"><div class="cn-footer-logo"><span class="cn-logo-text">کپیتال نتورک (شبکه جهانی سرمایه گذاران)</span><span class="cn-logo-dot"></span></div><p class="cn-footer-tagline">اتصال استارتاپ‌های Seed تا Series B به شبکه جهانی سرمایه‌گذاران Tier-1</p></div>
      <div><a href="/" class="cn-footer-btn">شروع همکاری</a></div>
    </div>
    <div class="cn-footer-middle">
      <div><h4 class="cn-footer-title">شرکت</h4><ul class="cn-footer-links"><li><a href="/#about">درباره ما</a></li><li><a href="/#process">فرآیند همکاری</a></li><li><a href="/#cases">کیس استادی</a></li><li><a href="/blog">بلاگ</a></li></ul></div>
      <div><h4 class="cn-footer-title">خدمات</h4><ul class="cn-footer-links"><li><a href="/#services">آماده‌سازی VC-Ready</a></li><li><a href="/#services">معرفی به سرمایه‌گذار</a></li><li><a href="/#services">مذاکره و بستن</a></li><li><a href="/founder_onboarding">ارزیابی رایگان</a></li></ul></div>
      <div><h4 class="cn-footer-title">تماس</h4><ul class="cn-footer-links"><li><a href="mailto:invest@capitalnetwork.ir">invest@capitalnetwork.ir</a></li><li><a href="#">WhatsApp Business</a></li><li><span>دبی، امارات - لندن، UK</span></li><li><span>پاسخگویی: شنبه تا چهارشنبه</span></li></ul></div>
      <div><h4 class="cn-footer-title">Deal Flow Insights</h4><p style="color:rgba(255,255,255,0.65);font-size:14px;margin:0">ماهانه 1 ایمیل: ترندهای جذب سرمایه، لیست VCهای فعال، و نکات Pitch.</p></div>
    </div>
    <div class="cn-footer-bottom">
      <div class="cn-footer-social"><a href="#" target="_blank"><svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M17.5 0H2.5C1.125 0 0 1.125 0 2.5V17.5C0 18.875 1.125 20 2.5 20H17.5C18.875 20 18.875 20 17.5V2.5C20 1.125 18.875 0 17.5 0ZM6.25 15.625H3.75V7.5H6.25V15.625ZM5 6.25C4.125 6.25 3.4375 5.5625 3.4375 4.6875S4.125 3.125 5 3.125S6.5625 3.8125 6.5625 4.6875S5.875 6.25 5 6.25ZM16.25 15.625H13.75V11.25C13.75 10.125 13.5 8.75 11.875 8.75C10.25 8.75 10 10 11.125V15.625H7.5V7.5H10V8.75C10.375 8 11.25 7.375 12.375 7.375C14.875 7.375 16.25 9 16.25 11.625V15.625Z"/></svg></a></div>
      <div class="cn-footer-legal"><span>© 2026 Capital Network. All rights reserved.</span><div class="cn-footer-legal-links"><a href="/privacy">Privacy</a><span>·</span><a href="/terms">Terms</a></div></div>
    </div>
  </div>
</footer>
</body>
</html>`

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
}
