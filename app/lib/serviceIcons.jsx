export function ServiceIcon({ type, color = '#D19C0A' }) {
  if (type === 'target') {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z"
          stroke={color}
          strokeWidth="2.5"
        />
        <path
          d="M21.3333 14.6667C21.3333 17.6122 18.9455 20 16 20C13.0545 20 10.6667 17.6122 10.6667 14.6667C10.6667 11.7212 13.0545 9.33334 16 9.33334C18.9455 9.33334 21.3333 11.7212 21.3333 14.6667Z"
          stroke={color}
          strokeWidth="2.5"
        />
        <path d="M16 20V28" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'document') {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M10.6667 14.6667H21.3333M10.6667 18.6667H21.3333M5.33334 6.66666H26.6667C27.403 6.66666 28 7.26362 28 8V24C28 24.7364 27.403 25.3333 26.6667 25.3333H5.33334C4.59696 25.3333 4 24.7364 4 24V8C4 7.26362 4.59696 6.66666 5.33334 6.66666Z"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 2.66666V6.66666M24 2.66666V6.66666"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path
        d="M28 8L16 2.66666L4 8L16 13.3333L28 8Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 14.6667L16 20L28 14.6667"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 21.3333L16 26.6667L28 21.3333"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
