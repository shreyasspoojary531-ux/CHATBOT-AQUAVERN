import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { defaultBotResponse } from "../../data/mockData";
import AutoResizeTextarea from "../ui/AutoResizeTextarea";
import TypingDots from "../ui/TypingDots";

export default function ChatbotInterface() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Hello! I'm Aquavern AI. How can I assist you today?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    textareaRef.current?.reset();
    setIsTyping(true);

    setTimeout(() => {
      const botMessage = {
        id: crypto.randomUUID(),
        sender: "bot",
        text: defaultBotResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className="relative z-10 mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-[1600px] items-center justify-center px-6 py-6 md:px-10 lg:px-14 xl:px-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-pulse-soft absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-white/[0.055] blur-[110px]" />
        <div className="absolute inset-x-12 top-20 mx-auto h-px max-w-4xl bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      <motion.section
        className="relative w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_60px_rgba(255,255,255,0.03)] backdrop-blur-2xl md:p-8"
        initial={{ opacity: 0, y: 24, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="mb-8 text-center md:mb-10">
          <motion.div
            className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] shadow-[0_24px_90px_rgba(255,255,255,0.08)]"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="h-6 w-6 text-white/75" />
          </motion.div>
          <h1 className="text-3xl font-semibold tracking-tight text-white/95 md:text-4xl">
            Aquavern AI
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400 md:text-base">
            Internal response console
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/25 shadow-[0_28px_100px_rgba(0,0,0,0.32)]">
          <div className="h-[46vh] min-h-[360px] space-y-6 overflow-y-auto p-5 md:min-h-[420px] md:p-6 lg:p-8">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                >
                  <div
                    className={`max-w-[84%] rounded-2xl px-5 py-3.5 shadow-[0_18px_70px_rgba(0,0,0,0.24)] sm:max-w-[65%] ${
                      message.sender === "user"
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

            {isTyping && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="rounded-2xl rounded-bl-md border border-white/[0.06] bg-white/[0.045] px-5 py-4">
                  <TypingDots />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-white/10 bg-black/25 p-4 backdrop-blur-xl md:p-6">
            <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 shadow-[0_18px_90px_rgba(0,0,0,0.3)] transition-all duration-300 focus-within:border-white/[0.18] focus-within:bg-black/[0.55]">
              <AutoResizeTextarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                minHeight={56}
                maxHeight={160}
                className="py-2 md:text-base"
              />
              <motion.button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-black shadow-[0_16px_50px_rgba(255,255,255,0.08)] transition-all duration-300 hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-35"
                whileHover={{ scale: inputValue.trim() && !isTyping ? 1.05 : 1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
