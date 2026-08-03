import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Ship,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Anchor,
  ArrowRight,
  Waves,
  Compass,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { getAllShipServices } from "../services/shipServices";
import ServiceCard from "../components/services/ServiceCard";
import CreateServiceModal from "../components/services/CreateServiceModal";
import ShipServiceDetail from "../components/services/ShipServiceDetail";

/* ─── Skeleton card for loading state ─── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5 overflow-hidden">
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 rounded-xl skeleton" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/5 skeleton rounded-md" />
          <div className="h-3 w-2/5 skeleton rounded-md" />
        </div>
      </div>
      <div className="mt-4 flex gap-1.5">
        <div className="h-6 w-16 skeleton rounded-lg" />
        <div className="h-6 w-14 skeleton rounded-lg" />
        <div className="h-6 w-12 skeleton rounded-lg" />
      </div>
      <div className="mt-4 pt-3.5 border-t border-white/[0.03] flex justify-between">
        <div className="h-3 w-20 skeleton rounded-md" />
        <div className="h-3 w-14 skeleton rounded-md" />
      </div>
    </div>
  );
}

/* ─── Skeleton grid ─── */
function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
          <SkeletonCard />
        </motion.div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SERVICES PAGE — Narrative Structure
   ══════════════════════════════════════════════════ */

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedShip, setSelectedShip] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setServices(await getAllShipServices());
    } catch (err) {
      setError(err.message || "Failed to load services.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const totalServices = services.reduce((a, s) => a + s.services_offered.length, 0);
  const locations = [...new Set(services.map((s) => s.current_location))].length;

  return (
    <div className="flex h-full min-h-0 flex-col gap-6 overflow-y-auto pb-8 overscroll-contain">

      {/* ═══════════════════════════════════
          CHAPTER 1 — HERO / NETWORK OVERVIEW
          ═══════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-white/[0.04] bg-gradient-to-b from-white/[0.02] to-transparent px-6 py-7 sm:px-8 sm:py-9"
      >
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(ellipse_at_100%_50%,rgba(103,232,249,0.04),transparent_65%)]" />
          <div className="absolute bottom-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        </div>

        <div className="relative">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/30 mb-3">
            <Waves className="h-3 w-3" />
            <span>Ship Network</span>
          </div>

          {/* Title + subtitle */}
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Maritime Service Hub
          </h1>
          <p className="mt-2 text-sm text-white/40 max-w-xl leading-relaxed">
            A coordinated network of vessels offering logistics, supplies, and crew support across
            active shipping routes.
          </p>

          {/* Stats strip (narrative) */}
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            <StatBlock label="Active Vessels" value={loading ? "—" : String(services.length)} icon={Ship} />
            <StatBlock label="Service Listings" value={loading ? "—" : String(totalServices)} icon={Anchor} />
            <StatBlock label="Ports Reached" value={loading ? "—" : String(locations)} icon={Compass} />
          </div>

          {/* CTAs */}
          <div className="mt-6 flex items-center gap-3">
            <Button onClick={() => setShowCreate(true)} className="gap-2 text-sm font-medium h-10 shadow-sm">
              <Plus className="h-4 w-4" />
              Register Vessel
            </Button>
            <button
              type="button"
              onClick={fetch}
              className="flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 h-10 text-xs text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-all duration-300"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════
          CHAPTER 2 — VESSEL DIRECTORY
          ═══════════════════════════════════ */}

      {loading ? (
        <LoadingGrid />
      ) : error ? (
        /* ── Error State ── */
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-1 items-center justify-center py-16">
          <div className="flex flex-col items-center gap-4 text-center max-w-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/12 bg-red-500/6">
              <AlertTriangle className="h-7 w-7 text-red-400/50" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-400/80">Unable to load fleet data</p>
              <p className="mt-1 text-xs text-red-400/50">{error}</p>
            </div>
            <Button variant="secondary" onClick={fetch} className="gap-2 text-sm h-9">
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </Button>
          </div>
        </motion.div>
      ) : services.length === 0 ? (
        /* ── Empty State ── */
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-1 items-center justify-center py-16">
          <div className="flex flex-col items-center gap-5 text-center max-w-sm">
            <motion.div
              animate={{ y: [0, -5, 0], rotate: [0, -2, 0, 2, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/[0.05] bg-white/[0.02]"
            >
              <Ship className="h-10 w-10 text-white/15" />
            </motion.div>
            <div>
              <p className="text-lg font-semibold text-white/50">No vessels in the network</p>
              <p className="mt-1.5 text-sm text-white/30 leading-relaxed">
                The fleet directory is empty. Register the first vessel to start offering services.
              </p>
            </div>
            <Button onClick={() => setShowCreate(true)} className="gap-2 text-sm h-10">
              <Plus className="h-4 w-4" /> Register Vessel
            </Button>
          </div>
        </motion.div>
      ) : (
        /* ── Vessel Grid ── */
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05, duration: 0.35 }}>
          {/* Section label */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-white/25">
              <Compass className="h-3 w-3" />
              <span>Active Vessels</span>
            </div>
            <span className="text-[10px] text-white/15">{services.length} ship{services.length !== 1 ? "s" : ""}</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {services.map((svc, i) => (
              <ServiceCard key={svc.id} service={svc} index={i} onClick={() => setSelectedShip(svc)} />
            ))}
          </div>
        </motion.div>
      )}

      {/* ═══════════════════════════════════
          CHAPTER 3 — FOOTER CTA
          ═══════════════════════════════════ */}
      {!loading && !error && services.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl border border-white/[0.04] bg-gradient-to-b from-white/[0.015] to-transparent px-6 py-6 sm:px-8"
        >
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-base font-semibold text-white">Want to join the network?</h3>
              <p className="mt-1 text-sm text-white/40">Register your vessel and start offering services to the fleet.</p>
            </div>
            <Button onClick={() => setShowCreate(true)} className="gap-2 text-sm font-medium h-10 shrink-0">
              Register Vessel <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* ── Modals ── */}
      <AnimatePresence>{showCreate && <CreateServiceModal onClose={() => setShowCreate(false)} onCreated={(s) => setServices((prev) => [s, ...prev])} />}</AnimatePresence>
      <AnimatePresence>{selectedShip && <ShipServiceDetail service={selectedShip} onClose={() => setSelectedShip(null)} />}</AnimatePresence>
    </div>
  );
}

/* ─── Stat block used in hero ─── */
function StatBlock({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.04] bg-white/[0.02]">
        <Icon className="h-3.5 w-3.5 text-white/25" />
      </div>
      <div>
        <p className="text-lg font-semibold tracking-tight text-white">{value}</p>
        <p className="text-[9px] uppercase tracking-[0.14em] text-white/25">{label}</p>
      </div>
    </div>
  );
}