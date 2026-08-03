import { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

const variantStyles = {
  primary:
    "border-white/15 bg-white text-black shadow-[0_12px_40px_rgba(255,255,255,0.10)] " +
    "hover:bg-white/90 hover:shadow-[0_16px_48px_rgba(255,255,255,0.16)] " +
    "active:shadow-[0_4px_16px_rgba(255,255,255,0.08)] " +
    "focus-visible:shadow-[0_0_0_2px_rgba(255,255,255,0.35),0_12px_40px_rgba(255,255,255,0.10)]",

  secondary:
    "border-white/15 bg-white/[0.06] text-white " +
    "hover:border-white/25 hover:bg-white/[0.10] hover:shadow-[0_8px_32px_rgba(255,255,255,0.06)] " +
    "active:bg-white/[0.07] active:shadow-none",

  ghost:
    "border-transparent bg-transparent text-white/60 " +
    "hover:bg-white/[0.06] hover:text-white hover:border-white/10 " +
    "active:bg-white/[0.04]",

  danger:
    "border-red-500/25 bg-red-500/10 text-red-400 " +
    "hover:bg-red-500/18 hover:border-red-500/40 hover:text-red-300 " +
    "active:bg-red-500/12",
};

const sizeStyles = {
  sm: "h-9 px-3.5 text-xs gap-1.5 rounded-lg",
  default: "h-11 px-5 text-sm gap-2 rounded-lg",
  lg: "h-12 px-6 text-sm gap-2.5 rounded-xl",
  icon: "h-11 w-11 p-0 rounded-lg",
  "icon-sm": "h-9 w-9 p-0 rounded-lg",
};

export const Button = forwardRef(function Button(
  {
    className,
    variant = "primary",
    size = "default",
    loading = false,
    disabled = false,
    children,
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={cn(
        // Base
        "relative inline-flex items-center justify-center font-medium",
        "outline-none transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "select-none",
        // Interactive
        "active:scale-[0.97]",
        // Focus
        "focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0d0e12]",
        // Disabled
        "disabled:pointer-events-none disabled:opacity-40",
        // Variant + Size
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {loading && (
        <Loader2
          className={cn(
            "animate-spin shrink-0",
            size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"
          )}
        />
      )}
      <span className={cn("flex items-center gap-2", loading && "opacity-0 invisible absolute")}>
        {children}
      </span>
      {/* Screen-reader only loading state */}
      {loading && <span className="sr-only">Loading</span>}
    </button>
  );
});