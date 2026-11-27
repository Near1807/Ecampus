import { useMemo, useState } from 'react'
import { BoardItem } from '../components/BoardItem'
import { FilterBar } from '../components/layout/FilterBar'
import type { FilterId } from '../config/categories'
import { layoutDesktop } from '../layout/board'
import { CORK, CREAM, FRAUNCES, MONO } from '../theme/tokens'
import type { Annonce } from '../types/annonce'

interface BoardPageProps {
  annonces: Annonce[]
  accent: string
  tilt: boolean
  /** 0 = disposition par défaut ; un autre entier donne une autre disposition. */
  seed: number
}

/** Page principale (desktop) : en-tête, filtres et tableau en liège rempli depuis le coin haut gauche. */
export function BoardPage({ annonces, accent, tilt, seed }: BoardPageProps) {
  const [filter, setFilter] = useState<FilterId>('all')

  const byId = useMemo(() => new Map(annonces.map((a) => [a.id, a])), [annonces])
  const slots = useMemo(() => layoutDesktop(annonces, seed), [annonces, seed])

  return (
    <div style={{ minHeight: '100%', background: '#16110D', color: CREAM, fontFamily: FRAUNCES }}>
      <header style={{ borderBottom: '1px solid rgba(255,244,226,.12)' }}>
        <FilterBar accent={accent} filter={filter} onChange={setFilter} />
      </header>

      <main className="wrap" style={{ maxWidth: 1440, margin: '0 auto', padding: '28px 40px 24px' }}>
        <h1 className="sr">Tableau des annonces</h1>
        <div style={{ background: '#3A2A1E', padding: 14, borderRadius: 10, boxShadow: 'inset 0 0 0 1px rgba(255,244,226,.06), 0 30px 60px -24px rgba(0,0,0,.7)' }}>
          <div
            className="board"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gridAutoRows: 104, gap: 22, padding: 36, borderRadius: 4, ...CORK, boxShadow: 'inset 0 0 50px rgba(70,35,10,.5)' }}
          >
            {slots.map((slot) => {
              const annonce = slot.annonceId ? byId.get(slot.annonceId) : undefined
              if (!annonce) return null
              return (
                <BoardItem
                  key={annonce.id}
                  slot={slot}
                  annonce={annonce}
                  accent={accent}
                  tilt={tilt}
                  dimmed={filter !== 'all' && annonce.categorie !== filter}
                />
              )
            })}
          </div>
        </div>
        <p style={{ margin: '20px 0 0', fontFamily: MONO, fontSize: 11.5, color: 'rgba(255,244,226,.6)' }}>
          Chaque annonce est publiée après validation par un administrateur.
        </p>
      </main>
    </div>
  )
}
