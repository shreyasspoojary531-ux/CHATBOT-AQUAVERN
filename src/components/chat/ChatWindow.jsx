import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import AutoResizeTextarea from "../ui/AutoResizeTextarea";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

export default function ChatWindow({ chat, onBack }) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState(chat.messages);

  const statusLabel = useMemo(() => `${chat.role} • ${chat.status}`, [chat.role, chat.status]);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = draft.trim();

    if (!trimmed) return;

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        sender: "You",
        text: trimmed,
        timestamp: "Now",
        direction: "outgoing",
      },
    ]);
    setDraft("");
  }

  return (
    <section className="glass-panel flex h-full min-h-0 flex-col overflow-hidden rounded-lg">
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 p-4">
        <div className="flex min-w-0 items-center gap-3">
          {onBack && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={onBack}
              aria-label="Back to private chat threads"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.045] text-white transition-all duration-300 hover:border-cyan-200/20 hover:bg-white/[0.075] md:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </motion.button>
          )}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-semibold text-black">
            {chat.initials}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-white">{chat.name}</h2>
            <p className="truncate text-xs text-white/45">{statusLabel}</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-white/45 sm:flex">
          <Sparkles className="h-3.5 w-3.5" />
          Secure room
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_24rem)]" />
        <div className="premium-scrollbar relative flex h-full flex-col gap-3 overflow-y-auto px-3 py-4 sm:px-4 sm:py-5">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.24 }}
                className={cn(
                  "flex",
                  message.direction === "outgoing" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[82%] rounded-lg border px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.24)]",
                    message.direction === "outgoing"
                      ? "user-message-bubble border-white/15 bg-white text-black"
                      : "border-white/10 bg-white/[0.06] text-white"
                  )}
                >
                  <p className="text-sm leading-6">{message.text}</p>
                  <p
                    className={cn(
                      "mt-1 text-right text-[11px]",
                      message.direction === "outgoing" ? "text-black/45" : "text-white/35"
                    )}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="shrink-0 border-t border-white/10 p-3">
        <div className="flex items-end gap-2 rounded-lg border border-white/10 bg-black/45 p-2 transition-colors focus-within:border-white/25">
          <AutoResizeTextarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Write a private message..."
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSubmit(event);
              }
            }}
          />
          <Button size="icon" variant="primary" aria-label="Send private message">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </section>
  );
}
