const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** « Vendredi 20 novembre 2026 » */
export function formatDateLong(d = new Date()): string {
  return cap(d.toLocaleDateString('fr-BE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))
}

/** « Ven. 20 novembre 2026 » */
export function formatDateShort(d = new Date()): string {
  return cap(d.toLocaleDateString('fr-BE', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }))
}
