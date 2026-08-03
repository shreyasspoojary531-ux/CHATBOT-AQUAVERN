import { motion } from "motion/react";
import { MapPin, ChevronRight, Anchor, Ship } from "lucide-react";

const SERVICE_MAP = {
  oil:         { label: "Oil",          emoji: "\u{1F6E2}️" },
  food:        { label: "Food",         emoji: "\u{1F371}" },
  water:       { label: "Water",        emoji: "\u{1F4A7}" },
  fuel:        { label: "Fuel",         emoji: "⛽" },
  medical:     { label: "Medical",      emoji: "\u{1F3E5}" },
  spare_parts: { label: "Spare Parts",  emoji: "\u{1F527}" },
  repair:      { label: "Repair",       emoji: "\u{1F6E0}️" },
  crew_transfer:{label: "Crew Transfer",emoji: "\u{1F477}" },
};

export default function ServiceCard({ service, index, onClick }) {
  const initials = service.ship_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const tags = service.services_offered.slice(0, 4);
  const overflow = service.services_offered.length - 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, scale: 1.005 }}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.025] p-5 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/12 hover:bg-white/[0.035] hover:shadow-[0_12px_40px_rgba(0,0,0,0.25),0_0_1px_rgba(255,255,255,0.04)]"
    >
      {/* Hover glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_0%,rgba(103,232,249,0.035),transparent_65%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-transparent to-transparent transition-all duration-700 group-hover:via-cyan-400/15" />

      {/* ── Row 1: Identity ── */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Initials avatar */}
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/10 to-white/[0.03] text-sm font-bold text-white shadow-sm transition-shadow duration-300 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.04)]">
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-white">{service.ship_name}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3 shrink-0 text-white/20" />
              <span className="truncate text-[11px] text-white/35">{service.current_location}</span>
            </div>
          </div>
        </div>

        {/* Live badge */}
        <div className="shrink-0 flex items-center gap-1.5 rounded-full border border-emerald-500/12 bg-emerald-500/5 px-2 py-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70 shadow-[0_0_6px_rgba(52,211,153,0.15)]" />
          <span className="text-[8px] font-semibold text-emerald-400/60 uppercase tracking-[0.1em]">Live</span>
        </div>
      </div>

      {/* ── Row 2: Service tags ── */}
      <div className="relative mt-4 flex flex-wrap gap-1.5">
        {tags.map((s) => {
          const svc = SERVICE_MAP[s];
          return (
            <span
              key={s}
              className="inline-flex items-center gap-1 rounded-lg border border-white/[0.03] bg-white/[0.025] px-2 py-1 text-[10px] text-white/40"
            >
              <span className="leading-none">{svc?.emoji || "\u{1F4E6}"}</span>
              <span>{svc?.label || s}</span>
            </span>
          );
        })}
        {overflow > 0 && (
          <span className="inline-flex items-center rounded-lg border border-white/[0.03] bg-white/[0.015] px-2 py-1 text-[10px] text-white/20">
            +{overflow}
          </span>
        )}
      </div>

      {/* ── Row 3: Footer ── */}
      <div className="relative mt-4 flex items-center justify-between border-t border-white/[0.02] pt-3.5">
        <span className="text-[8px] uppercase tracking-[0.14em] text-white/15 font-medium">
          {new Date(service.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
        <div className="flex items-center gap-1 text-[10px] font-medium text-cyan-300/30 transition-all duration-300 group-hover:text-cyan-300/70">
          View details
          <ChevronRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
        </div>
      </div>
    </motion.div>
  );
}