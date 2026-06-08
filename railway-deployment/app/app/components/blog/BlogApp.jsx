"use client"
import React, { useMemo, useState } from 'react'
import styles from './blog.module.css'
import BlogFilters from './BlogFilters'
import BlogList from './BlogList'
import BlogSidebar from './BlogSidebar'
import Pagination from './Pagination'

export default function BlogApp({ initialPosts = [], categories = [], tags = [], isAdmin = false, showDrafts = false, onEdit, onDelete }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('همه')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const pageSize = 6

  const publishedFilter = (post) => {
    const status = String(post.status || '').trim().toLowerCase()
    if (!status) return true
    return status === 'published' || status.includes('منتشر') || status.includes('publish')
  }

  const visiblePosts = showDrafts ? initialPosts : initialPosts.filter(publishedFilter)

  const filtered = useMemo(() => {
    let list = visiblePosts.slice()
    if (category && category !== 'همه') {
      list = list.filter((p) => p.category === category)
    }
    if (query) {
      const q = query.trim().toLowerCase()
      list = list.filter((p) => (
        p.title.toLowerCase().includes(q) ||
        (p.excerpt || '').toLowerCase().includes(q) ||
        (p.author || '').toLowerCase().includes(q) ||
        (p.tags || []).join(' ').toLowerCase().includes(q)
      ))
    }
    if (sort === 'newest') {
      list.sort((a, b) => (b.id || 0) - (a.id || 0))
    } else if (sort === 'oldest') {
      list.sort((a, b) => (a.id || 0) - (b.id || 0))
    } else if (sort === 'popular') {
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }
    return list
  }, [visiblePosts, category, query, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const start = (page - 1) * pageSize
  const pageItems = filtered.slice(start, start + pageSize)

  function resetFilters() {
    setQuery('')
    setCategory('همه')
    setSort('newest')
    setPage(1)
  }

  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <BlogFilters
          query={query}
          onQuery={setQuery}
          category={category}
          onCategory={setCategory}
          categories={categories}
          sort={sort}
          onSort={setSort}
          onReset={() => resetFilters()}
        />

        <BlogList posts={pageItems} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />

        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      </main>

      <aside className={styles.sidebar}>
        <BlogSidebar posts={visiblePosts} categories={categories} tags={tags} />
      </aside>
    </div>
  )
}
