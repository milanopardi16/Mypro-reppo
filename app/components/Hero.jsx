'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Button from './Button'
import { normalizeHero } from '../data/heroContent'
import { useLiveSiteContent } from '../hooks/useLiveSiteContent'

function HeroExtra({ extra, className = '' }) {
  if (!extra?.enabled || !String(extra.text || '').trim()) return null
  return (
    <div className={`cn-hero-extra ${className}`.trim()}>
      {extra.title ? <span className="cn-hero-extra-title">{extra.title}</span> : null}
      <p>{extra.text}</p>
    </div>
  )
}

function ShapeSvg({ shape }) {
  const w = shape.width || 40
  const h = shape.height || 40
  const sw = shape.strokeWidth || 2
  const color = shape.strokeColor || 'rgba(255,255,255,0.15)'

  if (shape.type === 'circle') {
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
        <circle cx={w / 2} cy={h / 2} r={w / 2 - 2} stroke={color} strokeWidth={sw} />
      </svg>
    )
  }
  if (shape.type === 'triangle') {
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
        <polygon points={`${w / 2},3 ${w - 2},${h - 2} 3,${h - 2}`} stroke={color} strokeWidth={sw} />
      </svg>
    )
  }
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <rect x="2" y="2" width={w - 4} height={h - 4} rx="8" stroke={color} strokeWidth={sw} />
    </svg>
  )
}

