import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { resolveVariables } from './message-variables'
import { getOrCreateConversation } from './conversations'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AdminSupabase = SupabaseClient<any, any, any>

export interface BroadcastFilters {
  excludeWithConv: boolean
  registeredFrom?: string | null
  registeredTo?: string | null
  chargedMin?: number | null
  chargedMax?: number | null
  gender?: string | null
  ageMin?: number | null
  ageMax?: number | null
}

function buildUserQuery(adminClient: AdminSupabase, filters: BroadcastFilters) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = adminClient.from('admin_users_view').select('id, display_name, age, gender')
  if (filters.registeredFrom) query = query.gte('created_at', filters.registeredFrom)
  if (filters.registeredTo) {
    const to = new Date(filters.registeredTo)
    to.setDate(to.getDate() + 1)
    query = query.lt('created_at', to.toISOString().split('T')[0])
  }
  if (filters.chargedMin != null) query = query.gte('total_charged', filters.chargedMin)
  if (filters.chargedMax != null) query = query.lte('total_charged', filters.chargedMax)
  if (filters.gender)             query = query.eq('gender', filters.gender)
  if (filters.ageMin != null)     query = query.gte('age', filters.ageMin)
  if (filters.ageMax != null)     query = query.lte('age', filters.ageMax)
  return query
}

export interface TargetUser {
  id: string
  display_name?: string | null
  age?: number | null
  gender?: string | null
}

export async function getTargetUsers(
  adminClient: AdminSupabase,
  characterId: string,
  filters: BroadcastFilters
): Promise<TargetUser[]> {
  // PostgREST は1リクエスト最大1000件なので、ページングして全員取得する
  const PAGE = 1000
  let targetUsers: TargetUser[] = []
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await buildUserQuery(adminClient, filters).order('id').range(from, from + PAGE - 1)
    if (error) { console.error('getTargetUsers:', error.message); return [] }
    targetUsers = targetUsers.concat(data ?? [])
    if (!data || data.length < PAGE) break
  }

  if (filters.excludeWithConv && targetUsers.length > 0) {
    // 既に会話があるユーザーを除外（IDを200件ずつに分けて問い合わせ、URL長の上限を避ける）
    const existingSet = new Set<string>()
    const ids = targetUsers.map(u => u.id)
    for (let i = 0; i < ids.length; i += 200) {
      const { data: existingConvs } = await adminClient
        .from('conversations').select('user_id')
        .eq('character_id', characterId).in('user_id', ids.slice(i, i + 200))
      for (const c of existingConvs ?? []) existingSet.add((c as { user_id: string }).user_id)
    }
    targetUsers = targetUsers.filter(u => !existingSet.has(u.id))
  }

  return targetUsers
}

export async function getTargetUserIds(
  adminClient: AdminSupabase,
  characterId: string,
  filters: BroadcastFilters
): Promise<string[]> {
  return (await getTargetUsers(adminClient, characterId, filters)).map(u => u.id)
}

export function createAdminSupabase(): AdminSupabase {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function processBroadcast(jobId: string): Promise<void> {
  const adminClient = createAdminSupabase()

  const { data: job, error: jobError } = await adminClient
    .from('broadcast_jobs').select('*').eq('id', jobId).single()

  if (jobError || !job) {
    console.error('processBroadcast: job not found', jobError)
    return
  }

  const filters: BroadcastFilters = {
    excludeWithConv: job.exclude_with_conversation,
    registeredFrom:  job.filter_registered_from,
    registeredTo:    job.filter_registered_to,
    chargedMin:      job.filter_charged_min,
    chargedMax:      job.filter_charged_max,
    gender:          job.filter_gender,
    ageMin:          job.filter_age_min,
    ageMax:          job.filter_age_max,
  }

  try {
    const targetUsers = await getTargetUsers(adminClient, job.character_id, filters)

    await adminClient.from('broadcast_jobs')
      .update({ target_count: targetUsers.length, status: 'processing' }).eq('id', jobId)

    let sentCount = 0
    const now = new Date().toISOString()

    for (const targetUser of targetUsers) {
      const userId = targetUser.id
      try {
        const conv = await getOrCreateConversation(adminClient, userId, job.character_id, { last_message_at: now, is_unread_staff: false })
        if (!conv) { console.error('processBroadcast: conv create failed', userId); continue }
        const conversationId = conv.id

        const resolvedMessage = resolveVariables(job.message, targetUser)
        const { error: msgError } = await adminClient.from('messages').insert({
          conversation_id: conversationId,
          sender_role: 'character',
          content: resolvedMessage,
          points_used: 0,
          is_read: false,
        })
        if (msgError) { console.error('processBroadcast: msg insert failed', msgError); continue }

        await adminClient.from('conversations')
          .update({ last_message_at: now, is_unread_staff: false }).eq('id', conversationId)

        sentCount++
      } catch (err) {
        console.error('processBroadcast: error for user', userId, err)
      }
    }

    await adminClient.from('broadcast_jobs')
      .update({ status: 'done', sent_count: sentCount }).eq('id', jobId)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    await adminClient.from('broadcast_jobs')
      .update({ status: 'failed', error_message: msg }).eq('id', jobId)
    console.error('processBroadcast: fatal error', err)
  }
}
