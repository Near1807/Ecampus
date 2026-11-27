import { ANTON, CREAM, MONO } from '../../theme/tokens'
import { PlusIcon, SearchIcon, UserIcon } from '../ui/icons'
import { Link, NavLink } from 'react-router-dom'

const navLink = (active: boolean, accent: string) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  minHeight: 44,
  color: active ? CREAM : 'rgba(255,244,226,.78)',
  textDecoration: 'none',
  ...(active ? { borderBottom: `2px solid ${accent}`, boxSizing: 'border-box' as const } : {}),
})

/** Barre du haut du site (desktop) : logo, navigation, recherche, actions. */
export function TopBar({ accent }: { accent: string }) {
  return (
    <div className="wrap" style={{ maxWidth: 'none', padding: '16px 40px', borderBottom: '1px solid rgba(255,244,226,.12)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px 32px' }}>
      <Link to="/" style={{ display: 'flex', flexDirection: 'column', gap: 2, textDecoration: 'none', color: CREAM }}>
        <span style={{ fontFamily: ANTON, fontSize: 32, lineHeight: 1, letterSpacing: '.01em' }}>
          E<span style={{ color: accent }}>-CAMpus</span>
        </span>
        <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.06em', color: 'rgba(255,244,226,.68)' }}>
          Le tableau d'affichage de l'ECAM
        </span>
      </Link>

      <nav aria-label="Navigation principale" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 22px', fontFamily: MONO, fontSize: 13 }}>
        <NavLink to="/" end style={({ isActive }) => navLink(isActive, accent)}>Tableau</NavLink>
        <NavLink to="/mes-annonces" style={({ isActive }) => navLink(isActive, accent)}>Mes annonces</NavLink>
        <NavLink to="/conversations" style={({ isActive }) => navLink(isActive, accent)}>
          Conversations
          <span style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', padding: '2px 6px', borderRadius: 3, background: 'rgba(255,244,226,.12)', color: CREAM }}>
            Admin
          </span>
        </NavLink>
      </nav>

      <div style={{ marginLeft: 'auto', display: 'flex', flexWrap: 'nowrap', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 200 }}>
          <label htmlFor="recherche" className="sr">Rechercher une annonce</label>
          <span style={{ position: 'absolute', left: 15, top: 14, color: 'rgba(255,244,226,.7)', display: 'flex' }}>
            <SearchIcon size={16} />
          </span>
          <input
            id="recherche"
            type="search"
            placeholder="Rechercher une annonce…"
            style={{ width: '100%', height: 44, padding: '0 16px 0 40px', background: 'rgba(255,244,226,.07)', border: '1px solid rgba(255,244,226,.22)', borderRadius: 999, color: CREAM, fontFamily: MONO, fontSize: 13 }}
          />
        </div>
        <button type="button" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 44, padding: '0 20px', border: 0, borderRadius: 999, background: accent, color: CREAM, fontFamily: MONO, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          <PlusIcon size={16} />
          Publier une annonce
        </button>
        <Link
          to="/login"
          aria-label="Se connecter"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: 44, height: 44, padding: 0, lineHeight: 0, borderRadius: '50%', background: '#3A2A1E', border: '1px solid rgba(255,244,226,.22)', color: CREAM, textDecoration: 'none', cursor: 'pointer' }}
        >
          <UserIcon />
        </Link>
      </div>
    </div>
  )
}
