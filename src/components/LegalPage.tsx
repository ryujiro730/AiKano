import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type { LegalDoc, LegalItem } from '@/i18n/legal/types'

const h2: React.CSSProperties = { fontFamily: "'Noto Serif JP', serif", fontSize: '1rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #e8e8e8' }
const p: React.CSSProperties = { fontSize: '14px', color: '#444', lineHeight: 1.8 }

function Item({ item }: { item: LegalItem }) {
  if (typeof item === 'string') return <li style={p}>{item}</li>
  return <li style={p}><strong style={{ color: '#1a1a1a' }}>{item.label}</strong>{item.text}</li>
}

export function LegalPage({ doc, notice }: { doc: LegalDoc; notice?: string }) {
  return (
    <div className="min-h-screen" style={{ background: '#fff' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8' }} className="sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center gap-3">
          <Link href="/" style={{ fontSize: '13px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
            className="hover:text-[#1a1a1a] transition-colors">
            <ChevronLeft size={14} />AiKano
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-14">
        <h1 style={{ fontFamily: "'Noto Serif JP', serif", fontSize: '1.75rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '8px' }}>{doc.title}</h1>
        <p style={{ fontSize: '13px', color: '#aaa', marginBottom: notice ? '16px' : '48px' }}>{doc.updated}</p>
        {notice && (
          <p style={{ ...p, fontSize: '13px', marginBottom: '40px', padding: '10px 14px', background: '#f8f8f8', borderRadius: '6px' }}>{notice}</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {doc.sections.map((sec, si) => (
            <section key={si}>
              <h2 style={h2}>{sec.title}</h2>
              {sec.preamble && <p style={{ ...p, marginBottom: '12px' }}>{sec.preamble}</p>}
              {sec.groups?.map((g, gi) => (
                <div key={gi}>
                  <p style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: 700, marginBottom: '8px' }}>{g.heading}</p>
                  <ul style={{ paddingLeft: '1.4em', margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: '6px', listStyleType: 'disc' }}>
                    {g.items.map((it, ii) => <Item key={ii} item={it} />)}
                  </ul>
                </div>
              ))}
              {sec.items && (sec.bullet
                ? <ul style={{ paddingLeft: '1.4em', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', listStyleType: 'disc' }}>{sec.items.map((it, ii) => <Item key={ii} item={it} />)}</ul>
                : <ol style={{ paddingLeft: '1.4em', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>{sec.items.map((it, ii) => <Item key={ii} item={it} />)}</ol>
              )}
              {sec.note && (
                <p style={{ ...p, color: '#1a1a1a', fontWeight: 600, marginTop: '16px', padding: '12px 16px', background: '#f8f8f8', borderRadius: '6px', borderLeft: '3px solid #e8e8e8' }}>{sec.note}</p>
              )}
              {sec.suffix && <p style={{ ...p, marginTop: '12px' }}>{sec.suffix}</p>}
              {sec.contact && (
                <div style={{ marginTop: '12px', fontSize: '14px', color: '#444', lineHeight: 2 }}>
                  {sec.contact.map((c, ci) => <p key={ci}>{c}</p>)}
                </div>
              )}
            </section>
          ))}
        </div>

        <div style={{ marginTop: '64px', paddingTop: '24px', borderTop: '1px solid #e8e8e8' }}>
          <p style={{ fontSize: '13px', color: '#aaa', textAlign: 'center' }}>{doc.footer}</p>
        </div>
      </div>
    </div>
  )
}
