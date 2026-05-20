import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquareText } from "lucide-react";
import { cn } from "../../lib/utils";

const links = [
  { label: "Home", to: "/" },
  { label: "Chatbot", to: "/chatbot" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-2xl">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="group flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: -8, scale: 1.04 }}
            transition={{ type: "spring", stiffness: 320, damping: 20 }}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/[0.06] shadow-[0_0_32px_rgba(255,255,255,0.08)]"
          >
            <MessageSquareText className="h-5 w-5 text-white" />
          </motion.div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-white">AQUAVERN</p>
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/35">TECHNOLGIES</p>
          </div>
        </NavLink>

        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.035] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-lg">
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
      </nav>
    </header>
  );
}
