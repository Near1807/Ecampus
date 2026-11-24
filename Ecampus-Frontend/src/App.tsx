import { Routes, Route } from 'react-router-dom'
import { Home } from './Home/Home.tsx'
import { Login } from './Login/Login.tsx'
import {Showcase} from "./Showcase/Showcase.tsx";

/**
 * Composant racine de l'application : relie chaque URL à son composant.
 *
 * @returns Les routes de l'application (/ et /login).
 */
function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/showcase" element={<Showcase />} />
      </Routes>
  )
}

export default App