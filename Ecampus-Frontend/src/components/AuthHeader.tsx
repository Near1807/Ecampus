import { Logo } from "./Logo.tsx";

/**
 * Brand block shown above the cards of the authentication pages: a tape pin and the logo.
 *
 * @returns The pin and the logo, centered.
 */
export function AuthHeader() {
    return (
        <div className="flex flex-col items-center gap-3">
            <div
                aria-hidden="true"
                className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-hover shadow-lg ring-4 ring-background/60"
            >
                <div className="h-1.5 w-1.5 rounded-full bg-foreground/80" />
            </div>
            <Logo size="lg" />
        </div>
    );
}