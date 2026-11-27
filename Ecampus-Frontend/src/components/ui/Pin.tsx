import type { CSSProperties } from 'react'
import { PINS, type PinColor } from '../../theme/tokens'

interface PinProps {
  color?: PinColor
  /** Décalage depuis la gauche / la droite (px). Par défaut : centrée. */
  left?: number
  right?: number
  top?: number
}

/** Punaise posée sur le haut d'une annonce. */
export function Pin({ color = 'white', left, right, top = -8 }: PinProps) {
  const x: CSSProperties =
    right !== undefined ? { right } : left !== undefined ? { left } : { left: '50%', marginLeft: -9 }
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        top,
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: `radial-gradient(circle at 34% 30%, ${PINS[color]})`,
        boxShadow: '2px 5px 5px rgba(30,12,2,.45)',
        zIndex: 3,
        ...x,
      }}
    />
  )
}
