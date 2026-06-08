'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from '../services/notificationService'
import { getAdminSocket } from '../services/socketService'

const NotificationContext = createContext(null)

function normalizeNotif(n) {
  return {
    ...n,
    isRead: Boolean(n?.isRead ?? n?.read),
  }
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const limit = 20
  const mountedRef = useRef(true)

  const load = useCallback(async (pageNum = 1) => {
    setLoading(true)
    try {
      const data = await fetchNotifications({ page: pageNum, limit, sort: 'desc' })
      if (!mountedRef.current) return
      setNotifications(data.notifications.map(normalizeNotif))
      setUnreadCount(data.unreadCount)
      setTotal(data.total)
      setPage(data.page)
    } catch {
      // ignore
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    load(1)

    const socket = getAdminSocket()
    if (!socket) return () => { mountedRef.current = false }

    const onNew = (payload) => {
      const notif = normalizeNotif(payload?.notification || payload)
      if (!notif?.id) return
      setNotifications((prev) => [notif, ...prev.filter((n) => n.id !== notif.id)])
      setUnreadCount((c) => c + (notif.isRead ? 0 : 1))
      setTotal((t) => t + 1)
    }

    socket.on('user_registered', onNew)
    socket.on('evaluation_submitted', onNew)
    socket.on('new_chat_message', onNew)
    socket.on('system_notification', onNew)

    return () => {
      mountedRef.current = false
      socket.off('user_registered', onNew)
      socket.off('evaluation_submitted', onNew)
      socket.off('new_chat_message', onNew)
      socket.off('system_notification', onNew)
    }
  }, [load])

  const markRead = useCallback(async (id) => {
    await markNotificationRead(id)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true, read: true } : n))
    )
    setUnreadCount((c) => Math.max(0, c - 1))
  }, [])

  const markAllRead = useCallback(async () => {
    await markAllNotificationsRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, read: true })))
    setUnreadCount(0)
  }, [])

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      total,
      page,
      limit,
      load,
      markRead,
      markAllRead,
    }),
    [notifications, unreadCount, loading, total, page, load, markRead, markAllRead]
  )

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotificationContext() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotificationContext must be used within NotificationProvider')
  return ctx
}
