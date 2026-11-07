/**
 * 登録済みユーザー全員へのお知らせメール（Resend の予約送信）。2026-11-06 作成: 写真ガチャ・無料写真の公開のお知らせ
 *   npx tsx --env-file=.env.local scripts/send-announcement.ts --dry              … 宛先の数を数えるだけ
 *   npx tsx --env-file=.env.local scripts/send-announcement.ts --preview <email>  … その1通だけ今すぐ送る（日本語）
 *   npx tsx --env-file=.env.local scripts/send-announcement.ts --at 2026-11-07T12:00:00+09:00  … 全員分を予約
 * 除外: 配信停止（email_opt_out。不達・迷惑報告で止めた人も含む）・BAN 中・社内アカウント。
 * 予約した分は Resend の管理画面か API（emails/{id}/cancel）で送信前なら取り消せる。送った ID は scripts/announcement-sent.json に残す
 */
import fs from 'fs'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { INTERNAL_EMAILS } from '../src/lib/internal-accounts'
import { unsubscribeUrl } from '../src/lib/email-unsubscribe'

const APP = 'https://aikano.chat'
type Copy = { subject: string; lead: string; items: [string, string][]; cta: string; footer: string; unsub: string }
const COPY: Record<string, Copy> = {
  ja: {
    subject: '写真ガチャがはじまりました。キャラの写真も無料で見られます',
    lead: 'いつもAiKanoをご利用いただきありがとうございます。新しく、次の3つが使えるようになりました。',
    items: [
      ['キャラの写真が無料で見られる', 'キャラのプロフィールに、誰でも見られる写真を各キャラ10枚ほど用意しました。'],
      ['写真ガチャ', '全キャラの限定写真から1枚が出ます（1回30pt・10連は1回分おまけ）。同じ写真は二度出ません。'],
      ['プレゼントで写真が届く', 'キャラにアイテムを贈ると、そのアイテムを持った写真が届きます。'],
    ],
    cta: 'キャラの写真を見てみる',
    footer: 'このメールは AiKano にご登録の方にお送りしています。※登場するのはAIキャラクターです。',
    unsub: '今後のお知らせメールを停止する',
  },
  en: {
    subject: 'Photo Gacha is here — and character photos are now free to view',
    lead: 'Thanks for using AiKano. Three new things are now available:',
    items: [
      ['Free character photos', 'Each character now has about 10 photos anyone can view on their profile.'],
      ['Photo Gacha', 'Draw one exclusive photo from all characters (30pt per draw, 10-pull includes one free draw). You never get the same photo twice.'],
      ['Photos for your gifts', 'Give a character an item and she will send you a photo holding it.'],
    ],
    cta: 'See the photos',
    footer: 'You are receiving this because you signed up for AiKano. All characters are AI.',
    unsub: 'Unsubscribe from these emails',
  },
  es: {
    subject: 'Llega el gacha de fotos — y las fotos de los personajes ya son gratis',
    lead: 'Gracias por usar AiKano. Ahora tienes tres novedades:',
    items: [
      ['Fotos gratis de los personajes', 'Cada personaje tiene unas 10 fotos que cualquiera puede ver en su perfil.'],
      ['Gacha de fotos', 'Sale una foto exclusiva de todos los personajes (30pt por tirada; la tirada x10 incluye una gratis). Nunca se repite.'],
      ['Fotos por tus regalos', 'Regala un artículo a un personaje y te enviará una foto con él.'],
    ],
    cta: 'Ver las fotos',
    footer: 'Recibes este correo porque te registraste en AiKano. Todos los personajes son IA.',
    unsub: 'Dejar de recibir estos correos',
  },
  fr: {
    subject: 'Le gacha photo est là — et les photos des personnages sont gratuites',
    lead: 'Merci d’utiliser AiKano. Trois nouveautés sont disponibles :',
    items: [
      ['Photos gratuites', 'Chaque personnage a environ 10 photos visibles par tous sur son profil.'],
      ['Gacha photo', 'Obtenez une photo exclusive parmi tous les personnages (30pt le tirage, le tirage x10 en offre un). Jamais deux fois la même.'],
      ['Des photos pour vos cadeaux', 'Offrez un objet à un personnage et elle vous enverra une photo avec.'],
    ],
    cta: 'Voir les photos',
    footer: 'Vous recevez cet e-mail car vous êtes inscrit sur AiKano. Tous les personnages sont des IA.',
    unsub: 'Ne plus recevoir ces e-mails',
  },
  de: {
    subject: 'Das Foto-Gacha ist da — und Figurenfotos sind jetzt kostenlos',
    lead: 'Danke, dass du AiKano nutzt. Drei Neuerungen sind verfügbar:',
    items: [
      ['Kostenlose Fotos', 'Jede Figur hat jetzt etwa 10 Fotos, die alle auf ihrem Profil sehen können.'],
      ['Foto-Gacha', 'Ziehe ein exklusives Foto aus allen Figuren (30pt pro Zug, beim 10er-Zug ist einer gratis). Nie dasselbe Foto zweimal.'],
      ['Fotos für deine Geschenke', 'Schenke einer Figur einen Gegenstand und sie schickt dir ein Foto damit.'],
    ],
    cta: 'Fotos ansehen',
    footer: 'Du erhältst diese E-Mail, weil du dich bei AiKano registriert hast. Alle Figuren sind KI.',
    unsub: 'Diese E-Mails abbestellen',
  },
  pt: {
    subject: 'Chegou o gacha de fotos — e as fotos das personagens agora são grátis',
    lead: 'Obrigado por usar o AiKano. Há três novidades:',
    items: [
      ['Fotos grátis', 'Cada personagem tem cerca de 10 fotos que qualquer pessoa pode ver no perfil.'],
      ['Gacha de fotos', 'Saia uma foto exclusiva de todas as personagens (30pt por giro; o giro x10 inclui um grátis). Nunca repete.'],
      ['Fotos pelos seus presentes', 'Dê um item a uma personagem e ela vai te mandar uma foto com ele.'],
    ],
    cta: 'Ver as fotos',
    footer: 'Você recebeu este e-mail porque se cadastrou no AiKano. Todas as personagens são IA.',
    unsub: 'Cancelar estes e-mails',
  },
}

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function html(c: Copy, unsub: string) {
  const items = c.items.map(([t, d]) => `
    <tr><td style="padding:0 0 14px;">
      <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#3d1a26;">${esc(t)}</p>
      <p style="margin:0;font-size:14px;color:#5a4048;line-height:1.7;">${esc(d)}</p>
    </td></tr>`).join('')
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#fdf6f0;font-family:'Hiragino Kaku Gothic ProN','Hiragino Sans','Meiryo',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf6f0;padding:32px 0;"><tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff8f5;border-radius:16px;overflow:hidden;">
  <tr><td style="background:linear-gradient(135deg,#f9a8b8,#e879a0);padding:22px 32px;"><p style="margin:0;color:#fff;font-size:20px;font-weight:700;">AiKano</p></td></tr>
  <tr><td style="padding:28px 32px 8px;">
    <p style="margin:0 0 20px;font-size:14px;color:#5a4048;line-height:1.7;">${esc(c.lead)}</p>
    <table width="100%" cellpadding="0" cellspacing="0">${items}</table>
    <div style="text-align:center;margin:12px 0 8px;">
      <a href="${APP}/characters" style="display:inline-block;background:linear-gradient(135deg,#f9a8b8,#e879a0);color:#fff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 36px;border-radius:100px;">${esc(c.cta)}</a>
    </div>
  </td></tr>
  <tr><td style="padding:16px 32px 24px;border-top:1px solid #f0dde5;">
    <p style="margin:0;font-size:11px;color:#c8a0a8;text-align:center;line-height:1.6;">${esc(c.footer)}<br>
    <a href="${unsub}" style="color:#c8a0a8;">${esc(c.unsub)}</a><br>合同会社TJYM ／ info@tjym.org</p>
  </td></tr>
</table></td></tr></table></body></html>`
}

async function main() {
  const args = process.argv.slice(2)
  const dry = args.includes('--dry')
  const preview = args.includes('--preview') ? args[args.indexOf('--preview') + 1] : null
  const at = args.includes('--at') ? args[args.indexOf('--at') + 1] : null
  const resend = new Resend(process.env.RESEND_API_KEY)
  const send = (to: string, userId: string, locale: string, scheduledAt?: string) => {
    const c = COPY[locale] ?? COPY.ja
    const unsub = unsubscribeUrl(userId)
    return resend.emails.send({
      from: 'AiKano <noreply@aikano.chat>',
      to,
      subject: c.subject,
      html: html(c, unsub),
      headers: { 'List-Unsubscribe': `<${unsub}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
      tags: [{ name: 'kind', value: 'announcement' }],
      ...(scheduledAt ? { scheduledAt } : {}),
    })
  }

  if (preview) {
    const r = await send(preview, 'preview', 'ja')
    console.log('preview', JSON.stringify(r.error ?? r.data))
    return
  }

  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { autoRefreshToken: false, persistSession: false } })
  const { data: profiles } = await db.from('profiles').select('id, email, locale, email_opt_out, role').eq('role', 'user').limit(10000)
  const banned = new Set<string>()
  for (let page = 1; ; page++) {
    const { data } = await db.auth.admin.listUsers({ page, perPage: 1000 })
    for (const u of data?.users ?? []) if (u.banned_until && new Date(u.banned_until) > new Date()) banned.add(u.id)
    if (!data || data.users.length < 1000) break
  }
  const internal = new Set<string>(INTERNAL_EMAILS as readonly string[])
  const targets = (profiles ?? []).filter(p => p.email && !p.email_opt_out && !banned.has(p.id) && !internal.has(p.email.toLowerCase()))
  const byLocale: Record<string, number> = {}
  for (const t of targets) byLocale[t.locale ?? 'ja'] = (byLocale[t.locale ?? 'ja'] ?? 0) + 1
  console.log({ profiles: profiles?.length, targets: targets.length, byLocale })
  if (dry || !at) return

  const sent: { userId: string; id: string }[] = []
  for (const t of targets) {
    const r = await send(t.email!, t.id, t.locale ?? 'ja', at)
    if (r.error) console.error('failed', t.id, r.error.message)
    else sent.push({ userId: t.id, id: r.data!.id })
    await new Promise(res => setTimeout(res, 150))   // Resend は 1 秒 10 件まで
  }
  fs.writeFileSync('scripts/announcement-sent.json', JSON.stringify({ at, sent }, null, 2))
  console.log({ scheduled: sent.length, at })
}

main()
