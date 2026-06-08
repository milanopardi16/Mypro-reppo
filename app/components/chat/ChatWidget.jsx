'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from '@/src/router-shims/navigation'
import { getCurrentUser } from '../../utils/userStore'
import { getUserSocket } from '../../admin/services/socketService'
import { sendChatMessage } from '../../utils/chatApi'
import './ChatWidget.css'

const GUEST_KEY = 'cn_chat_guest_id'
const EMOJIS = ['😊', '👍', '❤️', '🙏', '✅', '🔥']

function getOrCreateGuestId() {
  try {
    let id = sessionStorage.getItem(GUEST_KEY)
    if (!id) {
      id = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
      sessionStorage.setItem(GUEST_KEY, id)
    }
    return id
  } catch {
    return `guest_${Date.now()}`
  }
}

function getUserId() {
  const user = getCurrentUser()
  if (user?.id) return String(user.id)
  if (user?.email) return user.email
  return getOrCreateGuestId()
}

function getRoomId(userId) {
  return `room_${userId}`
}

async function fetchMessages(roomId) {
  const res = await fetch(`/api/chat/rooms/${encodeURIComponent(roomId)}/messages`)
  const body = await res.json().catch(() => ({}))
  return Array.isArray(body.messages) ? body.messages : []
}

async function uploadFile(file) {
  const data = new FormData()
  data.append('file', file)
  const res = await fetch('/api/chat/uploads', { method: 'POST', body: data })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.error || 'upload failed')
  return body
}