export default function Hero() {
  const containerRef = useRef(null)
  const siteContent = useLiveSiteContent()
  const hero = useMemo(() => normalizeHero(siteContent.hero), [siteContent.hero])

  const parallax = hero.parallax || {}
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const yMax = parallax.enabled !== false ? Number(parallax.yMax) || 150 : 0
  const opacityEnd = parallax.enabled !== false ? Number(parallax.opacityAtEnd) ?? 0.5 : 1
  const opacityPoint = Number(parallax.opacityScrollPoint) || 0.8

  const heroY = useTransform(scrollYProgress, [0, 1], [0, yMax])
  const heroOpacity = useTransform(scrollYProgress, [0, opacityPoint], [1, opacityEnd])

  const particlesConfig = hero.particles || {}
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (particlesConfig.enabled === false) {
      setParticles([])
      return
    }
    if (particlesConfig.mode === 'manual' && Array.isArray(particlesConfig.items) && particlesConfig.items.length > 0) {
      setParticles(particlesConfig.items.map((p, i) => ({ ...p, id: p.id ?? i })))
      return
    }
    const count = Number(particlesConfig.count) || 25
    const generated = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 3 + 1,
      opacity: Math.random() * 0.4 + 0.1,
      delay: Math.random() * 5,
    }))
    setParticles(generated)
  }, [particlesConfig.enabled, particlesConfig.mode, particlesConfig.count, JSON.stringify(particlesConfig.items)])

  const taglineText = hero.tagline?.text || ''
  const [displayText, setDisplayText] = useState('')
  const [typingIndex, setTypingIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    setDisplayText('')
    setTypingIndex(0)
  }, [taglineText])

  useEffect(() => {
    if (hero.tagline?.enabled === false) return
    if (typingIndex < taglineText.length) {
      const speed = hero.tagline?.animation?.typingSpeedMs ?? 80
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + taglineText[typingIndex])
        setTypingIndex((prev) => prev + 1)
      }, speed)
      return () => clearTimeout(timeout)
    }
  }, [typingIndex, taglineText, hero.tagline?.enabled, hero.tagline?.animation?.typingSpeedMs])

  useEffect(() => {
    if (hero.tagline?.showCursor === false) return
    const blink = hero.tagline?.animation?.cursorBlinkMs ?? 500
    const interval = setInterval(() => setShowCursor((prev) => !prev), blink)
    return () => clearInterval(interval)
  }, [hero.tagline?.showCursor, hero.tagline?.animation?.cursorBlinkMs])

  const heroStats = hero.stats?.enabled !== false && Array.isArray(hero.stats?.items) ? hero.stats.items : []
  const [animatedStats, setAnimatedStats] = useState(() => heroStats.map(() => 0))
  const countRef = useRef(null)
  const statsKey = JSON.stringify(heroStats)

  useEffect(() => {
    setAnimatedStats(heroStats.map(() => 0))
  }, [statsKey])

  useEffect(() => {
    if (hero.stats?.enabled === false) return
    const stats = JSON.parse(statsKey)
    const stepMs = hero.stats?.animation?.counterStepMs ?? 30
    const threshold = hero.stats?.animation?.observerThreshold ?? 0.3

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        const timers = stats.map((stat, index) => {
          const target = Number(stat.counterTarget)
          if (!Number.isFinite(target) || target <= 0) return null
          return setInterval(() => {
            setAnimatedStats((prev) => {
              const next = [...prev]
              if (next[index] >= target) {
                clearInterval(timers[index])
                next[index] = target
                return next
              }
              next[index] = (next[index] || 0) + 1
              return next
            })
          }, stepMs + index * 10)
        })
      },
      { threshold }
    )
    if (countRef.current) observer.observe(countRef.current)
    return () => observer.disconnect()
  }, [statsKey, hero.stats?.enabled, hero.stats?.animation?.counterStepMs, hero.stats?.animation?.observerThreshold])

  const renderStatValue = (stat, index) => {
    const target = Number(stat.counterTarget)
    if (Number.isFinite(target) && target > 0) {
      const suffix = stat.counterSuffix || ''
      const prefix = stat.prefix || ''
      if (suffix.includes('M')) return `${prefix || '+'}$${animatedStats[index] || 0}M`
      if (suffix.includes('روز')) return `${animatedStats[index] || 0}+${suffix.trim() || ' روز'}`
      return `${animatedStats[index] || 0}${suffix}`
    }
    return stat.display
  }

  const pAnim = particlesConfig.animation || {}
  const floatY = Number(pAnim.floatY) || 20
  const durMult = Number(pAnim.durationMultiplier) || 2

  const ctaItems = (hero.cta?.enabled !== false ? hero.cta?.items || [] : []).sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  )

  const descriptionItems = hero.description?.enabled !== false ? (hero.description?.items || []) : []
  const descAnim = hero.description?.animation || {}

  const getCtaHref = (btn) => {
    if (btn.linkType === 'phone') return `tel:${btn.phone || ''}`
    return btn.href || '#'
  }

  return (
    <section className="cn-hero-v2" ref={containerRef}>
      {hero.background?.enabled !== false && (
        <div className="cn-hero-bg">
          {hero.background?.showOrbs !== false && (
            <>
              <div className="cn-gradient-orb cn-orb-1"></div>
              <div className="cn-gradient-orb cn-orb-2"></div>
            </>
          )}
          {hero.background?.showGrid !== false && <div className="cn-grid-pattern"></div>}
        </div>
      )}

      {particlesConfig.enabled !== false && particles.length > 0 && (
        <div className="cn-hero-particles">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="cn-particle-dot"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                opacity: p.opacity,
              }}
              animate={{
                y: [0, -floatY, 0],
                opacity: [p.opacity, (p.opacity || 0.2) * 2, p.opacity],
              }}
              transition={{
                duration: (p.speed || 1) * durMult,
                repeat: Infinity,
                delay: p.delay || 0,
                ease: pAnim.ease || 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {hero.shapes?.enabled !== false &&
        (hero.shapes?.items || []).map((shape) => {
          const anim = shape.animation || {}
          const yPeak = Number(anim.yPeak) || -15
          const rot = Number(anim.rotatePeak) || 10
          return (
            <motion.div
              key={shape.id}
              className={`cn-hero-shape ${shape.positionClass || ''}`}
              animate={{
                y: [0, yPeak, 0],
                rotate: [0, rot, -rot, 0],
              }}
              transition={{
                duration: Number(anim.duration) || 6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Number(anim.delay) || 0,
              }}
            >
              <ShapeSvg shape={shape} />
            </motion.div>
          )
        })}

      <motion.div
        className="cn-hero-container"
        style={
          parallax.enabled !== false
            ? { y: heroY, opacity: heroOpacity }
            : undefined
        }
      >
        <div className="cn-hero-content">
          {hero.badge?.enabled !== false && (
            <motion.div
              className="cn-badge-v2"
              initial={{
                opacity: 0,
                x: hero.badge?.animation?.entranceX ?? -30,
              }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: hero.badge?.animation?.entranceDuration ?? 0.6,
                delay: hero.badge?.animation?.entranceDelay ?? 0.2,
              }}
            >
              {hero.badge?.showPulse !== false && (
                <motion.span
                  className="cn-pulse"
                  animate={{ scale: [1, hero.badge?.animation?.pulseScale ?? 1.5, 1] }}
                  transition={{
                    duration: hero.badge?.animation?.pulseDuration ?? 2,
                    repeat: Infinity,
                  }}
                />
              )}
            <span>{hero.badge?.text}</span>
            <HeroExtra extra={hero.badge?.extra} />
          </motion.div>
          )}

          {hero.title?.enabled !== false && (
            <motion.h1
              className="cn-h1-v2"
              initial={{ opacity: 0, y: hero.title?.animation?.entranceY ?? 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: hero.title?.animation?.entranceDuration ?? 0.8,
                delay: hero.title?.animation?.entranceDelay ?? 0.4,
              }}
            >
              <motion.span
                className="cn-hero-gradient-text"
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{
                  duration: hero.title?.animation?.gradientDuration ?? 4,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
              {hero.title?.text}
            </motion.span>
            <HeroExtra extra={hero.title?.extra} />
          </motion.h1>
          )}

          {hero.tagline?.enabled !== false && (
            <motion.p
              className="cn-tagline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: hero.tagline?.animation?.entranceDuration ?? 0.5,
                delay: hero.tagline?.animation?.entranceDelay ?? 0.8,
              }}
            >
              {displayText}
              {hero.tagline?.showCursor !== false && (
                <motion.span className="cn-type-cursor" animate={{ opacity: showCursor ? 1 : 0 }}>
                  {hero.tagline?.cursorChar || '|'}
                </motion.span>
              )}
            </motion.p>
          )}
          <HeroExtra extra={hero.tagline?.extra} />

          {hero.description?.enabled !== false && descriptionItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: descAnim.entranceY ?? 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: descAnim.entranceDuration ?? 0.6,
                delay: descAnim.entranceDelay ?? 1.2,
              }}
            >
              {descriptionItems.map((item, index) => (
                <motion.p
                  key={item.id || index}
                  className="cn-hero-desc-item"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: (descAnim.entranceDelay ?? 1.2) + index * 0.15,
                  }}
                >
                  {item.text}
                </motion.p>
              ))}
            </motion.div>
          )}
          <HeroExtra extra={hero.description?.extra} />

          {hero.cta?.enabled !== false && ctaItems.length > 0 && (
            <motion.div
              className="cn-cta-group-v2"
              initial={{ opacity: 0, y: hero.cta?.animation?.entranceY ?? 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: hero.cta?.animation?.entranceDuration ?? 0.6,
                delay: hero.cta?.animation?.entranceDelay ?? 1.6,
              }}
            >
              {ctaItems.map((btn) => (
                <Button key={btn.id} href={getCtaHref(btn)} variant={btn.variant || 'primary'} size="lg">
                  {btn.iconAnimation === 'slide' && (
                    <motion.svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      style={{ marginRight: '8px' }}
                      animate={{ x: [0, 4, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: btn.iconDuration ?? 1.5,
                        ease: 'easeInOut',
                      }}
                    >
                      <path
                        d="M7.5 15L12.5 10L7.5 5"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  )}
                  {btn.iconAnimation === 'rotate' && (
                    <motion.svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      style={{ marginRight: '8px' }}
                      animate={{ rotate: [0, 8, -8, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: btn.iconDuration ?? 2,
                        ease: 'easeInOut',
                      }}
                    >
                      <path
                        d="M3.66666 5.5C3.66666 4.48736 4.48736 3.66667 5.5 3.66667H7.33333C8.22344 3.66667 8.9789 4.28458 9.17454 5.15156L9.98287 8.35156C10.1418 9.05455 9.83987 9.78611 9.21911 10.1911L7.94444 11.0667C8.97985 13.3026 10.8641 15.1869 13.1 16.2222L13.9756 14.9476C14.3805 14.3268 15.1121 14.0249 15.8151 14.1838L19.0151 14.9921C19.8821 15.1878 20.5 15.9432 20.5 16.8333V18.6667C20.5 19.6793 19.6793 20.5 18.6667 20.5H17.8333C10.4445 20.5 4.5 14.5555 4.5 7.16667V6.33333C4.5 5.72967 4.73767 5.1501 5.15156 4.73621"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  )}
                  <span>{btn.label}</span>
                </Button>
              ))}
            </motion.div>
          )}
          <HeroExtra extra={hero.cta?.extra} />

          {hero.stats?.enabled !== false && heroStats.length > 0 && (
            <motion.div
              className="cn-stats-bar"
              ref={countRef}
              initial={{ opacity: 0, y: hero.stats?.animation?.entranceY ?? 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: hero.stats?.animation?.entranceDuration ?? 0.6,
                delay: hero.stats?.animation?.entranceDelay ?? 2,
              }}
            >
              {heroStats.map((stat, index) => (
                <div key={stat.id || index} style={{ display: 'contents' }}>
                  {index > 0 && <div className="cn-stat-divider"></div>}
                  <motion.div
                    className="cn-stat"
                    whileHover={{ scale: hero.stats?.animation?.hoverScale ?? 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="cn-stat-number">{renderStatValue(stat, index)}</div>
                    <div className="cn-stat-label">{stat.label}</div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          )}
          <HeroExtra extra={hero.stats?.extra} />
        </div>
      </motion.div>

      {hero.scroll?.enabled !== false && (
        <motion.div
          className="cn-scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: hero.scroll?.animation?.entranceDelay ?? 3 }}
        >
          <motion.div
            className="cn-scroll-mouse"
            animate={{ y: [0, hero.scroll?.animation?.mouseFloatY ?? 6, 0] }}
            transition={{
              repeat: Infinity,
              duration: hero.scroll?.animation?.mouseDuration ?? 2,
              ease: 'easeInOut',
            }}
          >
            <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
              <rect x="1" y="1" width="18" height="28" rx="9" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              <motion.circle
                cx="10"
                cy="8"
                r="2.5"
                fill="rgba(255,255,255,0.4)"
                animate={{ y: [0, hero.scroll?.animation?.dotTravelY ?? 10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: hero.scroll?.animation?.dotDuration ?? 2,
                  ease: 'easeInOut',
                }}
              />
            </svg>
          </motion.div>
          <span className="cn-scroll-text">{hero.scroll?.text || 'اسکرول کنید'}</span>
          <HeroExtra extra={hero.scroll?.extra} />
        </motion.div>
      )}
    </section>
  )
}
