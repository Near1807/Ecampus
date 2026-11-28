import { FILTERS, type FilterId } from '../../config/categories'
import { CREAM, MONO } from '../../theme/tokens'
import { formatDateLong } from '../../utils/date'

interface FilterBarProps {
  accent: string
  filter: FilterId
  onChange: (id: FilterId) => void
}

const legendItem = { display: 'inline-flex', alignItems: 'center', gap: 6 } as const

/** Date du jour, filtres par catégorie et légende des tailles. */
export function FilterBar({ accent, filter, onChange }: FilterBarProps) {
  return (
    <div className="wrap" style={{ maxWidth: 1440, margin: '0 auto', padding: '4px 40px 18px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 20px' }}>
      <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '.04em', color: 'rgba(255,244,226,.7)' }}>{formatDateLong()}</span>

      <div role="group" aria-label="Filtrer par catégorie" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {FILTERS.map((f) => {
          const on = filter === f.id
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onChange(f.id)}
              aria-pressed={on}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                minHeight: 44,
                padding: '0 16px',
                borderRadius: 999,
                border: `1px solid ${on ? CREAM : 'rgba(255,244,226,.28)'}`,
                background: on ? CREAM : 'transparent',
                color: on ? '#1A1410' : CREAM,
                fontFamily: MONO,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background .2s ease, color .2s ease',
              }}
            >
              <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: 2, background: f.swatch === 'ACCENT' ? accent : f.swatch, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.25)' }} />
              {f.label}
            </button>
          )
        })}
      </div>

      <div className="legend" style={{ marginLeft: 'auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 14px', fontFamily: MONO, fontSize: 11.5, color: 'rgba(255,244,226,.7)' }}>
        <span>Taille = importance</span>
        <span style={legendItem}><span aria-hidden="true" style={{ width: 8, height: 8, border: '1px solid rgba(255,244,226,.6)' }} />Standard</span>
        <span style={legendItem}><span aria-hidden="true" style={{ width: 12, height: 12, border: '1px solid rgba(255,244,226,.6)' }} />Important</span>
        <span style={legendItem}><span aria-hidden="true" style={{ width: 16, height: 16, background: accent }} />À la une</span>
      </div>
    </div>
  )
}
