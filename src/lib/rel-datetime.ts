export const REL_PATTERN = /^__rel:([^_]+)__$/

/**
 * '-30m', '-1h', '-3d', '+1d' などの相対時間指定を現在時刻から解決する
 */
export function resolveRelSpec(spec: string, isDateOnly = false): string {
  const now = new Date()
  const match = spec.match(/^([+-])(\d+)([mhd])$/)
  if (!match) return ''
  const [, sign, n, unit] = match
  const ms =
    parseInt(n) * (unit === 'm' ? 60_000 : unit === 'h' ? 3_600_000 : 86_400_000)
  const d = new Date(now.getTime() + (sign === '+' ? ms : -ms))
  const p = (x: number) => String(x).padStart(2, '0')
  if (isDateOnly) {
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
  }
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}
