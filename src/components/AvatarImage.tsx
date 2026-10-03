'use client'

import { useState } from 'react'
import { UserRound } from 'lucide-react'

type Props = {
  src: string | null | undefined
  alt: string
  className?: string
  style?: React.CSSProperties
  iconSize?: number
}

export function AvatarImage({ src, alt, className, style, iconSize = 48 }: Props) {
  const [error, setError] = useState(false)

  const isPlaceholder = !src ||
    src.includes('placehold.co') ||
    src.includes('placeholder.com') ||
    src.includes('via.placeholder') ||
    src.includes('dummyimage')

  if (isPlaceholder || error) {
    return (
      <div
        className={className}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f3e8f0, #e8d5f0)',
          ...style,
        }}
      >
        <UserRound size={iconSize} color="#c084fc" strokeWidth={1.5} opacity={0.7} />
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      loading="lazy"
      decoding="async"
      className={className}
      style={{ width: '100%', height: '100%', objectFit: 'cover', ...style }}
    />
  )
}
