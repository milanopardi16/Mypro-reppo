'use client'

import { motion } from 'framer-motion'

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  href,
  className = '',
  ...props 
}) {
  const baseClass = 'cn-btn-variant'
  const variantClass = {
    primary: 'cn-btn-primary-variant',
    secondary: 'cn-btn-secondary-variant',
    outline: 'cn-btn-outline',
    tertiary: 'cn-btn-tertiary',
    success: 'cn-btn-success',
  }[variant] || 'cn-btn-primary-variant'

  const sizeClass = {
    sm: 'cn-btn-sm',
    md: '',
    lg: 'cn-btn-lg',
  }[size] || ''

  const classes = `${baseClass} ${variantClass} ${sizeClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${loading ? 'cn-btn-loading' : ''} ${className}`

  if (href) {
    return (
      <motion.a 
        href={href}
        className={classes}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        {...props}
      >
        {loading && <span className="cn-spinner"></span>}
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      {...props}
    >
      {loading && <span className="cn-spinner"></span>}
      {children}
    </motion.button>
  )
}

export function ButtonGroup({ children, direction = 'row' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: direction === 'col' ? 'column' : 'row',
      gap: '12px',
      flexWrap: 'wrap'
    }}>
      {children}
    </div>
  )
}
