import type { SupabaseClient } from '@supabase/supabase-js'
import { getActivePlan } from './plans'

// 「写真・自撮り」などの語と「送って・見せて」などの依頼がそろったときだけ写真のお願いとみなす
const JA_NOUN = /写真|画像|自撮り|じどり|自撮|写メ|しゃめ|セルフィー|顔写真|ピクチャ/
const JA_ASK = /送って|おくって|見せて|みせて|見たい|みたい|ちょうだい|頂戴|ください|下さい|ほしい|欲しい|くれ|撮って|頼む|お願い|おねがい/
const JA_FACE = /顔(が|を)?(見せて|みせて|見たい|みたい)|姿(を)?(見せて|みせて|見たい)/
const LATIN_NOUN = /\b(nudes|pics?|photos?|pictures?|selfies?|snaps?|images?|fotos?|imagen(es)?|foto|bild(er)?|selfie)\b/i
const LATIN_ASK = /\b(send|show|share|see|want|wanna|give|got|have|can i|could you|mand[ae]|mándame|envía|envia|enviar|manda|quero|quiero|ver|zeig|schick|schicken|sehen|montre|envoie|voir)\b/i

export function isPhotoRequest(text: string) {
  return (JA_NOUN.test(text) && JA_ASK.test(text)) || JA_FACE.test(text) || (LATIN_NOUN.test(text) && LATIN_ASK.test(text))
}

/**
 * キャラが送る写真を1枚選ぶ。アイコン写真＋フォト（会員限定は会員のみ・レベル限定は達した人のみ）から、
 * この会話でまだ送っていないものを優先する。free: アイコンと到達済みのレベル限定フォトは無料で見せる。
 */
export async function pickCharacterPhoto(db: SupabaseClient, characterId: string, userId: string, conversationId: string, avatarUrl: string | null) {
  const [{ data: photos }, { data: profile }, { data: sent }, { data: uc }] = await Promise.all([
    db.from('character_photos').select('url, members_only, required_level').eq('character_id', characterId),
    db.from('profiles').select('subscription_status, subscription_plan, subscription_period_end, role').eq('id', userId).single(),
    db.from('message_media').select('url, messages!inner(conversation_id)').eq('messages.conversation_id', conversationId).limit(500),
    db.from('user_characters').select('affection_level').eq('user_id', userId).eq('character_id', characterId).maybeSingle(),
  ])
  const canSeeMembers = !!getActivePlan(profile) || profile?.role === 'admin'
  const level: number = uc?.affection_level ?? 1
  const candidates: { url: string; free: boolean }[] = [
    ...(avatarUrl ? [{ url: avatarUrl, free: true }] : []),
    ...(photos ?? [])
      .filter(p => (canSeeMembers || !p.members_only) && (!p.required_level || level >= p.required_level))
      .map(p => ({ url: p.url as string, free: !!p.required_level })),
  ]
  if (candidates.length === 0) return null
  const sentUrls = new Set((sent ?? []).map(r => r.url as string))
  const fresh = candidates.filter(c => !sentUrls.has(c.url))
  const pool = fresh.length > 0 ? fresh : candidates
  return pool[Math.floor(Math.random() * pool.length)]
}
