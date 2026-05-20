import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

export default function AutoResizeTextarea({
  value,
  onChange,
  className,
  minRows = 1,
  maxRows = 5,
  ...props
}) {
  const ref = useRef(null);

  useEffect(() => {
    const textarea = ref.current;

    if (!textarea) return;

    const lineHeight = 24;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      lineHeight * maxRows + 24
    )}px`;
  }, [value, maxRows]);

  return (
    <textarea
      ref={ref}
      rows={minRows}
      value={value}
      onChange={onChange}
      className={cn(
        "max-h-40 min-h-12 w-full resize-none bg-transparent text-sm leading-6 text-white outline-none placeholder:text-white/35",
        className
      )}
      {...props}
    />
  );
}
