import { templateCodeOf } from '../components/cards/registry'
import type { Annonce, NiveauPriorite } from '../types/annonce'
import type { Shape } from './packGrid'

const sh = (cols: number, rows: number): Shape => ({ cols, rows })

/**
 * Formes possibles d'une annonce, de la plus souhaitée à la moins souhaitée.
 * Priorité : on cherche d'abord `byTemplate` (certains templates ont besoin d'un format précis),
 * sinon `byPriority` (« taille = importance »).
 */
export interface ShapeTable {
  byPriority: Record<NiveauPriorite, Shape[]>
  byTemplate: Record<string, Shape[]>
}

/* ---------------- Desktop ---------------- */

export const DESKTOP_GRID = {
  cols: 6,
  /** Hauteur maximale en lignes. Infinity = le tableau grandit autant que nécessaire. */
  maxRows: Infinity,
}

export const DESKTOP_SHAPES: ShapeTable = {
  byPriority: {
    A_LA_UNE: [sh(3, 4), sh(4, 3), sh(2, 3)],
    HAUTE_PRIORITE: [sh(2, 2), sh(3, 2), sh(2, 3), sh(1, 3)],
    STANDARD: [sh(1, 2), sh(1, 3), sh(2, 2)],
  },
  byTemplate: {
    JOURNAL_UNE: [sh(2, 3), sh(3, 3)],
    APPEL_PROJET: [sh(3, 2), sh(2, 2)],
    BREVE: [sh(2, 1), sh(1, 2)],
    ETIQUETTE: [sh(1, 2), sh(1, 3)],
    POST_IT: [sh(1, 2), sh(1, 3)],
    POLAROID: [sh(1, 2), sh(1, 3)],
    NOTE_JOURNAL: [sh(1, 2), sh(1, 3)],
  },
}

/* ---------------- Mobile (un panneau = 2 colonnes × 6 lignes) ---------------- */

export const MOBILE_GRID = { cols: 2, rows: 6 }

export const MOBILE_SHAPES: ShapeTable = {
  byPriority: {
    A_LA_UNE: [sh(2, 3), sh(2, 2)],
    HAUTE_PRIORITE: [sh(1, 3), sh(2, 2), sh(2, 3)],
    STANDARD: [sh(1, 3), sh(1, 2), sh(2, 2)],
  },
  byTemplate: {
    JOURNAL_UNE: [sh(2, 3), sh(1, 3)],
    BREVE: [sh(1, 2)],
    ETIQUETTE: [sh(1, 3), sh(1, 2)],
    POST_IT: [sh(1, 2), sh(1, 3)],
    POLAROID: [sh(1, 3)],
    NOTE_JOURNAL: [sh(1, 2), sh(1, 3)],
  },
}

/** Formes de l'emplacement vide « Place libre ». */
export const PLACE_LIBRE_SHAPES: Shape[] = [sh(1, 3), sh(1, 2)]

export function shapesFor(annonce: Annonce, table: ShapeTable): Shape[] {
  return table.byTemplate[templateCodeOf(annonce)] ?? table.byPriority[annonce.niveauPriorite]
}
