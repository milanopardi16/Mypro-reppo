'use client'

import { motion } from 'framer-motion'
import { useSiteContent } from '../hooks/useSiteContent'
import { defaultSiteContent } from '../data/siteContent'

export default function Testimonials() {
  const siteContent = useSiteContent()

  const section = siteContent.testimonialsSection || defaultSiteContent.testimonialsSection
  const testimonialData = siteContent.testimonials || []

  return (
    <section className="cn-testimonials-section" id="testimonials">
      <div className="cn-testimonials-container">
        <motion.div 
          className="cn-testimonials-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="cn-section-badge">{section.badge}</div>
          <h2 className="cn-section-h2">
            {section.title}{' '}
            {section.titleHighlight ? (
              <span className="cn-text-gradient">{section.titleHighlight}</span>
            ) : null}{' '}
            {section.titleSuffix}
          </h2>
          <p className="cn-section-desc">{section.description}</p>
        </motion.div>

        <div className="cn-testimonials-grid">
          {testimonialData.map((testimonial, index) => (
            <motion.div 
              key={testimonial.id ?? index}
              className="cn-testimonial-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300 } }}
            >
              <div className="cn-testimonial-stars">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} className="cn-star">⭐</span>
                ))}
              </div>
              <p className="cn-testimonial-text">"{testimonial.text}"</p>
              <div className="cn-testimonial-author">
                <div className="cn-testimonial-avatar">
                  <span>{testimonial.author.charAt(0)}</span>
                </div>
                <div className="cn-testimonial-info">
                  <div className="cn-testimonial-name">{testimonial.author}</div>
                  <div className="cn-testimonial-role">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function TestimonialCard({ author = 'نام', role = 'عنوان', text = 'متن شهادت', rating = 5 }) {
  return (
    <motion.div 
      className="cn-testimonial-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
    >
      <div className="cn-testimonial-stars">
        {Array.from({ length: rating }).map((_, i) => (
          <span key={i} className="cn-star">⭐</span>
        ))}
      </div>
      <p className="cn-testimonial-text">"{text}"</p>
      <div className="cn-testimonial-author">
        <div className="cn-testimonial-avatar">
          {author.charAt(0)}
        </div>
        <div className="cn-testimonial-info">
          <div className="cn-testimonial-name">{author}</div>
          <div className="cn-testimonial-role">{role}</div>
        </div>
      </div>
    </motion.div>
  )
}

export function TestimonialsSection({ testimonials = [] }) {
  return (
    <section className="cn-testimonials-section">
      <div className="cn-testimonials-container">
        <motion.div 
          className="cn-testimonials-header"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="cn-testimonials-title">نظرات مشتریان</h2>
          <p className="cn-testimonials-subtitle">
            بیش از ۵۰ شرکت به ما اعتماد کرده‌اند
          </p>
        </motion.div>

        <div className="cn-testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function FeatureCard({ number, title, text, features = [] }) {
  return (
    <motion.div 
      className="cn-feature-card-item"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
    >
      <div className="cn-feature-card-number">{number}</div>
      <h3 className="cn-feature-card-title">{title}</h3>
      <p className="cn-feature-card-text">{text}</p>
      {features.length > 0 && (
        <ul className="cn-feature-card-list">
          {features.map((feature, i) => (
            <li key={i}>{feature}</li>
          ))}
        </ul>
      )}
    </motion.div>
  )
}
