import type { CSSProperties } from 'react'

interface TapeProps {
  w: number
  h: number
  rotate: number
  top?: number
  left?: number
  right?: number
  center?: boolean
  bg?: string
}

/** Morceau de scotch translucide. */
export function Tape({ w, h, rotate, top = -10, left, right, center, bg = 'rgba(246,238,214,.75)' }: TapeProps) {
  const x: CSSProperties = center
    ? { left: '50%', marginLeft: -w / 2 }
    : right !== undefined
      ? { right }
      : { left }
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        top,
        width: w,
        height: h,
        background: bg,
        transform: `rotate(${rotate}deg)`,
        boxShadow: '0 1px 2px rgba(0,0,0,.15)',
        zIndex: 3,
        ...x,
      }}
    />
  )
}
