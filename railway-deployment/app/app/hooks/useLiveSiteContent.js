'use client'

import { useEffect, useState } from 'react'
import { useSiteContentContext } from '../context/SiteContentProvider'
import {
  defaultSiteContent,
  fetchSiteContent,
  getStoredSiteContent,
  normalizeSiteContent,
} from '../data/siteContent'

export function useLiveSiteContent() {
  const previewCtx = useSiteContentContext()
  const [siteContent, setSiteContent] = useState(defaultSiteContent)

  useEffect(() => {
    if (previewCtx) return undefined

    const applyContent = (raw) => {
      const normalized = normalizeSiteContent(raw)
      setSiteContent((current) => {
        try {
          const currentJson = JSON.stringify(current)
          const nextJson = JSON.stringify(normalized)
          return currentJson === nextJson ? current : normalized
        } catch {
          return normalized
        }
      })
    }

    applyContent(getStoredSiteContent())
    fetchSiteContent().then((raw) => raw && applyContent(raw)).catch(() => {})

    const onUpdate = (event) => {
      if (event?.detail) applyContent(event.detail)
    }
    window.addEventListener('site-content-updated', onUpdate)
    return () => window.removeEventListener('site-content-updated', onUpdate)
  }, [previewCtx])

  if (previewCtx) {
    return previewCtx.content
  }

  return siteContent
}

export function usePreviewMode() {
  const previewCtx = useSiteContentContext()
  return Boolean(previewCtx?.previewMode)
}
