/** Moderation status of an announcement (EN_ATTENTE, VALIDE, DECLINE in the database). */
export type Status = "pending" | "validated" | "declined";

interface StatusBadgeProps {
    /** Moderation status to display. */
    status: Status;
    /** Shows the label next to the dot. When false, only the dot is shown. Defaults to true. */
    showLabel?: boolean;
}

const LABELS: Record<Status, string> = {
    pending: "En attente",
    validated: "Acceptée",
    declined: "Refusée",
};

const DOTS: Record<Status, string> = {
    pending: "bg-mustard",
    validated: "bg-success",
    declined: "bg-error",
};

const TEXTS: Record<Status, string> = {
    pending: "text-mustard",
    validated: "text-success",
    declined: "text-error",
};

/**
 * Colored dot, with or without its label, showing the moderation status of an announcement.
 *
 * @param props - The status, and whether the label is shown next to the dot.
 * @returns A pill with the label, or a bare dot readable by screen readers.
 */
export function StatusBadge({ status, showLabel = true }: StatusBadgeProps) {
    if (!showLabel) {
        return (
            <span
                role="img"
                aria-label={LABELS[status]}
                title={LABELS[status]}
                className={"h-2 w-2 shrink-0 rounded-full " + DOTS[status]}
            />
        );
    }

    return (
        <span
            className={
                "inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-panel px-2.5 py-1 font-mono text-[13px] " +
                TEXTS[status]
            }
        >
            <span aria-hidden="true" className={"h-1.5 w-1.5 rounded-full " + DOTS[status]} />
            {LABELS[status]}
        </span>
    );
}