import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { privateChats } from "../../data/mockData";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

export default function ChatInterface() {
  const [activeChat, setActiveChat] = useState(null);

  if (!activeChat) {
    return (
      <motion.div layout className="h-full">
        <ChatList chats={privateChats} onSelectChat={setActiveChat} />
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className="grid h-full gap-4 lg:grid-cols-[minmax(15rem,30%)_minmax(0,1fr)]"
    >
      <ChatList
        chats={privateChats}
        activeChatId={activeChat.id}
        onSelectChat={setActiveChat}
        compact
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={activeChat.id}
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -18 }}
          transition={{ duration: 0.28 }}
        >
          <ChatWindow chat={activeChat} />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
