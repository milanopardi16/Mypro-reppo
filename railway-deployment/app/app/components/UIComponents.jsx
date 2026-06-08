'use client'

import { motion } from 'framer-motion'

export default function StatusBadge({ status = 'pending', label = 'در انتظار' }) {
  const statusMap = {
    success: { className: 'cn-status-success', icon: '✓' },
    pending: { className: 'cn-status-pending', icon: '⏱' },
    inactive: { className: 'cn-status-inactive', icon: '✕' }
  }

  const current = statusMap[status] || statusMap.pending

  return (
    <span className={`cn-status-badge ${current.className}`}>
      <span className="cn-status-dot"></span>
      {label}
    </span>
  )
}

export function StatsCounter({ value = 0, label = '', suffix = '' }) {
  return (
    <motion.div 
      className="cn-stats-counter"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="cn-counter-value"
        initial={{ count: 0 }}
        whileInView={{ count: value }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: 'easeOut' }}
      >
        {value}{suffix}
      </motion.div>
      <div className="cn-counter-label">{label}</div>
    </motion.div>
  )
}

export function ProgressBar({ percentage = 50, label = '' }) {
  return (
    <div>
      {label && <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '8px' }}>{label}</p>}
      <div className="cn-progress-bar">
        <motion.div 
          className="cn-progress-fill"
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>
    </div>
  )
}
