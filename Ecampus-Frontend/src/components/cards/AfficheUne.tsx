import { ANTON, CREAM, FRAUNCES, MONO, pick } from '../../theme/tokens'
import { Pin } from '../ui/Pin'
import { Rings } from '../ui/Rings'
import { Tag } from '../ui/Tag'
import { kickerOf, type CardProps } from './types'

/** Template AFFICHE_UNE — grande carte « À la une » (couleur d'accent). */
export function AfficheUne({ annonce, accent, density, variant }: CardProps) {
  const d = annonce.details ?? {}
  const lg = density === 'lg'
  const cta = (
    <a
      href={d.ctaHref ?? '#'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        minHeight: 44,
        padding: variant === 'minimal' ? '0 14px' : lg ? '0 18px' : '0 16px',
        background: CREAM,
        color: '#2A120A',
        borderRadius: 999,
        fontFamily: MONO,
        fontSize: variant === 'minimal' ? 12 : lg ? 13 : 12.5,
        fontWeight: 600,
        textDecoration: 'none',
      }}
    >
      {lg ? d.ctaLabel : d.ctaLabelCourt}
    </a>
  )

  const root = {
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    flex: '1 1 auto',
    background: accent,
    color: CREAM,
    borderRadius: 3,
  }

  /* Variante compacte : panneau « Événements » du mobile */
  if (variant === 'minimal') {
    return (
      <article style={{ ...root, boxShadow: '0 2px 0 rgba(0,0,0,.12), 0 14px 22px -10px rgba(40,18,4,.6)' }}>
        <Pin color="white" />
        <div style={{ flex: '1 1 auto', minHeight: 0, overflow: 'hidden', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <Tag fontSize={10} padding="2px 6px" border="1px solid rgba(255,244,226,.7)">
              {kickerOf(annonce, 'md')}
            </Tag>
            <span style={{ fontFamily: ANTON, fontSize: 12, lineHeight: 1, letterSpacing: '.06em', textTransform: 'uppercase', border: `2px solid ${CREAM}`, borderRadius: 3, padding: '4px 7px 2px', transform: 'rotate(-6deg)' }}>
              À la une
            </span>
          </div>
          <h2 style={{ margin: '4px 0 0', fontFamily: ANTON, fontWeight: 400, fontSize: 44, lineHeight: 0.92, textTransform: 'uppercase' }}>
            {annonce.titre}
          </h2>
          <p style={{ margin: 0, fontFamily: MONO, fontSize: 11.5 }}>{d.accroche}</p>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ fontFamily: ANTON, fontSize: 24, lineHeight: 1 }}>
              {d.dateBig} {d.dateShort}
            </span>
            {cta}
          </div>
        </div>
      </article>
    )
  }

  return (
    <article
      style={{
        ...root,
        boxShadow: pick(density, '0 2px 0 rgba(0,0,0,.12), 0 20px 30px -10px rgba(40,18,4,.6)', '0 2px 0 rgba(0,0,0,.12), 0 16px 24px -10px rgba(40,18,4,.6)'),
      }}
    >
      <Rings
        big={pick<[number, number]>(density, [160, 440], [110, 280])}
        mid={pick<[number, number]>(density, [96, 312], [64, 188])}
        small={pick<[number, number]>(density, [34, 188], [22, 104])}
      />
      <Pin color="white" />
      <div style={{ position: 'relative', flex: '1 1 auto', minHeight: 0, overflow: 'hidden', padding: lg ? '32px 34px' : '18px 20px', display: 'flex', flexDirection: 'column', gap: lg ? 16 : 10 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: lg ? 16 : 12 }}>
          <Tag fontSize={lg ? 11 : 10.5} padding={lg ? '4px 8px' : '3px 7px'} border="1px solid rgba(255,244,226,.7)">
            {kickerOf(annonce, density)}
          </Tag>
          <span style={{ fontFamily: ANTON, fontSize: lg ? 20 : 14, lineHeight: 1, letterSpacing: '.06em', textTransform: 'uppercase', border: `${lg ? 3 : 2}px solid ${CREAM}`, borderRadius: lg ? 4 : 3, padding: lg ? '6px 12px 4px' : '5px 8px 3px', transform: 'rotate(-6deg)' }}>
            À la une
          </span>
        </div>
        <h2 style={{ margin: 0, fontFamily: ANTON, fontWeight: 400, fontSize: lg ? 'clamp(64px, 7vw, 100px)' : 50, lineHeight: 0.9, textTransform: 'uppercase', letterSpacing: lg ? '.005em' : undefined }}>
          <span style={{ display: 'block' }}>{annonce.titre}</span>
          {d.sousTitre && (
            <span style={{ display: 'block', color: 'transparent', WebkitTextStroke: `${lg ? 2 : 1.5}px ${CREAM}` }}>{d.sousTitre}</span>
          )}
        </h2>
        <p style={{ margin: 0, maxWidth: lg ? 470 : undefined, fontFamily: FRAUNCES, fontStyle: 'italic', fontSize: lg ? 19 : 14.5, lineHeight: 1.35 }}>
          {lg ? annonce.descriptionLongue : (annonce.descriptionCourte ?? annonce.descriptionLongue)}
        </p>
        <div style={{ marginTop: 'auto', display: 'flex', flexWrap: lg ? 'wrap' : undefined, alignItems: lg ? 'flex-end' : 'center', justifyContent: 'space-between', gap: lg ? '16px 24px' : 12 }}>
          {lg ? (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
              <span style={{ fontFamily: ANTON, fontSize: 60, lineHeight: 0.85 }}>{d.dateBig}</span>
              <span style={{ display: 'flex', flexDirection: 'column', fontFamily: MONO, fontSize: 13, lineHeight: 1.5 }}>
                <span>{d.dateLabel}</span>
                <span>{d.lieu}</span>
              </span>
            </div>
          ) : (
            <span style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              <span style={{ fontFamily: ANTON, fontSize: 36, lineHeight: 0.85 }}>{d.dateBig}</span>
              <span style={{ fontFamily: MONO, fontSize: 11.5 }}>{d.dateShort}</span>
            </span>
          )}
          {cta}
        </div>
      </div>
    </article>
  )
}
