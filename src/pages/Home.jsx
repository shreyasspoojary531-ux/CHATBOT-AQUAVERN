import { motion } from "framer-motion";
import ChatInterface from "../components/chat/ChatInterface";
import NotificationPanel from "../components/notifications/NotificationPanel";

export default function Home() {
  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-2"
      >
        <p className="text-xs uppercase tracking-[0.28em] text-white/35">Aquavern Home</p>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">Internal conversation desk</h1>
      </motion.div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.36 }}
          className="min-w-0 lg:basis-[70%]"
        >
          <ChatInterface />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.36 }}
          className="min-w-0 lg:basis-[30%]"
        >
          <NotificationPanel />
        </motion.div>
      </div>
    </div>
  );
}
