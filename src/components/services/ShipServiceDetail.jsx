import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, MapPin, Ship, Package, ArrowRight, Loader2, CheckCircle2, Anchor,
} from "lucide-react";
import { Button } from "../ui/Button";
import { requestService } from "../../services/shipServices";
import { useNavigate } from "react-router-dom";

const SVC = {
  oil: { label: "Oil", emoji: "\u{1F6E2}️" },
  food: { label: "Food", emoji: "\u{1F371}" },
  water: { label: "Water", emoji: "\u{1F4A7}" },
  fuel: { label: "Fuel", emoji: "⛽" },
  medical: { label: "Medical", emoji: "\u{1F3E5}" },
  spare_parts: { label: "Spare Parts", emoji: "\u{1F527}" },
  repair: { label: "Repair", emoji: "\u{1F6E0}️" },
  crew_transfer: { label: "Crew Transfer", emoji: "\u{1F477}" },
};

export default function ShipServiceDetail({ service, onClose }) {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const init = (name) => name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const handleOrder = async () => {
    if (!selected.length) return;
    setLoading(true); setError(null);
    const labels = selected.map((id) => SVC[id]?.label || id).join(", ");
    const msg = `Hello ${service.ship_name}! I'd like to request: ${labels}. Can we coordinate at ${service.current_location}?`;

    try {
      await requestService({ to_ship_service_id: service.id, services_requested: selected, message: msg });
      navigate("/home", { state: { serviceOrder: { shipName: service.ship_name, shipInitials: init(service.ship_name), services: selected, location: service.current_location, prefilledMessage: msg } } });
    } catch (err) {
      setError(err.message || "Failed to place request."); setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-end p-3 sm:p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="glass relative z-10 flex h-full max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/[0.10] shadow-[0_32px_100px_rgba(0,0,0,0.55)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

        {/* Header */}
        <div className="shrink-0 border-b border-white/[0.04] px-5 py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.10] bg-gradient-to-br from-white/10 to-white/[0.03] text-sm font-bold text-white shadow-sm">
                {init(service.ship_name)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <Ship className="h-3 w-3 text-white/30" />
                  <span className="text-[9px] uppercase tracking-[0.18em] text-white/25">Vessel</span>
                </div>
                <h2 className="text-sm font-semibold text-white mt-0.5">{service.ship_name}</h2>
              </div>
            </div>
            <button onClick={onClose} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-white/40 hover:text-white hover:bg-white/[0.06] transition-all duration-200">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-white/[0.04] bg-white/[0.02] px-3 py-1.5">
            <MapPin className="h-3 w-3 shrink-0 text-cyan-300/50" />
            <span className="text-[11px] text-white/45">{service.current_location}</span>
          </div>
        </div>

        {/* Services */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          <div className="flex items-center gap-2 mb-3">
            <Anchor className="h-3.5 w-3.5 text-white/30" />
            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/30">Available Services</span>
          </div>
          <p className="text-[11px] text-white/30 mb-4 leading-relaxed">Select services to request. A chat thread will open with a pre-filled order.</p>

          <div className="space-y-1.5">
            {service.services_offered.map((id) => {
              const on = selected.includes(id);
              return (
                <motion.button key={id} type="button" whileTap={{ scale: 0.98 }} onClick={() => setSelected((p) => p.includes(id) ? p.filter((s) => s !== id) : [...p, id])}
                  className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-xl border px-3.5 py-3 text-left transition-all duration-200 ${
                    on ? "border-cyan-400/25 bg-cyan-500/6 shadow-[0_0_16px_rgba(34,211,238,0.04)]" : "border-white/[0.06] bg-white/[0.02] hover:border-white/14 hover:bg-white/[0.04]"
                  }`}>
                  <span className="text-lg leading-none">{SVC[id]?.emoji || "\u{1F4E6}"}</span>
                  <span className={`flex-1 text-sm font-medium ${on ? "text-cyan-200" : "text-white/55"}`}>{SVC[id]?.label || id}</span>
                  {on && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 400, damping: 22 }}>
                      <CheckCircle2 className="h-[18px] w-[18px] text-cyan-300" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-white/[0.04] px-5 py-4">
          {error && <p className="text-[11px] text-red-400 mb-2">{error}</p>}
          {selected.length > 0 && (
            <p className="text-[11px] text-white/35 mb-2">Requesting: <span className="text-cyan-300">{selected.map((id) => SVC[id]?.label || id).join(", ")}</span></p>
          )}
          <Button onClick={handleOrder} disabled={!selected.length || loading} loading={loading} className="w-full gap-2 text-sm font-medium">
            {loading ? "Processing" : <><ArrowRight className="h-4 w-4" /> Request &amp; Chat</>}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}