import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, CornerDownLeft, Send, UserRound, Sparkles, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { chatbotStarterMessages } from "../../data/mockData";
import AutoResizeTextarea from "../ui/AutoResizeTextarea";
import { Button } from "../ui/Button";
import TypingDots from "../ui/TypingDots";
import { cn } from "../../lib/utils";
import { generateNIMCompletion } from "../../services/nvidiaLLM";

export default function ChatbotInterface() {
  const [messages, setMessages] = useState(chatbotStarterMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [openReasoningId, setOpenReasoningId] = useState(null);
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

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmed = input.trim();

    if (!trimmed || isTyping) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      // Send conversation history to NVIDIA NIM API
      const result = await generateNIMCompletion(newMessages);

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: result.content,
        reasoning: result.reasoning,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((current) => [...current, assistantMessage]);
    } catch (err) {
      console.error("NVIDIA NIM Completion Error:", err);
      const errorMessage = {
        id: `assistant-error-${Date.now()}`,
        role: "assistant",
        isError: true,
        content: `Error generating response: ${err.message || "Unable to reach NVIDIA NIM service."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((current) => [...current, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }

  const toggleReasoning = (id) => {
    setOpenReasoningId((current) => (current === id ? null : id));
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative flex h-full w-full overflow-hidden border-y border-white/10 bg-[#0d0e12] shadow-[0_30px_120px_rgba(0,0,0,0.45)]"
    >
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-1/2 top-[-10rem] h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-500/[0.08] blur-3xl"
          animate={{ opacity: [0.45, 0.85, 0.45], scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute bottom-0 left-8 h-px w-2/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08),transparent_35%,rgba(255,255,255,0.04)_72%,transparent)]" />
      </div>

      <div className="relative flex h-full min-h-0 w-full flex-1 flex-col">
        <header className="shrink-0 border-b border-white/10 px-4 py-4 sm:px-6 lg:px-8">
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
              className="flex w-fit items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/[0.06] px-3 py-2 text-xs text-cyan-200/80"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-300 animate-pulse" />
              NVIDIA NIM (gpt-oss-120b) Active
            </motion.div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-hidden">
          <div className="premium-scrollbar mx-auto flex h-full w-full max-w-5xl flex-col gap-4 overflow-y-auto scroll-smooth px-4 py-5 sm:px-6 lg:px-8">
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
                        : message.isError
                        ? "border-red-500/30 bg-red-500/10 text-red-400"
                        : "border-white/10 bg-white/[0.055] text-white"
                    )}
                  >
                    {message.role === "user" ? (
                      <UserRound className="h-5 w-5" />
                    ) : message.isError ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5" />
                    )}
                  </motion.div>

                  <motion.div
                    whileHover={{
                      borderColor:
                        message.role === "user"
                          ? "rgba(255,255,255,0.28)"
                          : message.isError
                          ? "rgba(239,68,68,0.4)"
                          : "rgba(255,255,255,0.18)",
                    }}
                    className={cn(
                      "max-w-[46rem] rounded-lg border px-4 py-3",
                      message.role === "user"
                        ? "border-white/15 bg-white text-black"
                        : message.isError
                        ? "border-red-500/30 bg-red-500/10 text-red-300"
                        : "border-white/10 bg-white/[0.055] text-white shadow-[0_18px_60px_rgba(0,0,0,0.26)]"
                    )}
                  >
                    {/* Collapsible Reasoning Trace if available */}
                    {message.reasoning && (
                      <div className="mb-3 rounded border border-cyan-500/20 bg-cyan-950/20 text-xs">
                        <button
                          type="button"
                          onClick={() => toggleReasoning(message.id)}
                          className="flex w-full items-center justify-between px-3 py-1.5 text-cyan-300 hover:text-cyan-200"
                        >
                          <span className="flex items-center gap-1.5 font-medium">
                            <Sparkles className="h-3 w-3" /> Model Reasoning Trace
                          </span>
                          {openReasoningId === message.id ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )}
                        </button>
                        {openReasoningId === message.id && (
                          <div className="border-t border-cyan-500/20 px-3 py-2 text-cyan-200/70 whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
                            {message.reasoning}
                          </div>
                        )}
                      </div>
                    )}

                    <p className="text-sm leading-6 whitespace-pre-wrap">{message.content}</p>
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

        <div className="shrink-0 border-t border-white/10 bg-[#0d0e12]/90 px-4 py-3 backdrop-blur-2xl sm:px-5">
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
                  placeholder="Message Aquavern (NVIDIA gpt-oss-120b)..."
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
