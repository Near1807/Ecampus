interface FilterOption<T extends string> {
    value: T;
    label: string;
}

interface FilterTabsProps<T extends string> {
    /** Name of the group, read by screen readers. */
    label: string;
    /** The choices, in display order. */
    options: FilterOption<T>[];
    /** Value of the selected choice. */
    value: T;
    /** Called with the value of the choice that was clicked. */
    onChange: (value: T) => void;
}

const BASE =
    "flex-1 cursor-pointer rounded-full px-3 py-1.5 text-center font-mono text-[13px] transition-colors";
const ACTIVE = BASE + " bg-surface font-medium text-foreground shadow-sm";
const IDLE = BASE + " text-foreground/70 hover:text-foreground";

/**
 * Pill-shaped tabs to filter a list: exactly one choice is selected at a time.
 *
 * @param props - The group name, the choices, the selected value and the change handler.
 * @returns The group of tabs.
 */
export function FilterTabs<T extends string>({ label, options, value, onChange }: FilterTabsProps<T>) {
    return (
        <div
            role="group"
            aria-label={label}
            className="flex items-center gap-1 rounded-full border border-foreground/10 bg-panel p-1"
        >
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    aria-pressed={option.value === value}
                    onClick={() => onChange(option.value)}
                    className={option.value === value ? ACTIVE : IDLE}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}