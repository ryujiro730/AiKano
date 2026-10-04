/** ブログ（SEO）からアイカノへのCTAリンク。utm_content には設置位置を必ず入れる */
export function blogCtaHref(path: string, content: string, slug?: string | null) {
  const p = new URLSearchParams({
    utm_source: 'blog',
    utm_medium: 'seo',
    utm_campaign: slug || 'blog',
    utm_content: content,
    ref: 'blog',
  })
  if (slug) p.set('article', slug)
  return `${path}?${p.toString()}`
}

export function blogSlugFromPath(pathname: string | null) {
  return pathname?.match(/^\/blog\/([^/?#]+)/)?.[1] ?? null
}
