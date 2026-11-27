import type { CSSProperties } from 'react'
import { CREAM, MONO } from '../../theme/tokens'
import { BoardIcon, DocIcon, PlusIcon, ShieldIcon, UserIcon } from '../ui/icons'

const item = (active: boolean): CSSProperties => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  height: '100%',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  fontFamily: MONO,
  fontSize: 10,
  color: active ? CREAM : 'rgba(255,244,226,.65)',
})

/** Barre de navigation basse du mobile, avec bouton « Publier » central. */
export function MobileNav({ accent }: { accent: string }) {
  return (
    <nav aria-label="Navigation principale" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 76, display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', alignItems: 'center', background: '#1F1813', borderTop: '1px solid rgba(255,244,226,.12)', zIndex: 6 }}>
      <a href="#" aria-current="page" style={item(true)}>
        <span aria-hidden="true" style={{ position: 'absolute', top: 0, left: '50%', marginLeft: -14, width: 28, height: 3, background: accent }} />
        <BoardIcon size={22} />
        Tableau
      </a>
      <a href="#" style={item(false)}>
        <DocIcon size={22} />
        Mes annonces
      </a>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button type="button" aria-label="Publier une annonce" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, marginTop: -26, border: '4px solid #16110D', borderRadius: '50%', background: accent, color: CREAM, boxShadow: '0 10px 18px -6px rgba(0,0,0,.6)', cursor: 'pointer' }}>
          <PlusIcon size={24} strokeWidth={2.4} />
        </button>
      </div>
      <a href="#" style={item(false)}>
        <ShieldIcon size={22} />
        Modération
      </a>
      <a href="#" style={item(false)}>
        <UserIcon size={22} />
        Compte
      </a>
    </nav>
  )
}
