import { FRAUNCES, MONO, pick } from '../../theme/tokens'
import { Tag } from '../ui/Tag'
import { Tape } from '../ui/Tape'
import type { CardProps } from './types'

const NOM_JOURNAL = "Le Journal de l'ECAM"

/** Template JOURNAL_UNE — article de une du journal étudiant (colonnes de presse). */
export function JournalUne({ annonce, density }: CardProps) {
  const d = annonce.details ?? {}
  const sm = density === 'sm'
  const lg = density === 'lg'

  const root = {
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    flex: '1 1 auto',
    background: '#F3EEE3',
    color: '#1D1A16',
    boxShadow: pick(
      density,
      '0 2px 0 rgba(0,0,0,.08), 0 16px 24px -10px rgba(40,20,5,.5)',
      '0 2px 0 rgba(0,0,0,.08), 0 14px 22px -10px rgba(40,20,5,.5)',
      '0 2px 0 rgba(0,0,0,.08), 0 12px 18px -10px rgba(40,20,5,.5)',
    ),
  }

  if (sm) {
    return (
      <article style={root}>
        <Tape w={58} h={22} rotate={-7} left={14} />
        <div style={{ flex: '1 1 auto', padding: '14px 12px 12px', display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden' }}>
          <div style={{ borderTop: '3px solid #1D1A16', borderBottom: '1px solid #1D1A16', padding: '5px 0 4px', textAlign: 'center' }}>
            <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: 17, lineHeight: 1.15 }}>Le Journal</div>
            <div style={{ marginTop: 2, fontFamily: MONO, fontSize: 9.5, letterSpacing: '.05em', textTransform: 'uppercase' }}>
              {d.numero} · {d.editionCourte}
            </div>
          </div>
          <h2 style={{ margin: 0, fontFamily: FRAUNCES, fontWeight: 600, fontSize: 15, lineHeight: 1.17 }}>{annonce.titre}</h2>
          <p style={{ margin: 0, fontFamily: FRAUNCES, fontSize: 11.5, lineHeight: 1.45 }}>
            {annonce.descriptionCourte ?? annonce.descriptionLongue}
          </p>
          <a href={d.ctaHref ?? '#'} style={{ marginTop: 'auto', fontFamily: MONO, fontSize: 11.5, color: '#1D1A16' }}>Lire →</a>
        </div>
      </article>
    )
  }

  return (
    <article style={root}>
      <Tape w={lg ? 86 : 72} h={lg ? 26 : 24} rotate={-7} top={lg ? -12 : -11} left={lg ? 22 : 18} />
      <Tape w={lg ? 78 : 66} h={lg ? 26 : 24} rotate={5} right={lg ? 20 : 16} />
      <div style={{ flex: '1 1 auto', padding: lg ? '24px 24px 18px' : '16px 18px 14px', display: 'flex', flexDirection: 'column', gap: lg ? 12 : 10, overflow: 'hidden' }}>
        <div style={{ borderTop: '3px solid #1D1A16', borderBottom: '1px solid #1D1A16', padding: lg ? '8px 0 6px' : '6px 0 5px', textAlign: 'center' }}>
          <div style={{ fontFamily: FRAUNCES, fontWeight: 700, fontSize: lg ? 26 : 21, lineHeight: 1.1, letterSpacing: lg ? '-.01em' : undefined }}>{NOM_JOURNAL}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: lg ? 4 : 3, fontFamily: MONO, fontSize: lg ? 10.5 : 9.5, letterSpacing: lg ? '.06em' : '.05em', textTransform: 'uppercase' }}>
            <span>{d.numero}</span>
            <span>{d.edition}</span>
            <span>{d.rubrique}</span>
          </div>
        </div>
        <h2 style={{ margin: 0, fontFamily: FRAUNCES, fontWeight: 600, fontSize: lg ? 22 : 19, lineHeight: 1.15 }}>{annonce.titre}</h2>
        <p style={{ margin: 0, fontFamily: FRAUNCES, fontSize: lg ? 12.5 : 12, lineHeight: 1.5, columnCount: 2, columnGap: lg ? 16 : 14, columnRule: '1px solid rgba(29,26,22,.25)', textAlign: 'justify', hyphens: 'auto' }}>
          {annonce.descriptionLongue}
        </p>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <Tag fontSize={lg ? 11 : 10.5} padding={lg ? '3px 8px' : '2px 7px'} border="1px solid #1D1A16">
            {lg || annonce.niveauPriorite === 'STANDARD' ? d.etiquette : 'Important'}
          </Tag>
          <a href={d.ctaHref ?? '#'} style={{ fontFamily: MONO, fontSize: 12, color: '#1D1A16' }}>Lire l'article →</a>
        </div>
      </div>
    </article>
  )
}
