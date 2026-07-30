import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Ship, MapPin, Package, Plus, Loader2 } from "lucide-react";
import { Button } from "../ui/Button";
import { createShipService } from "../../services/shipServices";

const AVAILABLE_SERVICES = [
  { id: "oil", label: "Oil", emoji: "🛢️" },
  { id: "food", label: "Food", emoji: "🍱" },
  { id: "water", label: "Water", emoji: "💧" },
  { id: "fuel", label: "Fuel", emoji: "⛽" },
  { id: "medical", label: "Medical", emoji: "🏥" },
  { id: "spare_parts", label: "Spare Parts", emoji: "🔧" },
  { id: "repair", label: "Repair", emoji: "🛠️" },
  { id: "crew_transfer", label: "Crew Transfer", emoji: "👷" },
];

export default function CreateServiceModal({ onClose, onCreated }) {
  const [shipName, setShipName] = useState("");
  const [location, setLocation] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleService = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shipName.trim()) return setError("Ship name is required.");
    if (!location.trim()) return setError("Current location is required.");
    if (selectedServices.length === 0) return setError("Select at least one service.");

    setLoading(true);
    setError(null);

    try {
      const result = await createShipService({
        ship_name: shipName.trim(),
        current_location: location.trim(),
        services_offered: selectedServices,
      });
      onCreated(result);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-white/15 bg-[#0d0e12] shadow-[0_40px_120px_rgba(0,0,0,0.7)]"
      >
        {/* Top glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">New Listing</p>
            <h2 className="mt-1 text-lg font-semibold text-white">Create Ship Service</h2>
          </div>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/60 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </motion.button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-400"
            >
              {error}
            </motion.div>
          )}

          {/* Ship Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">
              <Ship className="h-3.5 w-3.5" />
              Ship Name
            </label>
            <input
              type="text"
              value={shipName}
              onChange={(e) => { setShipName(e.target.value); setError(null); }}
              placeholder="e.g. MV Aquavern Pioneer"
              disabled={loading}
              className="w-full rounded-lg border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/35 outline-none transition-all duration-300 focus:border-white/28 focus:bg-white/[0.07] focus:ring-1 focus:ring-white/15 disabled:opacity-40"
            />
          </div>

          {/* Current Location */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">
              <MapPin className="h-3.5 w-3.5" />
              Current Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => { setLocation(e.target.value); setError(null); }}
              placeholder="e.g. 14.2°N 74.8°E — Arabian Sea"
              disabled={loading}
              className="w-full rounded-lg border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/35 outline-none transition-all duration-300 focus:border-white/28 focus:bg-white/[0.07] focus:ring-1 focus:ring-white/15 disabled:opacity-40"
            />
          </div>

          {/* Services Offered */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">
              <Package className="h-3.5 w-3.5" />
              Services Offered
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {AVAILABLE_SERVICES.map((svc) => {
                const active = selectedServices.includes(svc.id);
                return (
                  <motion.button
                    key={svc.id}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleService(svc.id)}
                    disabled={loading}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-xs font-medium transition-all duration-200 ${
                      active
                        ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                        : "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20 hover:bg-white/[0.06] hover:text-white/80"
                    } disabled:opacity-40`}
                  >
                    <span className="text-lg leading-none">{svc.emoji}</span>
                    <span>{svc.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Service
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
