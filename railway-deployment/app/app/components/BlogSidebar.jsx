'use client'

import { motion } from 'framer-motion'

export default function BlogSidebar({ 
  categories, 
  selectedCategory, 
  setSelectedCategory,
  allTags,
  selectedTag,
  setSelectedTag 
}) {
  return (
    <aside className="cn-blog-sidebar">
      
      {/* Categories */}
      <motion.div 
        className="cn-sidebar-widget"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="cn-sidebar-title">دسته‌بندی</h3>
        <ul className="cn-sidebar-categories">
          {categories.map((cat, index) => (
            <motion.li
              key={cat}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + (index * 0.05) }}
            >
              <button
                className={`cn-sidebar-cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                <span>{cat}</span>
                {selectedCategory === cat && (
                  <motion.span 
                    className="cn-sidebar-indicator"
                    layoutId="categoryIndicator"
                  />
                )}
              </button>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Tags */}
      <motion.div 
        className="cn-sidebar-widget"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="cn-sidebar-title">برچسب‌ها</h3>
        <div className="cn-sidebar-tags">
          {allTags.map((tag, index) => (
            <motion.button
              key={tag}
              className={`cn-sidebar-tag ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + (index * 0.03) }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tag}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Newsletter */}
      <motion.div 
        className="cn-sidebar-widget cn-sidebar-newsletter"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h3 className="cn-sidebar-title">خبرنامه</h3>
        <p className="cn-sidebar-news-text">
          ماهانه ۱ ایمیل: ترندهای جذب سرمایه، لیست VCهای فعال، و نکات Pitch.
        </p>
        <form className="cn-sidebar-form" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="ایمیل کاری شما" 
            className="cn-sidebar-input"
            required 
          />
          <button type="submit" className="cn-sidebar-submit">
            عضویت
          </button>
        </form>
      </motion.div>

    </aside>
  )
}