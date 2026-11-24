import type { ButtonHTMLAttributes } from "react";
import { Icon } from "./Icon";

/** Visual style: "neutral" (surface background) or "primary" (accent background, main action). */
type IconButtonVariant = "neutral" | "primary";

interface IconButtonProps
    extends Omit<
        ButtonHTMLAttributes<HTMLButtonElement>,
        "className" | "style" | "children" | "aria-label"
    > {
    /** REQUIRED. Material Symbols icon name (e.g. "person", "arrow_upward"). */
    icon: string;
    /**
     * REQUIRED. Accessible name of the button, read by screen readers and shown as a tooltip on hover.
     * Needed because there is no visible text: without it, nobody knows what the button does.
     */
    label: string;
    /** Optional, default "neutral". Visual style of the button. */
    variant?: IconButtonVariant;
}

const BASE =
    "inline-flex items-center justify-center shrink-0 w-11 h-11 rounded-full text-foreground transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

const VARIANTS: Record<IconButtonVariant, string> = {
    neutral: "bg-surface border border-foreground/20 hover:border-foreground/40",
    primary: "bg-primary hover:bg-primary-hover",
};

/**
 * Round 44px button that contains only an icon (account, send...).
 *
 * The look is chosen only through the props: className, style, children and aria-label are removed
 * from the accepted attributes on purpose. The text of `label` becomes the accessible name.
 * Every other native button attribute (onClick, disabled, type...) is accepted.
 *
 * @param props - See IconButtonProps.
 * @returns A button element. Its type is "button" unless you pass type="submit".
 *
 * @example
 * <IconButton icon="person" label="Mon compte" />
 * <IconButton icon="arrow_upward" label="Envoyer" variant="primary" type="submit" />
 */
export function IconButton({
                               icon,
                               label,
                               variant = "neutral",
                               type = "button",
                               ...rest
                           }: IconButtonProps) {
    const classes = BASE + " " + VARIANTS[variant];

    return (
        <button type={type} aria-label={label} title={label} className={classes} {...rest}>
    <Icon name={icon} size="lg" />
        </button>
);
}