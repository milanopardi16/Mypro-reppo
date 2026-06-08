import React from 'react'
import BlogCard from './BlogCard'
import styles from './blog.module.css'

export default function BlogList({ posts = [], isAdmin = false, onEdit, onDelete }) {
  const publishedFilter = (post) => {
    const status = String(post.status || '').trim().toLowerCase()
    if (!status) return true
    return status === 'published' || status.includes('منتشر') || status.includes('publish')
  }

  const visiblePosts = isAdmin ? posts : posts.filter(publishedFilter)

  if (!visiblePosts || visiblePosts.length === 0) {
    return <div className={styles.empty}>مطلبی یافت نشد.</div>
  }

  return (
    <div className={styles.grid}>
      {visiblePosts.map((p) => (
        <BlogCard key={p.id} post={p} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
