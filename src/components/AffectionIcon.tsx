import { User, Sprout, Smile, Heart, HeartHandshake, Sparkles, type LucideProps } from 'lucide-react'

// 好感度レベルごとのアイコン（絵文字の代わり）
const ICONS = [User, Sprout, Smile, Heart, HeartHandshake, Heart, Sparkles]

export function AffectionIcon({ level, ...props }: { level: number } & LucideProps) {
  const Icon = ICONS[Math.min(Math.max(level, 1), ICONS.length) - 1]
  // Lv.6「恋人」は塗りつぶしハートで Lv.4 と区別
  const fill = level === 6 ? 'currentColor' : 'none'
  return <Icon strokeWidth={2} fill={fill} {...props} />
}
