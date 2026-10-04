export type LegalItem = string | { label: string; text: string }

export type LegalSection = {
  title: string
  preamble?: string
  items?: LegalItem[]
  /** 箇条書き（番号なし）で表示する */
  bullet?: boolean
  /** 見出し付きの小リスト */
  groups?: { heading: string; items: LegalItem[] }[]
  /** 強調表示する補足 */
  note?: string
  suffix?: string
  contact?: string[]
}

export type LegalDoc = {
  title: string
  updated: string
  sections: LegalSection[]
  footer: string
}
