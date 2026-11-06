/** モザイク用極小画像の種類（p: アルバム写真 / m: チャットの画像 / v: 動画のサムネイル） */
export type PreviewKind = 'p' | 'm' | 'v'

/** 表示に使う src。保存済み（data URI）ならそれをそのまま、無ければ作って返す API（lib/media-preview.ts） */
export function previewSrc(kind: PreviewKind, id: string, preview?: string | null) {
  return preview || `/api/media/preview?${kind}=${id}`
}
