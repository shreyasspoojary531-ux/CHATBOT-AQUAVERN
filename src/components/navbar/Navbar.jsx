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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/45 backdrop-blur-2xl">
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
            <p className="text-sm font-semibold tracking-wide text-white">Aquavern</p>
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/35">Internal</p>
          </div>
        </NavLink>

        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "relative rounded-md px-4 py-2 text-sm font-medium text-white/55 transition-colors duration-300 hover:text-white",
                  isActive && "text-black"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="active-nav-pill"
                      className="absolute inset-0 rounded-md bg-white"
                      transition={{ type: "spring", stiffness: 430, damping: 34 }}
                    />
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
