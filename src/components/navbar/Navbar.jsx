import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, MessageSquareText, X, LogOut } from "lucide-react";
import { cn } from "../../lib/utils";

const links = [
  { label: "Home", to: "/home" },
  { label: "Chatbot", to: "/chatbot" },
  { label: "Notifications", to: "/notifications" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-2xl">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        <NavLink to="/home" onClick={() => setMobileMenuOpen(false)} className="group flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: -8, scale: 1.04 }}
            transition={{ type: "spring", stiffness: 320, damping: 20 }}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/[0.06] shadow-[0_0_32px_rgba(255,255,255,0.08)]"
          >
            <MessageSquareText className="h-5 w-5 text-white" />
          </motion.div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-white">AQUAVERN</p>
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/35">TECHNOLOGIES</p>
          </div>
        </NavLink>

        <div className="hidden max-w-[calc(100vw-11rem)] items-center gap-1.5 overflow-x-auto rounded-full border border-white/10 bg-white/[0.035] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-lg no-scrollbar md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "relative overflow-hidden rounded-full border px-4 py-2 text-sm font-medium outline-none transition-[color,background,border-color,box-shadow,opacity,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-[0.96]",
                  "border-transparent text-white/58 hover:-translate-y-0.5 hover:border-cyan-200/20 hover:bg-cyan-100/[0.045] hover:text-white hover:shadow-[0_0_28px_rgba(125,211,252,0.08)]",
                  isActive &&
                    "border-cyan-200/25 bg-gradient-to-b from-white/[0.15] to-white/[0.055] text-white shadow-[0_0_34px_rgba(125,211,252,0.12),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-lg"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <>
                      <motion.span
                        layoutId="active-nav-pill"
                        className="absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.12] to-white/[0.035]"
                        transition={{ type: "spring", stiffness: 430, damping: 34 }}
                      />
                      <motion.span
                        layoutId="active-nav-glow"
                        className="absolute inset-x-4 bottom-0 h-px rounded-full bg-cyan-200/80 shadow-[0_0_16px_rgba(125,211,252,0.65)]"
                        transition={{ type: "spring", stiffness: 430, damping: 34 }}
                      />
                    </>
                  )}
                  <span className="relative z-10">{link.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Desktop Logout Button */}
        <div className="hidden md:flex items-center">
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.02, borderColor: "rgba(239, 68, 68, 0.25)", backgroundColor: "rgba(239, 68, 68, 0.065)" }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-xs font-medium text-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-md transition-all duration-300 hover:text-red-400"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </motion.button>
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.045] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_50px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-200/20 hover:bg-white/[0.075] md:hidden"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </motion.button>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 top-16 z-40 bg-black/45 backdrop-blur-md md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 h-full w-full cursor-default"
            />
            <motion.aside
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel absolute right-3 top-3 w-[min(20rem,calc(100vw-1.5rem))] overflow-hidden rounded-lg border border-white/15 bg-white/[0.105] p-2 shadow-[0_30px_90px_rgba(0,0,0,0.55),0_0_60px_rgba(125,211,252,0.08),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-[42px] supports-[backdrop-filter]:bg-white/[0.08]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(125,211,252,0.14),transparent_12rem),linear-gradient(145deg,rgba(255,255,255,0.1),rgba(255,255,255,0.025))]" />
              <div className="relative border-b border-white/12 px-3 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">Navigation</p>
                <p className="mt-1 text-sm font-semibold text-white">Aquavern workspace</p>
              </div>
              <div className="relative mt-2 grid gap-1.5">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "group relative overflow-hidden rounded-lg border px-4 py-3 text-sm font-medium text-white/68 transition-all duration-300 active:scale-[0.98]",
                        "border-white/[0.055] bg-black/20 hover:border-cyan-200/24 hover:bg-white/[0.085] hover:text-white hover:shadow-[0_12px_42px_rgba(125,211,252,0.08)]",
                        isActive &&
                          "border-cyan-200/30 bg-gradient-to-b from-white/[0.18] to-white/[0.07] text-white shadow-[0_0_34px_rgba(125,211,252,0.14),inset_0_1px_0_rgba(255,255,255,0.14)]"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.span
                            layoutId="active-mobile-nav-glow"
                            className="absolute inset-y-2 left-0 w-px rounded-full bg-cyan-200/80 shadow-[0_0_16px_rgba(125,211,252,0.65)]"
                          />
                        )}
                        <span className="relative z-10">{link.label}</span>
                      </>
                    )}
                  </NavLink>
                ))}

                <div className="my-1 border-t border-white/10" />

                <motion.button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm font-medium text-red-400 transition-all duration-300 active:scale-[0.98] hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Logout Workspace
                </motion.button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
