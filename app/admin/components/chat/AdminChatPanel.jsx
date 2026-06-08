'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { formatRelativeTime } from '../../utils/formatRelativeTime'
import { fetchChatRooms, fetchRoomMessages, markRoomRead, uploadChatFile } from '../../services/chatService'
import { getAdminSocket } from '../../services/socketService'
import { sendChatMessage } from '../../../utils/chatApi'

const EMOJIS = ['😊', '👍', '❤️', '🎉', '🙏', '✅', '🔥', '💡', '📎', '🙂']

const S = {
  panel: { padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.04)' },
  input: { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(0,0,0,0.12)', color: '#fff', fontFamily: 'BYekan, IranYekan, sans-serif' },
  btn: { padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 900, cursor: 'pointer' },
  btnPrimary: { padding: '10px 14px', borderRadius: 10, border: 'none', background: '#D19C0A', color: '#0A1D3D', fontFamily: 'BYekan, IranYekan, sans-serif', fontWeight: 900, cursor: 'pointer' },
  muted: { color: '#a5b4fc', fontSize: 12 },
}

function FilterBtn({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...S.btn,
        fontSize: 12,
        background: active ? 'rgba(209,156,10,0.15)' : S.btn.background,
        borderColor: active ? 'rgba(209,156,10,0.4)' : 'rgba(255,255,255,0.12)',
        color: active ? '#E5B02A' : '#fff',
      }}
    >
      {children}
    </button>
  )
}

