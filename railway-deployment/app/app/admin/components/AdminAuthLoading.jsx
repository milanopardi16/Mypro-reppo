'use client'

export default function AdminAuthLoading({ message = 'در حال بررسی دسترسی...' }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0A1D3D',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: 20,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '3px solid rgba(255,255,255,0.15)',
          borderTopColor: '#D19C0A',
          animation: 'admin-auth-spin 0.8s linear infinite',
        }}
      />
      <div
        style={{
          fontFamily: 'BYekan, IranYekan, sans-serif',
          fontWeight: 900,
          fontSize: 14,
          color: '#a5b4fc',
        }}
      >
        {message}
      </div>
      <style>{`
        @keyframes admin-auth-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
