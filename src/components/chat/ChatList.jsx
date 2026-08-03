import { useCallback, useRef, useState, KeyboardEvent } from "react";
import { motion } from "motion/react";
import { CheckCheck, MessageSquareText, Search } from "lucide-react";
import { cn } from "../../lib/utils";

export default function ChatList({ chats, activeChatId, onSelectChat, compact = false }) {
  const [search, setSearch] = useState("");
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const listRef = useRef(null);

  const filtered = search.trim()
    ? chats.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : chats;

  const handleKeyDown = useCallback((e) => {
    if (!filtered.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIdx((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIdx((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIdx >= 0 && focusedIdx < filtered.length) {
          onSelectChat(filtered[focusedIdx]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setSearch("");
        break;
    }
  }, [filtered, focusedIdx, onSelectChat]);

  return (
    <div className="glass flex h-full min-h-0 flex-col rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-white/[0.04] px-4 py-4">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-white/30">
          <MessageSquareText className="h-3 w-3" />
          <span>Threads</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h2 className="text-base font-semibold tracking-tight text-white">Chats</h2>
          <span className="text-[10px] text-white/20">{chats.length} active</span>
        </div>

        {/* Search */}
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/15" />
          <input
            type="text" value={search}
            onChange={(e) => { setSearch(e.target.value); setFocusedIdx(-1); }}
            onKeyDown={handleKeyDown}
            placeholder="Search threads..."
            aria-label="Search threads"
            className="w-full h-9 rounded-lg border border-white/[0.04] bg-white/[0.02] pl-8 pr-3 text-xs text-white/60 placeholder:text-white/15 outline-none transition-all duration-300 focus:border-white/12 focus:bg-white/[0.03]"
          />
        </div>
      </div>

      {/* Thread list */}
      <div
        ref={listRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 space-y-0.5"
        role="listbox"
        aria-label="Chat threads"
        tabIndex={-1}
      >
        {filtered.map((chat, i) => {
          const active = chat.id === activeChatId;
          const focused = focusedIdx === i;
          return (
            <motion.button
              key={chat.id}
              type="button"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.025, duration: 0.25 }}
              onClick={() => onSelectChat(chat)}
              onMouseEnter={() => setFocusedIdx(-1)}
              role="option"
              aria-selected={active}
              className={cn(
                "group flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-all duration-200",
                active
                  ? "bg-white/[0.05] border border-white/[0.05]"
                  : focused && !active
                    ? "bg-white/[0.03] border border-white/[0.03]"
                    : "border border-transparent hover:bg-white/[0.02]"
              )}
            >
              {/* Avatar */}
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white font-semibold text-black text-sm shadow-sm">
                {chat.initials}
                <span className={cn(
                  "absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0d0e12] shadow-sm",
                  chat.status === "Online" ? "bg-emerald-400" : "bg-neutral-400"
                )} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-white">{chat.name}</p>
                  <span className="shrink-0 text-[9px] text-white/20">{chat.timestamp}</span>
                </div>
                <div className="mt-0.5 flex items-center gap-1">
                  <CheckCheck className="h-3 w-3 shrink-0 text-white/15" />
                  <p className="truncate text-xs text-white/35">{chat.lastMessage}</p>
                </div>
              </div>

              {chat.unread > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/80 px-1.5 text-[9px] font-semibold text-black">
                  {chat.unread}
                </span>
              )}
            </motion.button>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <p className="text-xs text-white/25">
              {search ? "No threads match your search" : "No threads yet"}
            </p>
            {!search && (
              <p className="mt-1 text-[10px] text-white/15">Browse the services page to start a conversation.</p>
            )}
          </div>
        )}
      </div>

      {/* Keyboard hint */}
      {filtered.length > 0 && (
        <div className="shrink-0 border-t border-white/[0.03] px-3 py-1.5 text-[8px] text-white/10 text-center">
          ↑↓ Navigate · Enter select · Esc clear search
        </div>
      )}
    </div>
  );
}