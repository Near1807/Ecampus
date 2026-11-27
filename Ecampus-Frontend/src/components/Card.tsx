import type { HTMLAttributes, ReactNode } from "react";

/**
 * Look of the card:
 * "paper" (newsprint paper with dark ink text): standard notices.
 * "dark" (deep brown panel): forms and structural panels.
 * "transparent" (no background, thin border): grouping on top of the page background.
 * "accent" (red-orange fill) and "blueprint" (dark blue fill): highlighted posters, with cream text.
 */
type CardVariant = "paper" | "dark" | "transparent" | "accent" | "blueprint";

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "className" | "style"> {
    /** REQUIRED. Content of the card. */
    children: ReactNode;
    /** Optional, default "paper". Look of the card. */
    variant?: CardVariant;
    /** Optional, default false. Adds a strip of adhesive tape on top of the card, like a notice stuck on a board. */
    taped?: boolean;
}

const BASE = "relative flex flex-col gap-3 rounded-sm p-6";

const TAPE =
    "pointer-events-none absolute -top-2 left-1/2 h-5 w-28 -translate-x-1/2 -rotate-1 rounded-sm bg-foreground/20 shadow-sm backdrop-blur-sm";

const VARIANTS: Record<CardVariant, string> = {
    paper: "bg-paper text-ink shadow-card",
    dark: "bg-panel text-foreground shadow-card",
    transparent: "border border-foreground/15",
    accent: "bg-primary text-foreground shadow-card",
    blueprint: "bg-blueprint text-foreground shadow-card",
};

/**
 * Container with a background, padding and a vertical spacing between its children.
 *
 * The text color is set by the variant and inherited by the Typography components placed inside,
 * so they need no color of their own. The parent decides the width of the card.
 * className and style are removed from the accepted attributes on purpose; every other native attribute is accepted.
 *
 * @param props - See CardProps.
 * @returns A div element.
 *
 * @example
 * <Card>
 *   <Label>Objets trouvés</Label>
 *   <Subtitle>Clé USB noire trouvée</Subtitle>
 * </Card>
 * <Card variant="dark" taped>
 *   <Title>Connexion</Title>
 * </Card>
 */
export function Card({ variant = "paper", taped = false, children, ...rest }: CardProps) {
    const classes = BASE + " " + VARIANTS[variant];

    return (
        <div className={classes} {...rest}>
            {taped ? <div aria-hidden="true" className={TAPE} /> : null}
            {children}
        </div>
    );
}