/** Miroir des enums du backend (model/Categorie.java, NiveauPriorite.java, ValidationStatus.java). */
export type Categorie =
  | 'OBJET_TROUVE'
  | 'OBJET_A_DONNER'
  | 'EVENEMENT'
  | 'APPEL_A_PROJET'
  | 'PUBLICITE'
  | 'ANNONCE_ADMINISTRATION'

/**
 * Catégories affichées sur le tableau.
 * ⚠ 'JOURNAL' n'existe pas encore côté backend : il faut l'ajouter à l'enum Java
 * `Categorie` ET au CHECK `chk_annonces_categorie` de la base (nouvelle migration).
 */
export type CategorieAffichage = Categorie | 'JOURNAL'

export type NiveauPriorite = 'STANDARD' | 'HAUTE_PRIORITE' | 'A_LA_UNE'
export type ValidationStatus = 'EN_ATTENTE' | 'VALIDE' | 'DECLINE'

/**
 * Champs d'affichage propres aux gabarits (dates formatées, lieu, lien, tags…).
 * ⚠ Absents du backend actuel : à ajouter (colonne JSONB `details`) ou à
 * déduire de description_longue / event_date.
 */
export interface AnnonceDetails {
  kicker?: string // étiquette complète (desktop)
  kickerCourt?: string // étiquette courte (mobile)
  sousTitre?: string // 2e ligne du titre (en contour)
  accroche?: string
  ref?: string
  numero?: string
  edition?: string
  editionCourte?: string
  rubrique?: string
  etiquette?: string
  dateBig?: string
  dateLabel?: string
  dateShort?: string
  horaire?: string
  lieu?: string
  lieuCourt?: string
  quand?: string
  deadline?: string
  deadlineYear?: string
  ctaLabel?: string
  ctaLabelCourt?: string
  ctaHref?: string
  signature?: string
  intervenant?: string
  note?: string
  tags?: string[]
  imageUrl?: string
  imageAlt?: string
}

export interface Annonce {
  id: string
  categorie: CategorieAffichage
  titre: string
  descriptionCourte?: string | null
  descriptionLongue: string
  niveauPriorite: NiveauPriorite
  validationStatus: ValidationStatus
  /** id de la table `templates` (0 = STANDARD). */
  templateId: number
  /** Code stable du template (table `templates`), prioritaire sur templateId si fourni par l'API. */
  templateCode?: string
  createdAt: string
  expiresAt?: string | null
  eventDate?: string | null
  details?: AnnonceDetails
}
