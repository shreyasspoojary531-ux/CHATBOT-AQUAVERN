import { motion } from "motion/react";
import { Bell } from "lucide-react";
import NotificationPanel from "../components/notifications/NotificationPanel";

export default function Notifications() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-5 overflow-hidden">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="shrink-0">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/30">
          <Bell className="h-3.5 w-3.5" />
          <span>Signal Log</span>
        </div>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">Notifications</h1>
        <p className="mt-1 text-sm text-white/40 max-w-lg">System updates, workspace activity, and incoming requests at a glance.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="min-h-0 flex-1 overflow-hidden">
        <NotificationPanel />
      </motion.div>
    </div>
  );
}