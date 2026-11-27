import type { Annonce } from '../../types/annonce'
import type { Density } from '../../theme/tokens'

/** Props communes à toutes les cartes (un gabarit = un composant). */
export interface CardProps {
  annonce: Annonce
  accent: string
  density: Density
  /** Variante propre à certains gabarits (ex. 'minimal' pour AfficheUne). */
  variant?: string
}

/** Étiquette de catégorie : version complète en desktop, courte en mobile. */
export function kickerOf(annonce: Annonce, density: Density): string {
  const d = annonce.details
  return density === 'lg' ? (d?.kicker ?? '') : (d?.kickerCourt ?? d?.kicker ?? '')
}
