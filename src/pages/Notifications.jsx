import { motion } from "framer-motion";
import NotificationPanel from "../components/notifications/NotificationPanel";

export default function Notifications() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-5 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        className="shrink-0"
      >
        <p className="text-xs uppercase tracking-[0.28em] text-white/35">Aquavern Signals</p>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">Notification center</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-0 flex-1 overflow-hidden h-full"
      >
        <NotificationPanel />
      </motion.div>
    </div>
  );
}
