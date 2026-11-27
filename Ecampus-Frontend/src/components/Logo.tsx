import type { HTMLAttributes } from "react";

/** Size of the logo: "sm" (navbar, aligned left) or "lg" (login page, centered). */
type LogoSize = "sm" | "lg";

interface LogoProps extends Omit<HTMLAttributes<HTMLDivElement>, "className" | "style"> {
    /** Optional, default "sm". Size of the logo. */
    size?: LogoSize;
}

const LAYOUTS: Record<LogoSize, string> = {
    sm: "items-start",
    lg: "items-center text-center",
};

const NAMES: Record<LogoSize, string> = {
    sm: "text-3xl tracking-wide",
    lg: "text-[64px] tracking-tight sm:text-[76px]",
};

const TAGLINE =
    "mt-1 font-mono text-[12px] font-medium uppercase tracking-widest text-foreground/70";

/**
 * E-CAMpus logo with its tagline. It is not a link and not a heading: wrap it in a link where needed.
 * className and style are removed from the accepted attributes on purpose; every other native attribute is accepted.
 *
 * @param props - See LogoProps.
 * @returns The brand block.
 *
 * @example
 * <Logo />
 * <Logo size="lg" />
 */
export function Logo({ size = "sm", ...rest }: LogoProps) {
    const layout = "flex flex-col " + LAYOUTS[size];
    const name = "flex items-baseline font-display uppercase leading-none " + NAMES[size];

    return (
        <div className={layout} {...rest}>
    <div className={name}>
    <span className="text-foreground">E-</span>
        <span className="text-primary">CAMpus</span>
        </div>
        <span className={TAGLINE}>Le tableau d'affichage de l'ECAM</span>
    </div>
);
}