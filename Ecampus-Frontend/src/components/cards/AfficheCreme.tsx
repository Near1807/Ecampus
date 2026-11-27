import { ANTON, CREAM, FRAUNCES, MONO } from '../../theme/tokens'
import { Pin } from '../ui/Pin'
import { Tag } from '../ui/Tag'
import { kickerOf, type CardProps } from './types'

/** Template AFFICHE_CREME (et STANDARD) — affiche crème, gros titre en couleur d'accent. */
export function AfficheCreme({ annonce, accent, density }: CardProps) {
  const d = annonce.details ?? {}
  const lg = density === 'lg'
  return (
    <article
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 auto',
        background: CREAM,
        color: '#2A211A',
        borderRadius: 2,
        boxShadow: `0 2px 0 rgba(0,0,0,.08), 0 ${lg ? 16 : 12}px ${lg ? 24 : 20}px -10px rgba(40,20,5,.5)`,
      }}
    >
      <Pin color="green" />
      <div style={{ flex: '1 1 auto', padding: lg ? '24px 26px 20px' : '16px 20px', display: 'flex', flexDirection: 'column', gap: lg ? 10 : 8 }}>
        <Tag fontSize={lg ? 11 : 10} padding={lg ? '4px 8px' : '2px 6px'} border={`1px solid ${accent}`} color={accent} alignSelf="flex-start">
          {kickerOf(annonce, density) || 'Annonce'}
        </Tag>
        <h2 style={{ margin: 0, fontFamily: ANTON, fontWeight: 400, fontSize: lg ? 52 : 38, lineHeight: 0.92, textTransform: 'uppercase', color: accent }}>{annonce.titre}</h2>
        <p style={{ margin: lg ? 0 : 'auto 0 0', fontFamily: FRAUNCES, fontSize: lg ? 16 : 14, lineHeight: 1.35 }}>{annonce.descriptionLongue}</p>
        {lg && d.signature && (
          <p style={{ margin: 'auto 0 0', fontFamily: MONO, fontSize: 11, color: '#6B5A4A' }}>{d.signature}</p>
        )}
      </div>
    </article>
  )
}
