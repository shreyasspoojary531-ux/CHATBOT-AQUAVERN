import { useState } from "react";
import { motion } from "motion/react";
import { Bell, CircleDot, Sparkles, Info, AlertCircle, CheckCircle2, CheckCheck } from "lucide-react";
import { notifications as initialNotifications } from "../../data/mockData";
import { useToast } from "../ui/Toast";

const TYPE_ICONS = {
  info: Info,
  warning: AlertCircle,
  success: CheckCircle2,
};

export default function NotificationPanel() {
  const [items, setItems] = useState(initialNotifications);
  const [allRead, setAllRead] = useState(false);
  const toast = useToast();

  const markAllRead = () => {
    setAllRead(true);
    toast("All notifications marked as read", "success");
  };

  return (
    <div className="glass relative flex h-full max-h-full min-h-0 flex-col overflow-hidden rounded-2xl p-4 sm:p-5">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(103,232,249,0.03),transparent_30rem)]" />

      {/* Header */}
      <div className="relative shrink-0 border-b border-white/[0.04] pb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-white/30">
              <Sparkles className="h-3 w-3" />
              <span>Activity Feed</span>
            </div>
            <h2 className="text-base font-semibold text-white mt-1 tracking-tight">Notifications</h2>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button type="button" onClick={markAllRead}
                className="flex items-center gap-1.5 rounded-lg border border-white/[0.04] bg-white/[0.02] px-2.5 py-1.5 text-[10px] text-white/30 hover:text-white/60 hover:border-white/10 transition-all duration-300">
                <CheckCheck className="h-3 w-3" />
                <span className="hidden sm:inline">Mark read</span>
              </button>
            )}
            <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.04] bg-white/[0.02]">
              <Bell className="h-[18px] w-[18px] text-white/25" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="relative mt-3 flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto overscroll-contain pr-1">
        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <Bell className="h-7 w-7 text-white/12" />
              <p className="text-sm text-white/25">No notifications yet</p>
              <p className="text-xs text-white/15">System updates will appear here.</p>
            </div>
          </div>
        ) : (
          items.map((item, i) => {
            const Icon = TYPE_ICONS[item.type] || CircleDot;
            return (
              <motion.div key={item.id}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02, duration: 0.25 }}
                whileHover={{ y: -1 }}
                className="group relative overflow-hidden rounded-xl border border-white/[0.03] bg-black/15 px-4 py-3.5 transition-all duration-300 hover:border-cyan-200/8 hover:bg-white/[0.02]"
              >
                <div className="pointer-events-none absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-cyan-200/0 transition-colors duration-300 group-hover:bg-cyan-200/25" />

                <div className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/20 group-hover:text-white/45 transition-colors duration-300" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate text-sm font-medium text-white">{item.title}</h3>
                      <span className="shrink-0 text-[9px] text-white/18">{item.time}</span>
                    </div>
                    <p className="mt-0.5 text-sm leading-relaxed text-white/35">{item.body}</p>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}