"use client"
import React from 'react'
import styles from './blog.module.css'

export default function Pagination({ page = 1, setPage, totalPages = 1 }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <nav className={styles.pagination} aria-label="pagination">
      <button className={styles.pageBtn} onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>قبلی</button>
      <ul className={styles.pageList}>
        {pages.map(p => (
          <li key={p}>
            <button className={`${styles.pageNum} ${p === page ? styles.active : ''}`} onClick={() => setPage(p)}>{p}</button>
          </li>
        ))}
      </ul>
      <button className={styles.pageBtn} onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>بعدی</button>
    </nav>
  )
}
