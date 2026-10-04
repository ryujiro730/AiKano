import { AFFECTION_LEVELS } from './affection'

// 好感度が低いうちはキャラがかわす、甘い・きわどい話題（llm-service の INTIMACY_BY_STAGE と対応）
const INTIMATE_RE = /エッチ|えっち|エロ|えろ|セックス|せっくす|sex|下着|パンツ|ぱんつ|ブラジャー|おっぱい|乳首|胸揉|胸を触|裸|脱いで|脱がせ|キス|きす|ちゅー|チュー|抱きたい|抱いて|抱かせ|触りたい|触らせ|舐め|なめたい|しゃぶ|挿れ|入れたい|イかせ|いかせて|オナ|勃起|ちんこ|ちんぽ|まんこ|お尻|ヤらせ|やらせて|ヤりたい|夜の相手|ベッドで/i

/** きわどい発言をかわされうる段階なら、それが解放されるレベルを返す（Lv5で甘い会話、Lv6でキス以上） */
export function intimacyUnlockFor(message: string, level: number) {
  if (level >= 6 || !INTIMATE_RE.test(message)) return null
  const unlock = AFFECTION_LEVELS.find(l => l.level === (level < 5 ? 5 : 6))!
  return { level: unlock.level, title: unlock.title }
}

export type IntimacyHint = NonNullable<ReturnType<typeof intimacyUnlockFor>>
