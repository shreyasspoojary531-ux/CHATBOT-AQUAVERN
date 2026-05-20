import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex h-[72px] w-full items-center border-b border-white/[0.06] bg-black/20 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10 lg:px-14 xl:px-20">
        <div className="flex h-14 items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl md:px-5">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.015 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_0_40px_rgba(255,255,255,0.03)]">
              <MessageSquare className="h-5 w-5 text-white/90" />
            </div>
            <span className="text-base font-semibold tracking-tight text-white/90 md:text-lg">
              Aquavern
            </span>
          </motion.div>

          <div className="flex items-center gap-5 sm:gap-8">
            {[
              { path: "/", label: "Home" },
              { path: "/chatbot", label: "Chatbot" },
            ].map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  relative rounded-xl px-2.5 py-2 text-sm font-medium transition-all duration-300 md:px-3
                  ${isActive ? "text-white" : "text-zinc-500 hover:text-white"}
                `}
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 rounded-xl bg-white/[0.075] shadow-[0_0_30px_rgba(255,255,255,0.04)]"
                        transition={{ type: "spring", bounce: 0.22, duration: 0.55 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
