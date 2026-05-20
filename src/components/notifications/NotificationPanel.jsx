import { motion } from "framer-motion";
import { Bell, CircleDot, Sparkles } from "lucide-react";
import { notifications } from "../../data/mockData";

export default function NotificationPanel() {
  return (
    <section className="glass-panel relative flex h-full max-h-full min-h-0 flex-col overflow-hidden rounded-lg p-4 sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(125,211,252,0.08),transparent_24rem)]" />
      <div className="relative flex shrink-0 items-center justify-between border-b border-white/10 pb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/35">Signal</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Notifications</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
            Workspace updates, system signals, and internal activity collected in one quiet view.
          </p>
        </div>
        <motion.div
          animate={{ y: [0, -4, 0], boxShadow: "0 0 36px rgba(125,211,252,0.1)" }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="hidden h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] sm:flex"
        >
          <Bell className="h-5 w-5 text-white" />
        </motion.div>
      </div>

      <div className="premium-scrollbar relative mt-6 flex min-h-0 flex-1 basis-0 flex-col gap-3 overflow-y-auto overscroll-contain pb-2 pr-1">
        {notifications.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.08,
              duration: 0.48,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{ y: -4, scale: 1.005 }}
            className="group relative overflow-hidden rounded-lg border border-white/10 bg-black/30 p-4 transition-all duration-300 hover:border-cyan-200/20 hover:bg-white/[0.055] hover:shadow-[0_20px_70px_rgba(125,211,252,0.08)]"
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-cyan-200/0 transition-colors duration-300 group-hover:bg-cyan-200/55" />
            <div className="pointer-events-none absolute -right-10 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-cyan-200/[0.055] opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
            <div className="flex items-start gap-3">
              <CircleDot className="mt-1 h-4 w-4 shrink-0 text-white/55 transition-colors group-hover:text-white" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="truncate text-sm font-semibold text-white">{item.title}</h3>
                  <span className="shrink-0 text-[11px] text-white/35">{item.time}</span>
                </div>
                <p className="mt-1 text-sm leading-5 text-white/48">{item.body}</p>
              </div>
              <Sparkles className="mt-1 h-4 w-4 shrink-0 text-white/0 transition-colors duration-300 group-hover:text-cyan-100/65" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
