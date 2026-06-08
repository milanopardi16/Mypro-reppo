'use client'

import { useState, useEffect, useRef } from 'react'
import Link from '@/src/router-shims/Link'
import { motion, AnimatePresence } from 'framer-motion'
import { toJalali } from '../../lib/formatDate'

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [posts, setPosts] = useState([])
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch('/api/blogs', { cache: 'no-store' })
        const data = await res.json()
        if (Array.isArray(data)) {
          setPosts(data)
        }
      } catch (error) {
        console.error('SearchModal: failed to load posts', error)
      }
    }

    loadPosts()
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchResults = posts.filter(post => {
      const searchTerm = query.toLowerCase()
      return (
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        (post.tags || []).some(tag => String(tag).toLowerCase().includes(searchTerm)) ||
        String(post.category).toLowerCase().includes(searchTerm)
      )
    })

    setResults(searchResults)
  }, [query, posts])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="cn-search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="cn-search-modal"
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="cn-search-modal-header">
              <div className="cn-search-input-wrapper">
                <svg className="cn-search-modal-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="جستجوی مقالات، برچسب‌ها، دسته‌بندی‌ها..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="cn-search-modal-input"
                />
                {query && (
                  <button className="cn-search-modal-clear" onClick={() => setQuery('')}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
              </div>
              <button className="cn-search-modal-close" onClick={onClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="cn-search-modal-body">
              {!query ? (
                <div className="cn-search-empty">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.1)" strokeWidth="2"/>
                    <path d="M24 16V28M24 32V34" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <p>برای جستجو تایپ کنید...</p>
                </div>
              ) : results.length === 0 ? (
                <div className="cn-search-no-results">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.1)" strokeWidth="2"/>
                    <path d="M16 16L32 32M32 16L16 32" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <h3>نتیجه‌ای یافت نشد</h3>
                  <p>موردی با عبارت "{query}" پیدا نشد. لطفاً با کلمات دیگری جستجو کنید.</p>
                </div>
              ) : (
                <div className="cn-search-results">
                  <div className="cn-search-results-count">
                    {results.length} نتیجه برای "{query}"
                  </div>
                  {results.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={`/blog/${post.slug}`}
                        className="cn-search-result-item"
                        onClick={onClose}
                      >
                        <div className="cn-search-result-content">
                          <div className="cn-search-result-category">{post.category}</div>
                          <h3 className="cn-search-result-title">{post.title}</h3>
                          <p className="cn-search-result-excerpt">{post.excerpt}</p>
                          <div className="cn-search-result-meta">
                            <span>{toJalali(post.date)}</span>
                            <span>•</span>
                            <span>{post.readTime}</span>
                            <span>•</span>
                            <div className="cn-search-result-tags">
                              {post.tags.map(tag => (
                                <span key={tag} className="cn-search-result-tag">{tag}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <svg className="cn-search-result-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="cn-search-modal-footer">
              <div className="cn-search-shortcuts">
                <span><kbd>↑</kbd> <kbd>↓</kbd> برای ناوبری</span>
                <span><kbd>ESC</kbd> برای بستن</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}