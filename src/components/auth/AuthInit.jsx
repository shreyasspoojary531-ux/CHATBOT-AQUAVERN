import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { useAuthStore } from "../../store/authStore";

export default function AuthInit({ children }) {
  const [checking, setChecking] = useState(true);
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    let cancelled = false;

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (cancelled) return;
        setSession(session);
        setChecking(false);
      })
      .catch(() => {
        if (cancelled) return;
        setChecking(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (cancelled) return;
        setSession(session);
        setChecking(false);
      }
    );

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [setSession]);

  if (checking) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0d0e12]">
        <div className="grid-bg pointer-events-none fixed inset-0 opacity-30" />
        <div className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-gradient-to-b from-white/[0.06] to-transparent" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-white/[0.06] border-t-white/50"
            role="status"
            aria-label="Loading"
          />
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/30 animate-pulse">
            Establishing secure session&hellip;
          </p>
        </div>
      </div>
    );
  }

  return children;
}