import { useMemo, useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Send, Shield, MoreHorizontal } from "lucide-react";
import AutoResizeTextarea from "../ui/AutoResizeTextarea";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

export default function ChatWindow({ chat, onBack }) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState(chat.messages);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const statusLabel = `${chat.role} · ${chat.status}`;

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: "You",
        text: trimmed,
        timestamp: "Now",
        direction: "outgoing",
      },
    ]);
    setDraft("");
  }

  return (
    <div className="glass flex h-full min-h-0 flex-col overflow-hidden rounded-2xl">
      {/* ── Header ── */}
      <div className="shrink-0 flex items-center justify-between gap-3 border-b border-white/[0.05] px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-white/50 hover:text-white hover:bg-white/[0.06] transition-all duration-200 md:hidden shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-semibold text-black shadow-sm">
            {chat.initials}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{chat.name}</p>
            <p className="truncate text-[11px] text-white/35 mt-px">{statusLabel}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-white/[0.04] bg-white/[0.02] px-2.5 py-1.5">
            <Shield className="h-3 w-3 text-white/25" />
            <span className="text-[10px] text-white/25">Encrypted</span>
          </div>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-white/25 hover:text-white/50 hover:bg-white/[0.04] transition-all duration-200">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03),transparent_30rem)] pointer-events-none" />

        <div className="relative flex h-full flex-col gap-2 overflow-y-auto overscroll-contain px-4 py-4">
          {messages.map((msg) => {
            const isOut = msg.direction === "outgoing";
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={cn("flex", isOut ? "justify-end" : "justify-start")}
              >
                <div className={cn(
                  "max-w-[75%] px-4 py-2.5 shadow-sm",
                  isOut
                    ? "user-selection bg-white text-black rounded-2xl rounded-br-sm"
                    : "bg-white/[0.05] text-white border border-white/[0.05] rounded-2xl rounded-bl-sm"
                )}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <p className={cn("mt-1 text-[10px]", isOut ? "text-black/35" : "text-white/25")}>
                    {msg.timestamp}
                  </p>
                </div>
              </motion.div>
            );
          })}
          <div ref={endRef} aria-hidden="true" />
        </div>
      </div>

      {/* ── Input ── */}
      <form onSubmit={handleSubmit} className="shrink-0 border-t border-white/[0.05] p-3">
        <div className="flex items-end gap-2 rounded-2xl border border-white/[0.06] bg-black/30 p-1.5 transition-all duration-300 focus-within:border-white/15 focus-within:bg-black/40">
          <AutoResizeTextarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a message..."
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
            className="min-h-10"
          />
          <Button type="submit" size="icon-sm" variant="primary" disabled={!draft.trim()}>
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </form>
    </div>
  );
}