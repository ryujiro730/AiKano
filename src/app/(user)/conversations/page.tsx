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
import { CrossPromoBanner } from '@/components/CrossPromoBanner'
import { SortToggleButton } from './SortToggleButton'
import { CampaignBannerImage } from '@/components/CampaignBannerImage'
import { INTERNAL_EMAILS } from '@/lib/internal-accounts'
import { RefreshOnMount } from '@/components/RefreshOnMount'
import { UserPlus } from 'lucide-react'

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

  // 未読数はフッターのバッジと同じ DB 関数で算出
  const [{ data: lastMessages }, { data: unreadRows }] = await Promise.all([
    admin.from('messages')
      .select('conversation_id, content, sender_role, created_at, metadata')
      .in('conversation_id', convIds)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .limit(Math.max(convIds.length * 30, 100)),
    admin.rpc('get_conversation_unread', { p_user_id: userId }),
  ])

  const lastMsgMap = new Map<string, { content: string; sender_role: string; metadata: any }>()
  ;(lastMessages ?? []).forEach((msg: any) => {
    if (!lastMsgMap.has(msg.conversation_id)) {
      lastMsgMap.set(msg.conversation_id, { content: msg.content, sender_role: msg.sender_role, metadata: msg.metadata })
    }
  })
  const unreadMap = new Map<string, number>(
    ((unreadRows ?? []) as { conversation_id: string; unread: number }[]).map(r => [r.conversation_id, r.unread]),
  )

  return (
    <div className="overflow-hidden" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)' }}>
      {convs.map((conv: any, i: number) => {
        const lastMsg = lastMsgMap.get(conv.id)
        const unread = unreadMap.get(conv.id) ?? 0
        const preview = lastMsg?.content?.trim()
          ? lastMsg.content
          : lastMsg?.metadata?.video_url
            ? '動画が送信されました'
            : lastMsg?.metadata?.image_url
              ? '画像が送信されました'
              : ''

        return (
          <Link
            key={conv.id}
            href={`/chat?character=${conv.characters?.id}`}
            className="flex items-center gap-3 px-4 py-3.5 transition-colors active:bg-[var(--color-surface-2)]"
            style={i > 0 ? { borderTop: '1px solid var(--color-border)' } : undefined}
          >
            <div className="rounded-full overflow-hidden flex-shrink-0" style={{ width: 52, height: 52 }}>
              <AvatarImage src={conv.characters?.avatar_url} alt={conv.characters?.name ?? ''} iconSize={24} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span className={`text-[15px] truncate ${unread > 0 ? 'font-bold' : 'font-semibold'}`}>{conv.characters?.name}</span>
                <span className="text-[11px] flex-shrink-0"
                  style={{ color: unread > 0 ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: unread > 0 ? 600 : 400 }}>
                  {formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: true, locale: ja })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <p className="flex-1 text-[13px] truncate"
                  style={{ color: unread > 0 ? 'var(--color-text)' : 'var(--color-text-muted)', fontWeight: unread > 0 ? 500 : 400 }}>
                  {lastMsg && lastMsg.sender_role !== 'character' ? 'あなた: ' : ''}{preview}
                </p>
                {unread > 0 && (
                  <span
                    className="flex-shrink-0 min-w-[20px] h-5 rounded-[6px] flex items-center justify-center text-[11px] text-white font-bold px-1.5 tabular-nums"
                    style={{ background: 'var(--color-primary)' }}
                  >
                    {unread > 99 ? '99+' : unread}
                  </span>
                )}
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
        <div key={i} className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
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
        <h1 className="text-[22px] font-bold">メッセージ</h1>
        <div className="flex items-center gap-3">
          <SortToggleButton currentSort={sort} />
          <Link href="/characters" className="flex items-center justify-center w-9 h-9 rounded-[10px]"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
            aria-label="新しく話す">
            <UserPlus size={17} strokeWidth={2} />
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
      <CrossPromoBanner placement="conversations" className="mt-8" />
      <ActionLogger actionType="conversations_view" />
      {/* ルーターキャッシュで既読前の未読数が残らないよう毎回最新化 */}
      <RefreshOnMount />
    </div>
  )
}
