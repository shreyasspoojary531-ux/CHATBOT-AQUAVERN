import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Ship, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/Button";
import { getAllShipServices } from "../services/shipServices";
import ServiceCard from "../components/services/ServiceCard";
import CreateServiceModal from "../components/services/CreateServiceModal";
import ShipServiceDetail from "../components/services/ShipServiceDetail";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedShip, setSelectedShip] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllShipServices();
      setServices(data);
    } catch (err) {
      setError(err.message || "Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreated = (newService) => {
    setServices((prev) => [newService, ...prev]);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-6 overflow-y-auto pb-10">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-white/35">Ship Network</p>
          <h1 className="mt-1.5 text-3xl font-semibold text-white sm:text-4xl">Services</h1>
          <p className="mt-2 text-sm text-white/40">Browse ships offering services or register your own vessel.</p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={fetchServices}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/50 hover:text-white transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </motion.button>
          <Button
            onClick={() => setShowCreate(true)}
            className="gap-2 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" />
            Create Service
          </Button>
        </div>
      </motion.div>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.35 }}
        className="flex gap-3 overflow-x-auto pb-1 no-scrollbar"
      >
        {[
          { label: "Active Ships", value: services.length },
          { label: "Total Services", value: services.reduce((acc, s) => acc + s.services_offered.length, 0) },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex shrink-0 flex-col gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-5 py-3"
          >
            <p className="text-xl font-semibold text-white">{stat.value}</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Content area */}
      {loading ? (
        <div className="flex flex-1 items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4 text-white/40">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">Loading ship services...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-1 items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-400/60" />
            <p className="text-sm text-red-400">{error}</p>
            <Button variant="ghost" onClick={fetchServices} className="gap-2 text-sm">
              <RefreshCw className="h-4 w-4" /> Try Again
            </Button>
          </div>
        </div>
      ) : services.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-1 items-center justify-center py-24"
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-16 w-16 items-center justify-center rounded-xl border border-white/12 bg-white/[0.05]"
            >
              <Ship className="h-8 w-8 text-white/30" />
            </motion.div>
            <div>
              <p className="text-base font-medium text-white/60">No ships registered yet</p>
              <p className="mt-1 text-sm text-white/35">Be the first to create a service listing.</p>
            </div>
            <Button onClick={() => setShowCreate(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Create Service
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              onClick={() => setSelectedShip(service)}
            />
          ))}
        </motion.div>
      )}

      {/* Create Service Modal */}
      <AnimatePresence>
        {showCreate && (
          <CreateServiceModal
            onClose={() => setShowCreate(false)}
            onCreated={handleCreated}
          />
        )}
      </AnimatePresence>

      {/* Ship Detail Panel */}
      <AnimatePresence>
        {selectedShip && (
          <ShipServiceDetail
            service={selectedShip}
            onClose={() => setSelectedShip(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
