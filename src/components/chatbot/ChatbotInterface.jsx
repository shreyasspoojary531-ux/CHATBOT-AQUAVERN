import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, CornerDownLeft, Send, UserRound } from "lucide-react";
import { chatbotStarterMessages, defaultBotReply } from "../../data/mockData";
import AutoResizeTextarea from "../ui/AutoResizeTextarea";
import { Button } from "../ui/Button";
import TypingDots from "../ui/TypingDots";
import { cn } from "../../lib/utils";

export default function ChatbotInterface() {
  const [messages, setMessages] = useState(chatbotStarterMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [messages, isTyping]);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = input.trim();

    if (!trimmed || isTyping) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: "Now",
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsTyping(true);

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: defaultBotReply,
          timestamp: "Just now",
        },
      ]);
      setIsTyping(false);
    }, 500);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative min-h-[calc(100vh-7.5rem)] overflow-hidden rounded-lg border border-white/10 bg-black/55 shadow-[0_30px_120px_rgba(0,0,0,0.6)]"
    >
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-1/2 top-[-10rem] h-80 w-80 -translate-x-1/2 rounded-full bg-white/[0.09] blur-3xl"
          animate={{ opacity: [0.45, 0.85, 0.45], scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute bottom-0 left-8 h-px w-2/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08),transparent_35%,rgba(255,255,255,0.04)_72%,transparent)]" />
      </div>

      <div className="relative flex min-h-[calc(100vh-7.5rem)] w-full flex-col">
        <header className="border-b border-white/10 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-white/35">Chatbot Live</p>
              <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                Aquavern Intelligence
              </h1>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18, duration: 0.35 }}
              className="flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/55"
            >
              <motion.span
                className="h-2 w-2 rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.8)]"
                animate={{ opacity: [0.45, 1, 0.45], scale: [1, 1.25, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
              Dummy response active
            </motion.div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          <div className="no-scrollbar mx-auto flex h-[calc(100vh-18.5rem)] w-full max-w-5xl flex-col gap-4 overflow-y-auto scroll-smooth px-4 py-6 sm:h-[calc(100vh-19rem)] sm:px-6 lg:px-8">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  whileHover={{ y: -1 }}
                  exit={{ opacity: 0, y: -8 }}
                  layout
                  transition={{ duration: 0.32, ease: "easeOut" }}
                  className={cn("flex gap-3", message.role === "user" && "flex-row-reverse")}
                >
                  <motion.div
                    initial={{ scale: 0.82, rotate: message.role === "user" ? 6 : -6 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 360, damping: 24 }}
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
                      message.role === "user"
                        ? "border-white/15 bg-white text-black"
                        : "border-white/10 bg-white/[0.055] text-white"
                    )}
                  >
                    {message.role === "user" ? (
                      <UserRound className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5" />
                    )}
                  </motion.div>

                  <motion.div
                    whileHover={{
                      borderColor:
                        message.role === "user"
                          ? "rgba(255,255,255,0.28)"
                          : "rgba(255,255,255,0.18)",
                    }}
                    className={cn(
                      "max-w-[46rem] rounded-lg border px-4 py-3",
                      message.role === "user"
                        ? "border-white/15 bg-white text-black"
                        : "border-white/10 bg-white/[0.055] text-white shadow-[0_18px_60px_rgba(0,0,0,0.26)]"
                    )}
                  >
                    <p className="text-sm leading-6">{message.content}</p>
                    <p
                      className={cn(
                        "mt-2 text-[11px]",
                        message.role === "user" ? "text-black/45" : "text-white/35"
                      )}
                    >
                      {message.timestamp}
                    </p>
                  </motion.div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-3"
                >
                  <motion.div
                    animate={{ boxShadow: "0 0 26px rgba(255,255,255,0.09)" }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.055]"
                  >
                    <Bot className="h-5 w-5 text-white" />
                  </motion.div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3">
                    <TypingDots />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} aria-hidden="true" />
          </div>
        </div>

        <div className="border-t border-white/10 bg-black/35 p-4 sm:p-5">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.35 }}
            className="mx-auto w-full max-w-5xl rounded-lg border border-white/12 bg-white/[0.045] p-2 shadow-[0_20px_70px_rgba(0,0,0,0.35)] transition-all duration-300 focus-within:border-white/28 focus-within:bg-white/[0.065]"
          >
            <div className="flex items-end gap-2">
              <div className="flex min-h-12 flex-1 items-start gap-3 px-3 py-2">
                <CornerDownLeft className="mt-1 h-4 w-4 shrink-0 text-white/35" />
                <AutoResizeTextarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Message Aquavern..."
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleSubmit(event);
                    }
                  }}
                />
              </div>
              <Button
                type="submit"
                size="icon"
                variant="primary"
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.form>
        </div>
      </div>
    </motion.section>
  );
}
