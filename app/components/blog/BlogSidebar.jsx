"use client"
import React from 'react'
import styles from './blog.module.css'
import Link from '@/src/router-shims/Link'

export default function BlogSidebar({ posts = [], categories = [], tags = [] }) {
  const counts = {}
  posts.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1 })
  const recent = posts.slice(0, 5)
  const popular = posts.filter(p => p.featured).slice(0,5)

  return (
    <div className={styles.widgetArea}>
      <div className={styles.widget}>
        <h4 className={styles.widgetTitle}>جستجوی سریع</h4>
        <input className={styles.widgetInput} placeholder="جستجوی پست‌ها..." />
      </div>

      <div className={styles.widget}>
        <h4 className={styles.widgetTitle}>دسته‌بندی‌ها</h4>
        <ul className={styles.catList}>
          {categories.map(c => (
            <li key={c}><Link href={`/category/${encodeURIComponent(c)}`}>{c} <span className={styles.count}>({counts[c]||0})</span></Link></li>
          ))}
        </ul>
      </div>

      <div className={styles.widget}>
        <h4 className={styles.widgetTitle}>پست‌های اخیر</h4>
        <ul className={styles.recentList}>
          {recent.map(r => (
            <li key={r.id}><Link href={`/blog/${r.slug}`}>{r.title}</Link></li>
          ))}
        </ul>
      </div>

      <div className={styles.widget}>
        <h4 className={styles.widgetTitle}>پست‌های محبوب</h4>
        <ul className={styles.recentList}>
          {popular.length ? popular.map(p => (<li key={p.id}><Link href={`/blog/${p.slug}`}>{p.title}</Link></li>)) : <li>مطلبی موجود نیست</li>}
        </ul>
      </div>

      <div className={styles.widget}>
        <h4 className={styles.widgetTitle}>برچسب‌ها</h4>
        <div className={styles.tagCloud}>
          {tags.map(t => (
            <Link key={t} href={`/tag/${encodeURIComponent(t)}`} className={styles.tag}>{t}</Link>
          ))}
        </div>
      </div>

      <div className={styles.widget}>
        <h4 className={styles.widgetTitle}>عضویت در خبرنامه</h4>
        <p>آخرین مقالات را در ایمیل خود دریافت کنید.</p>
        <div className={styles.newsletter}>
          <input placeholder="ایمیل شما" />
          <button className={styles.subscribe}>عضویت</button>
        </div>
      </div>

      <div className={styles.widgetBanner}>
        <h4>با ما رشد کنید</h4>
        <p>خدمات معرفی به سرمایه‌گذار و مشاوره تخصصی</p>
        <Link href="/services" className={styles.widgetCta}>شروع همکاری</Link>
      </div>
    </div>
  )
}
