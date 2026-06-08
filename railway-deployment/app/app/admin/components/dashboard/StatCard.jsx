'use client'

import { formatRelativeTime } from '../../utils/formatRelativeTime'

const ICONS = {
  users: '👥',
  evaluations: '📋',
  chat: '💬',
  messages: '✉️',
  notifications: '🔔',
  activity: '⚡',
}

export default function StatCard({ title, value, hint, icon = 'activity', loading }) {
  return (
    <div className="admin-stat-card" role="status" aria-label={title}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="admin-stat-label">{title}</div>
        <span aria-hidden="true" style={{ fontSize: 20, opacity: 0.7 }}>
          {ICONS[icon] || ICONS.activity}
        </span>
      </div>
      <div className="admin-stat-value">{loading ? '—' : value ?? 0}</div>
      {hint ? <div className="admin-stat-hint">{hint}</div> : null}
    </div>
  )
}

export function ActivityItem({ activity }) {
  return (
    <div className="admin-list-item">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ fontWeight: 900 }}>{activity.title || 'فعالیت'}</div>
        <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', whiteSpace: 'nowrap' }}>
          {activity.createdAt ? formatRelativeTime(activity.createdAt) : ''}
        </div>
      </div>
      {activity.message ? (
        <div style={{ marginTop: 6, fontSize: 13, color: 'var(--admin-text-muted)', lineHeight: 1.7 }}>
          {activity.message}
        </div>
      ) : null}
    </div>
  )
}

export function UserItem({ user }) {
  return (
    <div className="admin-list-item">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ fontWeight: 900 }}>{user.fullName || user.name || user.email || 'کاربر'}</div>
        <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
          {user.created_at || user.createdAt ? formatRelativeTime(user.created_at || user.createdAt) : ''}
        </div>
      </div>
      {user.email ? (
        <div style={{ marginTop: 6, fontSize: 12, color: 'var(--admin-text-muted)' }} dir="ltr">
          {user.email}
        </div>
      ) : null}
    </div>
  )
}
