import { templateCodeOf } from '../components/cards/registry'
import type { Annonce, NiveauPriorite } from '../types/annonce'
import { packGrid, type Placement } from './packGrid'
import {
  DESKTOP_GRID,
  DESKTOP_SHAPES,
  MOBILE_GRID,
  MOBILE_SHAPES,
  PLACE_LIBRE_SHAPES,
  shapesFor,
} from './shapes'
import { tiltFor, type Slot } from './slot'

const PRIORITY_RANK: Record<NiveauPriorite, number> = { A_LA_UNE: 0, HAUTE_PRIORITE: 1, STANDARD: 2 }

/** « À la une » d'abord, puis haute priorité, puis standard (ordre d'origine conservé à priorité égale). */
export function sortByPriority(annonces: Annonce[]): Annonce[] {
  return [...annonces].sort((a, b) => PRIORITY_RANK[a.niveauPriorite] - PRIORITY_RANK[b.niveauPriorite])
}

const span = (start: number, size: number) => `${start + 1} / span ${size}`

/* ---------------- Desktop ---------------- */

/** Calcule les emplacements du tableau desktop, en remplissant depuis le coin haut gauche. */
export function layoutDesktop(annonces: Annonce[], seed = 0): Slot[] {
  const { placements } = packGrid<Annonce>({
    cols: DESKTOP_GRID.cols,
    maxRows: DESKTOP_GRID.maxRows,
    items: sortByPriority(annonces),
    shapesFor: (a) => shapesFor(a, DESKTOP_SHAPES),
    seed,
  })
  return placements.map((p) => ({
    annonceId: p.item.id,
    col: span(p.col, p.cols),
    row: span(p.row, p.rows),
    tilt: tiltFor(p.item.id),
    density: 'lg',
    wide: p.cols >= 3,
  }))
}

/* ---------------- Mobile ---------------- */

export interface MobilePanelDef {
  title: string
  slots: Slot[]
}

interface PanelRule {
  title: string
  /** quelles annonces vont dans ce panneau */
  match: (a: Annonce) => boolean
  /** true : ce qui ne tient pas passe dans un panneau supplémentaire ; false : le surplus n'est pas affiché ici */
  spill: boolean
  /** ajoute un emplacement « Place libre » s'il reste de la place */
  placeLibre?: boolean
}

const KNOWN: string[] = ['EVENEMENT', 'OBJET_TROUVE', 'OBJET_A_DONNER', 'JOURNAL', 'APPEL_A_PROJET']

/** Définition des panneaux du carrousel mobile (dans l'ordre d'affichage). Un panneau vide est ignoré. */
const PANEL_RULES: PanelRule[] = [
  { title: 'À la une', match: (a) => a.niveauPriorite !== 'STANDARD', spill: false },
  { title: 'Événements', match: (a) => a.categorie === 'EVENEMENT', spill: true },
  {
    title: 'Objets trouvés',
    match: (a) => a.categorie === 'OBJET_TROUVE' || a.categorie === 'OBJET_A_DONNER',
    spill: true,
    placeLibre: true,
  },
  { title: 'Journal', match: (a) => a.categorie === 'JOURNAL', spill: true },
  { title: 'Appels à projet', match: (a) => a.categorie === 'APPEL_A_PROJET', spill: true },
  { title: 'Autres annonces', match: (a) => !KNOWN.includes(a.categorie), spill: true },
]

function toMobileSlot(p: Placement<Annonce | null>): Slot {
  const a = p.item
  return {
    annonceId: a ? a.id : null,
    col: span(p.col, p.cols),
    row: span(p.row, p.rows),
    tilt: a ? tiltFor(a.id) : 0,
    density: p.cols >= 2 ? 'md' : 'sm',
    // version compacte de la carte « À la une » quand elle est basse
    variant: a && p.rows <= 2 && templateCodeOf(a) === 'AFFICHE_UNE' ? 'minimal' : undefined,
  }
}

/** Calcule les panneaux du carrousel mobile (grille 2 × 6, remplie depuis le coin haut gauche). */
export function layoutMobile(annonces: Annonce[], seed = 0): MobilePanelDef[] {
  const panels: MobilePanelDef[] = []

  for (const rule of PANEL_RULES) {
    let queue: (Annonce | null)[] = sortByPriority(annonces.filter(rule.match))
    if (queue.length === 0) continue
    if (rule.placeLibre) queue = [...queue, null]

    for (let page = 1; queue.length > 0; page++) {
      const { placements, leftover } = packGrid<Annonce | null>({
        cols: MOBILE_GRID.cols,
        maxRows: MOBILE_GRID.rows,
        items: queue,
        shapesFor: (a) => (a ? shapesFor(a, MOBILE_SHAPES) : PLACE_LIBRE_SHAPES),
        seed,
      })
      if (placements.length === 0) break // sécurité : rien ne tient, on s'arrête
      panels.push({
        title: page === 1 ? rule.title : `${rule.title} (${page})`,
        slots: placements.map(toMobileSlot),
      })
      if (!rule.spill) break
      queue = leftover.filter((a) => a !== null) // « Place libre » n'est pas reportée
    }
  }
  return panels
}
