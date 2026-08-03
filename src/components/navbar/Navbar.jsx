import { useCallback, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Menu,
  MessageSquareText,
  X,
  LogOut,
  Home,
  Bot,
  Ship,
  Bell,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuthStore } from "../../store/authStore";
import { supabase } from "../../utils/supabase";

const links = [
  { label: "Home", to: "/home", icon: Home },
  { label: "Chatbot", to: "/chatbot", icon: Bot },
  { label: "Services", to: "/services", icon: Ship },
  { label: "Notifications", to: "/notifications", icon: Bell },
];

const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 32,
};

const easeTransition = {
  duration: 0.35,
  ease: [0.16, 1, 0.3, 1],
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Silently handle — auth is cleared regardless
    } finally {
      clearAuth();
      navigate("/login", { replace: true });
    }
  }, [clearAuth, navigate]);

  const closeMobile = useCallback(() => setMobileMenuOpen(false), []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/40 backdrop-blur-2xl supports-[backdrop-filter]:bg-black/30">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ── Brand ── */}
        <NavLink
          to="/home"
          onClick={closeMobile}
          className="group flex items-center gap-3 shrink-0"
        >
          <motion.div
            whileHover={{ rotate: -6, scale: 1.04 }}
            transition={{ type: "spring", stiffness: 320, damping: 20 }}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.12] bg-white/[0.05] shadow-[0_0_24px_rgba(255,255,255,0.06)]"
          >
            <MessageSquareText className="h-[18px] w-[18px] text-white" />
          </motion.div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold tracking-wide text-white">
              AQUAVERN
            </p>
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/30">
              TECHNOLOGIES
            </p>
          </div>
        </NavLink>

        {/* ── Desktop Nav ── */}
        <div className="hidden md:flex items-center gap-1 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-lg">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "relative overflow-hidden rounded-xl px-3.5 py-2 text-sm font-medium outline-none",
                  "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  isActive
                    ? "text-white"
                    : "text-white/50 hover:text-white/80"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.10] to-white/[0.03] border border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]"
                      transition={springTransition}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* ── Right side: Desktop Logout ── */}
        <div className="hidden md:flex items-center">
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03]",
              "px-3.5 py-2 text-xs font-medium text-white/45",
              "transition-all duration-300",
              "hover:border-red-500/25 hover:bg-red-500/8 hover:text-red-400",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            )}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Logout</span>
          </motion.button>
        </div>

        {/* ── Mobile Hamburger ── */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl md:hidden",
            "border border-white/[0.08] bg-white/[0.04]",
            "transition-all duration-300",
            "hover:border-white/20 hover:bg-white/[0.08]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          )}
        >
          <AnimatePresence mode="wait">
            {mobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-4 w-4 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-4 w-4 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </nav>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 top-16 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <button
              type="button"
              aria-label="Close menu"
              onClick={closeMobile}
              className="absolute inset-0 h-full w-full bg-black/40 backdrop-blur-sm cursor-default"
            />

            {/* Drawer panel */}
            <motion.aside
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "absolute right-3 top-3 w-[min(20rem,calc(100vw-1.5rem))]",
                "rounded-2xl border border-white/[0.10] bg-[#0d0e12]/95",
                "shadow-[0_32px_100px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]",
                "backdrop-blur-2xl supports-[backdrop-filter]:bg-[#0d0e12]/80",
                "overflow-hidden"
              )}
            >
              {/* Decorative glow */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-500/[0.06] blur-3xl" />

              {/* Header */}
              <div className="relative border-b border-white/[0.06] px-4 py-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/35">
                  Navigation
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  Aquavern workspace
                </p>
              </div>

              {/* Links */}
              <div className="relative p-2">
                {links.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.04 * i,
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <NavLink
                      to={link.to}
                      onClick={closeMobile}
                      className={({ isActive }) =>
                        cn(
                          "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium",
                          "transition-all duration-300",
                          isActive
                            ? "text-white"
                            : "text-white/55 hover:text-white hover:bg-white/[0.04]"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <motion.span
                              layoutId="mobile-active-bg"
                              className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/[0.06]"
                              transition={springTransition}
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-3">
                            <link.icon className="h-4 w-4" />
                            {link.label}
                          </span>
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                ))}

                {/* Divider */}
                <div className="my-2 border-t border-white/[0.06]" />

                {/* Mobile Logout */}
                <motion.button
                  onClick={() => {
                    closeMobile();
                    handleLogout();
                  }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.04 * links.length + 0.04,
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium",
                    "text-red-400/80 border border-red-500/15 bg-red-500/5",
                    "transition-all duration-300",
                    "hover:bg-red-500/10 hover:text-red-300"
                  )}
                >
                  <LogOut className="h-4 w-4" />
                  Logout workspace
                </motion.button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}