import { ANTON, CREAM, FRAUNCES, MONO } from '../../theme/tokens'
import { Pin } from '../ui/Pin'
import { Tag } from '../ui/Tag'
import { BloodDropIcon } from '../ui/icons'
import { kickerOf, type CardProps } from './types'

/** Template AFFICHE_ACCENT — carte pleine couleur d'accent avec pictogramme (collecte de sang). */
export function AfficheAccent({ annonce, accent, density }: CardProps) {
  const d = annonce.details ?? {}
  const lg = density === 'lg'
  return (
    <article
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 auto',
        background: accent,
        color: CREAM,
        borderRadius: 2,
        boxShadow: `0 2px 0 rgba(0,0,0,.1), 0 ${lg ? 14 : 12}px ${lg ? 22 : 20}px -10px rgba(40,18,4,.55)`,
      }}
    >
      <Pin color="dark" />
      <div style={{ flex: '1 1 auto', padding: lg ? '20px 18px 16px' : '14px 14px 12px', display: 'flex', flexDirection: 'column', gap: lg ? 10 : 8 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: lg ? 8 : 6 }}>
          <Tag fontSize={lg ? 10.5 : 10} padding={lg ? '3px 7px' : '2px 6px'} border="1px solid rgba(255,244,226,.7)">
            {kickerOf(annonce, density)}
          </Tag>
          <BloodDropIcon size={lg ? 26 : 22} />
        </div>
        <h2 style={{ margin: 0, fontFamily: ANTON, fontWeight: 400, fontSize: lg ? 34 : 25, lineHeight: 0.95, textTransform: 'uppercase' }}>{annonce.titre}</h2>
        <p style={{ margin: lg ? 0 : 'auto 0 0', display: 'flex', flexDirection: 'column', fontFamily: FRAUNCES, fontSize: lg ? 14 : 12.5, lineHeight: lg ? 1.4 : 1.35 }}>
          <span>{d.dateLabel}</span>
          <span>{d.lieu}</span>
        </p>
        {lg && d.note && <p style={{ margin: 'auto 0 0', fontFamily: MONO, fontSize: 11 }}>{d.note}</p>}
      </div>
    </article>
  )
}
