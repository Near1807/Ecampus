import { useAnnonces } from './hooks/useAnnonces'
import { useIsMobile } from './hooks/useIsMobile'
import { BoardPage } from './pages/BoardPage'
import { MobileBoardPage } from './pages/MobileBoardPage'
import { CREAM, DEFAULT_ACCENT, MONO } from './theme/tokens'

/** Couleur d'accent et inclinaison des annonces (réglages du thème). */
const ACCENT = DEFAULT_ACCENT
const TILT = true

function Message({ children }: { children: string }) {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#16110D', color: CREAM, fontFamily: MONO, fontSize: 14 }}>
      {children}
    </div>
  )
}

export default function App() {
  const isMobile = useIsMobile(640)
  const { annonces, loading, error } = useAnnonces()

  if (loading) return <Message>Chargement du tableau…</Message>
  if (error) return <Message>{`Impossible de charger les annonces (${error})`}</Message>

  return isMobile ? (
    <MobileBoardPage annonces={annonces} accent={ACCENT} tilt={TILT} />
  ) : (
    <BoardPage annonces={annonces} accent={ACCENT} tilt={TILT} />
  )
}
