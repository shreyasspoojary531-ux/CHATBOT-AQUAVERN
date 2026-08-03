import { motion } from "motion/react";
import { CheckCheck, MessageSquareText, Search } from "lucide-react";
import { cn } from "../../lib/utils";
import { useState } from "react";

export default function ChatList({ chats, activeChatId, onSelectChat, compact = false }) {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? chats.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : chats;

  return (
    <div className="glass flex h-full min-h-0 flex-col rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-white/[0.05] px-4 py-4">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-white/30">
          <MessageSquareText className="h-3.5 w-3.5" />
          <span>Threads</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h2 className="text-lg font-semibold tracking-tight text-white">Chats</h2>
          <span className="text-[11px] text-white/25">{chats.length} active</span>
        </div>

        {/* Search */}
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search threads..."
            className="w-full h-9 rounded-lg border border-white/[0.05] bg-white/[0.02] pl-8 pr-3 text-xs text-white/60 placeholder:text-white/20 outline-none transition-all duration-300 focus:border-white/15 focus:bg-white/[0.04]"
          />
        </div>
      </div>

      {/* Thread list */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 space-y-0.5">
        {filtered.map((chat, i) => {
          const active = chat.id === activeChatId;
          return (
            <motion.button
              key={chat.id}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              onClick={() => onSelectChat(chat)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-all duration-200",
                active
                  ? "bg-white/[0.06] border border-white/[0.06]"
                  : "border border-transparent hover:bg-white/[0.03]"
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

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-white">{chat.name}</p>
                  <span className="shrink-0 text-[10px] text-white/25">{chat.timestamp}</span>
                </div>
                <div className="mt-0.5 flex items-center gap-1">
                  <CheckCheck className="h-3 w-3 shrink-0 text-white/20" />
                  <p className="truncate text-xs text-white/40">{chat.lastMessage}</p>
                </div>
              </div>

              {/* Unread badge */}
              {chat.unread > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/90 px-1.5 text-[10px] font-semibold text-black">
                  {chat.unread}
                </span>
              )}
            </motion.button>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <p className="text-xs text-white/30">
              {search ? "No threads match your search" : "No threads yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}