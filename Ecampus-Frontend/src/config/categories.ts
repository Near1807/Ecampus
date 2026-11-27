import type { CategorieAffichage } from '../types/annonce'

export type FilterId = 'all' | CategorieAffichage

export interface FilterDef {
  id: FilterId
  label: string
  /** 'ACCENT' = couleur d'accent du thème */
  swatch: string
}

/** Filtres de la barre du tableau (desktop). */
export const FILTERS: FilterDef[] = [
  { id: 'all', label: 'Tout', swatch: 'transparent' },
  { id: 'EVENEMENT', label: 'Événements', swatch: 'ACCENT' },
  { id: 'OBJET_TROUVE', label: 'Objets trouvés', swatch: '#E7C873' },
  { id: 'JOURNAL', label: 'Journal', swatch: '#F3EEE3' },
  { id: 'APPEL_A_PROJET', label: 'Appels à projet', swatch: '#3D6BB3' },
]
