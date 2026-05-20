import { motion } from "framer-motion";
import { Bell, CircleDot } from "lucide-react";
import { notifications } from "../../data/mockData";

export default function NotificationPanel() {
  return (
    <aside className="glass-panel min-h-[32rem] rounded-lg p-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/35">Signal</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Notifications</h2>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
          <Bell className="h-5 w-5 text-white" />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {notifications.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07, duration: 0.32 }}
            whileHover={{ x: 4 }}
            className="group rounded-lg border border-white/10 bg-black/30 p-4 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.055]"
          >
            <div className="flex items-start gap-3">
              <CircleDot className="mt-1 h-4 w-4 shrink-0 text-white/55 transition-colors group-hover:text-white" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="truncate text-sm font-semibold text-white">{item.title}</h3>
                  <span className="shrink-0 text-[11px] text-white/35">{item.time}</span>
                </div>
                <p className="mt-1 text-sm leading-5 text-white/48">{item.body}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </aside>
  );
}
