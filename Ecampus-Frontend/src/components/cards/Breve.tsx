import { FRAUNCES, MONO } from '../../theme/tokens'
import { Pin } from '../ui/Pin'
import { kickerOf, type CardProps } from './types'

/** Template BREVE — courte brève du journal sur papier crème. */
export function Breve({ annonce, density }: CardProps) {
  const lg = density === 'lg'
  return (
    <article
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 auto',
        background: '#F3EEE3',
        color: '#1D1A16',
        boxShadow: '0 2px 0 rgba(0,0,0,.08), 0 12px 18px -10px rgba(40,20,5,.5)',
      }}
    >
      <Pin color="blue" right={lg ? 26 : 14} />
      <div style={{ flex: '1 1 auto', minHeight: 0, overflow: 'hidden', padding: lg ? '14px 20px' : '16px 14px 12px', display: 'flex', flexDirection: 'column', justifyContent: lg ? 'center' : undefined, gap: 6 }}>
        <span style={{ fontFamily: MONO, fontSize: lg ? 10.5 : 10, fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase' }}>
          {kickerOf(annonce, density)}
        </span>
        <h2 style={{ margin: 0, fontFamily: FRAUNCES, fontWeight: 400, fontSize: lg ? 16 : 14, lineHeight: lg ? 1.35 : 1.38 }}>{annonce.titre}</h2>
      </div>
    </article>
  )
}
