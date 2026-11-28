import { ANTON, CREAM, FRAUNCES, MONO } from '../theme/tokens'

/** Emplacement vide « Place libre » (panneau Objets trouvés du mobile). */
export function EmptySlot({ col, row }: { col: string; row: string }) {
  return (
    <div
      style={{
        gridColumn: col,
        gridRow: row,
        border: '2px dashed rgba(58,36,18,.55)',
        borderRadius: 4,
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        textAlign: 'center',
        color: '#3A2412',
      }}
    >
      <span style={{ fontFamily: ANTON, fontSize: 18, letterSpacing: '.06em', textTransform: 'uppercase' }}>Place libre</span>
      <p style={{ margin: 0, fontFamily: FRAUNCES, fontSize: 13, lineHeight: 1.35 }}>Tu as trouvé quelque chose ? Épingle-le ici.</p>
      <a
        href="#"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 44, padding: '0 14px', borderRadius: 999, background: '#3A2412', color: CREAM, fontFamily: MONO, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}
      >
        + Publier
      </a>
    </div>
  )
}
