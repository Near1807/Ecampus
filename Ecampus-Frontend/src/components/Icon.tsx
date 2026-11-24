type IconSize = "md" | "lg";

interface IconProps {
    /** REQUIRED. Name of the Material Symbols icon (e.g. "check", "person", "search"). Without it, nothing can be displayed. */
    name: string;
    /** Optional, default "md". Size of the icon: "md" (18px) or "lg" (20px). Any other value is a TypeScript error. */
    size?: IconSize;
}

const SIZES: Record<IconSize, string> = {
    md: "text-[18px]",
    lg: "text-[20px]",
};

/**
 * Displays an icon from the Material Symbols font.
 *
 * The component accepts no className or style: the size is chosen only through the `size` prop,
 * so every icon of the application follows the same scale.
 * The icon takes the text color of its parent element: to color it, set the color on a wrapper.
 *
 * @param props - See IconProps.
 * @returns A decorative icon, hidden from screen readers (the surrounding element must carry the accessible name).
 *
 * @example
 * <Icon name="check" />
 * <Icon name="search" size="lg" />
 */
export function Icon({ name, size = "md" }: IconProps) {
    const classes = "material-symbols-outlined " + SIZES[size];

    return (
        <span aria-hidden="true" className={classes}>
      {name}
    </span>
    );
}