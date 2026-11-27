import { FRAUNCES, MONO } from '../../theme/tokens'
import { Pin } from '../ui/Pin'
import type { CardProps } from './types'

/** Template POLAROID — photo + légende (objet trouvé avec image). */
export function Polaroid({ annonce, density }: CardProps) {
  const d = annonce.details ?? {}
  const lg = density === 'lg'
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}>
      <Pin color="red" />
      <article style={{ flex: '1 1 auto', minHeight: 0, overflow: 'hidden', padding: lg ? '10px 10px 14px' : '8px 8px 12px', display: 'flex', flexDirection: 'column', gap: 8, background: '#FBFAF6', color: '#2A241B', boxShadow: '0 2px 0 rgba(0,0,0,.08), 0 14px 20px -10px rgba(40,20,5,.5)' }}>
        {d.imageUrl && (
          <img
            src={d.imageUrl}
            alt={d.imageAlt ?? annonce.titre}
            style={{ display: 'block', width: '100%', height: lg ? 126 : 176, flex: '0 0 auto', objectFit: 'cover', objectPosition: '40% 50%', background: '#E3DED2' }}
          />
        )}
        <h2 style={{ margin: 0, padding: lg ? '0 4px' : '0 3px', fontFamily: FRAUNCES, fontStyle: 'italic', fontWeight: 500, fontSize: lg ? 15 : 14, lineHeight: 1.25 }}>{annonce.titre}</h2>
        <p style={{ margin: 'auto 0 0', padding: lg ? '0 4px' : '0 3px', fontFamily: MONO, fontSize: lg ? 10.5 : 10, letterSpacing: '.04em', textTransform: 'uppercase', color: '#5E5648' }}>
          {lg ? `${d.kicker} · ${d.lieu}` : `${d.lieu} · ${d.quand}`}
        </p>
      </article>
    </div>
  )
}
