import { useCallback, useRef, useState } from "react";
import { motion } from "motion/react";
import { X, Ship, MapPin, Package, Plus, Loader2, Anchor } from "lucide-react";
import { Button } from "../ui/Button";
import { createShipService } from "../../services/shipServices";
import { useToast } from "../ui/Toast";

const SERVICES = [
  { id: "oil", label: "Oil", emoji: "\u{1F6E2}️" },
  { id: "food", label: "Food", emoji: "\u{1F371}" },
  { id: "water", label: "Water", emoji: "\u{1F4A7}" },
  { id: "fuel", label: "Fuel", emoji: "⛽" },
  { id: "medical", label: "Medical", emoji: "\u{1F3E5}" },
  { id: "spare_parts", label: "Spare Parts", emoji: "\u{1F527}" },
  { id: "repair", label: "Repair", emoji: "\u{1F6E0}️" },
  { id: "crew_transfer", label: "Crew Transfer", emoji: "\u{1F477}" },
];

const MAX_NAME = 60;
const MAX_LOCATION = 100;

export default function CreateServiceModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const submitRef = useRef(false);
  const toast = useToast();
  const inputRef = useRef(null);

  // Focus first input on mount
  const handleAnimationComplete = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const toggle = (id) => {
    if (loading) return;
    setSelected((p) => p.includes(id) ? p.filter((s) => s !== id) : [...p, id]);
    setError(null);
  };

  const validate = useCallback(() => {
    const errors = {};
    if (!name.trim()) errors.name = "Ship name is required";
    else if (name.length > MAX_NAME) errors.name = `Max ${MAX_NAME} characters`;
    if (!location.trim()) errors.location = "Location is required";
    else if (location.length > MAX_LOCATION) errors.location = `Max ${MAX_LOCATION} characters`;
    if (selected.length === 0) errors.services = "Select at least one service";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [name, location, selected]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (submitRef.current || loading) return; // prevent double-submit
    submitRef.current = true;

    setLoading(true);
    setError(null);

    try {
      const result = await createShipService({
        ship_name: name.trim(),
        current_location: location.trim(),
        services_offered: selected,
      });
      toast(`"${name.trim()}" registered successfully`, "success");
      onCreated(result);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create service.");
      submitRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop with click prevention during loading */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={loading ? undefined : onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onAnimationComplete={handleAnimationComplete}
        role="dialog"
        aria-modal="true"
        aria-label="Register a vessel"
        className="glass relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.10] shadow-[0_32px_100px_rgba(0,0,0,0.55)]"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

        <div className="flex items-center justify-between border-b border-white/[0.04] px-5 py-4">
          <div>
            <div className="flex items-center gap-1.5">
              <Anchor className="h-3 w-3 text-white/30" />
              <span className="text-[9px] uppercase tracking-[0.18em] text-white/25">Registration</span>
            </div>
            <h2 className="text-sm font-semibold text-white mt-0.5">Register a Vessel</h2>
          </div>
          <button onClick={loading ? undefined : onClose} disabled={loading} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-white/40 hover:text-white transition-all duration-200 disabled:opacity-40">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4" noValidate>
          {error && (
            <div className="rounded-xl border border-red-500/15 bg-red-500/6 px-3.5 py-2.5" role="alert">
              <p className="text-[11px] text-red-400">{error}</p>
            </div>
          )}

          {/* Ship Name */}
          <div className="space-y-1.5">
            <label htmlFor="ship-name" className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/35">
              <Ship className="h-3 w-3" /> Ship Name
            </label>
            <div className="relative">
              <input id="ship-name" ref={inputRef}
                type="text" value={name} maxLength={MAX_NAME}
                onChange={(e) => { setName(e.target.value); setFieldErrors((p) => ({ ...p, name: null })); setError(null); }}
                placeholder="e.g. MV Aquavern Pioneer" disabled={loading}
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? "name-error" : "name-count"}
                className="w-full h-10 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 pr-16 text-sm text-white placeholder:text-white/20 outline-none transition-all duration-300 focus:border-white/18 focus:bg-white/[0.04] disabled:opacity-40 aria-[invalid=true]:border-red-500/30"
              />
              <span id="name-count" className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-white/15 tabular-nums">{name.length}/{MAX_NAME}</span>
            </div>
            {fieldErrors.name && <p id="name-error" className="text-[10px] text-red-400/70">{fieldErrors.name}</p>}
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label htmlFor="ship-location" className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/35">
              <MapPin className="h-3 w-3" /> Current Location
            </label>
            <div className="relative">
              <input id="ship-location"
                type="text" value={location} maxLength={MAX_LOCATION}
                onChange={(e) => { setLocation(e.target.value); setFieldErrors((p) => ({ ...p, location: null })); setError(null); }}
                placeholder="e.g. 14.2°N 74.8°E — Arabian Sea" disabled={loading}
                aria-invalid={!!fieldErrors.location}
                className="w-full h-10 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 pr-12 text-sm text-white placeholder:text-white/20 outline-none transition-all duration-300 focus:border-white/18 focus:bg-white/[0.04] disabled:opacity-40 aria-[invalid=true]:border-red-500/30"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-white/15 tabular-nums">{location.length}/{MAX_LOCATION}</span>
            </div>
            {fieldErrors.location && <p className="text-[10px] text-red-400/70">{fieldErrors.location}</p>}
          </div>

          {/* Services */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/35">
              <Package className="h-3 w-3" /> Services
            </label>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4" role="group" aria-label="Select services">
              {SERVICES.map((s) => {
                const on = selected.includes(s.id);
                return (
                  <motion.button key={s.id} type="button" whileTap={{ scale: 0.95 }} onClick={() => toggle(s.id)} disabled={loading}
                    aria-pressed={on}
                    className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-[11px] font-medium transition-all duration-200 ${
                      on ? "border-cyan-400/25 bg-cyan-500/6 text-cyan-200" : "border-white/[0.06] bg-white/[0.02] text-white/40 hover:border-white/16 hover:bg-white/[0.04] hover:text-white/65"
                    } disabled:opacity-40`}>
                    <span className="text-base leading-none">{s.emoji}</span>
                    <span>{s.label}</span>
                  </motion.button>
                );
              })}
            </div>
            {fieldErrors.services && <p className="text-[10px] text-red-400/70">{fieldErrors.services}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button type="button" variant="ghost" className="flex-1 h-10 text-xs" onClick={loading ? undefined : onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" className="flex-1 h-10 text-xs" disabled={loading} loading={loading}>
              {loading ? "Registering" : <><Plus className="h-3.5 w-3.5" /> Register</>}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}