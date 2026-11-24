import type { Annonce } from '../types/annonce'
import type { Density } from '../theme/tokens'

/** Emplacement d'une annonce sur la grille du tableau. */
export interface Slot {
  /** null = emplacement vide (« Place libre » sur mobile) */
  annonceId: string | null
  col: string
  row: string
  /** inclinaison en degrés */
  tilt: number
  density: Density
  variant?: string
  /** occupe plusieurs colonnes en responsive (classe .wide) */
  wide?: boolean
}

const s = (
  annonceId: string | null,
  col: string,
  row: string,
  tilt: number,
  density: Density,
  extra: Partial<Slot> = {},
): Slot => ({ annonceId, col, row, tilt, density, ...extra })

/**
 * Placement desktop (grille de 6 colonnes × lignes de 104px).
 * Temporaire : les ids correspondent aux données de démo. Les annonces qui n'ont
 * pas d'emplacement ici sont placées automatiquement par autoSlot().
 */
export const DESKTOP_SLOTS: Slot[] = [
  s('hackathon', '1 / span 3', '1 / span 4', -0.6, 'lg', { wide: true }),
  s('appel-campus', '4 / span 3', '1 / span 2', 0.8, 'lg', { wide: true }),
  s('journal-robotique', '4 / span 2', '3 / span 3', 1.2, 'lg'),
  s('calculatrice', '6 / span 1', '3 / span 2', -2.4, 'lg'),
  s('afterwork', '1 / span 2', '5 / span 2', -1, 'lg'),
  s('cle-usb', '3 / span 1', '5 / span 2', 2.6, 'lg'),
  s('breve-bibliotheque', '4 / span 2', '6 / span 1', -0.8, 'lg'),
  s('collecte-sang', '6 / span 1', '5 / span 2', 1.6, 'lg'),
  s('conference-ia', '1 / span 2', '7 / span 2', 0.7, 'lg'),
  s('veste-jean', '3 / span 1', '7 / span 2', 1.8, 'lg'),
  s('appel-domotique', '4 / span 2', '7 / span 2', -1.2, 'lg'),
  s('journal-recrute', '6 / span 1', '7 / span 2', -1.6, 'lg'),
]

/** Taille automatique selon le niveau de priorité (« taille = importance »). */
export function autoSlot(a: Annonce): Slot {
  switch (a.niveauPriorite) {
    case 'A_LA_UNE':
      return s(a.id, 'span 3', 'span 4', 0, 'lg', { wide: true })
    case 'HAUTE_PRIORITE':
      return s(a.id, 'span 2', 'span 2', 0, 'lg', { wide: true })
    default:
      return s(a.id, 'span 1', 'span 2', 0, 'lg')
  }
}

export interface MobilePanelDef {
  title: string
  slots: Slot[]
}

/** Panneaux du carrousel mobile (grille de 2 colonnes × 6 lignes). */
export const MOBILE_PANELS: MobilePanelDef[] = [
  {
    title: 'À la une',
    slots: [
      s('hackathon', '1 / span 2', '1 / span 3', -0.5, 'md'),
      s('journal-robotique', '1 / span 1', '4 / span 3', 1.4, 'sm'),
      s('appel-campus', '2 / span 1', '4 / span 3', -1.6, 'sm'),
    ],
  },
  {
    title: 'Événements',
    slots: [
      s('hackathon', '1 / span 2', '1 / span 2', 0.6, 'md', { variant: 'minimal' }),
      s('afterwork', '1 / span 2', '3 / span 2', -0.9, 'md'),
      s('collecte-sang', '1 / span 1', '5 / span 2', 1.6, 'sm'),
      s('conference-ia', '2 / span 1', '5 / span 2', -1.2, 'sm'),
    ],
  },
  {
    title: 'Objets trouvés',
    slots: [
      s('veste-jean', '1 / span 1', '1 / span 3', -1.8, 'sm'),
      s('calculatrice', '2 / span 1', '1 / span 3', 2, 'sm'),
      s('cle-usb', '1 / span 1', '4 / span 2', 2.4, 'sm'),
      s(null, '2 / span 1', '4 / span 3', 0, 'sm'),
    ],
  },
  {
    title: 'Journal',
    slots: [
      s('journal-robotique', '1 / span 2', '1 / span 4', -0.6, 'md'),
      s('journal-recrute', '1 / span 1', '5 / span 2', 1.2, 'sm'),
      s('breve-bibliotheque', '2 / span 1', '5 / span 2', -1.8, 'sm'),
    ],
  },
  {
    title: 'Appels à projet',
    slots: [
      s('appel-campus', '1 / span 2', '1 / span 3', 0.5, 'md'),
      s('appel-domotique', '1 / span 2', '4 / span 3', -0.8, 'md'),
    ],
  },
]
