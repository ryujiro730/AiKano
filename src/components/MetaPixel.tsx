'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { META_PIXEL_ID } from '@/lib/meta'

/** Meta Pixel。管理画面では読み込まない（スタッフの閲覧が広告の計測に混ざるため） */
export default function MetaPixel() {
  const pathname = usePathname()
  if (!META_PIXEL_ID || pathname?.startsWith('/admin')) return null
  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
    </Script>
  )
}
