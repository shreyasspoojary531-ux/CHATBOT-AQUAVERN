import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WifiOff } from "lucide-react";

export default function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {offline && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="sticky top-0 z-[500] flex items-center justify-center gap-2.5 bg-amber-500/10 border-b border-amber-500/15 px-4 py-2"
          role="alert"
          aria-live="assertive"
        >
          <WifiOff className="h-3.5 w-3.5 text-amber-400/70 shrink-0" />
          <p className="text-xs text-amber-400/70 font-medium">
            You are offline — some features may be unavailable
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}