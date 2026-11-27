import { useEffect, useState } from 'react'
import { fetchAnnonces } from '../api/annonces'
import type { Annonce } from '../types/annonce'

export function useAnnonces() {
  const [annonces, setAnnonces] = useState<Annonce[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const ctrl = new AbortController()
    fetchAnnonces(ctrl.signal)
      .then((data) => {
        if (!ctrl.signal.aborted) setAnnonces(data)
      })
      .catch((e: unknown) => {
        if (!ctrl.signal.aborted) setError(e instanceof Error ? e.message : 'Erreur inconnue')
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false)
      })
    return () => ctrl.abort()
  }, [])

  return { annonces, loading, error }
}
