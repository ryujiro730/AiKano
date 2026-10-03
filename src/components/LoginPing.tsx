'use client'
import { useEffect } from 'react'

export function LoginPing() {
  useEffect(() => {
    // JST の今日の日付をキーにして、1日1回だけpingを送る
    const todayJST = new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 10)
    const key = `lp_${todayJST}`
    if (sessionStorage.getItem(key)) return
    fetch('/api/auth/login-ping', { method: 'POST' }).then(() => {
      sessionStorage.setItem(key, '1')
    }).catch(() => {})
  }, [])
  return null
}
