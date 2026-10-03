// Payment brand icons — flat-rounded SVGs, displayed as native chip shapes

/* eslint-disable @next/next/no-img-element */

function BrandChip({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        height: '22px',
        width: 'auto',
        borderRadius: '3px',
        display: 'block',
        flexShrink: 0,
      }}
    />
  )
}

function KonbiniBadge({ src, alt, h = 18 }: { src: string; alt: string; h?: number }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: '#fff', border: '1px solid rgba(0,0,0,0.1)',
      borderRadius: '4px', padding: '2px 6px', flexShrink: 0,
    }}>
      <img src={src} alt={alt} style={{ display: 'block', height: `${h}px`, width: 'auto', maxWidth: '72px', objectFit: 'contain' }} />
    </span>
  )
}

export function CardBrands() {
  const brands = [
    { src: '/logos/visa.svg', alt: 'Visa' },
    { src: '/logos/mastercard.svg', alt: 'Mastercard' },
    { src: '/logos/amex.svg', alt: 'American Express' },
    { src: '/logos/jcb.svg', alt: 'JCB' },
    { src: '/logos/diners.svg', alt: 'Diners Club' },
    { src: '/logos/discover.svg', alt: 'Discover' },
    { src: '/logos/unionpay.svg', alt: '銀聯' },
  ]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
      {brands.map(b => <BrandChip key={b.alt} src={b.src} alt={b.alt} />)}
    </div>
  )
}

// 後方互換
export function VisaIcon() { return <BrandChip src="/logos/visa.svg" alt="VISA" /> }
export function MastercardIcon() { return <BrandChip src="/logos/mastercard.svg" alt="Mastercard" /> }
export function JcbIcon() { return <BrandChip src="/logos/jcb.svg" alt="JCB" /> }
export function AmexIcon() { return <BrandChip src="/logos/amex.svg" alt="AMEX" /> }

export function FamilyMartBadge() { return <KonbiniBadge src="/logos/familymart.png" alt="FamilyMart" h={18} /> }
export function LawsonBadge() { return <KonbiniBadge src="/logos/lawson.png" alt="Lawson" h={18} /> }
export function MinistopBadge() { return <KonbiniBadge src="/logos/ministop.png" alt="MINISTOP" h={22} /> }
export function SeicomartBadge() { return <KonbiniBadge src="/logos/seicomart.svg" alt="セイコーマート" h={18} /> }
export function PayPayBadge() { return <KonbiniBadge src="/logos/paypay.svg" alt="PayPay" h={20} /> }
