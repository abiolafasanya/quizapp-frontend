import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { cn } from "@/libs/utils";

type ButtonProps = {
  /** Visual style */
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
  /** Size */
  size?: "sm" | "md" | "lg" | "icon";
  /** When true: shows spinner and disables the button */
  loading?: boolean;
  /** Render child element directly (useful for Link) */
  asChild?: boolean;
  /** Left icon element */
  leftIcon?: React.ReactNode;
  /** Right icon element */
  rightIcon?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-600/90 focus-visible:ring-indigo-500",
  secondary:
    "bg-gray-900 text-white hover:bg-gray-900/90 focus-visible:ring-gray-900",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-300",
  destructive:
    "bg-red-600 text-white hover:bg-red-600/90 focus-visible:ring-red-500",
  outline:
    "bg-transparent border border-gray-300 text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-300",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
  icon: "h-10 w-10 p-0",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  asChild,
  leftIcon,
  rightIcon,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const isDisabled = disabled || loading;

  return (
    <Comp
      className={cn(
        "inline-flex select-none items-center justify-center gap-2 rounded-lg font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={18} aria-hidden />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </Comp>
  );
}
