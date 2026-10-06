'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Send, ChevronLeft, Images, X } from 'lucide-react'
import { getAffectionLevel, getAffectionProgress, AFFECTION_LEVELS } from '@/lib/affection'
import type { Character, Message, Profile, CharacterPhoto } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import Lightbox from '@/components/Lightbox'
import { AvatarImage } from '@/components/AvatarImage'
import { CharacterActionMenu } from '@/components/CharacterActionMenu'
import { compressImage, isHeic, heicToBlob } from '@/lib/compress-image'
import { PointsShortageDialog } from '@/components/PointsShortageDialog'
import { LevelUpToast } from '@/components/LevelUpToast'
import { AffectionMeter } from '@/components/AffectionMeter'
import type { IntimacyHint } from '@/lib/intimacy'
import { AffectionIcon } from '@/components/AffectionIcon'
import { LockedPhotoTile } from '@/components/LockedPhotoTile'
import { PLANS, type PlanId } from '@/lib/plans'
import { notifyBadgesChanged } from '@/lib/badge-events'
import { logAction } from '@/lib/action-log'
import { useI18n } from '@/i18n/client'
import { fmt, gap } from '@/i18n/fmt'
import { localizedCharacter } from '@/lib/character-i18n'
import { POINTS_PER_MESSAGE } from '@/lib/pricing'
import { GiftSheet, type GiftResult } from '@/components/GiftSheet'
import { canUseGacha } from '@/lib/features'
import { MosaicCover, LevelLockedCover, UnownedPhotoCover, GachaButton, useMediaUnlock } from '@/components/PaidMedia'
import type { MessageMediaView } from '@/lib/paid-media'

const MAX_CACHED_MSGS = 60
const CHAT_ENABLED = process.env.NEXT_PUBLIC_CHAT_ENABLED !== 'false'

