import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

export default function Link({ href, children, ...props }) {
  const target = typeof href === 'string' ? href : href?.pathname || '/'
  const isExternal = /^https?:\/\//i.test(target)

  if (isExternal) {
    return (
      <a href={target} {...props}>
        {children}
      </a>
    )
  }

  return (
    <RouterLink to={target} {...props}>
      {children}
    </RouterLink>
  )
}
