import type { ReactNode } from 'react'
import { ANTON, CORK } from '../../theme/tokens'

interface MobilePanelProps {
  index: number
  current: number
  total: number
  title: string
  children: ReactNode
}

/** Un panneau du carrousel : plaque en laiton (titre + pagination) et liège. */
export function MobilePanel({ index, current, total, title, children }: MobilePanelProps) {
  return (
    <section aria-label={`Panneau ${title}`} aria-hidden={index !== current} style={{ flex: '0 0 100%', height: '100%', padding: '4px 10px 10px' }}>
      <div style={{ height: '100%', position: 'relative', background: '#3A2A1E', borderRadius: 8, padding: '52px 8px 8px', boxShadow: 'inset 0 0 0 1px rgba(255,244,226,.06)' }}>
        <div style={{ position: 'absolute', top: 7, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 12, padding: '6px 14px', background: '#CDAE6E', color: '#2A1D10', borderRadius: 3, boxShadow: '0 2px 3px rgba(0,0,0,.4)' }}>
          <span aria-hidden="true" style={{ width: 5, height: 5, borderRadius: '50%', background: '#7A6232' }} />
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span style={{ fontFamily: ANTON, fontSize: 15, lineHeight: 1, letterSpacing: '.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{title}</span>
            <span aria-hidden="true" style={{ display: 'flex', gap: 5 }}>
              {Array.from({ length: total }, (_, i) => (
                <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: i === index ? '#2A1D10' : 'rgba(42,29,16,.3)' }} />
              ))}
            </span>
          </span>
          <span aria-hidden="true" style={{ width: 5, height: 5, borderRadius: '50%', background: '#7A6232' }} />
        </div>
        <div style={{ height: '100%', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gridTemplateRows: 'repeat(6, minmax(0, 1fr))', gap: 14, padding: 14, borderRadius: 3, ...CORK, boxShadow: 'inset 0 0 30px rgba(70,35,10,.5)' }}>
          {children}
        </div>
      </div>
    </section>
  )
}
