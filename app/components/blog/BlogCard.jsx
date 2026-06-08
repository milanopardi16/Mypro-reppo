import React from 'react'
import Link from '@/src/router-shims/Link'
import Image from '@/src/router-shims/Image'
import styles from './blog.module.css'
import { toJalali } from '../../../lib/formatDate'

export default function BlogCard({ post, isAdmin = false, onEdit, onDelete }) {
  const imgSrc = post.image || '/capital-network-logo.svg'
  return (
    <article className={styles.card}>
      <Link href={`/blog/${post.slug}`} className={styles.cardLink}>
        <div className={styles.thumb} aria-hidden>
          {String(imgSrc).startsWith('http') ? (
            <img src={imgSrc} alt={post.title} className={styles.thumbImage} />
          ) : (
            <Image
              src={imgSrc}
              alt={post.title}
              fill
              className={styles.thumbImage}
              sizes="(max-width:720px) 100vw, (max-width:1100px) 50vw, 33vw"
            />
          )}
        </div>

        <div className={styles.cardBody}>
          <div className={styles.cat}>{post.category}</div>
          <h3 className={styles.cardTitle}>{post.title}</h3>
          <p className={styles.excerpt}>{post.excerpt}</p>
          <div className={styles.meta}>
            <span>{post.author}</span>
            <span>•</span>
            <span>{toJalali(post.date)}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </Link>

      <div className={styles.cardFooter}>
        <Link href={`/blog/${post.slug}`} className={styles.readMore}>ادامه مطلب →</Link>
        {isAdmin && (
          <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
            <button onClick={() => onEdit && onEdit(post)} className={styles.btn} style={{ padding: '6px 10px' }}>✏️ ویرایش</button>
            <button onClick={() => onDelete && onDelete(post)} className={styles.btnDanger} style={{ padding: '6px 10px' }}>🗑️ حذف</button>
          </div>
        )}
      </div>
    </article>
  )
}
