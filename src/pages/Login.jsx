import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  MessageSquareText,
  Lock,
  Mail,
  Check,
  UserPlus,
  LogIn,
  Eye,
  EyeOff,
  Anchor,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../store/authStore";
import { supabase } from "../utils/supabase";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    if (accessToken) navigate("/home", { replace: true });
  }, [accessToken, navigate]);

  useEffect(() => {
    const saved = localStorage.getItem("remembered_email");
    if (saved) { setEmail(saved); setRememberMe(true); }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        if (data.session) { setSession(data.session); navigate("/home", { replace: true }); }
        else if (data.user) { setSuccessMessage("Account created! Check your email to confirm."); setIsSignUp(false); }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        if (data.session) {
          setSession(data.session);
          if (rememberMe) localStorage.setItem("remembered_email", email);
          else localStorage.removeItem("remembered_email");
          navigate("/home", { replace: true });
        }
      }
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally { setLoading(false); }
  };

  const toggleMode = () => { setIsSignUp((p) => !p); setError(null); setSuccessMessage(null); };

  return (
    <div className="fixed inset-0 flex bg-[#0d0e12]">

      {/* ── LEFT: Brand Showcase ── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-b from-[#0a0a0f] via-[#0d0e12] to-[#08090c]">
        {/* Grid background */}
        <div className="absolute inset-0 grid-bg opacity-60" />

        {/* Large ambient glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="w-[500px] h-[500px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(103,232,249,0.07) 0%, transparent 65%)"
            }}
          />
        </div>

        {/* Decorative grid lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,1) 0px, transparent 1px, transparent 2px)`,
            backgroundSize: '80px 100%'
          }}
        />

        {/* Brand content */}
        <div className="relative z-10 flex flex-col justify-center px-16 py-20 h-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Logo mark */}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] mb-8 shadow-lg">
              <MessageSquareText className="h-8 w-8 text-white" />
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-white leading-[1.1]">
              Aquavern
              <span className="block text-2xl text-white/40 font-normal mt-2">
                Internal Intelligence System
              </span>
            </h1>

            <div className="mt-12 space-y-4">
              {[
                { icon: Anchor, text: "Ship-to-ship coordination" },
                { icon: MessageSquareText, text: "Encrypted communications" },
                { icon: Lock, text: "Secure authentication" },
              ].map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06]">
                    <item.icon className="h-4 w-4 text-white/40" />
                  </div>
                  <span className="text-sm text-white/45">{item.text}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto pt-20 border-t border-white/[0.04]">
              <p className="text-xs text-white/20">
                Aquavern Technologies &mdash; Maritime Intelligence Network
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── RIGHT: Auth Form ── */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />

        {/* Small glow for visual warmth */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(103,232,249,0.04) 0%, transparent 70%)"
          }}
        />

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-sm px-6 sm:px-0"
        >
          {/* Mobile brand */}
          <div className="lg:hidden flex flex-col items-center mb-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] mb-4">
              <MessageSquareText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              AQUAVERN
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mt-1">
              Internal Intelligence System
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Feedback */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-red-500/15 bg-red-500/8 px-4 py-3"
              >
                <p className="text-xs text-red-400/90">{error}</p>
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-emerald-500/15 bg-emerald-500/8 px-4 py-3"
              >
                <p className="text-xs text-emerald-400/90">{successMessage}</p>
              </motion.div>
            )}

            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/45">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); error && setError(null); }}
                    disabled={loading}
                    className="w-full h-11 rounded-xl border border-white/[0.08] bg-white/[0.03] pl-10 pr-4 text-sm text-white placeholder:text-white/25 outline-none transition-all duration-300 focus:border-white/20 focus:bg-white/[0.05] focus:shadow-[0_0_0_1px_rgba(255,255,255,0.1)] disabled:opacity-40"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/45">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    placeholder={isSignUp ? "Create a password" : "Enter password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); error && setError(null); }}
                    disabled={loading}
                    className="w-full h-11 rounded-xl border border-white/[0.08] bg-white/[0.03] pl-10 pr-10 text-sm text-white placeholder:text-white/25 outline-none transition-all duration-300 focus:border-white/20 focus:bg-white/[0.05] focus:shadow-[0_0_0_1px_rgba(255,255,255,0.1)] disabled:opacity-40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide" : "Show"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember me */}
            {!isSignUp && (
              <label className="flex items-center gap-2.5 select-none group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} disabled={loading} className="sr-only" />
                  <div className={`flex h-[17px] w-[17px] items-center justify-center rounded-md border transition-all duration-300 ${rememberMe ? "border-white/30 bg-white text-black" : "border-white/[0.10] bg-white/[0.03] group-hover:border-white/20"} ${loading ? "opacity-40" : ""}`}>
                    {rememberMe && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                  </div>
                </div>
                <span className={`text-xs text-white/40 transition-colors group-hover:text-white/60 ${loading ? "opacity-40" : ""}`}>Remember me</span>
              </label>
            )}

            <Button type="submit" disabled={loading} loading={loading} className="w-full text-sm font-medium h-11">
              {loading ? (isSignUp ? "Creating Account" : "Signing In") : (isSignUp ? "Create Account" : "Sign In")}
            </Button>

            <div className="text-center pt-1">
              <button type="button" onClick={toggleMode} className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors">
                {isSignUp ? (
                  <><LogIn className="h-3.5 w-3.5" /> Already have an account? Sign in</>
                ) : (
                  <><UserPlus className="h-3.5 w-3.5" /> Don't have an account? Sign up</>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}