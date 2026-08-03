import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import { cn } from "../lib/utils";

export default function MainLayout() {
  const { pathname } = useLocation();
  const isChatbot = pathname === "/chatbot";

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[#0d0e12] text-white">
      {/* Background layers */}
      <div className="grid-bg pointer-events-none fixed inset-0 opacity-40" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-gradient-to-b from-white/[0.05] to-transparent" />
      <div className="pointer-events-none fixed -top-48 left-1/3 h-80 w-80 -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(103,232,249,0.06) 0%, transparent 70%)" }} />

      <Navbar />

      <main className={cn(
        "relative z-10 min-h-0 flex-1",
        isChatbot
          ? "mx-0 max-w-none overflow-hidden p-0"
          : "mx-auto w-full max-w-7xl overflow-y-auto px-4 py-4 sm:px-6 lg:px-8"
      )}>
        {isChatbot ? <Outlet /> : (
          <div className="min-h-0 h-full">
            <Outlet />
          </div>
        )}
      </main>
    </div>
  );
}