'use client'

import AdminLayout from '../components/AdminLayout'
import AdminChatPanel from '../components/chat/AdminChatPanel'

export default function AdminChatPage() {
  return (
    <AdminLayout title="چت زنده" subtitle="پشتیبانی آنلاین مشتریان">
      <AdminChatPanel />
    </AdminLayout>
  )
}
