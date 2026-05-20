import { motion } from "framer-motion";
import { CheckCheck } from "lucide-react";
import { cn } from "../../lib/utils";

export default function ChatList({ chats, activeChatId, onSelectChat, compact = false }) {
  return (
    <section className="glass-panel flex min-h-[32rem] flex-col rounded-lg">
      <div className="border-b border-white/10 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-white/35">Private Chats</p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <h1 className="text-2xl font-semibold text-white">{compact ? "Threads" : "Private Chats"}</h1>
          <span className="rounded-md border border-white/10 px-2 py-1 text-xs text-white/45">
            {chats.length} active
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {chats.map((chat, index) => {
          const active = chat.id === activeChatId;

          return (
            <motion.button
              key={chat.id}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.35 }}
              whileHover={{ y: -2 }}
              onClick={() => onSelectChat(chat)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all duration-300",
                active
                  ? "border-white/25 bg-white/[0.11] shadow-[0_18px_54px_rgba(0,0,0,0.4)]"
                  : "border-white/8 bg-white/[0.035] hover:border-white/18 hover:bg-white/[0.07]"
              )}
            >
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white text-sm font-semibold text-black">
                {chat.initials}
                <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-black bg-white" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-semibold text-white">{chat.name}</p>
                  <span className="text-xs text-white/40">{chat.timestamp}</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <CheckCheck className="h-3.5 w-3.5 shrink-0 text-white/35" />
                  <p className="truncate text-sm text-white/48">{chat.lastMessage}</p>
                </div>
              </div>

              {chat.unread > 0 && (
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-2 text-xs font-semibold text-black">
                  {chat.unread}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
