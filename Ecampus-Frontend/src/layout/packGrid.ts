/**
 * Algorithme de remplissage d'une grille, sans aucune dépendance à React.
 *
 * Principe : on part TOUJOURS de la première case libre en balayant la grille
 * ligne par ligne depuis le coin haut gauche. On y place la première annonce de
 * la file dont une forme (largeur × hauteur) tient dans la place disponible, en
 * essayant ses formes par ordre de préférence. Quand rien ne tient, la case reste
 * vide et on passe à la suivante. On continue tant qu'il reste de la place et des annonces.
 */

export interface Shape {
  /** nombre de colonnes occupées */
  cols: number
  /** nombre de lignes occupées */
  rows: number
}

export interface PackOptions<T> {
  /** largeur de la grille (nombre de colonnes) */
  cols: number
  /** hauteur maximale ; illimitée si absente (la grille grandit vers le bas) */
  maxRows?: number
  /** éléments à placer, dans l'ordre de priorité */
  items: T[]
  /** formes possibles d'un élément, de la plus souhaitée à la moins souhaitée */
  shapesFor: (item: T) => Shape[]
  /** 0 = ordre de préférence tel quel ; tout autre entier = autre disposition (déterministe) */
  seed?: number
  /**
   * Quand aucune annonce ne tient avec sa forme préférée, on accepte sa
   * N-ième forme au plus (0 = jamais de compromis). Défaut : 1.
   */
  compromise?: number
}

export interface Placement<T> extends Shape {
  item: T
  /** colonne de départ, à partir de 0 */
  col: number
  /** ligne de départ, à partir de 0 */
  row: number
}

export interface PackResult<T> {
  placements: Placement<T>[]
  /** hauteur utilisée par la grille */
  rows: number
  /** éléments qui n'ont pas trouvé de place */
  leftover: T[]
}

/** Petit générateur pseudo-aléatoire déterministe. */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffled<S>(list: S[], rand: () => number): S[] {
  const a = list.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function packGrid<T>({
  cols,
  maxRows = Infinity,
  items,
  shapesFor,
  seed = 0,
  compromise = 1,
}: PackOptions<T>): PackResult<T> {
  const rand = seed ? mulberry32(seed) : null

  // File d'attente : chaque élément avec ses formes valides (qui tiennent dans la grille).
  const leftover: T[] = []
  const queue: { item: T; shapes: Shape[] }[] = []
  for (const item of items) {
    const valid = shapesFor(item).filter(
      (s) => s.cols >= 1 && s.rows >= 1 && s.cols <= cols && s.rows <= maxRows,
    )
    if (valid.length === 0) leftover.push(item)
    else queue.push({ item, shapes: rand ? shuffled(valid, rand) : valid })
  }

  // busy[ligne][colonne] = case occupée (par une carte ou laissée vide)
  const busy: boolean[][] = []
  const isFree = (r: number, c: number) => !busy[r]?.[c]
  const occupy = (r: number, c: number, w: number, h: number) => {
    for (let y = r; y < r + h; y++) {
      busy[y] ??= Array<boolean>(cols).fill(false)
      for (let x = c; x < c + w; x++) busy[y][x] = true
    }
  }

  const placements: Placement<T>[] = []
  let r = 0
  let c = 0 // curseur : ne revient jamais en arrière

  while (queue.length > 0) {
    // 1. Première case libre, en balayant depuis le coin haut gauche.
    while (r < maxRows && !isFree(r, c)) {
      c++
      if (c >= cols) {
        c = 0
        r++
      }
    }
    if (r >= maxRows) break

    // Largeur libre à droite de cette case, et hauteur disponible.
    let w = 0
    while (c + w < cols && isFree(r, c + w)) w++
    const roomRows = maxRows - r
    const fits = (s: Shape) => s.cols <= w && s.rows <= roomRows

    // 2a. Première annonce de la file dont la FORME PRÉFÉRÉE tient ici.
    let pick = queue.findIndex((q) => fits(q.shapes[0]))
    let shape: Shape | undefined = pick >= 0 ? queue[pick].shapes[0] : undefined

    // 2b. Sinon, compromis : l'annonce qui tient avec sa forme la moins éloignée de sa préférence.
    if (pick < 0) {
      let bestRank = Infinity
      queue.forEach((q, qi) => {
        const si = q.shapes.findIndex(fits)
        if (si >= 0 && si <= compromise && si < bestRank) {
          bestRank = si
          pick = qi
          shape = q.shapes[si]
        }
      })
    }

    // 3. Rien ne tient : la case reste vide, on passe à la suivante.
    if (pick < 0 || !shape) {
      occupy(r, c, 1, 1)
      continue
    }

    // 4. Pas de trou orphelin : si aucune autre annonce ne peut combler l'espace
    //    restant à droite, on prend la forme la plus large disponible.
    const chosen = queue[pick]
    const rest = w - shape.cols
    if (rest > 0) {
      const someoneElseFits = queue.some(
        (q, qi) => qi !== pick && q.shapes.some((s) => s.cols <= rest),
      )
      if (!someoneElseFits) {
        shape = chosen.shapes.filter(fits).reduce((a, b) => (b.cols > a.cols ? b : a))
      }
    }

    placements.push({ item: chosen.item, col: c, row: r, cols: shape.cols, rows: shape.rows })
    occupy(r, c, shape.cols, shape.rows)
    queue.splice(pick, 1)
  }

  leftover.push(...queue.map((q) => q.item))
  const rows = placements.reduce((m, p) => Math.max(m, p.row + p.rows), 0)
  return { placements, rows, leftover }
}
