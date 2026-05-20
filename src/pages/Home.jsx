import { motion } from "framer-motion";
import ChatInterface from "../components/chat/ChatInterface";

export default function Home() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-5 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="shrink-0"
      >
        <p className="text-xs uppercase tracking-[0.28em] text-white/35">Aquavern Home</p>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">Internal conversation desk</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.36 }}
        className="min-h-0 flex-1 overflow-hidden"
      >
        <ChatInterface />
      </motion.div>
    </div>
  );
}
