import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function ChatList({ chats, selectedChat, onSelectChat }) {
  return (
    <section className="h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_60px_rgba(255,255,255,0.03)] backdrop-blur-2xl">
      <div className="flex h-full flex-col">
        <div className="pb-6">
          <div className="flex items-center justify-between gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Aquavern</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-white/90 md:text-2xl">Private Chats</h2>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 shadow-[0_0_40px_rgba(255,255,255,0.03)]">
              <MessageCircle className="h-5 w-5 text-white/55" />
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto">
          {chats.map((chat, index) => (
            <motion.button
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className={`group flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition-all duration-300 ${
                selectedChat?.id === chat.id
                  ? "border-white/[0.18] bg-white/[0.08] shadow-[0_20px_80px_rgba(255,255,255,0.06)]"
                  : "border-white/10 bg-white/[0.025] hover:border-white/[0.16] hover:bg-white/[0.055] hover:shadow-[0_20px_70px_rgba(255,255,255,0.04)]"
              }`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -3, scale: 1.01 }}
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-sm font-semibold text-white/80 md:h-14 md:w-14">
                    {chat.initials}
                  </div>
                  {chat.unread > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-black bg-white text-xs font-semibold text-black">
                      {chat.unread}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="mb-1.5">
                    <span className="truncate text-sm font-semibold text-white/90 md:text-base">{chat.name}</span>
                  </div>
                  <p className="truncate text-sm leading-relaxed text-zinc-400 md:text-base">{chat.lastMessage}</p>
                </div>
              </div>
              <span className="ml-4 shrink-0 self-start pt-1 text-xs text-zinc-500">{chat.timestamp}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
