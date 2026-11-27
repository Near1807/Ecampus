import type { HTMLAttributes, ReactNode } from "react";

/** Text color: "muted" (softened), "primary" (accent) or "ink" (dark, for text on paper cards). */
type TextColor = "muted" | "primary" | "ink";

type TextProps<T> = Omit<HTMLAttributes<T>, "className" | "style" | "color"> & {
    /** REQUIRED. Content of the text. */
    children: ReactNode;
    /** Optional. Color of the text. If omitted, the color of the parent element is used. */
    color?: TextColor;
};

const COLORS: Record<TextColor, string> = {
    muted: "text-foreground/70",
    primary: "text-primary",
    ink: "text-ink",
};

function withColor(classes: string, color?: TextColor): string {
    if (color) {
        return classes + " " + COLORS[color];
    }
    return classes;
}

/**
 * Brand and poster headline in the Anton font (56px, 36px on mobile). Rendered as a div, not as a heading.
 * className and style are removed from the accepted attributes on purpose; every other native attribute is accepted.
 *
 * @param props - See TextProps.
 * @returns A div element.
 *
 * @example
 * <Display>E-CAMpus</Display>
 */
export function Display({ children, color, ...rest }: TextProps<HTMLDivElement>) {
    const classes = "font-display text-[36px] leading-[40px] tracking-[0.02em] sm:text-[56px] sm:leading-[60px]";
    return (
        <div className={withColor(classes, color)} {...rest}>
            {children}
        </div>
    );
}

/**
 * Page title (28px, bold). Rendered as an h1: use it once per page.
 * className and style are removed from the accepted attributes on purpose; every other native attribute is accepted.
 *
 * @param props - See TextProps.
 * @returns An h1 element.
 *
 * @example
 * <Title>Discussions</Title>
 */
export function Title({ children, color, ...rest }: TextProps<HTMLHeadingElement>) {
    const classes = "font-serif font-bold text-[28px] leading-[34px]";
    return (
        <h1 className={withColor(classes, color)} {...rest}>
            {children}
        </h1>
    );
}

/**
 * Section or card title (22px, semibold). Rendered as an h2.
 * className and style are removed from the accepted attributes on purpose; every other native attribute is accepted.
 *
 * @param props - See TextProps.
 * @returns An h2 element.
 *
 * @example
 * <Subtitle>Annonces récentes</Subtitle>
 */
export function Subtitle({ children, color, ...rest }: TextProps<HTMLHeadingElement>) {
    const classes = "font-serif font-semibold text-[22px] leading-[28px]";
    return (
        <h2 className={withColor(classes, color)} {...rest}>
            {children}
        </h2>
    );
}

/**
 * Standard paragraph (16px). Rendered as a p.
 * className and style are removed from the accepted attributes on purpose; every other native attribute is accepted.
 *
 * @param props - See TextProps.
 * @returns A p element.
 *
 * @example
 * <Body>Le hackathon aura lieu à la cafétéria.</Body>
 */
export function Body({ children, color, ...rest }: TextProps<HTMLParagraphElement>) {
    const classes = "font-serif text-[16px] leading-[24px]";
    return (
        <p className={withColor(classes, color)} {...rest}>
            {children}
        </p>
    );
}

/**
 * Secondary text (14px). Rendered as a p.
 * className and style are removed from the accepted attributes on purpose; every other native attribute is accepted.
 *
 * @param props - See TextProps.
 * @returns A p element.
 *
 * @example
 * <Small color="muted">Publié par le cercle informatique</Small>
 */
export function Small({ children, color, ...rest }: TextProps<HTMLParagraphElement>) {
    const classes = "font-serif text-[14px] leading-[20px]";
    return (
        <p className={withColor(classes, color)} {...rest}>
            {children}
        </p>
    );
}

/**
 * Short monospaced text (13px) for timestamps, tags and navigation links. Rendered as a span.
 * Not the label of a form field: for a form, use Input, which has its own label.
 * className and style are removed from the accepted attributes on purpose; every other native attribute is accepted.
 *
 * @param props - See TextProps.
 * @returns A span element.
 *
 * @example
 * <Label color="primary">Événement</Label>
 */
export function Label({ children, color, ...rest }: TextProps<HTMLSpanElement>) {
    const classes = "font-mono font-semibold text-[13px] leading-[18px] tracking-[0.04em]";
    return (
        <span className={withColor(classes, color)} {...rest}>
      {children}
    </span>
    );
}