import * as React from "react";
import type { FieldError } from "react-hook-form";
import { cn } from "@/libs/utils";

type BaseProps = {
  label?: string;
  hint?: string;
  error?: FieldError | null;
  /** required asterisk next to label */
  requiredMark?: boolean;
  /** Leading adornment (icon / text) */
  leading?: React.ReactNode;
  /** Trailing adornment (icon / button) */
  trailing?: React.ReactNode;
  /** Use a <textarea> instead of <input> */
  multiline?: boolean;
  rows?: number;
  /** Force id if you need to pair external <label> */
  id?: string;
  /** Override input class only (container keeps spacing) */
  inputClassName?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">;

export default React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  BaseProps
>(function TextInput(
  {
    label,
    hint,
    error,
    requiredMark,
    leading,
    trailing,
    multiline = false,
    rows = 4,
    id,
    className,
    inputClassName,
    ...props
  },
  ref
) {
  const inputId = React.useId();
  const resolvedId = id ?? inputId;
  const describedBy = error
    ? `${resolvedId}-error`
    : hint
    ? `${resolvedId}-hint`
    : undefined;

  const InputTag = (multiline ? "textarea" : "input");

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label
          htmlFor={resolvedId}
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {label}
          {requiredMark && <span className="text-red-600"> *</span>}
        </label>
      )}

      <div
        className={cn(
          "relative flex items-stretch",
          error ? "has-[input]:ring-red-500" : ""
        )}
      >
        {leading && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leading}
          </span>
        )}

        <InputTag
          id={resolvedId}
          ref={ref as never}
          className={cn(
            "input w-full", // keep your project token
            "block rounded-lg border border-gray-300 bg-white",
            "px-3 py-2 placeholder:text-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500",
            leading ? "pl-9" : "",
            trailing ? "pr-9" : "",
            error
              ? "border-red-500 focus:ring-red-500/50 focus:border-red-500"
              : "",
            inputClassName
          )}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          rows={multiline ? rows : undefined}
          {...props}
        />

        {trailing && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {trailing}
          </span>
        )}
      </div>

      {hint && !error && (
        <p id={`${resolvedId}-hint`} className="mt-1 text-xs text-gray-500">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={`${resolvedId}-error`}
          className="mt-1 text-xs font-medium text-red-600"
        >
          {error.message as string}
        </p>
      )}
    </div>
  );
});
