import type { AnchorHTMLAttributes, ReactNode } from "react";

interface TextLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "style"> {
    /** REQUIRED. Text of the link. */
    children: ReactNode;
    /** REQUIRED. Address the link leads to. */
    href: string;
}

const CLASSES =
    "font-mono text-[12px] font-medium text-primary underline-offset-4 transition-colors hover:text-primary-light hover:underline";

/**
 * Small text link in the accent color, underlined on hover.
 * For a page of the application, it will later wrap the router's Link instead of a plain anchor.
 * className and style are removed from the accepted attributes on purpose; every other native attribute is accepted.
 *
 * @param props - See TextLinkProps.
 * @returns An anchor element.
 *
 * @example
 * <TextLink href="#">Mot de passe oublié ?</TextLink>
 */
export function TextLink({ children, ...rest }: TextLinkProps) {
    return (
        <a className={CLASSES} {...rest}>
            {children}
        </a>
    );
}