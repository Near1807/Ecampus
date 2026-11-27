import { ANTON, FRAUNCES, MONO, gridBlue, pick } from '../../theme/tokens'
import { Pin } from '../ui/Pin'
import { Tag } from '../ui/Tag'
import type { CardProps } from './types'

/** Template APPEL_PROJET — papier millimétré bleu avec date limite. */
export function AppelProjet({ annonce, density }: CardProps) {
  const d = annonce.details ?? {}
  const link = (size: number, extra = {}) => (
    <a href={d.ctaHref ?? '#'} style={{ fontFamily: MONO, fontSize: size, color: '#EAF1FF', ...extra }}>
      {density === 'lg' ? d.ctaLabel : d.ctaLabelCourt}
    </a>
  )

  const root = {
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    flex: '1 1 auto',
    ...gridBlue(pick(density, 22, 18, 16)),
    color: '#EAF1FF',
    borderRadius: 2,
    boxShadow: pick(
      density,
      '0 2px 0 rgba(0,0,0,.12), 0 18px 26px -10px rgba(20,14,30,.6)',
      '0 2px 0 rgba(0,0,0,.12), 0 14px 22px -10px rgba(20,14,30,.6)',
      '0 2px 0 rgba(0,0,0,.12), 0 12px 20px -10px rgba(20,14,30,.6)',
    ),
  }

  if (density === 'lg') {
    return (
      <article style={root}>
        <Pin color="gold" left={30} />
        <Pin color="gold" right={30} />
        <div style={{ flex: '1 1 auto', minHeight: 0, overflow: 'hidden', padding: '22px 24px', display: 'flex', flexWrap: 'wrap', gap: '16px 20px' }}>
          <div style={{ flex: '1 1 220px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 12px' }}>
              <Tag fontSize={11} padding="4px 8px" border="1px solid rgba(234,241,255,.7)">{d.kicker}</Tag>
              <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.06em', color: 'rgba(234,241,255,.78)' }}>{d.ref}</span>
            </div>
            <h2 style={{ margin: 0, fontFamily: FRAUNCES, fontWeight: 600, fontSize: 'clamp(20px, 2vw, 26px)', lineHeight: 1.1, letterSpacing: '-.01em' }}>{annonce.titre}</h2>
            <p style={{ margin: 0, fontFamily: MONO, fontSize: 12.5, lineHeight: 1.55, color: 'rgba(234,241,255,.88)' }}>{annonce.descriptionLongue}</p>
            {link(12.5, { marginTop: 'auto' })}
          </div>
          <div style={{ flex: '0 0 116px', border: '1px dashed rgba(234,241,255,.6)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 4, padding: 10 }}>
            <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(234,241,255,.8)' }}>Dépôt avant le</span>
            <span style={{ fontFamily: ANTON, fontSize: 44, lineHeight: 1 }}>{d.deadline}</span>
            <span style={{ fontFamily: MONO, fontSize: 12, color: 'rgba(234,241,255,.8)' }}>{d.deadlineYear}</span>
          </div>
        </div>
      </article>
    )
  }

  if (density === 'md') {
    return (
      <article style={root}>
        <Pin color="gold" left={22} />
        <Pin color="gold" right={22} />
        <div style={{ flex: '1 1 auto', minHeight: 0, overflow: 'hidden', padding: '18px 20px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <Tag fontSize={10.5} padding="3px 7px" border="1px solid rgba(234,241,255,.7)">{d.kicker}</Tag>
            <span style={{ fontFamily: MONO, fontSize: 10.5, color: 'rgba(234,241,255,.78)' }}>{d.ref}</span>
          </div>
          <h2 style={{ margin: 0, fontFamily: FRAUNCES, fontWeight: 600, fontSize: 22, lineHeight: 1.12 }}>{annonce.titre}</h2>
          <p style={{ margin: 0, fontFamily: MONO, fontSize: 11.5, lineHeight: 1.5, color: 'rgba(234,241,255,.88)' }}>
            {annonce.descriptionCourte ?? annonce.descriptionLongue}
          </p>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, borderTop: '1px dashed rgba(234,241,255,.5)', paddingTop: 8 }}>
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: MONO, fontSize: 10, textTransform: 'uppercase', letterSpacing: '.06em', color: 'rgba(234,241,255,.8)' }}>Dépôt avant le</span>
              <span style={{ fontFamily: ANTON, fontSize: 30, lineHeight: 1.05 }}>{d.deadline}.{d.deadlineYear}</span>
            </span>
            {link(12, { paddingBottom: 4 })}
          </div>
        </div>
      </article>
    )
  }

  return (
    <article style={root}>
      <Pin color="gold" />
      <div style={{ flex: '1 1 auto', minHeight: 0, overflow: 'hidden', padding: '16px 14px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Tag fontSize={10} padding="2px 6px" border="1px solid rgba(234,241,255,.7)" alignSelf="flex-start">{d.kicker}</Tag>
        <h2 style={{ margin: 0, fontFamily: FRAUNCES, fontWeight: 600, fontSize: 17, lineHeight: 1.12 }}>{annonce.titre}</h2>
        <div style={{ marginTop: 'auto', border: '1px dashed rgba(234,241,255,.6)', padding: '8px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <span style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(234,241,255,.8)' }}>Dépôt avant le</span>
          <span style={{ fontFamily: ANTON, fontSize: 30, lineHeight: 1 }}>{d.deadline}</span>
        </div>
        {link(11.5)}
      </div>
    </article>
  )
}
