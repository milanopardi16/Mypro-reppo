'use client'

import { motion } from 'framer-motion'

export default function BlogSearch({ searchQuery, setSearchQuery }) {
  return (
    <motion.div 
      className="cn-blog-search"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="cn-search-wrapper">
        <svg className="cn-search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17.5 17.5L13.875 13.875" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <input
          type="text"
          placeholder="جستجوی مقالات..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="cn-search-input"
        />
        {searchQuery && (
          <motion.button
            className="cn-search-clear"
            onClick={() => setSearchQuery('')}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}