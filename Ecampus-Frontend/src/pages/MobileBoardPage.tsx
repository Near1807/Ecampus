import { useState, type CSSProperties, type PointerEvent } from 'react'
import { BoardItem } from '../components/BoardItem'
import { EmptySlot } from '../components/EmptySlot'
import { MobileHeader } from '../components/layout/MobileHeader'
import { MobileNav } from '../components/layout/MobileNav'
import { MobilePanel } from '../components/layout/MobilePanel'
import { ChevronLeftIcon, ChevronRightIcon } from '../components/ui/icons'
import { MOBILE_PANELS } from '../config/slots'
import { CREAM, FRAUNCES } from '../theme/tokens'
import type { Annonce } from '../types/annonce'

interface MobileBoardPageProps {
  annonces: Annonce[]
  accent: string
  tilt: boolean
}

const arrow = (side: 'left' | 'right'): CSSProperties => ({
  position: 'absolute',
  top: 8,
  [side]: 20,
  zIndex: 5,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 44,
  height: 44,
  borderRadius: '50%',
  background: 'rgba(22,17,13,.55)',
  border: '1px solid rgba(255,244,226,.25)',
  color: CREAM,
  cursor: 'pointer',
})

/** Page mobile : carrousel de 5 panneaux (swipe + flèches) et navigation basse. */
export function MobileBoardPage({ annonces, accent, tilt }: MobileBoardPageProps) {
  const total = MOBILE_PANELS.length
  const [index, setIndex] = useState(0)
  const [startX, setStartX] = useState<number | null>(null)
  const go = (i: number) => setIndex((i + total) % total)

  const onUp = (e: PointerEvent) => {
    if (startX === null) return
    const dx = e.clientX - startX
    setStartX(null)
    if (dx < -45) go(index + 1)
    else if (dx > 45) go(index - 1)
  }

  const byId = new Map(annonces.map((a) => [a.id, a]))

  return (
    <div style={{ width: '100%', maxWidth: 430, margin: '0 auto', height: '100dvh', minHeight: 600, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#16110D', color: CREAM, fontFamily: FRAUNCES }}>
      <MobileHeader accent={accent} />

      <main
        onPointerDown={(e) => setStartX(e.clientX)}
        onPointerUp={onUp}
        onPointerCancel={() => setStartX(null)}
        style={{ flex: '1 1 auto', minHeight: 0, position: 'relative', overflow: 'hidden', touchAction: 'pan-y', paddingBottom: 76 }}
      >
        <h1 className="sr">Panneaux d'annonces</h1>
        <div style={{ display: 'flex', height: '100%', transform: `translateX(${-index * 100}%)`, transition: 'transform .5s cubic-bezier(.2,.8,.2,1)' }}>
          {MOBILE_PANELS.map((panel, i) => (
            <MobilePanel key={panel.title} index={i} current={index} total={total} title={panel.title}>
              {panel.slots.map((slot, k) => {
                if (slot.annonceId === null) return <EmptySlot key={`empty-${k}`} col={slot.col} row={slot.row} />
                const annonce = byId.get(slot.annonceId)
                if (!annonce) return null
                return <BoardItem key={`${annonce.id}-${k}`} slot={slot} annonce={annonce} accent={accent} tilt={tilt} />
              })}
            </MobilePanel>
          ))}
        </div>

        <button type="button" onClick={() => go(index - 1)} aria-label="Panneau précédent" style={arrow('left')}>
          <ChevronLeftIcon />
        </button>
        <button type="button" onClick={() => go(index + 1)} aria-label="Panneau suivant" style={arrow('right')}>
          <ChevronRightIcon />
        </button>
      </main>

      <MobileNav accent={accent} />
    </div>
  )
}