export default function AdminChatPanel() {
  const [rooms, setRooms] = useState([])
  const [messages, setMessages] = useState([])
  const [selectedRoomId, setSelectedRoomId] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [loadingRooms, setLoadingRooms] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const fileInputRef = useRef(null)
  const socketRef = useRef(null)

  const loadRooms = useCallback(async () => {
    setLoadingRooms(true)
    try {
      const list = await fetchChatRooms()
      setRooms(list)
    } catch {
      // ignore
    } finally {
      setLoadingRooms(false)
    }
  }, [])

  const loadMessages = useCallback(async (roomId) => {
    if (!roomId) return
    setLoadingMessages(true)
    try {
      const list = await fetchRoomMessages(roomId)
      setMessages(list)
      await markRoomRead(roomId)
    } catch {
      // ignore
    } finally {
      setLoadingMessages(false)
    }
  }, [])

  useEffect(() => {
    loadRooms()
    const roomsPoll = setInterval(loadRooms, 5000)
    const socket = getAdminSocket()
    socketRef.current = socket
    if (!socket) {
      return () => clearInterval(roomsPoll)
    }

    socket.emit('join_room', { roomId: selectedRoomId })

    const onMessage = (payload) => {
      const msg = payload?.message
      if (!msg) return
      if (msg.roomId === selectedRoomId) {
        setMessages((prev) => [...prev, msg])
        if (msg.senderType === 'user') markRoomRead(selectedRoomId)
      }
      loadRooms()
    }

    const onTypingStart = (payload) => {
      if (payload?.roomId === selectedRoomId && payload?.senderType === 'user') setTyping(true)
    }
    const onTypingStop = (payload) => {
      if (payload?.roomId === selectedRoomId && payload?.senderType === 'user') setTyping(false)
    }

    socket.on('receive_message', onMessage)
    socket.on('new_chat_message', onMessage)
    socket.on('typing_start', onTypingStart)
    socket.on('typing_stop', onTypingStop)

    return () => {
      clearInterval(roomsPoll)
      socket.off('receive_message', onMessage)
      socket.off('new_chat_message', onMessage)
      socket.off('typing_start', onTypingStart)
      socket.off('typing_stop', onTypingStop)
    }
  }, [selectedRoomId, loadRooms])

  useEffect(() => {
    if (!selectedRoomId) return undefined
    loadMessages(selectedRoomId)
    socketRef.current?.emit('join_room', { roomId: selectedRoomId })
    const msgPoll = setInterval(() => loadMessages(selectedRoomId), 4000)
    return () => clearInterval(msgPoll)
  }, [selectedRoomId, loadMessages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const roomStats = useMemo(() => {
    const map = {}
    rooms.forEach((r) => {
      map[r.id] = r
    })
    return map
  }, [rooms])

  const filteredRooms = useMemo(() => {
    let list = [...rooms]
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((r) => (r.userId || r.id || '').toLowerCase().includes(q))
    }
    if (filter === 'unread') {
      list = list.filter((r) => r.unreadCount > 0)
    } else if (filter === 'active') {
      list = list.filter((r) => r.status === 'active')
    }
    return list.sort((a, b) => Date.parse(b.lastMessageAt || b.createdAt || '') - Date.parse(a.lastMessageAt || a.createdAt || ''))
  }, [rooms, search, filter])

  const selectedRoom = roomStats[selectedRoomId]

  function emitTyping(active) {
    const socket = socketRef.current
    if (!socket || !selectedRoomId) return
    socket.emit(active ? 'typing_start' : 'typing_stop', { roomId: selectedRoomId })
  }

  function handleTextChange(e) {
    setText(e.target.value)
    emitTyping(true)
    clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => emitTyping(false), 1200)
  }

  async function sendMessage(attachment = null) {
    const trimmed = text.trim()
    if (!trimmed && !attachment) return
    if (!selectedRoomId) return

    setSending(true)
    const payload = {
      roomId: selectedRoomId,
      senderId: 'admin',
      senderType: 'admin',
      message: trimmed,
      attachment,
    }
    const socket = socketRef.current
    if (socket?.connected) {
      socket.emit('send_message', payload)
    } else {
      try {
        const msg = await sendChatMessage(payload)
        if (msg) setMessages((prev) => [...prev, msg])
        loadRooms()
      } catch {
        setSending(false)
        return
      }
    }
    setText('')
    setShowEmoji(false)
    emitTyping(false)
    setSending(false)
  }

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const uploaded = await uploadChatFile(file)
      await sendMessage({ url: uploaded.url, fileName: uploaded.fileName, type: file.type })
    } catch {
      // ignore
    }
    e.target.value = ''
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 14, minHeight: 520 }}>
      <div style={{ ...S.panel, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        <div style={{ padding: 12, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <input type="search" placeholder="جستجوی کاربر..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="جستجوی گفتگو" style={S.input} />
        </div>
        <div style={{ display: 'flex', gap: 6, padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap' }}>
          <FilterBtn active={filter === 'all'} onClick={() => setFilter('all')}>همه</FilterBtn>
          <FilterBtn active={filter === 'unread'} onClick={() => setFilter('unread')}>خوانده‌نشده</FilterBtn>
          <FilterBtn active={filter === 'active'} onClick={() => setFilter('active')}>فعال</FilterBtn>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loadingRooms ? (
            <div style={{ ...S.muted, padding: 20, textAlign: 'center' }}>در حال بارگذاری...</div>
          ) : filteredRooms.length === 0 ? (
            <div style={{ ...S.muted, padding: 20, textAlign: 'center' }}>گفتگویی وجود ندارد</div>
          ) : (
            filteredRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedRoomId(room.id)}
                style={{
                  padding: '12px 14px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  cursor: 'pointer',
                  background: selectedRoomId === room.id ? 'rgba(209,156,10,0.12)' : 'transparent',
                  borderRight: selectedRoomId === room.id ? '3px solid #D19C0A' : '3px solid transparent',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 900, fontSize: 14 }}>
                    {room.userId || room.id}
                    {room.status === 'active' ? (
                      <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#22c55e', marginRight: 6 }} />
                    ) : null}
                  </div>
                  {room.unreadCount > 0 ? (
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#D19C0A', display: 'inline-block' }} />
                  ) : null}
                </div>
                {room.lastMessageAt ? (
                  <div style={{ ...S.muted, marginTop: 4 }}>{formatRelativeTime(room.lastMessageAt)}</div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ ...S.panel, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        {selectedRoomId ? (
          <>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontWeight: 900 }}>{selectedRoom?.userId || selectedRoomId}</div>
              <div style={{ ...S.muted, marginTop: 4 }}>{selectedRoom?.status === 'active' ? 'آنلاین' : 'آفلاین'}</div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }} role="log" aria-live="polite">
              {loadingMessages ? (
                <div style={{ ...S.muted, textAlign: 'center' }}>در حال بارگذاری پیام‌ها...</div>
              ) : messages.length === 0 ? (
                <div style={{ ...S.muted, textAlign: 'center' }}>پیامی وجود ندارد. گفتگو را شروع کنید.</div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      maxWidth: '75%',
                      padding: '10px 14px',
                      borderRadius: 14,
                      alignSelf: msg.senderType === 'admin' ? 'flex-end' : 'flex-start',
                      background: msg.senderType === 'admin' ? 'rgba(209,156,10,0.18)' : 'rgba(0,0,0,0.12)',
                      border: `1px solid ${msg.senderType === 'admin' ? 'rgba(209,156,10,0.35)' : 'rgba(255,255,255,0.08)'}`,
                      lineHeight: 1.7,
                    }}
                  >
                    {msg.attachment?.url ? (
                      msg.attachment.type?.startsWith('image/') ? (
                        <a href={msg.attachment.url} target="_blank" rel="noreferrer">
                          <img src={msg.attachment.url} alt="" style={{ maxWidth: 200, borderRadius: 8 }} />
                        </a>
                      ) : (
                        <a href={msg.attachment.url} target="_blank" rel="noreferrer" style={{ color: '#E5B02A' }}>
                          📎 {msg.attachment.fileName || 'فایل'}
                        </a>
                      )
                    ) : null}
                    {msg.message ? <div>{msg.message}</div> : null}
                    <div style={{ fontSize: 11, color: '#a5b4fc', marginTop: 4 }}>
                      {formatRelativeTime(msg.createdAt)}
                      {msg.senderType === 'admin' && msg.isRead ? ' · خوانده شد' : ''}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {typing ? <div style={{ ...S.muted, padding: '4px 16px', fontStyle: 'italic' }}>کاربر در حال نوشتن...</div> : null}

            {showEmoji ? (
              <div style={{ padding: '8px 16px', display: 'flex', flexWrap: 'wrap', gap: 6, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                {EMOJIS.map((em) => (
                  <button key={em} type="button" style={{ ...S.btn, padding: '6px 10px' }} onClick={() => setText((t) => t + em)}>{em}</button>
                ))}
              </div>
            ) : null}

            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <input ref={fileInputRef} type="file" hidden onChange={handleFile} />
              <button type="button" style={{ ...S.btn, padding: '10px 12px' }} aria-label="پیوست" onClick={() => fileInputRef.current?.click()}>📎</button>
              <button type="button" style={{ ...S.btn, padding: '10px 12px' }} aria-label="ایموجی" onClick={() => setShowEmoji((v) => !v)}>😊</button>
              <textarea
                rows={1}
                placeholder="پیام خود را بنویسید..."
                value={text}
                onChange={handleTextChange}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                aria-label="متن پیام"
                style={{ ...S.input, flex: 1, resize: 'none', minHeight: 42 }}
              />
              <button type="button" style={{ ...S.btnPrimary, opacity: sending || !text.trim() ? 0.6 : 1 }} disabled={sending || !text.trim()} onClick={() => sendMessage()}>
                ارسال
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a5b4fc' }}>
            یک گفتگو را از لیست انتخاب کنید
          </div>
        )}
      </div>
    </div>
  )
}
