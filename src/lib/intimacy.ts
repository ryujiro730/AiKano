import { AFFECTION_LEVELS } from './affection'

// 好感度が低いうちはキャラがかわす、甘い・きわどい話題（llm-service の INTIMACY_BY_STAGE と対応）
const INTIMATE_RE = /エッチ|えっち|エロ|えろ|セックス|せっくす|sex|下着|パンツ|ぱんつ|ブラジャー|おっぱい|乳首|胸揉|胸を触|裸|脱いで|脱がせ|キス|きす|ちゅー|チュー|抱きたい|抱いて|抱かせ|触りたい|触らせ|舐め|なめたい|しゃぶ|挿れ|入れたい|イかせ|いかせて|オナ|勃起|ちんこ|ちんぽ|まんこ|お尻|ヤらせ|やらせて|ヤりたい|夜の相手|ベッドで/i
// 英・西・葡・独・仏（ラテン文字の語は単語の区切りで判定して誤反応を防ぐ）
const INTIMATE_LATIN_RE = /\b(sex|sexy|sexo|sexe|fuck|horny|naked|nude|boobs?|tits?|pussy|dick|cock|blowjob|cum|lingerie|panties|underwear|bra|kiss(es|ing)?|make out|desnud[oa]s?|tetas|besar(te)?|beso|follar|coger|nu[ae]s?|peitos|beij(o|ar)|transar|foder|nackt|titten|kuss|küssen|ficken|geil|seins|bisous?|embrasser|baiser|coquine?)\b/i

/** きわどい発言をかわされうる段階なら、それが解放されるレベルを返す（Lv5で甘い会話、Lv6でキス以上） */
export function intimacyUnlockFor(message: string, level: number) {
  if (level >= 6 || !(INTIMATE_RE.test(message) || INTIMATE_LATIN_RE.test(message))) return null
  const unlock = AFFECTION_LEVELS.find(l => l.level === (level < 5 ? 5 : 6))!
  return { level: unlock.level, title: unlock.title }
}

export type IntimacyHint = NonNullable<ReturnType<typeof intimacyUnlockFor>>
