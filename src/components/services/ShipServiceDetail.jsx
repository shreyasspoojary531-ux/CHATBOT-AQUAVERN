import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Ship, Package, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/Button";
import { requestService } from "../../services/shipServices";
import { useNavigate } from "react-router-dom";

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

export default function ShipServiceDetail({ service, onClose }) {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const toggleService = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleOrder = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    setError(null);

    const serviceLabels = selected
      .map((id) => SERVICE_LABEL[id] || id)
      .join(", ");
    const prefilledMessage = `Hello ${service.ship_name}! 🚢 I would like to request the following services: ${serviceLabels}. Can we coordinate delivery when our ships meet at ${service.current_location}? Please confirm availability.`;

    try {
      await requestService({
        to_ship_service_id: service.id,
        services_requested: selected,
        message: prefilledMessage,
      });

      // Navigate to home (internal chat) with pre-filled message state
      navigate("/home", {
        state: {
          serviceOrder: {
            shipName: service.ship_name,
            shipInitials: service.ship_name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
            services: selected,
            location: service.current_location,
            prefilledMessage,
          },
        },
      });
    } catch (err) {
      setError(err.message || "Failed to place request. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-end p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Side panel */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 60 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel relative z-10 flex h-full max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-white/15 bg-[#0d0e12] shadow-[0_40px_120px_rgba(0,0,0,0.7)]"
      >
        {/* Top glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" />

        {/* Header */}
        <div className="shrink-0 border-b border-white/10 px-5 py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-gradient-to-br from-white/10 to-white/[0.04] text-sm font-bold text-white">
                {service.ship_name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Ship className="h-3.5 w-3.5 text-white/40" />
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Ship Details</p>
                </div>
                <h2 className="mt-0.5 text-base font-semibold text-white">{service.ship_name}</h2>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/60 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>

          <div className="mt-4 flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2 text-xs text-white/50">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-cyan-300/60" />
            {service.current_location}
          </div>
        </div>

        {/* Services selection */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <div className="mb-4 flex items-center gap-2">
            <Package className="h-4 w-4 text-white/40" />
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">Available Services</p>
          </div>
          <p className="mb-4 text-xs text-white/35">Select the services you need. A conversation will open with a pre-filled order message.</p>

          <div className="space-y-2">
            {service.services_offered.map((svc) => {
              const isSelected = selected.includes(svc);
              return (
                <motion.button
                  key={svc}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleService(svc)}
                  className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-lg border px-4 py-3 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_24px_rgba(34,211,238,0.08)]"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                  }`}
                >
                  <span className="text-xl leading-none">{SERVICE_EMOJI[svc] || "📦"}</span>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isSelected ? "text-cyan-200" : "text-white/70"}`}>
                      {SERVICE_LABEL[svc] || svc}
                    </p>
                  </div>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 22 }}
                      >
                        <CheckCircle2 className="h-5 w-5 text-cyan-300" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Footer / Order CTA */}
        <div className="shrink-0 border-t border-white/10 px-5 py-4">
          {error && (
            <p className="mb-3 text-xs text-red-400">{error}</p>
          )}
          {selected.length > 0 && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 text-xs text-white/45"
            >
              Requesting:{" "}
              <span className="text-cyan-300">
                {selected.map((id) => SERVICE_LABEL[id] || id).join(", ")}
              </span>
            </motion.p>
          )}
          <Button
            onClick={handleOrder}
            disabled={selected.length === 0 || loading}
            className="w-full gap-2 text-sm font-semibold"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
            ) : (
              <><ArrowRight className="h-4 w-4" /> Request Service & Open Chat</>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
