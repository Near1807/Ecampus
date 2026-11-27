import type { ChangeEvent, SelectHTMLAttributes } from "react";

interface SelectOption<T extends string> {
    value: T;
    label: string;
}

interface SelectProps<T extends string>
    extends Omit<
        SelectHTMLAttributes<HTMLSelectElement>,
        "className" | "style" | "children" | "value" | "onChange" | "aria-label"
    > {
    /** Accessible name of the field, read by screen readers. */
    label: string;
    /** Value of the selected option. */
    value: T;
    /** The choices, in display order. */
    options: SelectOption<T>[];
    /** Called with the value of the option the user picked. */
    onChange: (value: T) => void;
}

const CLASSES =
    "h-11 w-full cursor-pointer rounded-full border border-foreground/[0.18] bg-foreground/[0.07] px-4 font-mono text-[13px] text-foreground transition-colors [color-scheme:dark] focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";

/**
 * Drop-down list of choices. The parent owns the selected value.
 *
 * @param props - The accessible name, the choices, the selected value and the change handler.
 * @returns A styled select.
 */
export function Select<T extends string>({ label, value, options, onChange, ...rest }: SelectProps<T>) {
    function handleChange(event: ChangeEvent<HTMLSelectElement>) {
        // The browser only offers the values of the options, so the cast to T is safe.
        onChange(event.target.value as T);
    }

    return (
        <select aria-label={label} className={CLASSES} value={value} onChange={handleChange} {...rest}>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}