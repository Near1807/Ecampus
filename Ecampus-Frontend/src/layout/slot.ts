import type { Density } from '../theme/tokens'

/** Emplacement calculé d'une annonce sur la grille (consommé par BoardItem). */
export interface Slot {
  /** null = emplacement vide « Place libre » (mobile) */
  annonceId: string | null
  /** gridColumn, ex. '1 / span 3' */
  col: string
  /** gridRow, ex. '1 / span 4' */
  row: string
  /** inclinaison en degrés */
  tilt: number
  density: Density
  variant?: string
  /** grande carte : occupe 2 colonnes en responsive (classe .wide) */
  wide?: boolean
}

/** Inclinaison stable (entre -2,6° et +2,6°) déduite de l'id : ne change pas d'un rendu à l'autre. */
export function tiltFor(id: string): number {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619)
  return ((h >>> 0) % 521) / 100 - 2.6
}
