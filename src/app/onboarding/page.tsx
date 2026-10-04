'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, ChevronLeft, Check } from 'lucide-react'
import { trackSignUp, trackOnboardingStart } from '@/lib/gtag'
import { getStoredUtm, getStoredGclid } from '@/components/UtmCapture'

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

    // セッションストレージ → localStorage → user_metadata の優先順で UTM を読む
    const { data: { user: authUser } } = await supabase.auth.getUser()
    const meta = (authUser?.user_metadata ?? {}) as Record<string, string | undefined>
    const urlP = new URLSearchParams(window.location.search)
    const utmData = getStoredUtm()

    const referralSource = urlP.get('referral_source') ?? sessionStorage.getItem('referral_source') ?? meta.referral_source ?? undefined
    const referralArticle = sessionStorage.getItem('referral_article') ?? undefined
    const referralByCode  = sessionStorage.getItem('referral_by_code') ?? undefined

    const utmSource   = urlP.get('utm_source')   ?? utmData?.utm_source   ?? sessionStorage.getItem('utm_source')   ?? meta.utm_source   ?? undefined
    const utmMedium   = urlP.get('utm_medium')   ?? utmData?.utm_medium   ?? sessionStorage.getItem('utm_medium')   ?? meta.utm_medium   ?? undefined
    const utmCampaign = urlP.get('utm_campaign') ?? utmData?.utm_campaign ?? sessionStorage.getItem('utm_campaign') ?? meta.utm_campaign ?? undefined
    const utmContent  = urlP.get('utm_content')  ?? utmData?.utm_content  ?? sessionStorage.getItem('utm_content')  ?? meta.utm_content  ?? undefined
    const utmTerm     = urlP.get('utm_term')     ?? utmData?.utm_term     ?? sessionStorage.getItem('utm_term')     ?? meta.utm_term     ?? undefined
    const fbclid      = urlP.get('fbclid')       ?? utmData?.fbclid       ?? sessionStorage.getItem('fbclid')       ?? meta.fbclid       ?? undefined
    const gclid       = urlP.get('gclid')        ?? getStoredGclid() ?? sessionStorage.getItem('gclid') ?? undefined
    const tjAclid     = urlP.get('aclid')        ?? utmData?.aclid        ?? sessionStorage.getItem('aclid')        ?? meta.aclid        ?? undefined

    const res = await fetch('/api/onboarding/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, age, gender, partnerCharacterId: selectedCharId,
        referralSource, referralArticle, referralByCode,
        utmSource, utmMedium, utmCampaign, utmContent, utmTerm, fbclid, gclid, tjAclid,
      }),
    })
    setSaving(false)
    if (!res.ok) {
      const data = await res.json()
      alert('保存に失敗しました: ' + (data.error ?? ''))
      return
    }
    trackSignUp({ referral_source: referralSource ?? utmSource })
    // sessionStorage をクリア
    ;['referral_source', 'referral_article', 'referral_by_code',
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid', 'aclid',
    ].forEach(k => sessionStorage.removeItem(k))
    window.location.href = `/chat?character=${selectedCharId}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[var(--color-primary)]" size={28} />
      </div>
    )
  }

  const selectedChar = characters.find(c => c.id === selectedCharId) ?? null
  const ageNum = parseInt(age)
  const ageInvalid = !!age && (isNaN(ageNum) || ageNum < 18)

  // 上部: 戻る＋進捗バー
  const TopBar = () => (
    <div className="flex items-center gap-3 mb-7">
      <button
        onClick={() => setStep(s => Math.max(1, s - 1))}
        className="w-9 h-9 -ml-2 flex items-center justify-center rounded-[10px] transition-opacity"
        style={{ color: 'var(--color-text)', opacity: step === 1 ? 0 : 1, pointerEvents: step === 1 ? 'none' : 'auto' }}
        aria-label="戻る"
      >
        <ChevronLeft size={22} />
      </button>
      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-3)' }}>
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%`, background: 'var(--color-primary)' }} />
      </div>
      <span className="text-xs tabular-nums w-9 text-right" style={{ color: 'var(--color-text-muted)' }}>{step}/3</span>
    </div>
  )

  // 画面下に固定するメインボタン
  const BottomCta = ({ label, disabled, onClick }: { label: string; disabled: boolean; onClick: () => void }) => (
    <div className="fixed left-0 right-0 bottom-0 px-4 pt-3"
      style={{ background: 'linear-gradient(to top, var(--color-bg) 70%, transparent)', paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}>
      <button
        onClick={onClick}
        disabled={disabled}
        className="btn-primary w-full max-w-md mx-auto flex items-center justify-center gap-2 font-bold disabled:opacity-40"
        style={{ height: 54, fontSize: 16, borderRadius: 12 }}
      >
        {saving && <Loader2 size={16} className="animate-spin" />}
        {label}
      </button>
    </div>
  )

  // 選んだキャラが話しかけてくる吹き出し
  const CharacterSays = ({ text }: { text: string }) => selectedChar && (
    <div className="flex items-end gap-3 mb-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={selectedChar.avatar_url} alt={selectedChar.name}
        className="w-16 h-16 rounded-full object-cover flex-shrink-0" style={{ objectPosition: 'top center' }} />
      <div className="bubble-operator px-4 py-3 text-[15px] leading-relaxed" style={{ maxWidth: '75%' }}>
        {text}
      </div>
    </div>
  )

  // ── Step 1: キャラクター選択 ──────────────────────
  if (step === 1) {
    return (
      <div className="pb-28">
        <TopBar />
        <h1 className="text-[26px] font-bold leading-tight mb-2">話してみたい子を<br />選んでください</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
          選んだ子からメッセージが届きます。あとから他の子とも話せます。
        </p>

        <div className="grid grid-cols-2 gap-3">
          {characters.map(char => {
            const isSelected = selectedCharId === char.id
            return (
              <button
                key={char.id}
                onClick={() => setSelectedCharId(char.id)}
                className="relative overflow-hidden text-left"
                style={{
                  borderRadius: 12,
                  aspectRatio: '3/4',
                  background: '#17131a',
                  outline: isSelected ? '2.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                  outlineOffset: isSelected ? '2px' : '0',
                  transition: 'outline 0.15s ease, transform 0.15s ease',
                  transform: isSelected ? 'scale(0.98)' : 'none',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={char.avatar_url} alt={char.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,10,14,0.85) 0%, rgba(13,10,14,0.1) 45%, transparent 65%)' }} />
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--color-primary)', color: '#fff' }}>
                    <Check size={16} strokeWidth={3} />
                  </div>
                )}
                <div className="absolute bottom-2.5 left-3 right-3">
                  <p className="text-white font-bold text-[15px] leading-tight">
                    {char.name}
                    {char.age && <span className="text-xs font-normal ml-1.5" style={{ opacity: 0.7 }}>{char.age}歳</span>}
                  </p>
                  {char.personality && (
                    <p className="text-[11px] mt-1 leading-snug line-clamp-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
                      {char.personality.replace(/[/、,]/g, ' · ')}
                    </p>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        <BottomCta
          label={selectedChar ? `${selectedChar.name}と話す` : '話したい子を選んでください'}
          disabled={!selectedCharId}
          onClick={() => setStep(2)}
        />
      </div>
    )
  }

  // ── Step 2: 名前 ──────────────────────────────────
  if (step === 2) {
    return (
      <div className="pb-28">
        <TopBar />
        <CharacterSays text="はじめまして！なんて呼んだらいいですか？" />
        <label className="text-sm font-semibold mb-2 block">呼ばれたい名前</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="ニックネームでOK"
          maxLength={20}
          className="input-warm w-full px-4 text-[17px]"
          style={{ height: 54 }}
          autoFocus
          onKeyDown={e => e.key === 'Enter' && name.trim() && setStep(3)}
        />
        <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
          {selectedChar?.name ?? 'キャラクター'}がこの名前で呼びかけます。あとで設定から変えられます。
        </p>

        <BottomCta label="次へ" disabled={!name.trim()} onClick={() => setStep(3)} />
      </div>
    )
  }

  // ── Step 3: 年齢・性別 ────────────────────────────
  return (
    <div className="pb-28">
      <TopBar />
      <CharacterSays text={`${name.trim()}さん、よろしくね！最後にもう少しだけ教えてください。`} />

      <div className="space-y-6">
        <div>
          <label className="text-sm font-semibold mb-2 block">年齢</label>
          <input
            type="number"
            inputMode="numeric"
            value={age}
            onChange={e => setAge(e.target.value)}
            placeholder="例: 30"
            min={18} max={99}
            className="input-warm w-full px-4 text-[17px]"
            style={{ height: 54 }}
          />
          {ageInvalid && (
            <p className="text-xs mt-2" style={{ color: 'var(--color-primary)' }}>ご利用は18歳以上の方に限られます</p>
          )}
        </div>
        <div>
          <label className="text-sm font-semibold mb-2 block">性別</label>
          <div className="grid grid-cols-3 gap-2">
            {GENDER_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setGender(opt.value)}
                className="rounded-[10px] text-[15px] font-semibold transition-colors"
                style={{
                  height: 50,
                  border: `1px solid ${gender === opt.value ? 'var(--color-primary)' : 'var(--color-border-warm)'}`,
                  background: gender === opt.value ? 'var(--color-primary-soft)' : 'var(--color-surface)',
                  color: gender === opt.value ? 'var(--color-primary)' : 'var(--color-text)',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <BottomCta
        label={saving ? '準備しています…' : `${selectedChar?.name ?? ''}と話しはじめる`}
        disabled={!age || ageInvalid || !gender || !selectedCharId || saving}
        onClick={complete}
      />
    </div>
  )
}
