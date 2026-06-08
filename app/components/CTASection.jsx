'use client'

import { useMemo } from 'react'
import Link from '@/src/router-shims/Link'
import { motion } from 'framer-motion'
import { useLiveSiteContent } from '../hooks/useLiveSiteContent'
import { defaultSiteContent } from '../data/siteContent'

export default function CTASection({ 
  badge,
  title,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  variant,
}) {
  const siteContent = useLiveSiteContent()
  const ctaSection = useMemo(
    () => ({ ...defaultSiteContent.ctaSection, ...(siteContent.ctaSection || {}) }),
    [siteContent.ctaSection]
  )

  const content = {
    badge: badge ?? ctaSection.badge,
    title: title ?? ctaSection.title,
    description: description ?? ctaSection.description,
    primaryButtonText: primaryButtonText ?? ctaSection.primaryButtonText,
    primaryButtonLink: primaryButtonLink ?? ctaSection.primaryButtonLink,
    secondaryButtonText: secondaryButtonText ?? ctaSection.secondaryButtonText,
    secondaryButtonLink: secondaryButtonLink ?? ctaSection.secondaryButtonLink,
    variant: variant ?? ctaSection.variant ?? 'default',
  }
  
  if (content.variant === 'compact') {
    return (
      <motion.div 
        className="cn-cta-compact"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
      >
        <div className="cn-cta-compact-text">
          <h3 className="cn-cta-compact-title">{content.title}</h3>
          <p className="cn-cta-compact-desc">{content.description}</p>
        </div>
        <div className="cn-cta-compact-action">
          <Link href={content.primaryButtonLink} className="cn-btn-variant cn-btn-primary-variant cn-cta-compact-btn">
            {content.primaryButtonText}
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.section 
      className="cn-cta-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="cn-cta-content">
        {content.badge && (
          <motion.div 
            className="cn-cta-badge"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <span>📍</span>
            {content.badge}
          </motion.div>
        )}
        
        <h2 className="cn-cta-title">{content.title}</h2>
        <p className="cn-cta-description">{content.description}</p>
        
        <div className="cn-cta-buttons">
          <Link href={content.primaryButtonLink} className="cn-btn-variant cn-btn-primary-variant cn-btn-lg">
            {content.primaryButtonText}
          </Link>
          <Link href={content.secondaryButtonLink} className="cn-btn-variant cn-btn-secondary-variant cn-btn-lg">
            {content.secondaryButtonText}
          </Link>
        </div>
      </div>
    </motion.section>
  )
}
