import { FRAUNCES, MONO, pick } from '../../theme/tokens'
import { Pin } from '../ui/Pin'
import { Tag } from '../ui/Tag'
import { kickerOf, type CardProps } from './types'

/** Template ETIQUETTE — étiquette jaune à œillet (objet trouvé). */
export function Etiquette({ annonce, density }: CardProps) {
  const d = annonce.details ?? {}
  const lg = density === 'lg'
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 auto',
        filter: `drop-shadow(0 ${lg ? 10 : 8}px ${lg ? 9 : 8}px rgba(40,20,5,.45))`,
      }}
    >
      <Pin color="red" top={15} />
      <article
        style={{
          position: 'relative',
          flex: '1 1 auto',
          padding: lg ? '48px 16px 16px' : '46px 14px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          background: '#E7C873',
          color: '#2B2108',
          clipPath: `polygon(24% 0, 76% 0, 100% ${pick(density, 15, 12)}%, 100% 100%, 0 100%, 0 ${pick(density, 15, 12)}%)`,
        }}
      >
        <span aria-hidden="true" style={{ position: 'absolute', top: 12, left: '50%', marginLeft: -12, width: 24, height: 24, borderRadius: '50%', border: '4px solid #CDA94F', background: '#9C6E3F' }} />
        <Tag fontSize={lg ? 10.5 : 10} padding={lg ? '3px 7px' : '2px 6px'} border="1px solid #2B2108" alignSelf="flex-start">
          {kickerOf(annonce, density)}
        </Tag>
        <h2 style={{ margin: 0, fontFamily: FRAUNCES, fontWeight: 600, fontSize: lg ? 20 : 18, lineHeight: 1.15 }}>{annonce.titre}</h2>
        <p style={{ margin: 0, fontFamily: FRAUNCES, fontSize: lg ? 13 : 12.5, lineHeight: 1.35 }}>{annonce.descriptionLongue}</p>
        {d.note && (
          <p style={{ margin: 'auto 0 0', fontFamily: MONO, fontSize: lg ? 11 : 10.5, lineHeight: 1.4, borderTop: '1px dashed rgba(43,33,8,.5)', paddingTop: 8 }}>{d.note}</p>
        )}
      </article>
    </div>
  )
}
