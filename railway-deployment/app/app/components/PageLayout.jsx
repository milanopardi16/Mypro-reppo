import Header from './Header'

export default function PageLayout({ children, title, subtitle, badge }) {
  return (
    <>
      <Header />
      <main className="cn-page">
        <div className="cn-page-container">
          {(badge || title || subtitle) && (
            <header className="cn-page-header">
              {badge && <div className="cn-page-badge">{badge}</div>}
              {title && <h1 className="cn-page-title">{title}</h1>}
              {subtitle && <p className="cn-page-subtitle">{subtitle}</p>}
            </header>
          )}

          {children}
        </div>
      </main>
    </>
  )
}
