import { motion } from "framer-motion";
import { Bell } from "lucide-react";

export default function NotificationPanel({ notifications }) {
  return (
    <section className="flex min-h-[360px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_60px_rgba(255,255,255,0.03)] backdrop-blur-2xl lg:h-full">
      <div className="mb-6 flex items-center justify-between gap-5">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Updates</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-white/90 md:text-2xl">Notifications</h2>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 shadow-[0_0_40px_rgba(255,255,255,0.03)]">
          <Bell className="h-5 w-5 text-white/55" />
        </div>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            className={`cursor-pointer rounded-2xl border px-5 py-4 transition-all duration-300 ${
              notification.unread
                ? "border-white/[0.14] bg-white/[0.06]"
                : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.05]"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -3, scale: 1.01 }}
          >
            <div className="flex items-start gap-3">
              {notification.unread && (
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-white/40 shadow-[0_0_18px_rgba(255,255,255,0.2)]" />
              )}
              <div className="flex-1 min-w-0">
                <p className="mb-1 text-sm font-semibold leading-relaxed text-white/90 md:text-base">
                  {notification.title}
                </p>
                <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-zinc-400">
                  {notification.description}
                </p>
                <p className="text-[10px] text-white/30">
                  {notification.time}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