function readCache<T>(key: string): T | null {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') } catch { return null }
}
function writeCache(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export default function ChatPage() {
  const { m, locale } = useI18n()
  const searchParams = useSearchParams()
  const router = useRouter()
  const characterId = searchParams.get('character')

  const [character, setCharacter] = useState<Character | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [allPhotos, setPhotos] = useState<CharacterPhoto[]>([])
  const [showAlbum, setShowAlbum] = useState(false)
  const [lightboxPhotos, setLightboxPhotos] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const [imageLightboxUrl, setImageLightboxUrl] = useState<string | null>(null)
  const [sendingPhoto, setSendingPhoto] = useState(false)
  const [sendingVideo, setSendingVideo] = useState(false)
  const [pendingMedia, setPendingMedia] = useState<{ file: File; mediaType: 'photo' | 'video'; previewUrl: string } | null>(null)
  const [pointsShortage, setPointsShortage] = useState<{ current: number; required: number } | null>(null)
  // キャラが送った有料メディア（message_id → 解錠状態。未解錠は URL なし）
  const [media, setMedia] = useState<Record<string, MessageMediaView>>({})
  const { unlock, dialog: unlockDialog } = useMediaUnlock()
  // 写真ガチャ公開前は、管理者以外には持っている写真だけを見せる
  const gachaEnabled = canUseGacha((profile as { role?: string } | null)?.role)
  const photos = gachaEnabled ? allPhotos : allPhotos.filter(p => !p.locked && !p.paywalled && !p.levelLocked)
  const [subInfo, setSubInfo] = useState<{ plan: string | null; used: number; limit: number } | null>(null)
  const [levelUp, setLevelUp] = useState<{ level: number } | null>(null)
  const [intimacyHint, setIntimacyHint] = useState<IntimacyHint | null>(null)
  const [giftOpen, setGiftOpen] = useState(false)
  const [affection, setAffection] = useState<{ points: number; level: number; messageCount: number } | null>(null)

  const bottomRef = useRef<HTMLDivElement>(null)
  const editableRef = useRef<HTMLDivElement>(null)
  // file input は DOM に置かず動的生成（iOS AutoFill ツールバーを抑制するため）
  const openFilePicker = (accept: string, onFile: (f: File) => void) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.onchange = () => { const f = input.files?.[0]; if (f) onFile(f) }
    input.click()
  }
  const supabaseRef = useRef(createClient())
  const channelRef = useRef<ReturnType<typeof supabaseRef.current.channel> | null>(null)
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const convIdRef = useRef<string | null>(null)
  const initializedRef = useRef(false)
  const supabase = supabaseRef.current

  // 画面に表示中のキャラ発言を既読にする（連続受信はまとめて1回）
  const markReadTimerRef = useRef<NodeJS.Timeout | null>(null)
  const markRead = useCallback(() => {
    if (markReadTimerRef.current) clearTimeout(markReadTimerRef.current)
    markReadTimerRef.current = setTimeout(() => {
      const cid = convIdRef.current
      if (!cid || document.visibilityState !== 'visible') return
      fetch('/api/chat/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: cid }),
      }).then(notifyBadgesChanged).catch(() => {})
    }, 300)
  }, [])

  const addMessage = useCallback((msg: Message) => {
    if (msg.sender_role === 'character' && !msg.is_read) markRead()
    setMessages(prev => {
      if (prev.find(m => m.id === msg.id)) return prev
      const next = [...prev, msg]
      // Update cache with latest messages
      if (convIdRef.current) {
        writeCache(`msgs:${convIdRef.current}`, next.slice(-MAX_CACHED_MSGS))
      }
      return next
    })
  }, [markRead])

  const loadMedia = useCallback(async (cid: string) => {
    const res = await fetch(`/api/media/conversation?conversationId=${cid}`).catch(() => null)
    if (!res?.ok) return
    const data = await res.json().catch(() => null)
    if (data?.media && convIdRef.current === cid) setMedia(data.media)
  }, [])

  // メディア付きのキャラ発言が届いたら解錠状態を取りに行く（message_media は messages の直後に入るので少し待つ）
  const mediaRequestedRef = useRef<Set<string>>(new Set())
  useEffect(() => {
    const cid = conversationId
    if (!cid) return
    const missing = messages.filter(x => x.metadata?.media && !media[x.id] && !mediaRequestedRef.current.has(x.id))
    if (missing.length === 0) return
    missing.forEach(x => mediaRequestedRef.current.add(x.id))
    setTimeout(() => loadMedia(cid), 800)
  }, [messages, media, conversationId, loadMedia])

  const unlockMedia = async (messageId: string) => {
    const url = await unlock({ messageId })
    if (!url) return
    setMedia(prev => ({ ...prev, [messageId]: { ...prev[messageId], unlocked: true, url } }))
    // 同じ写真が他のメッセージにもあれば一緒に開く
    if (convIdRef.current) loadMedia(convIdRef.current)
  }

  // チャットを開いたことを記録（キャラ情報が揃った最初の1回）
  const loggedOpenRef = useRef(false)
  useEffect(() => {
    if (!character || loggedOpenRef.current) return
    loggedOpenRef.current = true
    logAction('chat_open', { metadata: { character_name: character.name } })
  }, [character])

  // 別タブ・バックグラウンドから戻ったときに既読化
  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === 'visible') markRead() }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      if (markReadTimerRef.current) clearTimeout(markReadTimerRef.current)
    }
  }, [markRead])

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true
    if (!characterId) { router.push('/characters'); return }
    loadData()
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current)
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
    }
  }, [characterId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const setupRealtimeAndPolling = useCallback((convId: string, _userId: string) => {
    // 30秒ごとにフォールバックポーリング（最新メッセージ以降のみ取得）
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
    pollIntervalRef.current = setInterval(async () => {
      const cid = convIdRef.current
      if (!cid) return
      setMessages(prev => {
        const lastCreatedAt = prev.length > 0 ? prev[prev.length - 1].created_at : new Date(0).toISOString()
        supabase
          .from('messages').select('*')
          .eq('conversation_id', cid)
          .gt('created_at', lastCreatedAt)
          .order('created_at', { ascending: true })
          .then(({ data }) => { if (data) data.forEach(m => addMessage(m)) })
        return prev
      })
    }, 30000)

    if (channelRef.current) supabase.removeChannel(channelRef.current)
    const channel = supabase.channel(`chat:${convId}`)

    channel.on('broadcast', { event: 'new_message' }, ({ payload }) => {
      const msg = payload.message as Message
      addMessage(msg)
      if (msg.sender_role === 'character') setIsTyping(false)
    })

    channel.on('broadcast', { event: 'typing' }, ({ payload }) => {
      const typing: boolean = payload?.isTyping ?? false
      setIsTyping(typing)
      if (typing) {
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
        typingTimerRef.current = setTimeout(() => setIsTyping(false), 10000)
      }
    })

    channel.on('postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'messages',
      filter: `conversation_id=eq.${convId}`,
    }, (payload) => {
      const msg = payload.new as Message
      addMessage(msg)
      if (msg.sender_role === 'character') setIsTyping(false)
    })

    channelRef.current = channel
    channel.subscribe()
  }, [supabase, addMessage])

  const loadData = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) { router.push('/auth/login'); return }
    const userId = session.user.id

    const charCache = readCache<Character>(`charData:${characterId}`)
    const cachedConvId = localStorage.getItem(`conv:${userId}:${characterId}`)

    if (charCache && cachedConvId) {
      // INSTANT: show cached UI immediately
      const cachedMsgs = readCache<Message[]>(`msgs:${cachedConvId}`) ?? []
      setCharacter(localizedCharacter(charCache, locale))
      setMessages(cachedMsgs)
      setConversationId(cachedConvId)
      convIdRef.current = cachedConvId
      setLoading(false)

      // Background refresh
      const [profRes, charRes, photosRes, msgsRes, ucRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('characters').select('*').eq('id', characterId).single(),
        fetch(`/api/characters/${characterId}/photos`).then(r => r.json()).then(j => ({ data: (j.photos ?? null) as CharacterPhoto[] | null })),
        supabase.from('messages').select('*').eq('conversation_id', cachedConvId).eq('is_deleted', false).order('created_at', { ascending: true }),
        supabase.from('user_characters').select('affection_points,affection_level,message_count').eq('user_id', userId).eq('character_id', characterId!).maybeSingle(),
      ])
      if (profRes.data) {
        setProfile(profRes.data)
        const p = profRes.data as any
        if (p.subscription_status === 'active' || p.subscription_status === 'trialing') {
          setSubInfo({ plan: p.subscription_plan, used: p.monthly_messages_used ?? 0, limit: p.monthly_messages_limit ?? 0 })
        }
      }
      if (charRes.data) {
        setCharacter(localizedCharacter(charRes.data, locale))
        writeCache(`charData:${characterId}`, charRes.data)
      }
      if (photosRes.data) setPhotos(photosRes.data)
      if (msgsRes.data) {
        setMessages(msgsRes.data)
        writeCache(`msgs:${cachedConvId}`, msgsRes.data.slice(-MAX_CACHED_MSGS))
      }
      if (ucRes.data) {
        const uc = ucRes.data as any
        setAffection({ points: uc.affection_points, level: uc.affection_level, messageCount: uc.message_count })
      }
      setupRealtimeAndPolling(cachedConvId, userId)
    } else {
      // 初回：start-conversationで会話を作成＆ウェルカムメッセージ
      const [profRes, charRes, photosRes, startRes, ucRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('characters').select('*').eq('id', characterId).single(),
        fetch(`/api/characters/${characterId}/photos`).then(r => r.json()).then(j => ({ data: (j.photos ?? null) as CharacterPhoto[] | null })),
        fetch('/api/chat/start-conversation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ characterId }),
        }),
        supabase.from('user_characters').select('affection_points,affection_level,message_count').eq('user_id', userId).eq('character_id', characterId!).maybeSingle(),
      ])
      if (profRes.data) {
        setProfile(profRes.data)
        const p = profRes.data as any
        if (p.subscription_status === 'active' || p.subscription_status === 'trialing') {
          setSubInfo({ plan: p.subscription_plan, used: p.monthly_messages_used ?? 0, limit: p.monthly_messages_limit ?? 0 })
        }
      }
      if (charRes.data) {
        setCharacter(localizedCharacter(charRes.data, locale))
        writeCache(`charData:${characterId}`, charRes.data)
      }
      setPhotos(photosRes.data || [])
      if ((ucRes as any).data) {
        const uc = (ucRes as any).data
        setAffection({ points: uc.affection_points, level: uc.affection_level, messageCount: uc.message_count })
      }

      if (!startRes.ok) { setLoading(false); return }
      const { conversationId: newConvId, welcomeMessage } = await startRes.json()
      localStorage.setItem(`conv:${userId}:${characterId}`, newConvId)

      const { data: msgs } = await supabase
        .from('messages').select('*')
        .eq('conversation_id', newConvId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true })

      const allMsgs = msgs || []
      if (welcomeMessage && !allMsgs.find((m: Message) => m.id === welcomeMessage.id)) {
        allMsgs.unshift(welcomeMessage)
      }
      setMessages(allMsgs)
      writeCache(`msgs:${newConvId}`, allMsgs.slice(-MAX_CACHED_MSGS))
      setConversationId(newConvId)
      convIdRef.current = newConvId
      setupRealtimeAndPolling(newConvId, userId)
      setLoading(false)
    }


    // user_characters を retroactively populate（カウント表示の正規化・fire-and-forget）
    if (characterId) {
      fetch('/api/chat/activate-character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterId }),
      }).catch(() => {})
    }

    // 開いた時点で既読化
    markRead()
  }

  const sendMessage = async () => {
    const rawContent = editableRef.current?.innerText ?? input
    if (!rawContent.trim() || sending || !conversationId || !profile || !character) return

    // 残高・サブスク判定はサーバー（send-message）側で行い、不足時は 402 で返る
    const SEND_COST = POINTS_PER_MESSAGE

    // 初回メッセージの場合はキャラクターを登録
    const isFirstUserMessage = !messages.some(m => m.sender_role === 'user')
    if (isFirstUserMessage) {
      fetch('/api/chat/activate-character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterId: character.id }),
      }).catch(() => {})
    }

    setSending(true)
    setIntimacyHint(null)
    const content = rawContent.trim()
    setInput('')
    if (editableRef.current) editableRef.current.innerText = ''

    // ポイント消費＋メッセージ保存をサーバー側で一括実行
    const sendRes = await fetch('/api/chat/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId, content }),
    })
    const sendData = await sendRes.json().catch(() => ({}))
    if (!sendRes.ok || !sendData.message) {
      if (sendRes.status === 402) {
        setPointsShortage({ current: sendData.current ?? 0, required: sendData.required ?? SEND_COST })
      }
      // 送信できなかったので入力内容を戻す
      setInput(content)
      if (editableRef.current) editableRef.current.innerText = content
      setSending(false)
      return
    }
    setProfile(prev => prev ? { ...prev, points: sendData.points, bonus_points: sendData.bonus_points } : prev)
    window.dispatchEvent(new CustomEvent('pointsUpdated', { detail: { points: sendData.points + sendData.bonus_points } }))
    // 今回の送信で残高が尽きた → AI返信を受け取った後に購入ダイアログを出す
    const showPurchaseAfterReply = sendData.canSendNext === false

    const msg: Message = sendData.message
    addMessage(msg)

    // 返信した → このキャラへの自動同報を即時キャンセル（fire-and-forget）
    fetch('/api/chat/cancel-broadcasts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ characterId: character.id }),
    }).catch(() => {})

    channelRef.current?.send({
      type: 'broadcast',
      event: 'new_message',
      payload: { message: msg },
    })

    setSending(false)

    // AI自動返信を非同期でリクエスト（ポイント消費は送信時に完了済み）
    await requestAiReply()
    if (showPurchaseAfterReply) {
      setPointsShortage({ current: sendData.points + sendData.bonus_points, required: SEND_COST })
    }
  }

  // キャラの返事を取得する（メッセージ送信後・プレゼント後の共通処理）
  const requestAiReply = async () => {
    if (!conversationId || !character) return
    setIsTyping(true)
    try {
      const res = await fetch('/api/chat/ai-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          characterId: character.id,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.message) addMessage(data.message)
        // 写真のお願いへの返事は、文章のあと少し置いて写真が届く
        for (const extra of (data.extraMessages ?? []) as Message[]) {
          await new Promise(r => setTimeout(r, 1200))
          addMessage(extra)
        }

        // 好感度はサーバー側（ai-reply）で加算済み
        const aff = data.affection
        if (aff) {
          setAffection({ points: aff.affection_points, level: aff.affection_level, messageCount: aff.message_count })
          if (aff.leveled_up) setLevelUp({ level: aff.affection_level })
        }
        // 好感度が足りずかわされた話題は、仲が深まれば解放されることを1日1回だけ案内する
        if (data.intimacyHint) {
          const key = `intimacy_hint_${character.id}_${new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' })}`
          let shown = false
          try { shown = !!localStorage.getItem(key); localStorage.setItem(key, '1') } catch {}
          if (!shown) setIntimacyHint(data.intimacyHint)
        }
      } else {
        console.error('[chat] AI返信エラー:', await res.text())
      }
    } catch (err) {
      console.error('[chat] AI返信ネットワークエラー:', err)
    } finally {
      setIsTyping(false)
    }
  }

  // キャラのおねだりから、その場で買って贈る（持っていれば持ち物から）
  const giftWish = async (itemId: string, itemName: string) => {
    if (!characterId) return
    const res = await fetch('/api/items/gift', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, characterId, buy: true }),
    })
    const data = await res.json().catch(() => ({}))
    if (res.status === 402) { setPointsShortage({ current: data.current, required: data.required }); return }
    if (!res.ok) { alert(data.error ?? m.common.error); return }
    if (typeof data.points === 'number') {
      window.dispatchEvent(new CustomEvent('pointsUpdated', { detail: { points: data.points } }))
    }
    await handleGifted({ ...data, itemName })
  }

  const handleGifted = async (r: GiftResult) => {
    setGiftOpen(false)
    addMessage(r.message as Message)
    if (r.affection) {
      setAffection({ points: r.affection.affection_points, level: r.affection.affection_level, messageCount: r.affection.message_count })
      if (r.affection.leveled_up) setLevelUp({ level: r.affection.affection_level })
    }
    await requestAiReply()
  }

  const handleEditableInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = (e.target as HTMLDivElement).innerText
    setInput(text)
  }

  const openAlbumLightbox = async (index: number) => {
    if (!character || !profile) return

    // 会員限定・未解錠のフォトはライトボックスに含めない
    const all = [character.avatar_url, ...photos.filter(p => !p.locked && !p.paywalled && !p.levelLocked).map(p => p.url)]
    setLightboxPhotos(all)
    setLightboxIndex(index)
    setShowAlbum(false)
  }

  const sendMedia = async (file: File, mediaType: 'photo' | 'video') => {
    if (!conversationId || !profile || !character) return
    if (mediaType === 'photo' && sendingPhoto) return
    if (mediaType === 'video' && sendingVideo) return

    if (mediaType === 'photo') setSendingPhoto(true)
    else setSendingVideo(true)

    const supabase = supabaseRef.current
    const folder = mediaType === 'video' ? 'user-videos' : 'user-photos'

    let uploadBlob: Blob = file
    let uploadContentType = file.type
    let uploadExt = file.name.split('.').pop() ?? (mediaType === 'video' ? 'mp4' : 'jpg')

    if (mediaType === 'photo') {
      const sourceFile = isHeic(file) ? new File([await heicToBlob(file)], file.name + '.jpg', { type: 'image/jpeg' }) : file
      const { blob } = await compressImage(sourceFile)
      uploadBlob = blob
      uploadContentType = 'image/webp'
      uploadExt = 'webp'
    }

    const path = `${folder}/${profile.id}/${Date.now()}.${uploadExt}`

    const { error: uploadError } = await supabase.storage.from('chat-images').upload(path, uploadBlob, { upsert: false, contentType: uploadContentType })
    if (uploadError) {
      alert(mediaType === 'video' ? m.chat.uploadVideoFailed : m.chat.uploadImageFailed)
      if (mediaType === 'photo') setSendingPhoto(false)
      else setSendingVideo(false)
      return
    }
    const { data: { publicUrl } } = supabase.storage.from('chat-images').getPublicUrl(path)

    // メッセージ保存・ポイント消費をサーバーサイドAPIで実行（service roleでmetadataを確実に保存）
    const res = await fetch('/api/chat/send-media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId, mediaUrl: publicUrl, mediaType }),
    })
    const data = await res.json()

    if (res.status === 402) {
      setPointsShortage({ current: data.current, required: data.required })
    } else if (res.ok && data.message) {
      const msg = data.message
      setMessages(prev => [...prev.slice(-MAX_CACHED_MSGS + 1), msg])
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
      if (data.newPoints !== undefined) {
        setProfile(prev => prev ? { ...prev, points: data.newPoints } : prev)
        window.dispatchEvent(new CustomEvent('pointsUpdated', { detail: { points: data.newPoints } }))
      }
      channelRef.current?.send({ type: 'broadcast', event: 'new_message', payload: { message: msg } })
    } else {
      alert(m.chat.sendFailed)
    }

    if (mediaType === 'photo') setSendingPhoto(false)
    else setSendingVideo(false)
  }

  const stageMedia = (file: File, mediaType: 'photo' | 'video') => {
    const previewUrl = URL.createObjectURL(file)
    setPendingMedia({ file, mediaType, previewUrl })
  }

  const cancelPendingMedia = () => {
    if (pendingMedia) URL.revokeObjectURL(pendingMedia.previewUrl)
    setPendingMedia(null)
  }

  const sendPendingOrText = async () => {
    if (pendingMedia) {
      const { file, mediaType, previewUrl } = pendingMedia
      setPendingMedia(null)
      URL.revokeObjectURL(previewUrl)
      await sendMedia(file, mediaType)
    } else {
      await sendMessage()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex gap-1.5">
          <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
        </div>
      </div>
    )
  }
  if (!character) return null

  const hasPhotos = photos.length > 0

  return (
    <div className="fixed flex flex-col" style={{ top: '52px', left: 0, right: 0, bottom: 0 }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ background: 'rgba(255, 255, 255, 0.94)', backdropFilter: 'saturate(180%) blur(16px)', borderBottom: '1px solid var(--color-border)' }}>
        <Link href="/characters" className="p-1 -ml-1 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
          <ChevronLeft size={22} />
        </Link>
        <Link href={`/characters/${character.id}`}>
          <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
            <Image src={character.avatar_url} alt={character.name} fill className="object-cover" sizes="36px" />
          </div>
        </Link>
        <div className="flex-1">
          <Link href={`/characters/${character.id}`}>
            <p className="text-[15px] font-semibold leading-tight hover:opacity-80 transition-opacity">{character.name}</p>
          </Link>
          {subInfo && subInfo.limit > 0 && (
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 1 }}>
              {fmt(m.chat.usage, { used: subInfo.used, limit: subInfo.limit })}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {hasPhotos && (
            <button
              onClick={() => setShowAlbum(true)}
              className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              <Images size={19} />
            </button>
          )}
          <CharacterActionMenu characterId={character.id} characterName={character.name} />
        </div>
      </div>

      {/* 友好度バー（ヘッダー直下に固定表示） */}
      {affection && (() => {
        const lvData = getAffectionLevel(affection.points)
        const progress = getAffectionProgress(affection.points)
        const nextLv = AFFECTION_LEVELS.find(l => l.level === lvData.level + 1)
        return (
          <div className="px-4 py-2 flex-shrink-0"
            style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
                <AffectionIcon level={lvData.level} size={13} style={{ color: lvData.color }} />
                {m.affection.levels[lvData.level - 1]}
                <span className="font-normal tabular-nums" style={{ color: 'var(--color-text-muted)' }}>Lv.{lvData.level}</span>
                {subInfo?.plan ? (
                  <span className="text-[10px] font-bold px-1.5 py-px rounded-md tabular-nums"
                    style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                    {fmt(m.affection.memberMultiplier, { n: PLANS[subInfo.plan as PlanId]?.affection_multiplier ?? 1 })}
                  </span>
                ) : (
                  <Link href="/payment" className="text-[10px] font-semibold" style={{ color: 'var(--color-primary)' }}>
                    {m.affection.memberDouble}
                  </Link>
                )}
              </span>
              <span className="text-[11px] tabular-nums" style={{ color: 'var(--color-text-muted)' }}>
                {nextLv ? fmt(m.affection.toNext, { title: m.affection.levels[nextLv.level - 1], pt: (nextLv.threshold - affection.points).toLocaleString() }) : `${affection.points.toLocaleString()}pt`}
              </span>
            </div>
            <div style={{ height: 3, borderRadius: 2, overflow: 'hidden', background: 'var(--color-surface-2)' }}>
              <div style={{
                height: '100%', borderRadius: 2,
                width: `${progress}%`,
                background: lvData.color,
                transition: 'width 0.8s ease',
              }} />
            </div>
          </div>
        )
      })()}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 animate-fade-in text-center">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[var(--color-border-warm)] mb-4">
              <Image src={character.avatar_url} alt={character.name} fill className="object-cover" sizes="80px" />
            </div>
            <p className="font-medium mb-1">{character.name}</p>
            <p className="text-[var(--color-text-muted)] text-sm">{m.chat.firstMessage}</p>
            <p className="text-xs mt-3 max-w-[260px] leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              {m.chat.affectionIntro}
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={msg.id} message={msg} characterName={character.name} characterAvatar={character.avatar_url} onImageClick={setImageLightboxUrl} media={media[msg.id]} onUnlock={unlockMedia}
            wishFulfilled={!!msg.metadata?.wish_item_id && messages.slice(i + 1).some(x => x.metadata?.item_id === msg.metadata?.wish_item_id)}
            onGiftWish={giftWish} />
        ))}
        {intimacyHint && !isTyping && (
          <IntimacyHintCard hint={intimacyHint} characterName={character.name} isMember={!!subInfo?.plan} />
        )}
        {isTyping && (
          <div className="flex items-end gap-2 animate-fade-in">
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[var(--color-border)] flex-shrink-0">
              <Image src={character.avatar_url} alt="" fill className="object-cover" sizes="28px" />
            </div>
            <div className="bubble-operator px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 py-3"
        style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)', paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }}>
        {CHAT_ENABLED ? (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-end">
              <button
                type="button"
                onClick={() => setGiftOpen(true)}
                disabled={sending}
                className="flex-shrink-0 flex items-center justify-center rounded-full transition-transform active:scale-90 disabled:opacity-40"
                style={{ width: 44, height: 44, background: 'linear-gradient(160deg, #fde68a, #f59e0b)', border: '2px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}
                aria-label={m.hud.gift}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/items/present.webp" alt="" style={{ width: 30, height: 30 }} />
              </button>
              <div className="flex-1 flex flex-col min-w-0">
                <div
                  ref={editableRef}
                  contentEditable={!pendingMedia}
                  suppressContentEditableWarning
                  onInput={handleEditableInput}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendPendingOrText() } }}
                  data-placeholder={pendingMedia ? m.chat.sendingMedia : m.chat.placeholder}
                  className="input-warm px-4 py-2.5 outline-none"
                  role="textbox"
                  style={{
                    minHeight: '42px', maxHeight: '120px', overflowY: 'auto',
                    lineHeight: '1.5', fontSize: '16px',
                    opacity: pendingMedia ? 0.6 : 1,
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  }}
                />
                {input.length > 200 && (
                  <p className="text-right text-[11px] mt-0.5 mr-1" style={{ color: input.length >= 300 ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                    {input.length}/300
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={sendPendingOrText}
                disabled={(!input.trim() && !pendingMedia) || input.length > 300 || sending}
                className="btn-primary flex-shrink-0 flex items-center justify-center disabled:opacity-40"
                style={{ width: 44, height: 44 }}
                aria-label={m.common.send}
              >
                <Send size={17} />
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl px-4 py-3 text-center"
            style={{ background: 'var(--color-primary-soft)', border: '1px solid var(--color-primary-border)' }}>
            <p className="text-sm font-bold mb-0.5">{m.chat.guestTitle}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{m.chat.guestBody}</p>
          </div>
        )}
      </div>

      {/* アルバムオーバーレイ */}
      {showAlbum && (
        <div className="fixed inset-0 z-40 flex flex-col" style={{ background: 'rgba(0,0,0,0.85)' }}>
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image src={character.avatar_url} alt="" fill className="object-cover" sizes="32px" />
              </div>
              <p className="text-white font-semibold text-sm">{fmt(m.chat.photosOf, { name: character.name })}</p>
            </div>
            <button onClick={() => setShowAlbum(false)} className="p-2 text-white/70 hover:text-white">
              <X size={22} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-6">
            <div className="grid grid-cols-3 gap-1.5">
              {/* アバターも含む */}
              <div
                className="relative overflow-hidden rounded-xl cursor-pointer"
                style={{ aspectRatio: '1' }}
                onClick={() => openAlbumLightbox(0)}
              >
                <Image src={character.avatar_url} alt="" fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="33vw" />
              </div>
              {photos.filter(p => !p.locked && !p.paywalled && !p.levelLocked).map((photo, i) => (
                <div
                  key={photo.id}
                  className="relative overflow-hidden rounded-xl cursor-pointer"
                  style={{ aspectRatio: '1' }}
                  onClick={() => openAlbumLightbox(i + 1)}
                >
                  <Image src={photo.url} alt="" fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="33vw" />
                </div>
              ))}
              {photos.filter(p => !p.locked && p.paywalled).map(photo => (
                <div key={photo.id} className="relative overflow-hidden rounded-xl" style={{ aspectRatio: '1' }}>
                  <Link href={`/gacha/${character.id}`} prefetch={false} className="absolute inset-0">
                    <UnownedPhotoCover previewSrc={`/api/media/preview?p=${photo.id}`} />
                  </Link>
                </div>
              ))}
              {photos.filter(p => !p.locked && p.levelLocked).map(photo => (
                <div key={photo.id} className="relative overflow-hidden rounded-xl" style={{ aspectRatio: '1' }}>
                  <LevelLockedCover previewSrc={`/api/media/preview?p=${photo.id}`} level={photo.required_level ?? 0} />
                </div>
              ))}
              {photos.filter(p => p.locked).map(photo => (
                <LockedPhotoTile key={photo.id} className="rounded-xl" />
              ))}
            </div>
            <GachaButton characterId={character.id} remaining={photos.filter(p => !p.locked && p.paywalled).length} />
          </div>
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          photos={lightboxPhotos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onChange={setLightboxIndex}
        />
      )}

      {/* チャット内画像タップのライトボックス */}
      {imageLightboxUrl && (
        <Lightbox
          photos={[imageLightboxUrl]}
          index={0}
          onClose={() => setImageLightboxUrl(null)}
          onChange={() => {}}
        />
      )}

      {/* アニメーション定義 */}
      <style>{`
        @keyframes promoFloatHeart {
          0%   { transform: translateY(0) scale(1) rotate(-10deg); opacity: 0.9; }
          100% { transform: translateY(-220px) scale(0.2) rotate(20deg); opacity: 0; }
        }
        @keyframes promoConfetti {
          0%   { transform: translateY(-10px) rotate(0deg) scaleX(1); opacity: 1; }
          80%  { opacity: 0.8; }
          100% { transform: translateY(110vh) rotate(800deg) scaleX(0.4); opacity: 0; }
        }
        @keyframes promoDialogIn {
          0%   { transform: scale(0.75) translateY(40px); opacity: 0; }
          65%  { transform: scale(1.05) translateY(-5px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes promoCracker {
          0%   { transform: scale(0) rotate(-25deg); opacity: 0; }
          55%  { transform: scale(1.25) rotate(8deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes promoShimmer {
          0%, 100% { opacity: 0.85; }
          50%       { opacity: 1; }
        }
      `}</style>

      {giftOpen && (
        <GiftSheet characterId={character.id} characterName={character.name} onClose={() => setGiftOpen(false)} onGifted={handleGifted} />
      )}

      {unlockDialog}

      {/* ポイント不足ダイアログ */}
      {pointsShortage && (
        <PointsShortageDialog
          currentPoints={pointsShortage.current}
          requiredPoints={pointsShortage.required}
          onClose={() => setPointsShortage(null)}
        />
      )}

      {/* レベルアップトースト */}
      {levelUp && character && (
        <LevelUpToast
          level={levelUp.level}
          characterName={character.name}
          onClose={() => setLevelUp(null)}
        />
      )}
    </div>
  )
}

function IntimacyHintCard({ hint, characterName, isMember }: { hint: IntimacyHint; characterName: string; isMember: boolean }) {
  const { m, locale } = useI18n()
  const levelText = fmt(m.chat.hintBodyLevel, { level: hint.level, title: m.affection.levels[hint.level - 1] })
  return (
    <div className="mx-auto w-full max-w-[320px] rounded-[var(--radius-card,12px)] px-4 py-3 text-center animate-fade-in"
      style={{ background: 'var(--color-primary-soft)', border: '1px solid var(--color-primary-border)' }}>
      <p className="flex items-center justify-center gap-1.5 text-xs font-bold mb-1" style={{ color: 'var(--color-primary)' }}>
        <AffectionIcon level={hint.level} size={13} />
        {fmt(m.chat.hintTitle, { name: characterName })}
      </p>
      <p className="text-[13px] leading-relaxed" style={{ color: 'var(--color-text)' }}>
        {m.chat.hintBodyA.trim()}{gap(locale, levelText)}<strong>{levelText}</strong>{gap(locale, m.chat.hintBodyB.trim())}{m.chat.hintBodyB.trim()}
      </p>
      <p className="text-[11px] mt-1.5" style={{ color: 'var(--color-text-muted)' }}>
        {m.chat.hintRaise}
        {!isMember && (
          <>　<Link href="/payment" className="font-semibold underline" style={{ color: 'var(--color-primary)' }}>{m.chat.hintMember}</Link></>
        )}
      </p>
    </div>
  )
}

function MessageBubble({ message, characterName, characterAvatar, onImageClick, media, onUnlock, wishFulfilled, onGiftWish }: {
  message: Message; characterName: string; characterAvatar: string
  onImageClick?: (url: string) => void
  /** キャラが送った有料メディアの解錠状態（未取得なら undefined） */
  media?: MessageMediaView
  onUnlock?: (messageId: string) => Promise<void>
  /** おねだりされたアイテムをもう贈ったか */
  wishFulfilled?: boolean
  onGiftWish?: (itemId: string, itemName: string) => Promise<void>
}) {
  const { m } = useI18n()
  const isUser = message.sender_role === 'user'
  const isItem = !!message.metadata?.item_id
  const paidKind = !isItem ? message.metadata?.media : undefined
  // ユーザーが送った写真・動画（URL は metadata にある）
  const hasBroadcastImage = !isItem && !!message.metadata?.image_url
  const hasVideo = !isItem && !!message.metadata?.video_url

  return (
    <div className={`flex items-end gap-2 animate-fade-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && (
        <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[var(--color-border)] flex-shrink-0 mb-4">
          <Image src={characterAvatar} alt={characterName} fill className="object-cover" sizes="28px" />
        </div>
      )}
      <div className={`max-w-[78%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        {isItem ? (
          <div className={`px-3 py-2.5 rounded-2xl flex items-center gap-2.5 ${isUser ? 'bubble-user' : 'bubble-operator'}`}>
            {message.metadata?.item_image_url ? (
              <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ background: 'rgba(255,255,255,0.92)' }}>
                <Image src={message.metadata.item_image_url} alt={message.metadata.item_name ?? ''} fill className="object-contain p-1" sizes="48px" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.2)' }}>
                <span style={{ fontSize: '20px' }}>🎁</span>
              </div>
            )}
            <div>
              <p className="text-[10px] opacity-70 mb-0.5">{m.chat.gift}</p>
              <p className="text-sm font-semibold">{message.metadata?.item_name}</p>
              <p className="text-[11px] opacity-70 mt-0.5">{m.chat.giftSent}</p>
            </div>
          </div>
        ) : paidKind ? (
          <div className="rounded-2xl overflow-hidden bubble-operator">
            {media?.unlocked && media.url ? (
              paidKind === 'video' ? (
                <video src={media.url} controls playsInline className="w-[240px] block" style={{ maxHeight: '320px' }} />
              ) : (
                <div className="relative w-[240px] cursor-pointer" style={{ aspectRatio: '4/3' }} onClick={() => onImageClick?.(media.url!)}>
                  <Image src={media.url} alt="" fill className="object-cover" sizes="240px" />
                </div>
              )
            ) : (
              <div className="relative w-[240px]" style={{ aspectRatio: '4/3', background: 'var(--color-surface-2)' }}>
                {media && (
                  <MosaicCover
                    previewSrc={paidKind === 'image' ? `/api/media/preview?m=${message.id}&w=6&h=5` : null}
                    kind={paidKind}
                    price={media.price}
                    onUnlock={() => onUnlock?.(message.id) ?? Promise.resolve()}
                  />
                )}
              </div>
            )}
            {message.content && (
              <p className="px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            )}
          </div>
        ) : hasVideo ? (
          <div className={`rounded-2xl overflow-hidden ${isUser ? 'bubble-user' : 'bubble-operator'}`} style={{ maxWidth: '240px' }}>
            <video
              src={message.metadata!.video_url!}
              controls
              playsInline
              className="w-full block rounded-2xl"
              style={{ maxHeight: '320px' }}
            />
          </div>
        ) : hasBroadcastImage ? (
          <div className={`rounded-2xl overflow-hidden ${isUser ? 'bubble-user' : 'bubble-operator'}`}>
            <div className="relative w-[240px] cursor-pointer" style={{ aspectRatio: '4/3' }} onClick={() => onImageClick?.(message.metadata!.image_url!)}>
              <Image src={message.metadata!.image_url!} alt="" fill className="object-cover" sizes="240px" />
            </div>
            {message.content && (
              <p className="px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            )}
          </div>
        ) : (
          <div className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${isUser ? 'bubble-user' : 'bubble-operator'}`}>
            {message.content}
          </div>
        )}
        {!isUser && message.metadata?.wish_item_id && (
          <WishCard
            name={message.metadata.wish_item_name ?? ''}
            imageUrl={message.metadata.wish_item_image_url ?? null}
            price={message.metadata.wish_item_price ?? 0}
            fulfilled={!!wishFulfilled}
            onGift={() => onGiftWish?.(message.metadata!.wish_item_id!, message.metadata!.wish_item_name ?? '') ?? Promise.resolve()}
          />
        )}
      </div>
    </div>
  )
}

/** キャラのおねだりアイテム。1タップで買って贈れる */
function WishCard({ name, imageUrl, price, fulfilled, onGift }: {
  name: string; imageUrl: string | null; price: number; fulfilled: boolean
  onGift: () => Promise<void>
}) {
  const { m } = useI18n()
  const [busy, setBusy] = useState(false)
  return (
    <div className="flex items-center gap-2.5 pl-2 pr-2.5 py-2 mt-0.5"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-primary-border)', borderRadius: 'var(--radius-card)' }}>
      <div className="relative w-11 h-11 rounded-lg flex-shrink-0" style={{ background: 'var(--color-primary-soft)' }}>
        {imageUrl && <Image src={imageUrl} alt="" fill className="object-contain p-1" sizes="44px" />}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold" style={{ color: 'var(--color-primary)' }}>{m.chat.wishLabel}</p>
        <p className="text-sm font-semibold truncate">{name}</p>
      </div>
      {fulfilled ? (
        <span className="ml-1 text-[11px] font-bold flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>{m.chat.wishDone}</span>
      ) : (
        <button type="button" disabled={busy}
          onClick={async () => { setBusy(true); try { await onGift() } finally { setBusy(false) } }}
          className="ml-1 flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold text-white disabled:opacity-60"
          style={{ background: 'var(--color-primary)' }}>
          {busy ? m.chat.processing : fmt(m.chat.wishGive, { pt: price })}
        </button>
      )}
    </div>
  )
}
