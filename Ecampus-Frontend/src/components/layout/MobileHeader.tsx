import { ANTON, CREAM, MONO } from '../../theme/tokens'
import { formatDateShort } from '../../utils/date'
import { SearchIcon } from '../ui/icons'

export function MobileHeader({ accent }: { accent: string }) {
  return (
    <header style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, height: 60, padding: '8px 16px' }}>
      <a href="#" style={{ display: 'flex', flexDirection: 'column', gap: 2, textDecoration: 'none', color: CREAM }}>
        <span style={{ fontFamily: ANTON, fontSize: 26, lineHeight: 1, letterSpacing: '.01em' }}>
          E<span style={{ color: accent }}>-</span>camarade
        </span>
        <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '.04em', color: 'rgba(255,244,226,.68)' }}>{formatDateShort()}</span>
      </a>
      <button type="button" aria-label="Rechercher une annonce" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,244,226,.07)', border: '1px solid rgba(255,244,226,.22)', color: CREAM, cursor: 'pointer' }}>
        <SearchIcon />
      </button>
    </header>
  )
}
