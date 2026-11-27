import type { CSSProperties } from 'react'

/* Polices (chargées dans index.css) */
export const ANTON = "'Anton', Impact, sans-serif"
export const FRAUNCES = "'Fraunces', Georgia, serif"
export const MONO = "'IBM Plex Mono', ui-monospace, monospace"

/* Couleurs */
export const CREAM = '#FFF4E2'
export const DEFAULT_ACCENT = '#CC3D1C'

/* Dégradés des punaises */
export const PINS = {
  white: '#FFFFFF 0 20%, #EDE3CF 58%, #B9A988 100%',
  gold: '#FFF1B8 0 20%, #E2B33A 58%, #9A7313 100%',
  red: '#FFB3A3 0 20%, #D23B22 58%, #8A1E0C 100%',
  green: '#BDEBD3 0 20%, #2F8A62 58%, #175239 100%',
  blue: '#BFD6FF 0 20%, #2F62B8 58%, #173A78 100%',
  dark: '#8C7B6B 0 20%, #3A2E25 58%, #1A130E 100%',
} as const
export type PinColor = keyof typeof PINS

/* Fond en liège du tableau */
export const CORK: CSSProperties = {
  backgroundColor: '#BF8B58',
  backgroundImage:
    'radial-gradient(rgba(92,52,22,.38) 1px, transparent 1.6px), radial-gradient(rgba(255,232,196,.25) 1px, transparent 1.6px)',
  backgroundSize: '9px 9px, 13px 13px',
  backgroundPosition: '0 0, 4px 6px',
}

/* Papier millimétré bleu */
export const gridBlue = (size: number, alpha = 0.08): CSSProperties => ({
  backgroundColor: '#1E3A6B',
  backgroundImage: `linear-gradient(rgba(234,241,255,${alpha}) 1px, transparent 1px), linear-gradient(90deg, rgba(234,241,255,${alpha}) 1px, transparent 1px)`,
  backgroundSize: `${size}px ${size}px`,
})

/* Feuille à lignes */
export const ruledPaper = (offset: number): CSSProperties => ({
  backgroundColor: '#FDFCF7',
  backgroundImage:
    'repeating-linear-gradient(transparent 0 23px, rgba(30,58,107,.16) 23px 24px)',
  backgroundPosition: `0 ${offset}px`,
})

/**
 * Densité d'une carte :
 *  - lg : carte du tableau desktop
 *  - md : grande carte du carrousel mobile (pleine largeur)
 *  - sm : petite carte du carrousel mobile (demi-largeur)
 */
export type Density = 'lg' | 'md' | 'sm'

/** Choisit une valeur selon la densité (sm retombe sur md si non fourni). */
export function pick<T>(d: Density, lg: T, md: T, sm: T = md): T {
  return d === 'lg' ? lg : d === 'md' ? md : sm
}
