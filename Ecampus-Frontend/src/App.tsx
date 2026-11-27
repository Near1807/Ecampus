import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./AppLayout/AppLayout.tsx";
import { Conversations } from "./Conversations/Conversations.tsx";
import Home from "./Home/Home.tsx";
import { Login } from "./Login/Login.tsx";
import { Showcase } from "./Showcase/Showcase.tsx";
import { MesAnnonces } from "./Mes-Annonces/Mes-Annonces.tsx";
import { Register } from "./Register/Register.tsx";
import { ForgotPassword } from "./Forgotten-Password/Forgotten-Password.tsx";

/**
 * Declares the routes of the application: each path displays one page.
 * Pages inside the AppLayout route get the navigation bar; the others do not.
 * Must be rendered inside a BrowserRouter (see main.tsx).
 *
 * @returns The page matching the current address.
 */
export default function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/conversations" element={<Conversations />} />
                <Route path="/mes-annonces" element={<MesAnnonces />} />
            </Route>
            <Route path="/forgotten-password" element={<ForgotPassword/>}/>
            <Route path="/login" element={<Login />} />
            <Route path="/showcase" element={<Showcase />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    );
}