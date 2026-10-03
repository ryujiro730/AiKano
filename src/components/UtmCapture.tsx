'use client'

import { useEffect } from 'react'

const UTM_KEY = 'utm_attr'
const UTM_TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30日

export type UtmData = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  fbclid?: string
  captured_at: number
}

export function getStoredUtm(): UtmData | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(UTM_KEY)
    if (!raw) return null
    const data: UtmData = JSON.parse(raw)
    if (Date.now() - data.captured_at > UTM_TTL_MS) {
      localStorage.removeItem(UTM_KEY)
      return null
    }
    return data
  } catch {
    return null
  }
}

export function clearStoredUtm() {
  if (typeof window !== 'undefined') localStorage.removeItem(UTM_KEY)
}

export default function UtmCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const utm_source   = params.get('utm_source')   ?? undefined
    const utm_medium   = params.get('utm_medium')   ?? undefined
    const utm_campaign = params.get('utm_campaign') ?? undefined
    const utm_content  = params.get('utm_content')  ?? undefined
    const utm_term     = params.get('utm_term')     ?? undefined
    const fbclid       = params.get('fbclid')       ?? undefined

    if (utm_source || utm_medium || utm_campaign || utm_content || fbclid) {
      const data: UtmData = {
        utm_source, utm_medium, utm_campaign, utm_content, utm_term, fbclid,
        captured_at: Date.now(),
      }
      localStorage.setItem(UTM_KEY, JSON.stringify(data))
    }
  }, [])

  return null
}
