import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon } from "./Icon";

/** Visual style: "primary" (main action), "secondary" (neutral), "ghost" (text only). */
type ButtonVariant = "primary" | "secondary" | "ghost";

/** Height and text size: "sm" (32px), "md" (40px), "lg" (48px). */
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "style"> {
    /**
     * REQUIRED. Label displayed inside the button.
     * A button without a label is empty for sighted users and unnamed for screen readers.
     * For an icon-only button, use IconButton instead.
     */
    children: ReactNode;
    /** Optional, default "primary". Visual style of the button. */
    variant?: ButtonVariant;
    /** Optional, default "md". Height and text size of the button. */
    size?: ButtonSize;
    /** Optional. Material Symbols icon name shown before the label. No icon if omitted. */
    icon?: string;
    /** Optional, default false. Makes the button take the full width of its container. */
    fullWidth?: boolean;
}

const BASE =
    "inline-flex items-center justify-center gap-2 rounded-full font-mono font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

const VARIANTS: Record<ButtonVariant, string> = {
    primary: "bg-primary hover:bg-primary-hover text-foreground",
    secondary:
        "bg-surface border border-foreground/20 hover:border-foreground/40 text-foreground",
    ghost: "text-foreground/70 hover:text-foreground hover:bg-foreground/10",
};

const SIZES: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-[13px]",
    md: "h-11 px-5 text-[13px]",
    lg: "h-12 px-6 text-[14px]",
};

/**
 * Standard pill-shaped button of the application.
 *
 * The look is chosen only through the props (variant, size, icon, fullWidth): className and style
 * are removed from the accepted attributes on purpose, so every button stays consistent.
 * Spacing and placement belong to the parent container (gap, flex, grid), not to the button.
 * Every other native button attribute (onClick, disabled, type, aria-label...) is accepted
 * and passed to the underlying button element.
 *
 * @param props - See ButtonProps.
 * @returns A button element. Its type is "button" unless you pass type="submit",
 * so it never submits a surrounding form by accident.
 *
 * @example
 * <Button>Accepter</Button>
 * <Button variant="secondary" icon="check" fullWidth>Valider</Button>
 * <Button type="submit" size="lg">Se connecter</Button>
 */
export function Button({
                           variant = "primary",
                           size = "md",
                           icon,
                           fullWidth = false,
                           type = "button",
                           children,
                           ...rest
                       }: ButtonProps) {
    let classes = BASE + " " + VARIANTS[variant] + " " + SIZES[size];
    if (fullWidth) {
        classes = classes + " w-full";
    }

    return (
        <button type={type} className={classes} {...rest}>
            {icon ? <Icon name={icon} /> : null}
            {children}
        </button>
    );
}