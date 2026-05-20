import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowLeft } from "lucide-react";
import AutoResizeTextarea from "../ui/AutoResizeTextarea";

export default function ChatInterface({ chat, onBack }) {
  const [messages, setMessages] = useState(chat?.messages || []);
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      sender: "me",
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    textareaRef.current?.reset();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!chat) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-zinc-500 md:text-base">
        Select a conversation to start messaging
      </div>
    );
  }

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_0_60px_rgba(255,255,255,0.03)] backdrop-blur-2xl">
      <div className="flex items-center gap-4 border-b border-white/10 p-6">
        <button 
          onClick={onBack}
          className="rounded-xl p-2 transition-all duration-300 hover:bg-white/10 hover:text-white lg:hidden"
        >
          <ArrowLeft className="h-5 w-5 text-white/60" />
        </button>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-xs font-semibold text-white/80">
          {chat.initials}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold tracking-tight text-white/90 md:text-lg">{chat.name}</h3>
          <p className="text-xs text-zinc-500 md:text-sm">Secure internal thread</p>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-6 pb-8">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <div
                className={`max-w-[84%] rounded-2xl px-5 py-3.5 shadow-[0_18px_70px_rgba(0,0,0,0.26)] sm:max-w-[65%] ${
                  message.sender === "me"
                    ? "rounded-br-md border border-white/10 bg-white/[0.12] text-white/90"
                    : "rounded-bl-md border border-white/[0.06] bg-white/[0.045] text-white/80"
                }`}
              >
                <p className="text-sm leading-relaxed md:text-base">{message.text}</p>
                <p className="mt-2 text-right text-[10px] text-white/25">{message.time}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 shrink-0 border-t border-white/10 bg-black/25 p-6 backdrop-blur-xl">
        <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 shadow-[0_18px_80px_rgba(0,0,0,0.26)] transition-all duration-300 focus-within:border-white/[0.18] focus-within:bg-black/[0.55]">
          <AutoResizeTextarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            minHeight={48}
            maxHeight={120}
            className="py-2 md:text-base"
          />
          <motion.button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-black shadow-[0_16px_50px_rgba(255,255,255,0.08)] transition-all duration-300 hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-35"
            whileHover={{ scale: inputValue.trim() ? 1.04 : 1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
