'use client'

import Link from '@/src/router-shims/Link'
import { motion } from 'framer-motion'
import { useSiteContent } from '../hooks/useSiteContent'
import { defaultSiteContent } from '../data/siteContent'

export default function Process() {
  const siteContent = useSiteContent()
  const processHome = siteContent.processHome || defaultSiteContent.processHome
  const steps = processHome.steps || []

  return (
    <section className="cn-process" id="process">
      <div className="cn-process-container">
        <div className="cn-section-header">
          <div className="cn-section-badge">{processHome.badge}</div>
          <h2 className="cn-section-h2">
            {processHome.title}{' '}
            {processHome.titleHighlight ? (
              <span className="cn-text-gradient">{processHome.titleHighlight}</span>
            ) : null}
          </h2>
          <p className="cn-section-desc">{processHome.description}</p>
        </div>

        <div className="cn-timeline">
          {steps.map((step, index) => (
            <div key={step.id} className="cn-timeline-item">
              <div className="cn-timeline-marker">
                <div className="cn-timeline-number">{String(index + 1).padStart(2, '0')}</div>
                {index < steps.length - 1 ? <div className="cn-timeline-line"></div> : null}
              </div>

              <div className={`cn-timeline-card ${step.highlight ? 'highlight' : ''}`}>
                <div className="cn-timeline-header">
                  <h3 className="cn-timeline-title">{step.title}</h3>
                  {step.duration ? (
                    <span className="cn-timeline-duration">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8C14.6667 4.3181 11.6819 1.33334 8 1.33334C4.3181 1.33334 1.33334 4.3181 1.33334 8C1.33334 11.6819 4.3181 14.6667 8 14.6667Z"
                          stroke="#D19C0A"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M8 4V8L10.6667 10.6667"
                          stroke="#D19C0A"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      {step.duration}
                    </span>
                  ) : null}
                </div>

                <p className="cn-timeline-desc">{step.description}</p>

                {(step.tags || []).length > 0 ? (
                  <div className="cn-timeline-tags">
                    {step.tags.map((tag) => (
                      <span key={tag} className="cn-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="cn-process-cta">
          {processHome.note ? (
            <p className="cn-process-note">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z"
                  stroke="#00B2A9"
                  strokeWidth="2"
                />
                <path
                  d="M10 6.66667V10L12.5 12.5"
                  stroke="#00B2A9"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              {processHome.note}
            </p>
          ) : null}
          {processHome.ctaText ? (
            <Link href={processHome.ctaHref || '#contact'} className="cn-btn-v2 cn-btn-primary-v2">
              <span>{processHome.ctaText}</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}
