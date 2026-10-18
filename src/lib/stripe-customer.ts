import type Stripe from 'stripe'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * 保存済みの Stripe 顧客IDが、いまのキー（本番/テスト）で使えるかを確かめる。
 * ローカル開発も本番と同じDBを使うため、テスト環境で作った顧客IDが profiles に残ることがある。
 */
export async function isUsableCustomer(stripe: Stripe, customerId: string): Promise<boolean> {
  try {
    const customer = await stripe.customers.retrieve(customerId)
    return !customer.deleted
  } catch (err) {
    if ((err as Stripe.errors.StripeError)?.code === 'resource_missing') return false
    throw err
  }
}

/** ユーザーの Stripe 顧客IDを返す。未作成、またはいまの環境に存在しない場合は作り直して保存する */
export async function getOrCreateCustomer(
  stripe: Stripe,
  admin: SupabaseClient,
  user: { id: string; email?: string | null },
): Promise<string> {
  const { data: profile } = await admin
    .from('profiles')
    .select('stripe_customer_id, email')
    .eq('id', user.id)
    .single()

  const saved = profile?.stripe_customer_id as string | null | undefined
  if (saved && await isUsableCustomer(stripe, saved)) return saved

  const customer = await stripe.customers.create({
    email: profile?.email ?? user.email ?? undefined,
    metadata: { userId: user.id },
  })
  // テストキー（ローカル開発）で作った顧客IDは本番DBに保存しない（本番の顧客IDを上書きしてしまうため）
  if (process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_')) {
    await admin.from('profiles').update({ stripe_customer_id: customer.id }).eq('id', user.id)
  }
  return customer.id
}
