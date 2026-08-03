import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bot,
  CornerDownLeft,
  Send,
  UserRound,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Cpu,
  Zap,
  Clipboard,
  ClipboardCheck,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Lightbulb,
} from "lucide-react";
import AutoResizeTextarea from "../ui/AutoResizeTextarea";
import TypingDots from "../ui/TypingDots";
import { cn } from "../../lib/utils";
import { generateNIMCompletion } from "../../services/nvidiaLLM";

/* ─── Suggested prompts shown on the welcome screen ─── */
const SUGGESTIONS = [
  { icon: Lightbulb, label: "Summarize recent activity", text: "Can you summarize the recent workspace activity?" },
  { icon: Zap, label: "Explain ship logistics", text: "How does ship-to-ship service coordination work?" },
  { icon: Sparkles, label: "Draft a service request", text: "Draft a service request for fuel and supplies at our next port." },
];

/* ─── Streaming hook — reveals text progressively ─── */
function useStreamingText(fullText, active) {
  const [displayed, setDisplayed] = useState("");
  const idxRef = useRef(0);

  useEffect(() => {
    if (!active || !fullText) { setDisplayed(fullText || ""); return; }
    idxRef.current = 0;
    setDisplayed("");

    const charsPerTick = 3;
    const interval = 18;

    const t = setInterval(() => {
      idxRef.current += charsPerTick;
      if (idxRef.current >= fullText.length) {
        setDisplayed(fullText);
        clearInterval(t);
      } else {
        setDisplayed(fullText.slice(0, idxRef.current));
      }
    }, interval);

    return () => clearInterval(t);
  }, [fullText, active]);

  return displayed;
}

/* ─── Code block with copy button ─── */
function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }, [code]);

  return (
    <div className="group relative my-3 overflow-hidden rounded-xl border border-white/[0.06] bg-black/60">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/[0.04] px-3 py-1.5">
        <span className="text-[10px] text-white/25 uppercase tracking-[0.08em]">{language || "code"}</span>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all duration-200"
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? (
            <><ClipboardCheck className="h-3 w-3 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
          ) : (
            <><Clipboard className="h-3 w-3" /><span className="hidden sm:inline">Copy</span></>
          )}
        </button>
      </div>
      {/* Code content */}
      <pre className="overflow-x-auto p-3 text-[13px] leading-relaxed font-mono text-white/80"><code>{code}</code></pre>
    </div>
  );
}

