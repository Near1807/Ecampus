import { FRAUNCES, MONO } from '../../theme/tokens'
import { Tape } from '../ui/Tape'
import type { CardProps } from './types'

/** Template NOTE_JOURNAL — petit mot de la rédaction (recrutement, communiqué…). */
export function NoteJournal({ annonce, density }: CardProps) {
  const d = annonce.details ?? {}
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
        boxShadow: '0 2px 0 rgba(0,0,0,.08), 0 14px 20px -10px rgba(40,20,5,.5)',
      }}
    >
      <Tape w={lg ? 70 : 56} h={lg ? 24 : 22} rotate={-8} top={-11} left={18} />
      <div style={{ flex: '1 1 auto', padding: lg ? '20px 16px 16px' : '16px 14px 12px', display: 'flex', flexDirection: 'column', gap: lg ? 10 : 6 }}>
        <span style={{ fontFamily: MONO, fontSize: lg ? 10.5 : 10, fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase' }}>{d.kicker}</span>
        <h2 style={{ margin: 0, paddingBottom: lg ? 8 : 6, borderBottom: '1px solid #1D1A16', fontFamily: FRAUNCES, fontWeight: 700, fontSize: lg ? 22 : 18, lineHeight: 1.1 }}>{annonce.titre}</h2>
        <p style={{ margin: 0, fontFamily: FRAUNCES, fontSize: lg ? 13.5 : 12, lineHeight: lg ? 1.45 : 1.4 }}>
          {lg ? annonce.descriptionLongue : (annonce.descriptionCourte ?? annonce.descriptionLongue)}
        </p>
        {lg && d.ctaLabel && (
          <a href={d.ctaHref ?? '#'} style={{ marginTop: 'auto', fontFamily: MONO, fontSize: 12, color: '#1D1A16' }}>{d.ctaLabel}</a>
        )}
      </div>
    </article>
  )
}
