import { FRAUNCES, MONO, ruledPaper } from '../../theme/tokens'
import { Pin } from '../ui/Pin'
import { kickerOf, type CardProps } from './types'

/** Template FEUILLE_QUADRILLEE — feuille à lignes avec tags (projet étudiant). */
export function FeuilleQuadrillee({ annonce, density }: CardProps) {
  const d = annonce.details ?? {}
  const lg = density === 'lg'
  return (
    <article
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 auto',
        ...ruledPaper(lg ? 14 : 12),
        color: '#1A2233',
        borderTop: '6px solid #1E3A6B',
        boxShadow: `0 2px 0 rgba(0,0,0,.08), 0 ${lg ? 14 : 12}px ${lg ? 22 : 20}px -10px rgba(40,20,5,.5)`,
      }}
    >
      <Pin color="blue" top={-12} />
      <div style={{ flex: '1 1 auto', padding: lg ? '16px 22px 18px' : '16px 20px', display: 'flex', flexDirection: 'column', gap: lg ? 10 : 8 }}>
        <span style={{ fontFamily: MONO, fontSize: lg ? 11 : 10.5, fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', color: '#1E3A6B' }}>
          {kickerOf(annonce, density)}
        </span>
        <h2 style={{ margin: 0, fontFamily: FRAUNCES, fontWeight: 600, fontSize: lg ? 22 : 19, lineHeight: 1.2 }}>{annonce.titre}</h2>
        <p style={{ margin: 0, fontFamily: FRAUNCES, fontSize: lg ? 14 : 13, lineHeight: 1.45 }}>{annonce.descriptionLongue}</p>
        <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {(d.tags ?? []).map((t) => (
            <span key={t} style={{ fontFamily: MONO, fontSize: lg ? 11 : 10.5, padding: '3px 8px', borderRadius: 999, background: '#1E3A6B', color: '#EAF1FF' }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}
