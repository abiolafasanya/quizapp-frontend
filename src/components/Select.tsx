import * as React from "react";
import * as RSelect from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/libs/utils";

export type SelectOption = { label: string; value: string; disabled?: boolean };

type SelectProps = {
  label?: string;
  placeholder?: string;
  hint?: string;
  error?: { message?: string } | null;
  requiredMark?: boolean;
  options: SelectOption[];
  value?: string;
  onValueChange?: (val: string) => void;
  disabled?: boolean;
  id?: string;
  className?: string; // container
  triggerClassName?: string; // button/trigger
};

export function Select({
  label,
  placeholder = "Select one",
  hint,
  error,
  requiredMark,
  options,
  value,
  onValueChange,
  disabled,
  id,
  className,
  triggerClassName,
}: SelectProps) {
  const autoId = React.useId();
  const resolvedId = id ?? autoId;
  const hasError = !!error?.message;

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

      <RSelect.Root
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <RSelect.Trigger
          id={resolvedId}
          className={cn(
            "input w-full inline-flex items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-left",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            hasError &&
              "border-red-500 focus:ring-red-500/50 focus:border-red-500",
            triggerClassName
          )}
          aria-invalid={hasError || undefined}
          aria-describedby={
            hasError
              ? `${resolvedId}-error`
              : hint
              ? `${resolvedId}-hint`
              : undefined
          }
        >
          <RSelect.Value placeholder={placeholder} />
          <RSelect.Icon className="ml-2 opacity-70">
            <ChevronDown size={16} />
          </RSelect.Icon>
        </RSelect.Trigger>

        <RSelect.Portal>
          <RSelect.Content
            position="popper"
            sideOffset={6}
            className={cn(
              "z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl"
            )}
          >
            <RSelect.ScrollUpButton className="flex h-8 items-center justify-center">
              <ChevronUp size={16} />
            </RSelect.ScrollUpButton>

            <RSelect.Viewport className="p-1">
              {options.map((opt) => (
                <RSelect.Item
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-md px-8 py-2 text-sm outline-none",
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
                    "data-[highlighted]:bg-gray-100"
                  )}
                >
                  <RSelect.ItemText>{opt.label}</RSelect.ItemText>
                  <RSelect.ItemIndicator className="absolute left-2 inline-flex">
                    <Check size={16} />
                  </RSelect.ItemIndicator>
                </RSelect.Item>
              ))}
            </RSelect.Viewport>

            <RSelect.ScrollDownButton className="flex h-8 items-center justify-center">
              <ChevronDown size={16} />
            </RSelect.ScrollDownButton>
          </RSelect.Content>
        </RSelect.Portal>
      </RSelect.Root>

      {hint && !hasError && (
        <p id={`${resolvedId}-hint`} className="mt-1 text-xs text-gray-500">
          {hint}
        </p>
      )}
      {hasError && (
        <p
          id={`${resolvedId}-error`}
          className="mt-1 text-xs font-medium text-red-600"
        >
          {error?.message}
        </p>
      )}
    </div>
  );
}
