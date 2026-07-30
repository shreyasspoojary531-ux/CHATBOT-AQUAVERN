import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { useAuthStore } from "../../store/authStore";

export default function AuthInit({ children }) {
  const [checking, setChecking] = useState(true);
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setChecking(false);
    }).catch((err) => {
      console.error("Error getting session:", err);
      setChecking(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setChecking(false);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

  if (checking) {
    return (
      <div className="relative flex h-full min-h-screen w-full items-center justify-center bg-[#0d0e12] text-white">
        <div className="soft-grid pointer-events-none fixed inset-0 opacity-60" />
        <div className="pointer-events-none fixed inset-x-0 top-0 h-96 bg-gradient-to-b from-white/[0.09] to-transparent" />
        <div className="z-10 flex flex-col items-center gap-4">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-white/10 border-t-white/60" />
          <p className="text-[10px] uppercase tracking-[0.24em] text-white/35 animate-pulse">Securing workspace session...</p>
        </div>
      </div>
    );
  }

  return children;
}
