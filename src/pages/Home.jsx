import { motion } from "motion/react";
import ChatInterface from "../components/chat/ChatInterface";
import { MessageSquareText } from "lucide-react";

export default function Home() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-5 overflow-hidden">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="shrink-0">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/30">
          <MessageSquareText className="h-3 w-3" />
          <span>Workspace</span>
        </div>
        <h1 className="mt-1.5 text-xl font-semibold tracking-tight text-white sm:text-2xl">
          Internal Desk
        </h1>
        <p className="mt-1 text-sm text-white/40 max-w-lg">
          Private threads for coordinating with ship crews and service providers.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="min-h-0 flex-1 overflow-hidden">
        <ChatInterface />
      </motion.div>
    </div>
  );
}