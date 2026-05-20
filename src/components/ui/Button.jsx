import { cn } from "../../lib/utils";

export function Button({ className, variant = "primary", size = "default", ...props }) {
  const variants = {
    primary:
      "border-white/15 bg-white text-black shadow-[0_18px_48px_rgba(255,255,255,0.12)] hover:bg-white/90",
    ghost:
      "border-white/10 bg-white/[0.03] text-white hover:border-white/20 hover:bg-white/[0.07]",
    icon:
      "border-white/10 bg-white/[0.04] text-white hover:border-white/25 hover:bg-white/[0.08]",
  };

  const sizes = {
    default: "h-11 px-5 text-sm",
    sm: "h-9 px-3 text-xs",
    icon: "h-11 w-11 p-0",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:pointer-events-none disabled:opacity-45",
        "active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
