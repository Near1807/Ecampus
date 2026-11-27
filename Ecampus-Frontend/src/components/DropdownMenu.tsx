import { useState, type KeyboardEvent } from "react";
import { Button } from "./Button.tsx";

/** One entry of a dropdown menu. */
export interface DropdownItem {
    label: string;
    /** Called when the entry is chosen. The menu closes afterwards. */
    onSelect: () => void;
    /** Shows the entry in the primary color, for destructive actions. Defaults to false. */
    danger?: boolean;
}

interface DropdownMenuProps {
    /** Text of the button that opens the menu. */
    label: string;
    /** Entries of the menu, in display order. */
    items: DropdownItem[];
}

const ITEM =
    "w-full cursor-pointer px-4 py-2 text-left font-mono text-[13px] transition-colors hover:bg-foreground/10";
const ITEM_DEFAULT = ITEM + " text-foreground/70 hover:text-foreground";
const ITEM_DANGER = ITEM + " text-primary";

/**
 * Button that opens a list of actions on click. Closes when an entry is chosen or Escape is pressed.
 *
 * @param props - The button text and the entries.
 * @returns The button and, when open, its menu.
 */
export function DropdownMenu({ label, items }: DropdownMenuProps) {
    const [open, setOpen] = useState(false);

    function handleSelect(item: DropdownItem) {
        setOpen(false);
        item.onSelect();
    }

    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (event.key === "Escape") {
            setOpen(false);
        }
    }

    return (
        <div className="relative" onKeyDown={handleKeyDown}>
            <Button
                variant="secondary"
                icon="more_horiz"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
            >
                {label}
            </Button>
            {open && (
                <div
                    role="menu"
                    className="absolute right-0 top-full z-20 mt-2 w-56 rounded-2xl border border-foreground/10 bg-panel py-2 shadow-card"
                >
                    {items.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            role="menuitem"
                            onClick={() => handleSelect(item)}
                            className={item.danger ? ITEM_DANGER : ITEM_DEFAULT}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}