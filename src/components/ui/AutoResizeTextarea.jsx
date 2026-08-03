import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

export default function AutoResizeTextarea({
  value,
  onChange,
  className,
  minRows = 1,
  maxRows = 6,
  disabled = false,
  ...props
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const lineH = 22;
    el.style.height = "auto";
    const maxH = lineH * maxRows + 32; // padding buffer
    el.style.height = `${Math.min(el.scrollHeight, maxH)}px`;
  }, [value, maxRows]);

  return (
    <textarea
      ref={ref}
      rows={minRows}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={cn(
        "w-full resize-none bg-transparent text-sm leading-[22px] text-white/85 outline-none",
        "placeholder:text-white/20 placeholder:transition-colors placeholder:duration-300",
        "focus:placeholder:text-white/30",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "transition-[height] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "scrollbar-none",
        className
      )}
      {...props}
    />
  );
}