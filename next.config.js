/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['next-mdx-remote'],
    outputFileTracingIncludes: {
      '/blog/[slug]': ['./node_modules/next-mdx-remote/**/*'],
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
    ],
    dangerouslyAllowSVG: true,
    // 縮小した画像をブラウザに7日持たせる（既定の60秒だと1分ごとに取り直していた）。管理画面のアップロードは毎回別のファイル名。item-photos のように同じパスへ上書きしたときは最大7日古いものが出る
    minimumCacheTTL: 604800,
  },
  trailingSlash: false,
  async redirects() {
    return [
      // 末尾スラッシュを正規URLにリダイレクト
      { source: '/:path+/', destination: '/:path+', permanent: true },
      // ブラウザのi18n自動リクエスト対策
      { source: '/ja', destination: '/', permanent: false },
      { source: '/ja/:path*', destination: '/:path*', permanent: false },
    ]
  },
}

module.exports = nextConfig
