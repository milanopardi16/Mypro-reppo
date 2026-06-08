'use client'

import { motion } from 'framer-motion'
import { useSiteContent } from '../hooks/useSiteContent'
import { defaultSiteContent } from '../data/siteContent'
import { ServiceIcon } from '../lib/serviceIcons'

function ServiceCard({ service, index }) {
  const color = service.color || '#D19C0A'

  return (
    <motion.div
      className={`cn-service-card ${service.featured ? 'cn-card-featured' : ''}`}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -10,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
    >
      <motion.div
        className="cn-card-glow"
        animate={{
          opacity: [0, 0.3, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: 'reverse',
          delay: index * 0.5,
        }}
      />

      {service.featured && (
        <motion.div
          className="cn-card-badge-popular"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, delay: 0.5 }}
        >
          محبوب‌ترین
        </motion.div>
      )}

      <div className="cn-card-content">
        <motion.div className="cn-card-icon" whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <ServiceIcon type={service.iconType} color={color} />
          </motion.div>
        </motion.div>

        <motion.h3
          className="cn-card-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {service.title}
        </motion.h3>

        <p className="cn-card-text">{service.description}</p>

        <ul className="cn-card-list">
          {(service.items || []).map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <motion.svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, delay: 0.4 + i * 0.1 }}
              >
                <path
                  d="M16.6667 5L7.50004 14.1667L3.33337 10"
                  stroke="#00B2A9"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
              {item}
            </motion.li>
          ))}
        </ul>

        <motion.div
          className="cn-card-footer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.span
            className={`cn-card-tag ${service.featured ? 'cn-tag-accent' : ''}`}
            whileHover={{ scale: 1.05 }}
          >
            {service.tag}
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function Services() {
  const siteContent = useSiteContent()
  const servicesHome = siteContent.servicesHome || defaultSiteContent.servicesHome
  const services = siteContent.services || defaultSiteContent.services

  return (
    <section className="cn-services" id="services">
      <div className="cn-services-bg"></div>

      <div className="cn-services-container">
        <div className="cn-section-header">
          <motion.div
            className="cn-section-badge"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {servicesHome.badge}
          </motion.div>

          <motion.h2
            className="cn-section-h2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {servicesHome.title}{' '}
            {servicesHome.titleHighlight ? (
              <span className="cn-text-gradient">{servicesHome.titleHighlight}</span>
            ) : null}
          </motion.h2>

          <motion.p
            className="cn-section-desc"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {servicesHome.description}
          </motion.p>
        </div>

        <motion.div
          className="cn-services-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
