import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import { cn } from "../lib/utils";

export default function MainLayout() {
  const { pathname } = useLocation();
  const isChatbotPage = pathname === "/chatbot";

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[#0d0e12] text-white">
      <div className="soft-grid pointer-events-none fixed inset-0 opacity-60" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-gradient-to-b from-white/[0.08] to-transparent" />
      <Navbar />
      <main
        className={cn(
          "relative z-10 min-h-0 flex-1 overflow-hidden",
          isChatbotPage
            ? "mx-0 max-w-none overflow-hidden p-0"
            : "mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8"
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}
