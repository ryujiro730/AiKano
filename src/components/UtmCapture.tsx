'use client'

import { useEffect } from 'react'

const UTM_KEY   = 'utm_attr'
const GCLID_KEY = 'gclid_attr'
const UTM_TTL_MS   = 30 * 24 * 60 * 60 * 1000 // 30日
const GCLID_TTL_MS = 90 * 24 * 60 * 60 * 1000 // 90日（Google Ads cookie と同じ）

export type UtmData = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  fbclid?: string
  aclid?: string
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

/** 広告クリック時に付与される gclid を取得（90日保持） */
export function getStoredGclid(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(GCLID_KEY)
    if (!raw) return null
    const { gclid, captured_at } = JSON.parse(raw)
    if (Date.now() - captured_at > GCLID_TTL_MS) {
      localStorage.removeItem(GCLID_KEY)
      return null
    }
    return gclid ?? null
  } catch {
    return null
  }
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
    const aclid        = params.get('aclid')        ?? undefined
    const gclid        = params.get('gclid')        ?? undefined

    if (utm_source || utm_medium || utm_campaign || utm_content || fbclid || aclid) {
      const data: UtmData = {
        utm_source, utm_medium, utm_campaign, utm_content, utm_term, fbclid, aclid,
        captured_at: Date.now(),
      }
      localStorage.setItem(UTM_KEY, JSON.stringify(data))
    }

    // gclid は上書きせず、初回クリック時のものを90日保持
    if (gclid && !getStoredGclid()) {
      localStorage.setItem(GCLID_KEY, JSON.stringify({ gclid, captured_at: Date.now() }))
    }
  }, [])

  return null
}
