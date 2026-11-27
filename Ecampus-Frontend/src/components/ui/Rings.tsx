type Ring = [offset: number, size: number]

/** Cercles décoratifs en bas à droite d'une carte « À la une ». */
export function Rings({ big, mid, small }: { big: Ring; mid: Ring; small: Ring }) {
  const circle = (o: number, s: number) => ({
    position: 'absolute' as const,
    right: -o,
    bottom: -o,
    width: s,
    height: s,
    borderRadius: '50%',
  })
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 3, pointerEvents: 'none' }}
    >
      <div style={{ ...circle(...big), border: '2px solid rgba(255,244,226,.2)' }} />
      <div style={{ ...circle(...mid), border: '2px solid rgba(255,244,226,.2)' }} />
      <div style={{ ...circle(...small), background: 'rgba(255,244,226,.1)' }} />
    </div>
  )
}
