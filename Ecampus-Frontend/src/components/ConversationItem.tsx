import type { ButtonHTMLAttributes } from "react";
import { StatusBadge, type Status } from "./StatusBadge.tsx";

interface ConversationItemProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "style" | "children"> {
    /** Subject of the discussion (title of the announcement). */
    subject: string;
    /** Name of the person on the other side. */
    author: string;
    /** Beginning of the last message. */
    preview: string;
    /** Time or date of the last message. */
    time: string;
    /** Moderation status, shown as a dot. */
    status: Status;
    /** True for the discussion currently open. Defaults to false. */
    selected?: boolean;
}

const BASE =
    "flex w-full cursor-pointer flex-col gap-1.5 rounded-2xl border p-4 text-left text-foreground transition-colors";
const SELECTED = "border-foreground/10 bg-surface";
const IDLE = "border-transparent bg-panel/60 hover:border-foreground/10 hover:bg-panel";

/**
 * Row of the discussion list. Click handling goes through the native onClick.
 *
 * @param props - The texts of the row, its status, and whether it is selected.
 * @returns A button showing the discussion summary.
 */
export function ConversationItem({
    subject,
    author,
    preview,
    time,
    status,
    selected = false,
    ...rest
}: ConversationItemProps) {
    return (
        <button
            type="button"
            aria-current={selected ? "true" : undefined}
            className={BASE + " " + (selected ? SELECTED : IDLE)}
            {...rest}
        >
            <span className="flex w-full items-center justify-between gap-2">
                <span className="truncate font-serif text-[16px] font-medium">{subject}</span>
                <span className="flex shrink-0 items-center gap-2">
                    <span className="font-mono text-[13px] text-foreground/40">{time}</span>
                    <StatusBadge status={status} showLabel={false} />
                </span>
            </span>
            <span className="font-mono text-[13px] text-foreground/70">{author}</span>
            <span className="w-full truncate font-serif text-[14px] text-foreground/70">« {preview} »</span>
        </button>
    );
}