/* ─── Message bubble renderer ─── */
function MessageBubble({ message, isStreaming, onRetry }) {
  const [showActions, setShowActions] = useState(false);

  // Simple markdown-like renderer for inline code, bold, lists
  const renderContent = (text) => {
    if (!text) return null;
    const segments = [];
    const lines = text.split("\n");
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Code block
      if (line.trim().startsWith("```")) {
        const lang = line.trim().slice(3).trim();
        const codeLines = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith("```")) {
          codeLines.push(lines[i]);
          i++;
        }
        i++; // skip closing ```
        segments.push(<CodeBlock key={`cb-${i}`} code={codeLines.join("\n")} language={lang} />);
        continue;
      }

      // List item
      if (line.match(/^[\s]*[-*]\s/)) {
        const items = [];
        while (i < lines.length && lines[i].match(/^[\s]*[-*]\s/)) {
          items.push(lines[i].replace(/^[\s]*[-*]\s/, ""));
          i++;
        }
        segments.push(
          <ul key={`ul-${i}`} className="my-2 space-y-1 list-disc pl-4 text-sm leading-relaxed text-inherit opacity-90">
            {items.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        );
        continue;
      }

      // Numbered list
      if (line.match(/^\s*\d+[.)]\s/)) {
        const items = [];
        while (i < lines.length && lines[i].match(/^\s*\d+[.)]\s/)) {
          items.push(lines[i].replace(/^\s*\d+[.)]\s/, ""));
          i++;
        }
        segments.push(
          <ol key={`ol-${i}`} className="my-2 space-y-1 list-decimal pl-4 text-sm leading-relaxed text-inherit opacity-90">
            {items.map((item, idx) => <li key={idx}>{item}</li>)}
          </ol>
        );
        continue;
      }

      // Horizontal rule
      if (line.match(/^---+\s*$/)) {
        segments.push(<hr key={`hr-${i}`} className="my-3 border-white/[0.06]" />);
        i++;
        continue;
      }

      // Regular paragraph — check for inline formatting
      if (line.trim() === "") {
        segments.push(<div key={`sp-${i}`} className="h-2" />);
        i++;
        continue;
      }

      // Bold, inline code
      const parts = line.split(/(`[^`]+`)/g);
      const rendered = parts.map((part, pIdx) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={pIdx} className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[13px] font-mono text-cyan-200/90">{part.slice(1, -1)}</code>;
        }
        // Bold
        const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
        return boldParts.map((bp, bpIdx) => {
          if (bp.startsWith("**") && bp.endsWith("**")) {
            return <strong key={bpIdx} className="font-semibold">{bp.slice(2, -2)}</strong>;
          }
          return bp;
        });
      });

      segments.push(
        <p key={`p-${i}`} className="text-sm leading-relaxed text-inherit [&:not(:first-child)]:mt-1">
          {rendered}
        </p>
      );
      i++;
    }

    return segments;
  };

  const isUser = message.role === "user";
  const isError = message.isError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={cn("flex gap-3 items-start group", isUser && "flex-row-reverse")}
    >
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border shadow-sm",
          isUser
            ? "border-white/[0.08] bg-white text-black"
            : isError
              ? "border-red-500/20 bg-red-500/10 text-red-400"
              : "border-white/[0.05] bg-white/[0.04] text-white"
        )}
      >
        {isUser ? <UserRound className="h-[15px] w-[15px]" /> : isError ? <AlertTriangle className="h-[15px] w-[15px]" /> : <Bot className="h-[15px] w-[15px]" />}
      </motion.div>

      {/* Bubble */}
      <div
        className={cn(
          "relative max-w-[42rem] rounded-2xl px-4 py-3 shadow-sm transition-shadow duration-300",
          isUser
            ? "bg-white text-black rounded-tr-md"
            : isError
              ? "bg-red-500/6 border border-red-500/12 text-red-300 rounded-tl-sm"
              : "bg-white/[0.04] border border-white/[0.05] text-white rounded-tl-sm group-hover:shadow-[0_4px_20px_rgba(255,255,255,0.02)]"
        )}
        onMouseEnter={() => !isUser && setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Reasoning trace toggle */}
        {message.reasoning && (
          <ReasoningToggle reasoning={message.reasoning} messageId={message.id} />
        )}

        {/* Message content */}
        <div className={cn("text-sm leading-relaxed whitespace-pre-wrap [&_code]:text-[13px]", isStreaming && "after:content-['▊'] after:ml-0.5 after:animate-pulse after:text-cyan-300/60")}>
          {isStreaming ? (
            <StreamingContent text={message.content} />
          ) : (
            renderContent(message.content)
          )}
        </div>

        {/* Footer row: timestamp + actions */}
        <div className="flex items-center justify-between mt-2">
          <span className={cn("text-[10px]", isUser ? "text-black/25" : "text-white/20")}>
            {message.timestamp}
          </span>

          {/* Action buttons (AI messages only) */}
          {!isUser && !isError && !isStreaming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: showActions ? 1 : 0 }}
              className="flex items-center gap-0.5"
            >
              <button type="button" className="flex h-6 w-6 items-center justify-center rounded-md text-white/20 hover:text-white/60 hover:bg-white/[0.04] transition-all duration-200" aria-label="Regenerate">
                <RotateCcw className="h-3 w-3" />
              </button>
              <button type="button" className="flex h-6 w-6 items-center justify-center rounded-md text-white/20 hover:text-white/60 hover:bg-white/[0.04] transition-all duration-200" aria-label="Good response">
                <ThumbsUp className="h-3 w-3" />
              </button>
              <button type="button" className="flex h-6 w-6 items-center justify-center rounded-md text-white/20 hover:text-white/60 hover:bg-white/[0.04] transition-all duration-200" aria-label="Bad response">
                <ThumbsDown className="h-3 w-3" />
              </button>
            </motion.div>
          )}

          {/* Error: retry */}
          {isError && onRetry && (
            <button type="button" onClick={onRetry} className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] text-red-400/70 hover:text-red-300 hover:bg-red-500/8 transition-all duration-200">
              <RotateCcw className="h-3 w-3" /> Retry
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Reasoning toggle ─── */
function ReasoningToggle({ reasoning, messageId }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-2 overflow-hidden rounded-xl border border-cyan-500/8 bg-cyan-950/8">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between px-3 py-1.5 text-[11px] text-cyan-300/60 hover:text-cyan-200 transition-colors"
      >
        <span className="flex items-center gap-1.5 font-medium">
          <Sparkles className="h-3 w-3" />
          Reasoning
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-3 w-3" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-cyan-500/8"
          >
            <div className="px-3 py-2 text-[11px] text-cyan-200/40 leading-relaxed font-mono whitespace-pre-wrap">
              {reasoning}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Streaming text with progressive reveal ─── */
function StreamingContent({ text }) {
  const displayed = useStreamingText(text, true);
  return <span>{displayed}</span>;
}

/* ─── Welcome screen with suggestions ─── */
function WelcomeScreen({ onSelectSuggestion }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-1 flex-col items-center justify-center px-6 py-12"
    >
      {/* Logo mark */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] shadow-lg"
      >
        <Bot className="h-8 w-8 text-white/50" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-2xl font-semibold tracking-tight text-white text-center"
      >
        Aquavern Intelligence
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.4 }}
        className="mt-2 text-sm text-white/40 text-center max-w-md leading-relaxed"
      >
        Ask questions, draft messages, analyze data, or explore the ship network.
      </motion.p>

      {/* Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.36, duration: 0.4 }}
        className="mt-8 flex flex-col sm:flex-row gap-2.5 w-full max-w-lg"
      >
        {SUGGESTIONS.map((s, i) => (
          <motion.button
            key={s.label}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.06, duration: 0.35 }}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectSuggestion(s.text)}
            className="flex flex-1 items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-left transition-all duration-300 hover:border-white/14 hover:bg-white/[0.04] hover:shadow-sm group"
          >
            <s.icon className="h-4 w-4 shrink-0 text-white/25 group-hover:text-white/50 transition-colors" />
            <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors leading-snug">{s.label}</span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════ */

export default function ChatbotInterface() {
  const [messages, setMessages] = useState([]); // Start empty for welcome screen
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamingId, setStreamingId] = useState(null);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  useEffect(() => {
    requestAnimationFrame(scrollToBottom);
  }, [messages, isTyping, scrollToBottom]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isTyping) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsTyping(true);

    try {
      const result = await generateNIMCompletion(updated);
      const assistantId = `a-${Date.now()}`;
      const assistantMsg = {
        id: assistantId,
        role: "assistant",
        content: result.content,
        reasoning: result.reasoning,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setStreamingId(assistantId);
      setMessages((prev) => [...prev, assistantMsg]);
      // Auto-stop streaming after content is fully rendered
      setTimeout(() => setStreamingId(null), Math.min(result.content.length * 18, 2000));
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ae-${Date.now()}`,
          role: "assistant",
          isError: true,
          content: `Error: ${err.message || "Unable to reach service."}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, messages]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  const handleSuggestion = useCallback((text) => {
    setInput(text);
    // Auto-submit on suggestion click
    setTimeout(() => {
      const userMsg = {
        id: `u-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      generateNIMCompletion([...(messages.length ? messages : []), userMsg])
        .then((result) => {
          const aid = `a-${Date.now()}`;
          setStreamingId(aid);
          setMessages((prev) => [...prev, { id: aid, role: "assistant", content: result.content, reasoning: result.reasoning, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
          setTimeout(() => setStreamingId(null), Math.min(result.content.length * 18, 2000));
        })
        .catch((err) => {
          setMessages((prev) => [...prev, { id: `ae-${Date.now()}`, role: "assistant", isError: true, content: `Error: ${err.message || "Unable to reach service."}`, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
        })
        .finally(() => setIsTyping(false));
    }, 50);
  }, [messages]);

  const hasMessages = messages.length > 0;

  return (
    <div className="relative flex h-full w-full flex-col border-y border-white/[0.03]">
      {/* Ambient glow orbs */}
      <motion.div
        animate={{ opacity: [0.25, 0.5, 0.25], scale: [1, 1.03, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-[-8rem] w-[450px] h-[450px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(103,232,249,0.04) 0%, transparent 65%)" }}
      />
      <div className="pointer-events-none absolute bottom-0 left-10 h-px w-1/2 bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      {/* ── Header ── */}
      <header className="shrink-0 border-b border-white/[0.03] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/[0.05] bg-white/[0.03]">
              <Cpu className="h-4 w-4 text-white/40" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-white truncate">
                Aquavern Intelligence
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/60" />
                <span className="text-[10px] text-white/30">Online</span>
              </div>
            </div>
          </div>

          {/* Model badge */}
          <div className="inline-flex items-center gap-2 rounded-lg border border-white/[0.04] bg-white/[0.02] px-2.5 py-1.5">
            <motion.span animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }}>
              <Zap className="h-3 w-3 text-cyan-300/50" />
            </motion.span>
            <span className="text-[10px] text-white/30 font-medium hidden sm:inline">gpt-oss-120b</span>
            <span className="text-[10px] text-white/30 font-medium sm:hidden">NIM</span>
          </div>
        </div>
      </header>

      {/* ── Messages Area ── */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-4xl flex-col overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 lg:px-8">
          {hasMessages ? (
            <AnimatePresence initial={false} mode="popLayout">
              {messages.map((msg, idx) => (
                <div key={msg.id} className={cn(idx > 0 && "mt-3")}>
                  <MessageBubble
                    message={msg}
                    isStreaming={msg.id === streamingId}
                    onRetry={() => {
                      // Re-submit last user message
                      const userMsgs = messages.filter((m) => m.role === "user");
                      if (userMsgs.length) {
                        setMessages((prev) => prev.filter((m) => m.id !== msg.id));
                        setIsTyping(true);
                        const lastUser = userMsgs[userMsgs.length - 1];
                        generateNIMCompletion(messages.filter((m) => m.id !== msg.id))
                          .then((result) => {
                            const aid = `a-${Date.now()}`;
                            setStreamingId(aid);
                            setMessages((prev) => [...prev, { id: aid, role: "assistant", content: result.content, reasoning: result.reasoning, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
                            setTimeout(() => setStreamingId(null), Math.min(result.content.length * 18, 2000));
                          })
                          .catch((err) => {
                            setMessages((prev) => [...prev, { id: `ae-${Date.now()}`, role: "assistant", isError: true, content: `Error: ${err.message || "Unable to reach service."}`, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
                          })
                          .finally(() => setIsTyping(false));
                      }
                    }}
                  />
                </div>
              ))}
            </AnimatePresence>
          ) : (
            <WelcomeScreen onSelectSuggestion={handleSuggestion} />
          )}

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="flex gap-3 items-start mt-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/[0.05] bg-white/[0.03]">
                  <Bot className="h-[15px] w-[15px] text-white/40" />
                </div>
                <div className="rounded-2xl border border-white/[0.04] bg-white/[0.03] px-4 py-3">
                  <TypingDots />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={endRef} aria-hidden="true" />
        </div>
      </div>

      {/* ── Input Composer (Centerpiece) ── */}
      <div className="shrink-0 border-t border-white/[0.03] bg-gradient-to-t from-[#0d0e12] via-[#0d0e12] to-transparent px-4 pt-2 pb-3 sm:px-6 lg:px-8">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
          className="mx-auto w-full max-w-4xl"
        >
          <div className="relative group">
            {/* Deep shadow on focus */}
            <div className="absolute -inset-1 rounded-2xl opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(103,232,249,0.06) 0%, transparent 70%)" }}
            />
            <div className="relative flex items-end gap-1.5 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.25)] transition-all duration-300 group-focus-within:border-white/18 group-focus-within:bg-white/[0.05] group-focus-within:shadow-[0_8px_40px_rgba(103,232,249,0.04),0_4px_24px_rgba(0,0,0,0.3)]">
              {/* Attachment button */}
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white/20 hover:text-white/50 hover:bg-white/[0.05] transition-all duration-200"
                aria-label="Add attachment"
                tabIndex={-1}
              >
                <Plus className="h-4 w-4" />
              </button>

              {/* Textarea */}
              <AutoResizeTextarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Aquavern Intelligence..."
                disabled={isTyping}
                className="min-h-10 px-1"
                maxRows={8}
              />

              {/* Send button */}
              <motion.button
                type="submit"
                disabled={!input.trim() || isTyping}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
                  input.trim() && !isTyping
                    ? "bg-white text-black shadow-[0_4px_16px_rgba(255,255,255,0.12)] hover:bg-white/90"
                    : "bg-white/[0.04] text-white/20"
                )}
                aria-label="Send message"
              >
                <Send className="h-[15px] w-[15px]" />
              </motion.button>
            </div>

            {/* Keyboard hint */}
            <div className="flex items-center justify-between mt-2 px-1">
              <span className="text-[10px] text-white/15">
                Enter to send · Shift+Enter for new line
              </span>
              {input.length > 0 && (
                <span className={cn("text-[10px] tabular-nums transition-colors", input.length > 2000 ? "text-red-400/60" : "text-white/15")}>
                  {input.length}
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}