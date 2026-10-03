export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { createAdminClientStatic } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { unstable_cache } from 'next/cache'
import Link from 'next/link'
import { AvatarImage } from '@/components/AvatarImage'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { ActionLogger } from '@/components/ActionLogger'
import { SortToggleButton } from './SortToggleButton'
import { CampaignBannerImage } from '@/components/CampaignBannerImage'
import { INTERNAL_EMAILS } from '@/lib/internal-accounts'

// ブロック中のキャラIDを30秒キャッシュ（unstable_cacheはSetを保持できないので配列で返す）
const getCachedBlockedIds = unstable_cache(
  async (userId: string) => {
    const admin = createAdminClientStatic()
    const { data } = await admin.from('blocks').select('character_id').eq('user_id', userId)
    return (data ?? []).map((b: any) => b.character_id as string)
  },
  ['blocked-char-ids'],
  { revalidate: 30 }
)

async function ConversationList({ userId, sort }: { userId: string; sort: 'asc' | 'desc' }) {
  const admin = createAdminClientStatic()
  const cutoff = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()

  const [{ data: convsRaw }, blockedCharIds] = await Promise.all([
    admin.from('conversations')
      .select('id, last_message_at, characters(id, name, avatar_url)')
      .eq('user_id', userId)
      .not('character_id', 'is', null)
      .not('last_message_at', 'is', null)
      .gte('last_message_at', cutoff)
      .order('last_message_at', { ascending: sort === 'asc' }),
    getCachedBlockedIds(userId),
  ])

  const blockedSet = new Set(blockedCharIds)
  const convs = (convsRaw ?? []).filter((c: any) => !blockedSet.has(c.characters?.id))
  const convIds = convs.map((c: any) => c.id)

  if (convIds.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="text-[var(--color-text-muted)] text-sm mb-4">まだ会話がありません</p>
        <Link href="/characters" className="btn-primary px-5 py-2.5 text-sm inline-block">
          話し相手を探す
        </Link>
      </div>
    )
  }

  const { data: lastMessages } = await admin.from('messages')
    .select('conversation_id, content, sender_role, created_at, is_read, metadata')
    .in('conversation_id', convIds)
    .order('created_at', { ascending: false })
    .limit(Math.max(convIds.length * 30, 100))

  const lastMsgMap = new Map<string, { content: string; sender_role: string; metadata: any }>()
  const unreadMap = new Map<string, number>()
  ;(lastMessages ?? []).forEach((msg: any) => {
    if (!lastMsgMap.has(msg.conversation_id)) {
      lastMsgMap.set(msg.conversation_id, { content: msg.content, sender_role: msg.sender_role, metadata: msg.metadata })
    }
    if (msg.sender_role === 'character' && !msg.is_read) {
      unreadMap.set(msg.conversation_id, (unreadMap.get(msg.conversation_id) ?? 0) + 1)
    }
  })

  return (
    <div className="space-y-2">
      {convs.map((conv: any) => {
        const lastMsg = lastMsgMap.get(conv.id)
        const unread = unreadMap.get(conv.id) ?? 0

        return (
          <Link
            key={conv.id}
            href={`/chat?character=${conv.characters?.id}`}
            className="block"
          >
            <div
              className="flex items-center gap-3 p-4 rounded-2xl transition-all duration-200"
              style={unread > 0 ? {
                background: 'linear-gradient(135deg, rgba(253,236,246,0.9) 0%, rgba(253,246,249,0.8) 100%)',
                border: '1.5px solid rgba(233,76,139,0.35)',
                boxShadow: '0 4px 20px rgba(232,67,143,0.1)',
              } : {
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div className="relative flex-shrink-0">
                <div
                  className="rounded-full overflow-hidden"
                  style={{
                    width: '60px', height: '60px',
                    border: unread > 0 ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border-warm)',
                    boxShadow: unread > 0 ? '0 0 16px var(--color-primary-glow)' : 'none',
                  }}
                >
                  <AvatarImage src={conv.characters?.avatar_url} alt={conv.characters?.name ?? ''} iconSize={28} />
                </div>
                {unread > 0 && (
                  <span
                    className="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full flex items-center justify-center text-[11px] text-white font-bold px-1"
                    style={{ background: 'var(--color-primary)', boxShadow: '0 1px 6px rgba(232,121,160,0.5)' }}
                  >
                    {unread > 99 ? '99+' : unread}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-semibold">{conv.characters?.name}</span>
                  <span className="text-[11px] flex-shrink-0 ml-2"
                    style={{ color: unread > 0 ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                    {formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: true, locale: ja })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {unread > 0 && (
                    <span
                      className="flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: 'var(--color-primary)', color: '#fff' }}
                    >
                      新着
                    </span>
                  )}
                  {lastMsg && (
                    <p className="text-xs truncate"
                      style={{ color: unread > 0 ? 'var(--color-text)' : 'var(--color-text-muted)', fontWeight: unread > 0 ? 500 : 400 }}>
                      {lastMsg.sender_role === 'character' ? '' : 'あなた: '}
                      {lastMsg.content?.trim()
                        ? lastMsg.content
                        : lastMsg.metadata?.video_url
                          ? '動画が送信されました'
                          : lastMsg.metadata?.image_url
                            ? '画像が送信されました'
                            : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

function ConversationListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="skeleton rounded-full flex-shrink-0" style={{ width: 52, height: 52 }} />
          <div className="flex-1 space-y-2">
            <div className="skeleton rounded" style={{ height: 14, width: '55%' }} />
            <div className="skeleton rounded" style={{ height: 12, width: '80%' }} />
          </div>
          <div className="skeleton rounded flex-shrink-0" style={{ width: 36, height: 12 }} />
        </div>
      ))}
      <style>{`.skeleton{background:linear-gradient(90deg,var(--color-surface-2) 25%,var(--color-border) 50%,var(--color-surface-2) 75%);background-size:200% 100%;animation:sk 1.2s infinite}@keyframes sk{to{background-position:-200% 0}}`}</style>
    </div>
  )
}

export default async function ConversationsPage({ searchParams }: { searchParams: { sort?: string } }) {
  const user = await getAuthUser()
  if (!user) return null

  const sort = searchParams.sort === 'asc' ? 'asc' : 'desc'

  return (
    <div>
      <div className="flex items-center justify-between mb-6 pt-2">
        <h1 className="text-xl font-bold">メッセージ</h1>
        <div className="flex items-center gap-3">
          <SortToggleButton currentSort={sort} />
          <Link href="/characters" style={{ color: 'var(--color-primary)', fontSize: 20, lineHeight: 1 }} aria-label="新しく話す">
            ♡
          </Link>
        </div>
      </div>
      {!INTERNAL_EMAILS.includes(user.email as any) && (
        <Suspense fallback={<div className="mb-6" style={{ height: 0 }} />}>
          <CampaignBannerImage className="mb-6" userId={user.id} />
        </Suspense>
      )}
      <Suspense fallback={<ConversationListSkeleton />}>
        <ConversationList userId={user.id} sort={sort} />
      </Suspense>
      <ActionLogger actionType="conversations_view" />
    </div>
  )
}
