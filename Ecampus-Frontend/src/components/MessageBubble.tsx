import type { ReactNode } from "react";
import { Body, Label } from "./Typography.tsx";

interface MessageBubbleProps {
    /** True for a message written by the current user: shown on the right. Defaults to false. */
    own?: boolean;
    /** Name of the author, shown above the bubble. */
    author?: string;
    /** Time of the message, shown above the bubble next to the author. */
    time?: string;
    /** Text of the message. */
    children: ReactNode;
}

/**
 * Message bubble of a conversation. Aligns itself to the left or to the right, so its parent
 * must be a flex column.
 *
 * @param props - Who wrote it, the header information and the text.
 * @returns A bubble with its header line.
 */
export function MessageBubble({ own = false, author, time, children }: MessageBubbleProps) {
    const header = [author, time].filter(Boolean).join(" · ");
    const wrapper = own
        ? "flex max-w-xl flex-col items-end gap-1.5 self-end"
        : "flex max-w-xl flex-col items-start gap-1.5 self-start";
    const bubble = own
        ? "rounded-2xl rounded-tr-sm border border-foreground/10 bg-surface p-5 text-foreground"
        : "rounded-2xl rounded-tl-sm bg-paper p-5 text-ink shadow-sm";

    return (
        <div className={wrapper}>
            {header !== "" && <Label color="muted">{header}</Label>}
            <div className={bubble}>
                <Body>{children}</Body>
            </div>
        </div>
    );
}