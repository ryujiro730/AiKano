/** 翻訳文の {name} を差し込む */
export function fmt(template: string, vars: Record<string, string | number> = {}) {
  return template.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`))
}

/** 文を分割して強調表示するときの区切り。日本語は空白なし、他言語は空白（句読点の前は除く） */
export function gap(locale: string, next: string) {
  return locale === 'ja' || /^[\s.,!?;:)\]』」、。？！»”’]/.test(next) ? '' : ' '
}
