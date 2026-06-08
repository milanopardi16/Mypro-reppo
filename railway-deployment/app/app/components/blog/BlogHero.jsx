import React from 'react'

export default function BlogHero({ total = 0 }) {
  return (
    <section className="cn-hero-v2">
      <div className="cn-hero-bg" aria-hidden></div>
      <div className="cn-hero-container">
        <div className="cn-hero-content">
          <div className="cn-badge-v2"><span className="cn-pulse" aria-hidden></span><span>بلاگ</span></div>
          <h1 className="cn-h1-v2">آخرین مقالات و آموزش‌ها</h1>
          <p className="cn-subtext-v2">مطالب تخصصی درباره جذب سرمایه، رشد کسب‌وکار و نکات عملی برای کارآفرینان.</p>

          <div className="cn-cta-group-v2">
            <a className="cn-btn-primary-v2" href="/services">مشاوره رایگان</a>
            <a className="cn-btn-glass" href="/blog">همه مقالات ({total})</a>
          </div>
        </div>
      </div>
    </section>
  )
}
