'use client'

import Link from '@/src/router-shims/Link'
import { motion } from 'framer-motion'
import { toJalali } from '../../lib/formatDate'

export default function BlogCard({ post, index = 0 }) {
  return (
    <motion.article
      className="cn-blog-card"
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5, ease: 'easeOut' }
        }
      }}
      whileHover={{ 
        y: -8,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      }}
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="cn-blog-card-image">
          <div className="cn-blog-card-placeholder">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="3" y="3" width="34" height="34" rx="8" stroke="rgba(209,156,10,0.2)" strokeWidth="2"/>
              <path d="M13 25L20 18L27 25" stroke="rgba(209,156,10,0.4)" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="17" cy="16" r="2.5" fill="rgba(209,156,10,0.4)"/>
            </svg>
          </div>
          <div className="cn-blog-card-category">{post.category}</div>
        </div>

        <div className="cn-blog-card-body">
          <div className="cn-blog-card-meta">
            <span className="cn-blog-date">{toJalali(post.date)}</span>
            <span className="cn-blog-separator">•</span>
            <span className="cn-blog-read-time">{post.readTime}</span>
          </div>

          <h3 className="cn-blog-card-title">{post.title}</h3>
          
          <p className="cn-blog-card-excerpt">{post.excerpt}</p>

          <div className="cn-blog-card-tags">
            {post.tags.slice(0, 2).map(tag => (
              <span key={tag} className="cn-blog-tag-sm">{tag}</span>
            ))}
          </div>

          <div className="cn-blog-card-footer">
            <span className="cn-blog-read-more">
              ادامه مطلب
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}