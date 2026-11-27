import { Outlet } from "react-router-dom";
import { TopBar } from "../components/layout/TopBar";
import { DEFAULT_ACCENT } from "../theme/tokens";

/**
 * Frame shared by the pages that need the navigation bar: the bar on top, the current page below.
 * The page area scrolls by itself, so the bar always stays visible.
 *
 * @returns The bar and the page matching the current address.
 */
export function AppLayout() {
    return (
        <div className="flex h-dvh flex-col">
            <TopBar accent={DEFAULT_ACCENT} />
            <div className="min-h-0 flex-1 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}