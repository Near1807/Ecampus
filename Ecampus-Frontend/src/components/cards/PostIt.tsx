import { FRAUNCES, MONO } from '../../theme/tokens'
import { Tag } from '../ui/Tag'
import { Tape } from '../ui/Tape'
import { kickerOf, type CardProps } from './types'

/** Template POST_IT — papier jaune avec scotch (objet trouvé). */
export function PostIt({ annonce, density }: CardProps) {
  const d = annonce.details ?? {}
  const lg = density === 'lg'
  return (
    <article
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 auto',
        background: '#F6DC5B',
        color: '#2B2410',
        boxShadow: '0 2px 0 rgba(0,0,0,.08), 0 14px 20px -10px rgba(40,20,5,.5)',
      }}
    >
      <Tape center w={lg ? 80 : 68} h={lg ? 24 : 22} rotate={-3} top={lg ? -12 : -11} bg="rgba(246,238,214,.72)" />
      <div style={{ flex: '1 1 auto', minHeight: 0, overflow: 'hidden', padding: lg ? '22px 18px 16px' : '16px 14px 12px', display: 'flex', flexDirection: 'column', gap: lg ? 10 : 6 }}>
        <Tag fontSize={lg ? 10.5 : 10} padding={lg ? '3px 7px' : '2px 6px'} border="1px solid #2B2410" alignSelf="flex-start">
          {kickerOf(annonce, density)}
        </Tag>
        <h2 style={{ margin: lg ? 0 : '2px 0 0', fontFamily: FRAUNCES, fontStyle: 'italic', fontWeight: 500, fontSize: lg ? 19 : 15, lineHeight: 1.22 }}>{annonce.titre}</h2>
        {lg && <p style={{ margin: 0, fontFamily: FRAUNCES, fontSize: 13, lineHeight: 1.35 }}>{annonce.descriptionLongue}</p>}
        <a href={d.ctaHref ?? '#'} style={{ marginTop: 'auto', fontFamily: MONO, fontSize: lg ? 12 : 11.5, color: '#2B2410' }}>{d.ctaLabel}</a>
      </div>
    </article>
  )
}
