'use client'

import { useEffect } from 'react'

function detectPlatform() {
  if (typeof window === 'undefined') return

  const root = document.documentElement
  const ua = navigator.userAgent || ''
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isAndroid = /Android/i.test(ua)

  root.classList.remove('cn-ios', 'cn-android', 'cn-mobile-generic')
  if (isIOS) root.classList.add('cn-ios')
  else if (isAndroid) root.classList.add('cn-android')
  else if (window.matchMedia('(max-width: 1024px)').matches) root.classList.add('cn-mobile-generic')

  const dpr = window.devicePixelRatio || 1
  root.classList.toggle('cn-retina', dpr >= 2)
  root.classList.toggle('cn-retina-3x', dpr >= 3)
}

export default function PlatformDetector() {
  useEffect(() => {
    detectPlatform()
    window.addEventListener('resize', detectPlatform)
    return () => window.removeEventListener('resize', detectPlatform)
  }, [])

  return null
}