export default function ChatWidget() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [online, setOnline] = useState(false)
  const [typing, setTyping] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)
  const [unread, setUnread] = useState(0)
  const [userId, setUserId] = useState('')
  const [roomId, setRoomId] = useState('')
  const socketRef = useRef(null)
  const endRef = useRef(null)
  const fileRef = useRef(null)
  const typingRef = useRef(null)

  const initChat = useCallback(() => {
    const uid = getUserId()
    const rid = getRoomId(uid)
    setUserId(uid)
    setRoomId(rid)

    const socket = getUserSocket(uid)
    socketRef.current = socket

    fetchMessages(rid).then(setMessages)
    const poll = setInterval(() => {
      fetchMessages(rid).then(setMessages)
    }, 4000)

    if (!socket) {
      setOnline(true)
      return () => clearInterval(poll)
    }

    socket.on('connect', () => setOnline(true))
    socket.on('disconnect', () => setOnline(false))
    socket.emit('join_room', { roomId: rid })

    socket.on('receive_message', (payload) => {
      const msg = payload?.message
      if (!msg || msg.roomId !== rid) return
      setMessages((prev) => [...prev, msg])
      if (!open && msg.senderType === 'admin') setUnread((c) => c + 1)
    })

    socket.on('typing_start', (p) => {
      if (p?.roomId === rid && p?.senderType === 'admin') setTyping(true)
    })
    socket.on('typing_stop', (p) => {
      if (p?.roomId === rid && p?.senderType === 'admin') setTyping(false)
    })

    socket.on('message_read', () => {
      setMessages((prev) => prev.map((m) => (m.senderType === 'user' ? { ...m, isRead: true } : m)))
    })

    return () => {
      clearInterval(poll)
      socket.off('connect')
      socket.off('disconnect')
      socket.off('receive_message')
      socket.off('typing_start')
      socket.off('typing_stop')
      socket.off('message_read')
    }
  }, [open])

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return undefined
    return initChat()
  }, [pathname, initChat])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  useEffect(() => {
    if (open) setUnread(0)
  }, [open])

  if (pathname?.startsWith('/admin')) return null

  function emitTyping(active) {
    socketRef.current?.emit(active ? 'typing_start' : 'typing_stop', { roomId })
  }

  function handleTextChange(e) {
    setText(e.target.value)
    emitTyping(true)
    clearTimeout(typingRef.current)
    typingRef.current = setTimeout(() => emitTyping(false), 1200)
  }

  async function send(attachment = null) {
    const trimmed = text.trim()
    if (!trimmed && !attachment) return
    const payload = {
      roomId,
      senderId: userId,
      senderType: 'user',
      message: trimmed,
      attachment,
    }
    if (socketRef.current?.connected) {
      socketRef.current.emit('send_message', payload)
    } else {
      try {
        const msg = await sendChatMessage(payload)
        if (msg) setMessages((prev) => [...prev, msg])
      } catch {
        return
      }
    }
    setText('')
    setShowEmoji(false)
    emitTyping(false)
  }

  async function onFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const up = await uploadFile(file)
      await send({ url: up.url, fileName: up.fileName, type: file.type })
    } catch {
      // ignore
    }
    e.target.value = ''
  }

  return (
    <>
      <div className="cn-chat-launcher">
        {!open ? (
          <span className="cn-chat-launcher-label" aria-hidden="true">
            ✨ پشتیبانی آنلاین
          </span>
        ) : null}

        <div className="cn-chat-launcher-btn-wrap">
          {!open ? (
            <>
              <span className="cn-chat-pulse-ring" aria-hidden="true" />
              <span className="cn-chat-pulse-ring" aria-hidden="true" />
              <span className="cn-chat-pulse-ring" aria-hidden="true" />
              <span className="cn-chat-sparkle s1" aria-hidden="true">✦</span>
              <span className="cn-chat-sparkle s2" aria-hidden="true">✧</span>
              <span className="cn-chat-sparkle s3" aria-hidden="true">★</span>
            </>
          ) : null}

          {!open && unread > 0 ? (
            <span className="cn-chat-unread-badge">{unread > 9 ? '9+' : unread}</span>
          ) : null}

          <motion.button
            type="button"
            className={`cn-chat-launcher-btn${open ? ' open' : ''}`}
            aria-label={open ? 'بستن چت' : 'باز کردن چت پشتیبانی'}
            onClick={() => setOpen((v) => !v)}
            whileTap={{ scale: 0.92 }}
          >
            {open ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                <circle cx="8" cy="10" r="1.2" />
                <circle cx="12" cy="10" r="1.2" />
                <circle cx="16" cy="10" r="1.2" />
              </svg>
            )}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="cn-chat-widget-panel"
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            role="dialog"
            aria-label="چت پشتیبانی"
          >
            <div className="cn-chat-widget-header">
              <div>
                <h3>پشتیبانی آنلاین</h3>
                <div className={`cn-chat-widget-status${online ? ' online' : ''}`}>
                  <span className="cn-chat-widget-status-dot" />
                  {online ? 'آنلاین — پاسخگوی شما هستیم' : 'در حال اتصال...'}
                </div>
              </div>
              <button type="button" className="cn-chat-widget-close" onClick={() => setOpen(false)} aria-label="بستن">
                ✕
              </button>
            </div>

            <div className="cn-chat-widget-messages">
              {messages.length === 0 ? (
                <div className="cn-chat-widget-welcome">
                  <span className="cn-chat-widget-welcome-icon">💬</span>
                  سلام! تیم Capital Network آماده پاسخگویی به سوالات شماست.
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`cn-chat-widget-msg ${msg.senderType === 'user' ? 'user' : 'admin'}`}>
                    {msg.attachment?.url ? (
                      msg.attachment.type?.startsWith('image/') ? (
                        <img src={msg.attachment.url} alt="" style={{ maxWidth: 180, borderRadius: 8 }} />
                      ) : (
                        <a href={msg.attachment.url} target="_blank" rel="noreferrer" style={{ color: '#818cf8' }}>
                          📎 {msg.attachment.fileName || 'فایل'}
                        </a>
                      )
                    ) : null}
                    {msg.message ? <div>{msg.message}</div> : null}
                    <div className="cn-chat-widget-msg-meta">
                      {msg.senderType === 'user' && msg.isRead ? '✓✓' : msg.senderType === 'user' ? '✓' : ''}
                    </div>
                  </div>
                ))
              )}
              <div ref={endRef} />
            </div>

            {typing ? <div className="cn-chat-widget-typing">پشتیبان در حال نوشتن...</div> : null}

            {showEmoji ? (
              <div className="cn-chat-widget-emoji-bar">
                {EMOJIS.map((em) => (
                  <button key={em} type="button" onClick={() => setText((t) => t + em)}>
                    {em}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="cn-chat-widget-tools">
              <button type="button" aria-label="پیوست" onClick={() => fileRef.current?.click()}>
                📎
              </button>
              <button type="button" aria-label="ایموجی" onClick={() => setShowEmoji((v) => !v)}>
                😊
              </button>
              <input ref={fileRef} type="file" hidden onChange={onFile} />
            </div>

            <div className="cn-chat-widget-input">
              <textarea
                rows={1}
                placeholder="پیام..."
                value={text}
                onChange={handleTextChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send()
                  }
                }}
              />
              <button type="button" disabled={!text.trim()} onClick={() => send()}>
                ارسال
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
