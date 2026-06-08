'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from '@/src/router-shims/Image'
import Link from '@/src/router-shims/Link'
import SearchModal from './SearchModal'
import ProfileButton from './ProfileButton'
import { normalizeHeader } from '../data/siteContent'
import { useLiveSiteContent, usePreviewMode } from '../hooks/useLiveSiteContent'

const NAV_ICONS = {
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  ),
  default: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

function navIconFor(href = '') {
  if (href === '/' || href === '') return NAV_ICONS.home
  return NAV_ICONS.default
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const rawContent = useLiveSiteContent()
  const previewMode = usePreviewMode()
  const siteContent = useMemo(
    () => ({ ...rawContent, header: normalizeHeader(rawContent.header) }),
    [rawContent]
  )

  const blockNav = previewMode
    ? (event) => {
        event.preventDefault()
      }
    : undefined

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('cn-mobile-nav-open', menuOpen)
    return () => document.body.classList.remove('cn-mobile-nav-open')
  }, [menuOpen])

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth > 1024) setMenuOpen(false)
    }
    window.addEventListener('resize', closeOnResize)
    return () => window.removeEventListener('resize', closeOnResize)
  }, [])

  const handleNavTouch = (event) => {
    if (!document.documentElement.classList.contains('cn-android')) return
    const link = event.currentTarget
    const rect = link.getBoundingClientRect()
    link.style.setProperty('--ripple-x', `${((event.touches?.[0]?.clientX ?? event.clientX) - rect.left)}px`)
    link.style.setProperty('--ripple-y', `${((event.touches?.[0]?.clientY ?? event.clientY) - rect.top)}px`)
  }

  const navItems = siteContent.header.navItems || []
  const extraHeaderButtonLabel = siteContent.header.auth?.extraButtonLabel
  const extraHeaderButtonHref = siteContent.header.auth?.extraButtonHref || '#'

  return (
    <header className={`cn-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="cn-header-container">
        <Link href="/" className="cn-header-logo" onClick={blockNav}>
          <Image
            src={siteContent.header.logoSrc || '/capital-network-logo.svg'}
            alt={siteContent.header.logoAlt || siteContent.header.brand}
            width={200}
            height={70}
            className="cn-logo-img"
            priority
          />
        </Link>

        <nav className="cn-nav-desktop">
          {navItems.map((item) => (
            <Link key={item.id || item.href} href={item.href} className="cn-nav-link" onClick={blockNav}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="cn-header-actions">
          <ProfileButton />
          {extraHeaderButtonLabel ? (
            <Link href={extraHeaderButtonHref} className="cn-header-btn" onClick={blockNav}>
              <span>{extraHeaderButtonLabel}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </Link>
          ) : null}
          <Link href={siteContent.header.auth?.evaluationHref || '/founder_onboarding'} className="cn-header-btn" onClick={blockNav}>
            <span>{siteContent.header.auth?.requestEvaluation}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </Link>
          
          <button 
            type="button"
            className={`cn-menu-toggle ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'بستن منو' : 'باز کردن منو'}
            aria-expanded={menuOpen}
            aria-controls="cn-mobile-nav-panel"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <div
        id="cn-mobile-nav-panel"
        className={`cn-mobile-menu ${menuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!menuOpen}
        aria-label="منوی اصلی"
      >
        <div className="cn-mobile-menu-glow" aria-hidden="true" />
        <div className="cn-mobile-menu-inner">
          <div className="cn-mobile-menu-header">
            <div className="cn-mobile-menu-brand">
              <span className="cn-mobile-menu-mark" aria-hidden="true" />
              <span className="cn-mobile-menu-title">{siteContent.header.brand || 'کپیتال نتورک'}</span>
            </div>
            <button
              type="button"
              className="cn-mobile-close"
              onClick={() => setMenuOpen(false)}
              aria-label="بستن منو"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <nav className="cn-mobile-nav">
            {navItems.map((item, index) => (
              <Link
                key={item.id || item.href}
                href={item.href}
                className="cn-mobile-link"
                style={{ '--nav-i': index }}
                onTouchStart={handleNavTouch}
                onClick={(e) => {
                  if (previewMode) e.preventDefault()
                  setMenuOpen(false)
                }}
              >
                <span className="cn-mobile-link-text">{item.label}</span>
                <span className="cn-mobile-link-icon">{navIconFor(item.href)}</span>
              </Link>
            ))}
            <Link
              href={siteContent.header.auth?.loginHref || '/login'}
              className="cn-mobile-link cn-mobile-link-auth"
              style={{ '--nav-i': navItems.length }}
              onTouchStart={handleNavTouch}
              onClick={(e) => {
                if (previewMode) e.preventDefault()
                setMenuOpen(false)
              }}
            >
              <span className="cn-mobile-link-text">{siteContent.header.auth?.login || 'ورود'}</span>
              <span className="cn-mobile-link-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M15 3h4a1 1 0 011 1v16a1 1 0 01-1 1h-4M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
            <div className="cn-mobile-divider" />
            {extraHeaderButtonLabel ? (
              <Link
                href={extraHeaderButtonHref}
                className="cn-mobile-btn"
                style={{ '--nav-i': navItems.length + 1 }}
                onClick={(e) => {
                  if (previewMode) e.preventDefault()
                  setMenuOpen(false)
                }}
              >
                <span>{extraHeaderButtonLabel}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            ) : null}
            <Link
              href={siteContent.header.auth?.evaluationHref || '/founder_onboarding'}
              className="cn-mobile-btn"
              style={{ '--nav-i': navItems.length + (extraHeaderButtonLabel ? 2 : 1) }}
              onClick={(e) => {
                if (previewMode) e.preventDefault()
                setMenuOpen(false)
              }}
            >
              <span>{siteContent.header.auth?.requestEvaluation || 'درخواست ارزیابی'}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </nav>
        </div>
      </div>

      <button 
        type="button"
        className="cn-header-search-btn"
        onClick={() => setSearchOpen(true)}
        aria-label={siteContent.header.search?.label || 'جستجو'}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17.5 17.5L13.875 13.875" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
