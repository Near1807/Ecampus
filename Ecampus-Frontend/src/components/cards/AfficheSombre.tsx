import { ANTON, CREAM, FRAUNCES, MONO } from '../../theme/tokens'
import { Pin } from '../ui/Pin'
import { Tag } from '../ui/Tag'
import { kickerOf, type CardProps } from './types'

/** Template AFFICHE_SOMBRE — affiche sombre (conférence). */
export function AfficheSombre({ annonce, accent, density }: CardProps) {
  const d = annonce.details ?? {}
  const lg = density === 'lg'
  return (
    <article
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 auto',
        background: '#231D18',
        color: CREAM,
        borderRadius: 2,
        boxShadow: `0 2px 0 rgba(0,0,0,.12), 0 ${lg ? 16 : 12}px ${lg ? 24 : 20}px -10px rgba(20,10,2,.6)`,
      }}
    >
      <Pin color="gold" left={lg ? 34 : 22} />
      <div style={{ flex: '1 1 auto', minHeight: 0, overflow: 'hidden', padding: lg ? '24px 26px 20px' : '14px 14px 12px', display: 'flex', flexDirection: 'column', gap: lg ? 12 : 8 }}>
        <Tag fontSize={lg ? 11 : 10} padding={lg ? '4px 8px' : '2px 6px'} border="1px solid rgba(255,244,226,.7)" alignSelf="flex-start">
          {kickerOf(annonce, density)}
        </Tag>
        <h2 style={{ margin: 0, fontFamily: ANTON, fontWeight: 400, fontSize: lg ? 42 : 22, lineHeight: 0.92, textTransform: 'uppercase' }}>{annonce.titre}</h2>
        <div style={{ width: lg ? 48 : 30, height: 4, background: accent }} />
        {lg ? (
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <p style={{ margin: 0, fontFamily: FRAUNCES, fontSize: 14 }}>{d.intervenant}</p>
            <p style={{ margin: 0, fontFamily: MONO, fontSize: 12, color: 'rgba(255,244,226,.78)' }}>
              {d.dateLabel} · {d.horaire} · {d.lieu}
            </p>
          </div>
        ) : (
          <p style={{ margin: 'auto 0 0', display: 'flex', flexDirection: 'column', fontFamily: MONO, fontSize: 10.5, lineHeight: 1.45, color: 'rgba(255,244,226,.8)' }}>
            <span>{d.dateLabel}</span>
            <span>
              {d.horaire} · {d.lieuCourt ?? d.lieu}
            </span>
          </p>
        )}
      </div>
    </article>
  )
}
