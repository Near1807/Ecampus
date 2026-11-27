import { Route, Routes } from "react-router-dom";
import { Login } from "./Login/Login.tsx";
import { Showcase } from "./Showcase/Showcase.tsx";
import  Home  from "./Home/Home.tsx";

/**
 * Declares the routes of the application: each path displays one page.
 * Must be rendered inside a BrowserRouter (see main.tsx).
 *
 * @returns The page matching the current address.
 */
export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/showcase" element={<Showcase />} />
        </Routes>
    );
}