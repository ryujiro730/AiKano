'use client'

import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from 'recharts'
import { useI18n } from '@/i18n/client'

export interface CharacterStats {
  kindness:     number  // 優しさ  1-5
  intelligence: number  // 知性    1-5
  passion:      number  // 情熱    1-5
  mysterious:   number  // 謎めき  1-5
  cuteness:     number  // 可愛さ  1-5
}

const DEFAULT_STATS: CharacterStats = {
  kindness: 3, intelligence: 3, passion: 3, mysterious: 3, cuteness: 3,
}

export function SpiderChart({
  stats = DEFAULT_STATS,
  color = '#E94C8B',
  size = 200,
}: {
  stats?: Partial<CharacterStats> | null
  color?: string
  size?: number
}) {
  const { m } = useI18n()
  const s: CharacterStats = { ...DEFAULT_STATS, ...(stats ?? {}) }
  const data = [
    { subject: m.traits.kindness,   value: Math.round(s.kindness     * 20) },
    { subject: m.traits.intelligence,     value: Math.round(s.intelligence * 20) },
    { subject: m.traits.passion,     value: Math.round(s.passion      * 20) },
    { subject: m.traits.mysterious,   value: Math.round(s.mysterious   * 20) },
    { subject: m.traits.cuteness,   value: Math.round(s.cuteness     * 20) },
  ]

  return (
    <ResponsiveContainer width="100%" height={size}>
      <RadarChart data={data} margin={{ top: 12, right: 32, bottom: 12, left: 32 }}>
        <PolarGrid stroke="rgba(232,67,143,0.18)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 11, fill: 'var(--color-text-muted)', fontFamily: 'Noto Sans JP, sans-serif' }}
        />
        <Radar
          name="stats"
          dataKey="value"
          stroke={color}
          fill={color}
          fillOpacity={0.22}
          strokeWidth={2}
          dot={{ r: 3, fill: color } as any}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
