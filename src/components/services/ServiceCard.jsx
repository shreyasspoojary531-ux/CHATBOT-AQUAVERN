import { motion } from "framer-motion";
import { MapPin, ChevronRight, Wifi } from "lucide-react";

const SERVICE_EMOJI = {
  oil: "🛢️",
  food: "🍱",
  water: "💧",
  fuel: "⛽",
  medical: "🏥",
  spare_parts: "🔧",
  repair: "🛠️",
  crew_transfer: "👷",
};

const SERVICE_LABEL = {
  oil: "Oil",
  food: "Food",
  water: "Water",
  fuel: "Fuel",
  medical: "Medical",
  spare_parts: "Spare Parts",
  repair: "Repair",
  crew_transfer: "Crew Transfer",
};

export default function ServiceCard({ service, index, onClick }) {
  const initials = service.ship_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -3, scale: 1.01 }}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-cyan-400/25 hover:bg-white/[0.07] hover:shadow-[0_16px_48px_rgba(34,211,238,0.06)]"
    >
      {/* Hover glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.06),transparent_60%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/0 to-transparent transition-all duration-300 group-hover:via-cyan-400/30" />

      {/* Header row */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-gradient-to-br from-white/10 to-white/[0.04] text-sm font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-white">{service.ship_name}</h3>
            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-white/45">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{service.current_location}</span>
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
          <Wifi className="h-2.5 w-2.5" />
          Active
        </div>
      </div>

      {/* Services tags */}
      <div className="relative mt-4 flex flex-wrap gap-1.5">
        {service.services_offered.slice(0, 5).map((svc) => (
          <span
            key={svc}
            className="flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.05] px-2 py-1 text-[11px] text-white/65"
          >
            <span>{SERVICE_EMOJI[svc] || "📦"}</span>
            <span>{SERVICE_LABEL[svc] || svc}</span>
          </span>
        ))}
        {service.services_offered.length > 5 && (
          <span className="flex items-center rounded-md border border-white/10 bg-white/[0.05] px-2 py-1 text-[11px] text-white/45">
            +{service.services_offered.length - 5} more
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="relative mt-4 flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/25">
          {new Date(service.created_at).toLocaleDateString()}
        </p>
        <div className="flex items-center gap-1 text-[11px] font-medium text-cyan-300/70 transition-colors group-hover:text-cyan-300">
          View Services
          <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </div>
      </div>
    </motion.div>
  );
}
