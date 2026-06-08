import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import HomePage from '../app/page'
import AboutPage from '../app/about/page'
import BlogPage from '../app/blog/page'
import BlogPostPage from '../app/blog/[slug]/page'
import CategoryPage from '../app/category/[slug]/page'
import ContactPage from '../app/contact/page'
import DashboardPage from '../app/dashboard/page'
import DisclaimerPage from '../app/disclaimer/page'
import FounderOnboardingPage from '../app/founder_onboarding/page'
import LoginPage from '../app/login/page'
import PreviewHomepagePage from '../app/preview/homepage/page'
import PrivacyPage from '../app/privacy/page'
import ProcessPage from '../app/process/page'
import RegisterPage from '../app/register/page'
import ServicesPage from '../app/services/page'
import TagPage from '../app/tag/[slug]/page'
import TermsPage from '../app/terms/page'
import TestRoutePage from '../app/test-route/page'
import NotFoundPage from '../app/not-found'
import ConditionalFooter from '../app/components/ConditionalFooter'
import PlatformDetector from '../app/components/PlatformDetector'
import ScrollToTop from '../app/components/ScrollToTop'

import AdminGate from '../app/admin/AdminGate'
import AdminDashboardPage from '../app/admin/page'
import AdminSiteContentPage from '../app/admin/site-content/page'
import AdminBlogPage from '../app/admin/blog/page'
import AdminHeaderNavPage from '../app/admin/header-nav/page'
import AdminRegistrationsPage from '../app/admin/registrations/page'
import AdminMessagesPage from '../app/admin/messages/page'
import AdminEvaluationsPage from '../app/admin/evaluations/page'
import AdminNotificationsPage from '../app/admin/notifications/page'
import AdminChatPage from '../app/admin/chat/page'
import ChatWidget from '../app/components/chat/ChatWidget'

function TagRoute() {
  const params = useParams()
  return <TagPage params={params} />
}

function CategoryRoute() {
  const params = useParams()
  return <CategoryPage params={params} />
}

function BlogPostRoute() {
  const params = useParams()
  return <BlogPostPage params={params} />
}

const isDev = import.meta.env.DEV

export default function App() {
  return (
    <>
      <PlatformDetector />
      <div className="cn-site-background" aria-hidden="true">
        <span className="cn-gradient-orb cn-orb-1"></span>
        <span className="cn-gradient-orb cn-orb-2"></span>
        <span className="cn-grid-pattern"></span>
      </div>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostRoute />} />
        <Route path="/category/:slug" element={<CategoryRoute />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
        <Route path="/founder_onboarding" element={<FounderOnboardingPage />} />
        <Route path="/login" element={<LoginPage />} />
        {isDev ? (
          <Route path="/preview/homepage" element={<PreviewHomepagePage />} />
        ) : (
          <Route path="/preview/homepage" element={<Navigate to="/" replace />} />
        )}
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/process" element={<ProcessPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/tag/:slug" element={<TagRoute />} />
        <Route path="/terms" element={<TermsPage />} />
        {isDev ? (
          <Route path="/test-route" element={<TestRoutePage />} />
        ) : (
          <Route path="/test-route" element={<Navigate to="/" replace />} />
        )}

        <Route element={<AdminGate />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/site-content" element={<AdminSiteContentPage />} />
          <Route path="/admin/header-nav" element={<AdminHeaderNavPage />} />
          <Route path="/admin/blog" element={<AdminBlogPage />} />
          <Route path="/admin/registrations" element={<AdminRegistrationsPage />} />
          <Route path="/admin/messages" element={<AdminMessagesPage />} />
          <Route path="/admin/evaluations" element={<AdminEvaluationsPage />} />
          <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
          <Route path="/admin/chat" element={<AdminChatPage />} />
        </Route>

        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <ConditionalFooter />
      <ChatWidget />
      <ScrollToTop />
    </>
  )
}
