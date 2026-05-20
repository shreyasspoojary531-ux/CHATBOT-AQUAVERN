import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { cn } from "../../lib/utils";

function useAutoResizeTextarea({ minHeight, maxHeight }) {
  const textareaRef = useRef(null);

  const adjustHeight = useCallback(
    (reset) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      textarea.style.height = `${minHeight}px`;

      if (reset) return;

      const nextHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      );

      textarea.style.height = `${nextHeight}px`;
    },
    [maxHeight, minHeight]
  );

  useEffect(() => {
    adjustHeight(true);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

const AutoResizeTextarea = forwardRef(
  ({ className, minHeight = 52, maxHeight = 160, onChange, value, style, ...props }, ref) => {
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight, maxHeight });

    useImperativeHandle(ref, () => ({
      element: textareaRef.current,
      reset: () => adjustHeight(true),
      resize: () => adjustHeight(),
    }));

    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => {
          onChange?.(event);
          adjustHeight();
        }}
        className={cn(
          "w-full resize-none bg-transparent text-sm leading-relaxed text-white/90 outline-none",
          "placeholder:text-white/25 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        style={{ minHeight, maxHeight, overflow: "hidden", ...style }}
        rows={1}
        {...props}
      />
    );
  }
);

AutoResizeTextarea.displayName = "AutoResizeTextarea";

export default AutoResizeTextarea;
