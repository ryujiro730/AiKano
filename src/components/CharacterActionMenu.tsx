'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { MoreVertical, Flag, Ban, X } from 'lucide-react'

interface Props {
  characterId: string
  characterName: string
}

interface MenuPos { top: number; right: number }

export function CharacterActionMenu({ characterId, characterName }: Props) {
  const [open, setOpen] = useState(false)
  const [menuPos, setMenuPos] = useState<MenuPos | null>(null)
  const [showReport, setShowReport] = useState(false)
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const [done, setDone] = useState<'reported' | 'blocked' | 'unblocked' | null>(null)
  const [reportError, setReportError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    fetch('/api/blocks')
      .then(r => r.json())
      .then(({ blocks }) => {
        setIsBlocked((blocks ?? []).some((b: any) => b.character_id === characterId))
      })
      .catch(() => {})
  }, [characterId])

  // 完了トーストを自動非表示
  useEffect(() => {
    if (!done) return
    const t = setTimeout(() => setDone(null), 2500)
    return () => clearTimeout(t)
  }, [done])

  // ドロップダウン外クリックで閉じる
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      const t = e.target as Node
      const inBtn = btnRef.current?.contains(t) ?? false
      const inDrop = dropdownRef.current?.contains(t) ?? false
      if (!inBtn && !inDrop) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const openMenu = useCallback(() => {
    if (!btnRef.current) return
    const r = btnRef.current.getBoundingClientRect()
    setMenuPos({ top: r.bottom + 4, right: window.innerWidth - r.right })
    setOpen(v => !v)
  }, [])

  const submitReport = async () => {
    console.log('[report] called reason:', JSON.stringify(reason), 'submitting:', submitting)
    if (!reason.trim()) { setReportError('内容を入力してください'); return }
    if (submitting) return
    setSubmitting(true)
    setReportError(null)
    try {
      const res = await fetch(`/api/characters/${characterId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })
      console.log('[report] status:', res.status)
      if (res.ok) {
        setShowReport(false)
        setReason('')
        setDone('reported')
      } else {
        const body = await res.json().catch(() => ({}))
        setReportError(body.error ?? `エラー (${res.status})`)
      }
    } catch (e) {
      console.error('[report] fetch error:', e)
      setReportError('通信エラーが発生しました')
    }
    setSubmitting(false)
  }

  const toggleBlock = async () => {
    setOpen(false)
    const wasBlocked = isBlocked
    console.log('[block] called wasBlocked:', wasBlocked, 'submitting:', submitting)
    setSubmitting(true)
    try {
      const res = await fetch(`/api/characters/${characterId}/block`, {
        method: wasBlocked ? 'DELETE' : 'POST',
      })
      console.log('[block] status:', res.status)
      if (res.ok) {
        setIsBlocked(!wasBlocked)
        setDone(wasBlocked ? 'unblocked' : 'blocked')
      } else {
        const body = await res.json().catch(() => ({}))
        setDone(null)
        console.error('[block] error:', body)
      }
    } catch (e) {
      console.error('[block] fetch error:', e)
    }
    setSubmitting(false)
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={openMenu}
        className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
      >
        <MoreVertical size={19} />
      </button>

      {mounted && open && menuPos && createPortal(
        <div
          ref={dropdownRef}
          className="fixed rounded-xl shadow-lg overflow-hidden"
          style={{
            top: menuPos.top,
            right: menuPos.right,
            zIndex: 99999,
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.08)',
            minWidth: '160px',
          }}
        >
          <button
            onClick={() => { setOpen(false); setShowReport(true) }}
            className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-left hover:bg-gray-50 transition-colors"
          >
            <Flag size={15} className="text-orange-500" />
            通報する
          </button>
          <button
            onClick={toggleBlock}
            disabled={submitting}
            className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-left hover:bg-gray-50 transition-colors border-t border-gray-100 disabled:opacity-40"
            style={{ color: isBlocked ? 'var(--color-text-muted)' : '#e8437f' }}
          >
            <Ban size={15} />
            {isBlocked ? 'お断り解除' : 'お断りする'}
          </button>
        </div>,
        document.body
      )}

      {mounted && showReport && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center p-5"
          style={{ zIndex: 99999, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => { setShowReport(false); setReportError(null) }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl p-6"
            style={{ background: '#fff' }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-base">通報する</p>
              <button onClick={() => { setShowReport(false); setReportError(null) }} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mb-3">
              {characterName}さんへの通報内容を入力してください。
            </p>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="通報内容を入力（必須）"
              rows={4}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm resize-none outline-none focus:border-[var(--color-primary)] transition-colors"
              style={{ fontFamily: 'inherit' }}
            />
            <p className="text-xs text-gray-400 mt-1 mb-1">{reason.trim().length} 文字</p>
            {reportError && (
              <p className="text-xs text-red-500 mb-3">{reportError}</p>
            )}
            {!reportError && <div className="mb-3" />}
            <button
              onClick={submitReport}
              disabled={!reason.trim() || submitting}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #f9a8d4, #e8437f)' }}
            >
              {submitting ? '送信中…' : '通報する'}
            </button>
          </div>
        </div>,
        document.body
      )}

      {mounted && done && createPortal(
        <div
          className="fixed bottom-24 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full text-sm font-medium text-white shadow-lg pointer-events-none"
          style={{ zIndex: 99999, background: 'rgba(30,30,30,0.85)', whiteSpace: 'nowrap' }}
        >
          {done === 'reported' && '通報しました'}
          {done === 'blocked' && 'お断りしました'}
          {done === 'unblocked' && 'お断りを解除しました'}
        </div>,
        document.body
      )}
    </>
  )
}
