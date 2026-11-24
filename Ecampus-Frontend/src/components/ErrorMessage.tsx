import type { HTMLAttributes, ReactNode } from "react";
import { Icon } from "./Icon";

interface ErrorMessageProps
    extends Omit<HTMLAttributes<HTMLDivElement>, "className" | "style" | "role"> {
    /** REQUIRED. Text of the error, shown next to an error icon. */
    children: ReactNode;
}

const CLASSES =
    "flex items-center gap-2.5 rounded-sm bg-error-container/40 p-3 font-mono text-[12px] font-medium text-error";

/**
 * Error banner for a form: icon and message in the error color.
 * It has the "alert" role, so screen readers announce it as soon as it appears.
 * className, style and role are removed from the accepted attributes on purpose; every other native attribute is accepted.
 *
 * @param props - See ErrorMessageProps.
 * @returns A div element.
 *
 * @example
 * <ErrorMessage>Adresse e-mail ou mot de passe incorrect</ErrorMessage>
 */
export function ErrorMessage({ children, ...rest }: ErrorMessageProps) {
    return (
        <div role="alert" className={CLASSES} {...rest}>
            <Icon name="error" />
            <span>{children}</span>
        </div>
    );
}