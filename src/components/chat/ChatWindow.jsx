import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatList from "./ChatList";
import ChatInterface from "./ChatInterface";

export default function ChatWindow({ chats }) {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div
      className={`relative transition-all duration-500 ${
        selectedChat
          ? "min-h-[680px] lg:h-[calc(100vh-120px)] lg:min-h-[680px]"
          : "min-h-[360px] md:min-h-[420px]"
      }`}
    >
      <div className="hidden h-full gap-6 lg:flex xl:gap-8">
        <motion.div
          className={`h-full transition-[width] duration-500 ease-out ${
            selectedChat ? "w-[36%] min-w-[300px]" : "w-full"
          }`}
          layout
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <ChatList
            chats={chats}
            selectedChat={selectedChat}
            onSelectChat={setSelectedChat}
          />
        </motion.div>

        <AnimatePresence>
          {selectedChat && (
            <motion.div
              key={`chat-interface-${selectedChat.id}`}
              className="h-full min-w-0 flex-1"
              initial={{ opacity: 0, x: 26, scale: 0.985, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 26, scale: 0.985, filter: "blur(8px)" }}
              transition={{ duration: 0.38, ease: "easeOut" }}
            >
              <ChatInterface chat={selectedChat} onBack={() => setSelectedChat(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-full lg:hidden">
        <AnimatePresence mode="wait">
          {selectedChat ? (
            <motion.div
              key={`mobile-chat-interface-${selectedChat.id}`}
              className="h-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ChatInterface chat={selectedChat} onBack={() => setSelectedChat(null)} />
            </motion.div>
          ) : (
            <motion.div
              key="mobile-chat-list"
              className="h-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ChatList
                chats={chats}
                selectedChat={selectedChat}
                onSelectChat={setSelectedChat}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!selectedChat && <div className="hidden lg:block" />}
    </div>
  );
}
