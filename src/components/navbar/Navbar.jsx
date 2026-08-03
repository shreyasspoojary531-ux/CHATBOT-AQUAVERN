import { useCallback, useRef, useState } from "react";
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

const spring = { type: "spring", stiffness: 400, damping: 32 };

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const menuBtnRef = useRef(null);

  const handleLogout = useCallback(async () => {
    try { await supabase.auth.signOut(); } catch { /* cleared below */ }
    clearAuth();
    navigate("/login", { replace: true });
  }, [clearAuth, navigate]);

  const confirmLogout = useCallback(async () => {
    setShowLogoutConfirm(false);
    setMobileOpen(false);
    // Brief delay so the UI settles
    await new Promise((r) => setTimeout(r, 200));
    handleLogout();
  }, [handleLogout]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.05] bg-black/40 backdrop-blur-2xl supports-[backdrop-filter]:bg-black/30">
      <nav className="mx-auto flex h-14 sm:h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <NavLink to="/home" onClick={() => setMobileOpen(false)} className="group flex items-center gap-3 shrink-0">
          <motion.div whileHover={{ rotate: -6, scale: 1.04 }} transition={{ type: "spring", stiffness: 320, damping: 20 }}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-white/[0.10] bg-white/[0.04]">
            <MessageSquareText className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px] text-white" />
          </motion.div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold tracking-wide text-white">AQUAVERN</p>
            <p className="text-[9px] uppercase tracking-[0.24em] text-white/25">TECHNOLOGIES</p>
          </div>
        </NavLink>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 rounded-2xl border border-white/[0.04] bg-white/[0.02] p-1 shadow-sm">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to}
              className={({ isActive }) => cn(
                "relative overflow-hidden rounded-xl px-3 py-1.5 text-xs font-medium outline-none transition-all duration-300",
                isActive ? "text-white" : "text-white/45 hover:text-white/75"
              )}>
              {({ isActive }) => (
                <>
                  {isActive && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/[0.04]" transition={spring} />}
                  <span className="relative z-10 flex items-center gap-1.5"><link.icon className="h-3.5 w-3.5" />{link.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center gap-2">
          <motion.button onClick={() => setShowLogoutConfirm(true)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-[7px] text-[11px] font-medium text-white/35 transition-all duration-300 hover:border-red-500/15 hover:bg-red-500/5 hover:text-red-400/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/15">
            <LogOut className="h-3 w-3" />
            <span className="hidden lg:inline">Logout</span>
          </motion.button>
        </div>

        {/* Mobile hamburger */}
        <button ref={menuBtnRef} type="button" onClick={() => setMobileOpen((o) => !o)} aria-expanded={mobileOpen} aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="flex h-9 w-9 items-center justify-center rounded-xl md:hidden border border-white/[0.06] bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.05] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20">
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 top-14 z-40 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)} className="absolute inset-0 h-full w-full bg-black/40 backdrop-blur-sm cursor-default" />
            <motion.aside initial={{ x: "100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-3 top-3 w-[min(20rem,calc(100vw-1.5rem))] rounded-2xl border border-white/[0.08] bg-[#0d0e12]/95 backdrop-blur-2xl overflow-hidden shadow-[0_32px_100px_rgba(0,0,0,0.5)]"
              role="dialog" aria-modal="true" aria-label="Navigation menu">
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-500/[0.04] blur-3xl" />
              <div className="relative border-b border-white/[0.04] px-4 py-3.5">
                <p className="text-[9px] uppercase tracking-[0.22em] text-white/30">Navigation</p>
                <p className="mt-0.5 text-sm font-semibold text-white">Aquavern workspace</p>
              </div>
              <div className="relative p-2">
                {links.map((link, i) => (
                  <motion.div key={link.to} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i, duration: 0.25 }}>
                    <NavLink to={link.to} onClick={() => setMobileOpen(false)}
                      className={({ isActive }) => cn(
                        "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                        isActive ? "text-white" : "text-white/50 hover:text-white hover:bg-white/[0.03]"
                      )}>
                      {({ isActive }) => (
                        <>
                          {isActive && <motion.span layoutId="mobile-active" className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.04]" transition={spring} />}
                          <span className="relative z-10 flex items-center gap-3"><link.icon className="h-4 w-4" />{link.label}</span>
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
                <div className="my-2 border-t border-white/[0.04]" />
                <motion.button onClick={() => { setMobileOpen(false); setShowLogoutConfirm(true); }}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * links.length + 0.02, duration: 0.25 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-red-400/70 border border-red-500/12 bg-red-500/4 hover:bg-red-500/8 hover:text-red-300 transition-all duration-200">
                  <LogOut className="h-4 w-4" /> Logout workspace
                </motion.button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout confirmation dialog */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
            <motion.div initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="glass relative z-10 w-full max-w-sm rounded-2xl border border-white/[0.10] p-6 shadow-[0_32px_100px_rgba(0,0,0,0.55)]"
              role="alertdialog" aria-label="Confirm logout">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/12 bg-red-500/6 mb-4">
                  <LogOut className="h-6 w-6 text-red-400/60" />
                </div>
                <h3 className="text-base font-semibold text-white">Leave workspace?</h3>
                <p className="mt-1.5 text-sm text-white/40 leading-relaxed">You will be signed out and returned to the login screen.</p>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="ghost" className="flex-1 text-xs h-10" onClick={() => setShowLogoutConfirm(false)}>Cancel</Button>
                <Button className="flex-1 text-xs h-10 gap-2" onClick={confirmLogout}>
                  <LogOut className="h-3.5 w-3.5" /> Logout
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}