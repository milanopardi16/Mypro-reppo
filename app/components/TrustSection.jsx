'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useSiteContent } from '../hooks/useSiteContent'
import { defaultSiteContent } from '../data/siteContent'

function CountUp({ end, duration = 2, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!isInView) return

    let start = 0
    const increment = end / (duration * 60)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [isInView, end, duration])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

const METRIC_ICONS = ['💰', '🎯', '⏱️']

export default function TrustSection() {
  const siteContent = useSiteContent()
  const trust = siteContent.trust || defaultSiteContent.trust
  const continents = trust.continents || []
  const metrics = trust.metrics || []
  const header = trust.header || {}
  const cta = trust.cta || defaultSiteContent.trust.cta

  return (
    <section className="cn-trust-section" id="trust">
      <div className="cn-trust-bg-overlay"></div>

      <div className="cn-trust-container">
        <motion.div
          className="cn-trust-header"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="cn-trust-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span className="cn-trust-pulse"></span>
            {header.badge}
          </motion.div>

          <h2 className="cn-trust-h2">{header.title}</h2>

          <p className="cn-trust-subtitle">{header.subtitle}</p>
        </motion.div>

        <motion.div
          className="cn-continent-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
              },
            },
          }}
        >
          {continents.map((continent, index) => (
            <motion.div
              key={continent.id}
              className="cn-continent-item"
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.9 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.5, ease: 'easeOut' },
                },
              }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { type: 'spring', stiffness: 300, damping: 20 },
              }}
            >
              <motion.div
                className="cn-icon"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              >
                {continent.icon}
              </motion.div>
              <div className="cn-continent-name">{continent.name}</div>
              <motion.div
                className="cn-continent-count"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {continent.count}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {trust.note ? (
          <motion.p
            className="cn-investor-note"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            {trust.note}
          </motion.p>
        ) : null}

        <motion.div
          className="cn-metrics-row"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.4,
              },
            },
          }}
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              className="cn-metric-card"
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.6, ease: 'easeOut' },
                },
              }}
              whileHover={{
                y: -5,
                transition: { type: 'spring', stiffness: 300 },
              }}
            >
              <motion.div
                className="cn-metric-icon"
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2 + index * 0.1,
                }}
              >
                {METRIC_ICONS[index] || '📊'}
              </motion.div>

              <motion.div
                className="cn-metric-value"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.2 }}
              >
                {metric.prefix ? <span className="cn-metric-prefix">{metric.prefix}</span> : null}
                <CountUp end={metric.value} duration={2.5} suffix={metric.suffix} />
              </motion.div>

              <motion.div
                className="cn-metric-label"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + index * 0.2 }}
              >
                {metric.label}
              </motion.div>

              <motion.div
                className="cn-metric-progress"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 1.5,
                  delay: 0.8 + index * 0.2,
                  ease: 'easeOut',
                }}
                style={{
                  transformOrigin: 'right',
                  backgroundColor: index === 0 ? '#D19C0A' : index === 1 ? '#00B2A9' : '#D19C0A',
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {cta?.text ? (
          <motion.div
            className="cn-trust-cta"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
          >
            <motion.a
              href={cta.href || '#contact'}
              className="cn-trust-cta-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{cta.text}</span>
              <motion.svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              >
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </motion.a>
          </motion.div>
        ) : null}
      </div>
    </section>
  )
}
