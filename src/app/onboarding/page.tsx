'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, ChevronLeft } from 'lucide-react'
import { trackSignUp, trackOnboardingStart } from '@/lib/gtag'

const GENDER_OPTIONS = [
  { value: 'male', label: '男性' },
  { value: 'female', label: '女性' },
  { value: 'other', label: 'その他' },
]

type CharOption = { id: string; name: string; age: number | null; avatar_url: string; personality: string | null }

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [characters, setCharacters] = useState<CharOption[]>([])
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/auth/login'); return }

      const [{ data: profile }, { data: chars }] = await Promise.all([
        supabase.from('profiles').select('display_name, age, gender').eq('id', user.id).single(),
        supabase.from('characters').select('id, name, age, avatar_url, personality').eq('is_active', true).order('sort_order', { ascending: true }),
      ])

      if (profile?.display_name) setName(profile.display_name)
      if (profile?.age) setAge(String(profile.age))
      if (profile?.gender) setGender(profile.gender)
      if (chars) setCharacters(chars as CharOption[])

      if (profile?.display_name && profile?.age && profile?.gender) {
        window.location.href = '/characters'
        return
      }

      setLoading(false)
      trackOnboardingStart()
    }
    init()
  }, [])

  const complete = async () => {
    if (!selectedCharId) return
    setSaving(true)
    const referralSource = sessionStorage.getItem('referral_source') ?? undefined
    const referralArticle = sessionStorage.getItem('referral_article') ?? undefined
    const referralByCode = sessionStorage.getItem('referral_by_code') ?? undefined
    const res = await fetch('/api/onboarding/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, age, gender, partnerCharacterId: selectedCharId, referralSource, referralArticle, referralByCode }),
    })
    setSaving(false)
    if (!res.ok) {
      const data = await res.json()
      alert('保存に失敗しました: ' + (data.error ?? ''))
      return
    }
    trackSignUp({ referral_source: referralSource })
    sessionStorage.removeItem('referral_source')
    sessionStorage.removeItem('referral_article')
    sessionStorage.removeItem('referral_by_code')
    window.location.href = `/chat?character=${selectedCharId}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[var(--color-primary)]" size={28} />
      </div>
    )
  }

  const StepDots = () => (
    <div className="flex justify-center gap-2 mb-8">
      {[1, 2, 3].map(s => (
        <div
          key={s}
          className="rounded-full transition-all duration-300"
          style={{
            width: s === step ? '24px' : '8px',
            height: '8px',
            background: s <= step ? 'var(--color-primary)' : 'var(--color-border)',
          }}
        />
      ))}
    </div>
  )

  // ── Step 1: 名前 ──────────────────────────────────
  if (step === 1) {
    return (
      <div>
        <StepDots />
        <h1 className="text-2xl font-bold mb-2">あなたのお名前は？</h1>
        <p className="text-[var(--color-text-muted)] text-sm mb-8">
          キャラクターがこの名前で呼びかけます
        </p>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="ニックネーム"
          className="input-warm w-full px-4 py-4 text-lg mb-8 text-center"
          autoFocus
          onKeyDown={e => e.key === 'Enter' && name.trim() && setStep(2)}
        />
        <button
          onClick={() => setStep(2)}
          disabled={!name.trim()}
          className="btn-primary w-full py-4 text-base font-semibold disabled:opacity-50"
        >
          次へ
        </button>
      </div>
    )
  }

  // ── Step 2: 年齢・性別 ────────────────────────────
  if (step === 2) {
    return (
      <div>
        <StepDots />
        <button
          onClick={() => setStep(1)}
          className="flex items-center gap-1 text-[var(--color-text-muted)] text-sm mb-6 hover:text-[var(--color-text)] transition-colors"
        >
          <ChevronLeft size={16} />
          戻る
        </button>

        <h1 className="text-2xl font-bold mb-2">プロフィール設定</h1>
        <p className="text-[var(--color-text-muted)] text-sm mb-8">
          キャラクターとの会話に使います
        </p>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">年齢</label>
            <input
              type="number"
              value={age}
              onChange={e => setAge(e.target.value)}
              placeholder="例: 25"
              min={18} max={99}
              className="input-warm w-full px-4 py-3 text-base"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-3 block">性別</label>
            <div className="grid grid-cols-3 gap-3">
              {GENDER_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setGender(opt.value)}
                  className="py-3 rounded-xl border text-sm font-medium transition-all"
                  style={{
                    borderColor: gender === opt.value ? 'var(--color-primary)' : 'var(--color-border)',
                    background: gender === opt.value ? 'var(--color-primary)' : 'var(--color-surface-2)',
                    color: gender === opt.value ? '#fff' : 'var(--color-text)',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => setStep(3)}
          disabled={!age || !gender || parseInt(age) < 18}
          className="btn-primary w-full py-4 text-base font-semibold mt-10 disabled:opacity-50"
        >
          次へ
        </button>
        {age && parseInt(age) < 18 && (
          <p className="text-center text-sm mt-3" style={{ color: 'var(--color-primary)' }}>
            ご利用は18歳以上の方に限られます
          </p>
        )}
      </div>
    )
  }

  // ── Step 3: キャラクター選択 ──────────────────────
  return (
    <div>
      <StepDots />
      <button
        onClick={() => setStep(2)}
        className="flex items-center gap-1 text-[var(--color-text-muted)] text-sm mb-6 hover:text-[var(--color-text)] transition-colors"
      >
        <ChevronLeft size={16} />
        戻る
      </button>

      <h1 className="text-2xl font-bold mb-1">話す相手を選ぼう</h1>
      <p className="text-[var(--color-text-muted)] text-sm mb-6">
        あとからいつでも変えられます
      </p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {characters.map(char => {
          const isSelected = selectedCharId === char.id
          return (
            <button
              key={char.id}
              onClick={() => setSelectedCharId(char.id)}
              style={{
                position: 'relative',
                borderRadius: 16,
                overflow: 'hidden',
                aspectRatio: '3/4',
                border: 'none',
                padding: 0,
                outline: isSelected ? '3px solid var(--color-primary)' : '2px solid transparent',
                outlineOffset: '2px',
                cursor: 'pointer',
                background: '#111',
                transition: 'outline 0.15s ease',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={char.avatar_url}
                alt={char.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 45%, transparent 70%)',
              }} />
              {isSelected && (
                <div style={{
                  position: 'absolute', top: 10, right: 10,
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'var(--color-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, color: '#fff', fontWeight: 700,
                }}>
                  ✓
                </div>
              )}
              <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, textAlign: 'left' }}>
                <p style={{ color: '#fff', fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>
                  {char.name}
                  {char.age && (
                    <span style={{ fontSize: 12, fontWeight: 400, opacity: 0.7, marginLeft: 5 }}>
                      {char.age}歳
                    </span>
                  )}
                </p>
                {char.personality && (
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 3, lineHeight: 1.3 }}>
                    {char.personality}
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <button
        onClick={complete}
        disabled={!selectedCharId || saving}
        className="btn-primary w-full py-4 text-base font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {saving && <Loader2 size={16} className="animate-spin" />}
        {selectedCharId ? 'はじめる' : 'キャラクターを選んでください'}
      </button>
    </div>
  )
}
