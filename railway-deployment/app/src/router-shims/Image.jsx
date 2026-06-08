import React from 'react'

export default function Image({
  src,
  alt = '',
  fill,
  style,
  className,
  width,
  height,
  ...rest
}) {
  const mergedStyle = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style }
    : style

  return (
    <img
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      style={mergedStyle}
      {...rest}
    />
  )
}
