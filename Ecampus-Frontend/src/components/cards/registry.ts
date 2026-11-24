import type { ComponentType } from 'react'
import type { Annonce } from '../../types/annonce'
import { AfficheAccent } from './AfficheAccent'
import { AfficheCreme } from './AfficheCreme'
import { AfficheSombre } from './AfficheSombre'
import { AfficheUne } from './AfficheUne'
import { AppelProjet } from './AppelProjet'
import { Breve } from './Breve'
import { Etiquette } from './Etiquette'
import { FeuilleQuadrillee } from './FeuilleQuadrillee'
import { JournalUne } from './JournalUne'
import { NoteJournal } from './NoteJournal'
import { Polaroid } from './Polaroid'
import { PostIt } from './PostIt'
import type { CardProps } from './types'

/**
 * Un template = un composant React. La base ne stocke que le `code` stable
 * (table `templates`) ; ce registre fait la correspondance code → composant.
 * Ajouter un template = 1 composant + 1 ligne ici + 1 INSERT dans `templates`.
 */
export const CARD_BY_CODE: Record<string, ComponentType<CardProps>> = {
  STANDARD: AfficheCreme,
  AFFICHE_UNE: AfficheUne,
  APPEL_PROJET: AppelProjet,
  JOURNAL_UNE: JournalUne,
  BREVE: Breve,
  ETIQUETTE: Etiquette,
  POST_IT: PostIt,
  POLAROID: Polaroid,
  AFFICHE_CREME: AfficheCreme,
  AFFICHE_ACCENT: AfficheAccent,
  AFFICHE_SOMBRE: AfficheSombre,
  FEUILLE_QUADRILLEE: FeuilleQuadrillee,
  NOTE_JOURNAL: NoteJournal,
}

/** Ids de la migration 20261120120000_seed_templates.sql (utilisé si l'API ne renvoie que templateId). */
const CODE_BY_ID: Record<number, string> = {
  0: 'STANDARD',
  1: 'AFFICHE_UNE',
  2: 'APPEL_PROJET',
  3: 'JOURNAL_UNE',
  4: 'BREVE',
  5: 'ETIQUETTE',
  6: 'POST_IT',
  7: 'POLAROID',
  8: 'AFFICHE_CREME',
  9: 'AFFICHE_ACCENT',
  10: 'AFFICHE_SOMBRE',
  11: 'FEUILLE_QUADRILLEE',
  12: 'NOTE_JOURNAL',
}

export function resolveCard(annonce: Annonce): ComponentType<CardProps> {
  const code = annonce.templateCode ?? CODE_BY_ID[annonce.templateId] ?? 'STANDARD'
  return CARD_BY_CODE[code] ?? CARD_BY_CODE.STANDARD
}
