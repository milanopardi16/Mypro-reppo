'use client'

import Link from '@/src/router-shims/Link'
import Button from './Button'
import { useMemo } from 'react'
import { defaultSiteContent } from '../data/siteContent'
import { useLiveSiteContent, usePreviewMode } from '../hooks/useLiveSiteContent'

export default function Footer() {
  const rawContent = useLiveSiteContent()
  const previewMode = usePreviewMode()

  const siteContent = useMemo(() => {
    const stored = rawContent
    const merged = { ...stored }
    if (stored.footer) {
      merged.footer = {
        ...defaultSiteContent.footer,
        ...stored.footer,
        contact: { ...defaultSiteContent.footer.contact, ...(stored.footer.contact || {}) },
        newsletter: { ...defaultSiteContent.footer.newsletter, ...(stored.footer.newsletter || {}) },
        social: { ...defaultSiteContent.footer.social, ...(stored.footer.social || {}) },
      }
    }
    return merged
  }, [rawContent])

  const footer = siteContent.footer || defaultSiteContent.footer
  const blockNav = previewMode
    ? (event) => {
        event.preventDefault()
      }
    : undefined

  const renderFooterLink = (link) => {
    if (!link) return null
    const href = link.href || '#'
    const isExternal = String(href).startsWith('http')
    const isHashLink = !isExternal && href.includes('#')
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" onClick={blockNav}>
          {link.label}
        </a>
      )
    }
    if (isHashLink) {
      return (
        <a href={href} onClick={blockNav}>
          {link.label}
        </a>
      )
    }
    return (
      <Link href={href} onClick={blockNav}>
        {link.label}
      </Link>
    )
  }

  return (
    <footer className="cn-footer">
      <div className="cn-footer-bg"></div>
      
      <div className="cn-footer-container">
        
        <div className="cn-footer-top">
          <div className="cn-footer-brand">
            <div className="cn-footer-logo">
              <span className="cn-logo-text">{footer.brandName || 'کپیتال نتورک'}</span>
              <span className="cn-logo-dot"></span>
            </div>
            <p className="cn-footer-tagline">{footer.about}</p>
          </div>
          
          <div className="cn-footer-cta">
            <Button 
              href={footer.ctaHref || '#contact'} 
              variant="primary"
              size="md"
              className="cn-footer-btn-new"
            >
              {footer.ctaText || 'شروع همکاری'}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ marginRight: '8px' }}>
                <path d="M6.75 13.5L11.25 9L6.75 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Button>
          </div>
        </div>

        <div className="cn-footer-middle">
          <div className="cn-footer-col">
            <h4 className="cn-footer-title">شرکت</h4>
            <ul className="cn-footer-links">
              {Array.isArray(footer.links) && footer.links.map((link) => (
                <li key={link.id || link.href}>{renderFooterLink(link)}</li>
              ))}
            </ul>
          </div>

          <div className="cn-footer-col">
            <h4 className="cn-footer-title">خدمات</h4>
            <ul className="cn-footer-links">
              {Array.isArray(footer.servicesLinks) && footer.servicesLinks.map((link) => (
                <li key={link.id || link.href}>{renderFooterLink(link)}</li>
              ))}
            </ul>
          </div>

          <div className="cn-footer-col">
            <h4 className="cn-footer-title">تماس</h4>
            <ul className="cn-footer-links">
              <li>
                <a href={`mailto:${footer.contact?.email || ''}`}>{footer.contact?.email || ''}</a>
              </li>
              <li>
                <a href={footer.contact?.whatsapp || '#'} target="_blank" rel="noopener noreferrer">
                  {footer.contact?.whatsappLabel || 'WhatsApp'}
                </a>
              </li>
              <li>
                {footer.contact?.locationHref ? (
                  <Link href={footer.contact.locationHref}>{footer.contact.location}</Link>
                ) : (
                  <span className="cn-footer-text">{footer.contact?.location || ''}</span>
                )}
              </li>
              <li>
                {footer.contact?.supportHref ? (
                  <Link href={footer.contact.supportHref}>{footer.contact.support}</Link>
                ) : (
                  <span className="cn-footer-text">{footer.contact?.support || ''}</span>
                )}
              </li>
            </ul>
          </div>

          <div className="cn-footer-col cn-footer-newsletter">
            <h4 className="cn-footer-title">{footer.newsletter?.title || 'خبرنامه'}</h4>
            <p className="cn-footer-news-text">{footer.newsletter?.description || ''}</p>
            <form className="cn-news-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder={footer.newsletter?.placeholder || 'ایمیل'} required />
              <Button 
                type="submit" 
                variant="primary"
                size="sm"
                className="cn-news-submit-btn"
              >
                {footer.newsletter?.submitText || 'ارسال'}
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9H15M15 9L9 3M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </Button>
            </form>
          </div>
        </div>

        <div className="cn-footer-bottom">
          <div className="cn-footer-social">
            {footer.social?.linkedin && (
              <a href={footer.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">LinkedIn</a>
            )}
            {footer.social?.instagram && (
              <a href={footer.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">Instagram</a>
            )}
            {footer.social?.twitter && (
              <a href={footer.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">Twitter</a>
            )}
          </div>

          <div className="cn-footer-legal">
            <span>{footer.copyright || ''}</span>
            <div className="cn-footer-legal-links">
              {Array.isArray(footer.legalLinks) && footer.legalLinks.map((link, idx) => (
                <span key={link.id || link.href}>
                  {idx > 0 && <span>·</span>}
                  {renderFooterLink(link)}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}
