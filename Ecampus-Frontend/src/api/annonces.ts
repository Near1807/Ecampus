import type { Annonce } from '../types/annonce'
import { MOCK_ANNONCES } from '../data/mockAnnonces'

/**
 * Mode démo : actif tant que VITE_USE_MOCK n'est pas défini à 'false'.
 * Pour brancher le backend : créer .env.local avec VITE_USE_MOCK=false
 * (les appels /api/* sont proxyfiés vers Spring Boot par vite.config.ts et nginx.conf).
 */
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export async function fetchAnnonces(signal?: AbortSignal): Promise<Annonce[]> {
  if (USE_MOCK) return MOCK_ANNONCES

  // ⚠ Endpoint à créer côté backend (aucun AnnonceController pour l'instant).
  const res = await fetch('/api/annonces', { signal })
  if (!res.ok) throw new Error(`GET /api/annonces → ${res.status}`)
  const all = (await res.json()) as Annonce[]
  // Le tableau n'affiche que les annonces validées par un administrateur.
  return all.filter((a) => a.validationStatus === 'VALIDE')
}
