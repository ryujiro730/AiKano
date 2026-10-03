export const AFFECTION_LEVELS = [
  { level: 1, title: '見知らぬ人',  emoji: '👤', threshold: 0,    next: 50,   color: '#9ca3af' },
  { level: 2, title: '知り合い',    emoji: '🌱', threshold: 50,   next: 200,  color: '#86efac' },
  { level: 3, title: '友達',        emoji: '😊', threshold: 200,  next: 500,  color: '#67e8f9' },
  { level: 4, title: '仲良し',      emoji: '💕', threshold: 500,  next: 1000, color: '#f9a8d4' },
  { level: 5, title: '恋人候補',    emoji: '💝', threshold: 1000, next: 2500, color: '#f472b6' },
  { level: 6, title: '恋人',        emoji: '❤️', threshold: 2500, next: 5000, color: '#e8438f' },
  { level: 7, title: '運命の人',    emoji: '💫', threshold: 5000, next: null,  color: '#f59e0b' },
] as const

export type AffectionLevelData = {
  level: number
  title: string
  emoji: string
  threshold: number
  next: number | null
  color: string
}

export function getAffectionLevel(points: number): AffectionLevelData {
  let result: AffectionLevelData = AFFECTION_LEVELS[0]
  for (const l of AFFECTION_LEVELS) {
    if (points >= l.threshold) result = l
  }
  return result
}

export function getAffectionProgress(points: number): number {
  const current = getAffectionLevel(points)
  if (!current.next) return 100
  const from = current.threshold
  const to = current.next
  return Math.min(100, Math.round(((points - from) / (to - from)) * 100))
}

export const ACHIEVEMENTS: Record<string, { title: string; desc: string; emoji: string }> = {
  messages_1:   { title: '初めてのメッセージ', desc: '初めてメッセージを送った',    emoji: '💬' },
  messages_10:  { title: 'おしゃべり好き',     desc: '10通のメッセージを送った',    emoji: '🗣️' },
  messages_50:  { title: '話し込む人',          desc: '50通のメッセージを送った',   emoji: '📱' },
  messages_100: { title: '常連さん',            desc: '100通のメッセージを送った',  emoji: '🌟' },
  messages_300: { title: '大の仲良し',          desc: '300通のメッセージを送った',  emoji: '🏆' },
  level_2:      { title: '知り合いになった',    desc: '好感度が「知り合い」に達した', emoji: '🌱' },
  level_3:      { title: '友達になった',        desc: '好感度が「友達」に達した',    emoji: '😊' },
  level_4:      { title: '仲良しになった',      desc: '好感度が「仲良し」に達した',  emoji: '💕' },
  level_5:      { title: '恋人候補になった',    desc: '好感度が「恋人候補」に達した', emoji: '💝' },
  level_6:      { title: '恋人になった',        desc: '好感度が「恋人」に達した',    emoji: '❤️' },
  level_7:      { title: '運命の出会い',        desc: '好感度が「運命の人」に達した', emoji: '💫' },
}
