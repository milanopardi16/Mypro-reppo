'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const THEME_KEY = 'cn_admin_theme'

const AdminThemeContext = createContext(null)

export function AdminThemeProvider({ children }) {
  const [theme, setThemeState] = useState('dark')

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY)
      if (stored === 'light' || stored === 'dark') setThemeState(stored)
    } catch {
      // ignore
    }
  }, [])

  const setTheme = useCallback((next) => {
    setThemeState(next)
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      // ignore
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme])

  return <AdminThemeContext.Provider value={value}>{children}</AdminThemeContext.Provider>
}

export function useAdminThemeContext() {
  const ctx = useContext(AdminThemeContext)
  if (!ctx) throw new Error('useAdminThemeContext must be used within AdminThemeProvider')
  return ctx
}
