import { AnimatePresence, motion } from "motion/react";
import { MessageSquareText, Sparkles, ArrowUpRight, Anchor } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { privateChats } from "../../data/mockData";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

function EmptyThreadState() {
  return (
    <div className="glass relative flex h-full min-h-0 items-center justify-center overflow-hidden rounded-2xl">
      {/* Deeper glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,rgba(255,255,255,0.05),transparent_28rem)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col items-center px-8 text-center max-w-sm"
      >
        {/* Icon group */}
        <div className="relative mb-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03]">
            <MessageSquareText className="h-8 w-8 text-white/30" />
          </div>
          <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.06] border border-white/[0.08]">
            <Sparkles className="h-3.5 w-3.5 text-white/40" />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-white leading-tight">
          No conversation selected
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/40">
          Choose a thread from the sidebar to view messages, or create a new
          conversation from the services page.
        </p>

        {/* Quick actions */}
        <div className="mt-8 flex flex-col gap-2 w-full">
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-xs text-white/35">
            <Anchor className="h-3.5 w-3.5 shrink-0" />
            <span>Browse ships to start a service request</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-xs text-white/35">
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
            <span>Messages are end-to-end encrypted</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ChatInterface() {
  const [chats, setChats] = useState(privateChats);
  const [activeChat, setActiveChat] = useState(null);
  const location = useLocation();
  const processedOrderRef = useRef(null);

  useEffect(() => {
    const order = location.state?.serviceOrder;
    if (!order) return;

    const key = `${order.shipName}-${order.services.join(",")}-${order.location}`;
    if (processedOrderRef.current === key) return;
    processedOrderRef.current = key;

    const chatId = `ship-${order.shipName.replace(/\s+/g, "-").toLowerCase()}`;
    const existing = chats.findIndex((c) => c.id === chatId);
    const labels = { oil: "Oil", food: "Food", water: "Water", fuel: "Fuel", medical: "Medical", spare_parts: "Spare Parts", repair: "Repair", crew_transfer: "Crew Transfer" };
    const serviceLabels = order.services.map((id) => labels[id] || id).join(", ");
    const msg = order.prefilledMessage || `Hello ${order.shipName}! I'd like to request: ${serviceLabels}. Can we coordinate at ${order.location}?`;

    const newChat = {
      id: chatId, name: order.shipName, role: "Ship Service",
      initials: order.shipInitials, lastMessage: msg, timestamp: "Now",
      status: "Online", unread: 0,
      messages: [{ id: `order-${Date.now()}`, sender: "You", text: msg, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), direction: "outgoing" }],
    };

    if (existing >= 0) {
      const updated = [...chats];
      updated[existing] = { ...updated[existing], messages: [...updated[existing].messages, newChat.messages[0]], lastMessage: msg, timestamp: "Now" };
      setChats(updated); setActiveChat(updated[existing]);
    } else {
      setChats((prev) => [newChat, ...prev]); setActiveChat(newChat);
    }
    window.history.replaceState({}, "");
  }, [location.state, chats]);

  return (
    <>
      {/* Desktop: side-by-side */}
      <motion.div layout className="hidden h-full min-h-0 gap-4 md:grid md:grid-cols-[minmax(14rem,28%)_minmax(0,1fr)] xl:grid-cols-[minmax(16rem,24%)_minmax(0,1fr)]">
        <ChatList chats={chats} activeChatId={activeChat?.id} onSelectChat={setActiveChat} compact />
        <AnimatePresence mode="wait">
          {activeChat ? (
            <motion.div key={activeChat.id} initial={{ opacity: 0, x: 12, filter: "blur(4px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: -12, filter: "blur(4px)" }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }} className="min-h-0">
              <ChatWindow chat={activeChat} />
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }} className="min-h-0">
              <EmptyThreadState />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mobile: stacked */}
      <div className="h-full min-h-0 md:hidden">
        <AnimatePresence mode="wait">
          {activeChat ? (
            <motion.div key={`m-${activeChat.id}`} initial={{ opacity: 0, x: 20, filter: "blur(4px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: 20, filter: "blur(4px)" }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }} className="h-full min-h-0">
              <ChatWindow chat={activeChat} onBack={() => setActiveChat(null)} />
            </motion.div>
          ) : (
            <motion.div key="m-list" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }} className="h-full min-h-0">
              <ChatList chats={chats} activeChatId={activeChat?.id} onSelectChat={setActiveChat} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}