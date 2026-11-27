import type { ChangeEvent, TextareaHTMLAttributes } from "react";

interface TextareaProps
    extends Omit<
        TextareaHTMLAttributes<HTMLTextAreaElement>,
        "className" | "style" | "children" | "value" | "onChange" | "aria-label"
    > {
    /** Accessible name of the field, read by screen readers. */
    label: string;
    /** Current text, kept in a state by the parent. */
    value: string;
    /** Called with the new text at each keystroke. */
    onChange: (value: string) => void;
}

const CLASSES =
    "min-h-32 w-full resize-y rounded-2xl border border-foreground/[0.18] bg-foreground/[0.07] px-4 py-3 font-mono text-[13px] text-foreground transition-colors placeholder:text-foreground/50 focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";

/**
 * Multi-line text field. Same behavior as Input: the parent owns the value.
 *
 * @param props - The accessible name, the current text and the change handler.
 * @returns A styled textarea.
 */
export function Textarea({ label, value, onChange, ...rest }: TextareaProps) {
    function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
        onChange(event.target.value);
    }

    return <textarea aria-label={label} className={CLASSES} value={value} onChange={handleChange} {...rest} />;
}