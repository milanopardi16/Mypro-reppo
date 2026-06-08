'use client'

import { createContext, useContext, useMemo } from 'react'
import { defaultSiteContent, normalizeSiteContent } from '../data/siteContent'

export const SiteContentContext = createContext(null)

export function SiteContentProvider({ content, previewMode = false, children }) {
  const value = useMemo(
    () => ({
      content: normalizeSiteContent(content || defaultSiteContent),
      previewMode,
    }),
    [content, previewMode]
  )

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
}

export function useSiteContentContext() {
  return useContext(SiteContentContext)
}
