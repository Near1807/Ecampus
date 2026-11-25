import type { Annonce } from '../types/annonce'
import type { Slot } from '../layout/slot'
import { resolveCard } from './cards/registry'

interface BoardItemProps {
  slot: Slot
  annonce: Annonce
  accent: string
  /** Inclinaison activée ? */
  tilt: boolean
  /** Estompe l'annonce (filtre actif sur une autre catégorie). */
  dimmed?: boolean
}

/** Place une annonce sur la grille : position, inclinaison, atténuation, puis délègue à la carte du template. */
export function BoardItem({ slot, annonce, accent, tilt, dimmed = false }: BoardItemProps) {
  const Card = resolveCard(annonce)
  return (
    <div
      className={slot.wide ? 'wide' : undefined}
      style={{
        gridColumn: slot.col,
        gridRow: slot.row,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        opacity: dimmed ? 0.2 : 1,
        filter: `grayscale(${dimmed ? 1 : 0})`,
        transform: `rotate(${tilt ? slot.tilt : 0}deg)`,
        transition: 'opacity .35s ease, filter .35s ease, transform .35s ease',
      }}
    >
      <Card annonce={annonce} accent={accent} density={slot.density} variant={slot.variant} />
    </div>
  )
}
