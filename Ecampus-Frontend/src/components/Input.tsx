import type { ChangeEvent, InputHTMLAttributes } from "react";
import { Icon } from "./Icon";

/** Kind of field: "text", "email", "password" (hides the characters) or "search". */
type InputType = "text" | "email" | "password" | "search" | "date" | "datetime-local";

interface InputProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        "className" | "style" | "type" | "value" | "onChange" | "aria-label"
    > {
    /** REQUIRED. Accessible name of the field, read by screen readers (there is no visible label). */
    label: string;
    /** REQUIRED. Current text of the field. Keep it in a state of the parent. */
    value: string;
    /** REQUIRED. Called with the new text each time the user types. */
    onChange: (value: string) => void;
    /** Optional, default "text". Kind of field. */
    type?: InputType;
    /** Optional. Hint displayed while the field is empty. */
    placeholder?: string;
    /** Optional. Material Symbols icon name displayed at the left of the field (e.g. "search"). No icon if omitted. */
    icon?: string;
}

const BASE =
    "w-full h-11 pr-4 rounded-full bg-foreground/[0.07] border border-foreground/[0.18] text-foreground font-mono text-[13px] placeholder:text-foreground/50 focus:outline-none focus:border-primary transition-colors";

/**
 * Pill-shaped text field with an optional icon, used for search and forms.
 *
 * The field takes the full width of its parent: the parent decides the width.
 * className, style and aria-label are removed from the accepted attributes on purpose.
 * Every other native input attribute (name, required, disabled, autoComplete...) is accepted.
 *
 * @param props - See InputProps.
 * @returns A text field.
 *
 * @example
 * const [query, setQuery] = useState("");
 * <Input label="Rechercher une annonce" icon="search" placeholder="Rechercher une annonce..." value={query} onChange={setQuery} />
 * <Input label="Mot de passe" type="password" autoComplete="current-password" required value={password} onChange={setPassword} />
 */
export function Input({
                          label,
                          value,
                          onChange,
                          type = "text",
                          placeholder,
                          icon,
                          ...rest
                      }: InputProps) {
    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        onChange(event.target.value);
    }

    let classes = BASE;
    if (icon) {
        classes = classes + " pl-12";
    } else {
        classes = classes + " pl-4";
    }

    return (
        <div className="relative w-full">
            {icon ? (
                <span className="absolute left-4 top-1/2 flex -translate-y-1/2 text-foreground/70 pointer-events-none">
          <Icon name={icon} size="lg" />
        </span>
            ) : null}
            <input
                type={type}
                aria-label={label}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className={classes}
                {...rest}
            />
        </div>
    );
}