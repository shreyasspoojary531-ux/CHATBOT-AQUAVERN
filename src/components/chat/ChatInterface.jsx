import { AnimatePresence, motion } from "framer-motion";
import { MessageSquareText, Sparkles } from "lucide-react";
import { useState } from "react";
import { privateChats } from "../../data/mockData";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

function EmptyThreadState() {
  return (
    <section className="glass-panel relative flex h-full min-h-0 items-center justify-center overflow-hidden rounded-lg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.1),transparent_20rem)]" />
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex max-w-md flex-col items-center px-6 text-center"
      >
        <motion.div
          animate={{ y: [0, -5, 0], boxShadow: "0 0 48px rgba(125,211,252,0.08)" }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mb-5 flex h-16 w-16 items-center justify-center rounded-lg border border-white/12 bg-white/[0.055]"
        >
          <MessageSquareText className="h-7 w-7 text-white" />
        </motion.div>
        <div className="mb-3 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/45">
          <Sparkles className="h-3.5 w-3.5" />
          Thread workspace
        </div>
        <h2 className="text-2xl font-semibold text-white">Select a thread to view conversation</h2>
        <p className="mt-3 text-sm leading-6 text-white/45">
          Choose a private chat from the left panel to load its conversation history here.
        </p>
      </motion.div>
    </section>
  );
}

export default function ChatInterface() {
  const [activeChat, setActiveChat] = useState(null);

  return (
    <>
      <motion.div
        layout
        className="hidden h-full min-h-0 gap-4 md:grid md:grid-cols-[minmax(14rem,32%)_minmax(0,1fr)] xl:grid-cols-[minmax(16rem,28%)_minmax(0,1fr)]"
      >
        <ChatList
          chats={privateChats}
          activeChatId={activeChat?.id}
          onSelectChat={setActiveChat}
          compact
        />
        <AnimatePresence mode="wait">
          {activeChat ? (
            <motion.div
              key={activeChat.id}
              initial={{ opacity: 0, x: 18, filter: "blur(6px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -18, filter: "blur(6px)" }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="min-h-0"
            >
              <ChatWindow chat={activeChat} />
            </motion.div>
          ) : (
            <motion.div
              key="empty-thread"
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="min-h-0"
            >
              <EmptyThreadState />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="h-full min-h-0 md:hidden">
        <AnimatePresence mode="wait">
          {activeChat ? (
            <motion.div
              key={`mobile-${activeChat.id}`}
              initial={{ opacity: 0, x: 28, filter: "blur(6px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 28, filter: "blur(6px)" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="h-full min-h-0"
            >
              <ChatWindow chat={activeChat} onBack={() => setActiveChat(null)} />
            </motion.div>
          ) : (
            <motion.div
              key="mobile-thread-list"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="h-full min-h-0"
            >
              <ChatList
                chats={privateChats}
                activeChatId={activeChat?.id}
                onSelectChat={setActiveChat}
                compact
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
