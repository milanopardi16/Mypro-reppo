"use client"
import React from 'react'
import styles from './blog.module.css'

export default function BlogFilters({ query, onQuery, category, onCategory, categories = [], sort, onSort, onReset }) {
  return (
    <div className={styles.filters} role="search" aria-label="جستجوی مقالات">
      <div className={styles.searchRow}>
        <input
          className={styles.searchInput}
          placeholder="جستجو در مقالات..."
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          aria-label="جستجوی مقالات"
        />
        <button className={styles.clearBtn} onClick={() => onReset()}>پاک کردن فیلترها</button>
      </div>

      <div className={styles.controlsRow}>
        <select className={styles.select} value={category} onChange={(e) => onCategory(e.target.value)}>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select className={styles.select} value={sort} onChange={(e) => onSort(e.target.value)}>
          <option value="newest">جدیدترین</option>
          <option value="oldest">قدیمی‌ترین</option>
          <option value="popular">محبوب‌ترین</option>
        </select>
      </div>
    </div>
  )
}
