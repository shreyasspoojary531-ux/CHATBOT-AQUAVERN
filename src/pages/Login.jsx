import { useCallback, useState, useEffect } from "react";
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

/* ─── Validation helpers ─── */
const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PW = 6;
const MAX_PW = 128;
const MAX_EMAIL = 254;

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

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

  const validate = useCallback(() => {
    const errors = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!VALID_EMAIL.test(email.trim())) {
      errors.email = "Enter a valid email address";
    } else if (email.length > MAX_EMAIL) {
      errors.email = `Email must be under ${MAX_EMAIL} characters`;
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (isSignUp && password.length < MIN_PW) {
      errors.password = `Password must be at least ${MIN_PW} characters`;
    } else if (password.length > MAX_PW) {
      errors.password = `Password must be under ${MAX_PW} characters`;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [email, password, isSignUp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({ email: email.trim(), password });
        if (signUpError) throw signUpError;
        if (data.session) { setSession(data.session); navigate("/home", { replace: true }); }
        else if (data.user) { setSuccessMessage("Account created! Check your email to confirm."); setIsSignUp(false); }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (signInError) throw signInError;
        if (data.session) {
          setSession(data.session);
          if (rememberMe) localStorage.setItem("remembered_email", email);
          else localStorage.removeItem("remembered_email");
          navigate("/home", { replace: true });
        }
      }
    } catch (err) {
      const msg = err.message || "Authentication failed.";
      // Clean up common Supabase errors for readability
      if (msg.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please try again.");
      } else if (msg.includes("Email not confirmed")) {
        setError("Please confirm your email address before signing in.");
      } else if (msg.includes("User already registered")) {
        setError("An account with this email already exists.");
      } else if (msg.includes("rate_limit")) {
        setError("Too many attempts. Please wait a moment.");
      } else {
        setError(msg);
      }
    } finally { setLoading(false); }
  };

  // Password strength indicator for sign-up
  const pwStrength = isSignUp && password.length > 0
    ? password.length < MIN_PW ? 0
      : password.length < 10 ? 1
      : password.match(/[A-Z]/) && password.match(/[0-9]/) && password.match(/[^A-Za-z0-9]/) ? 3
      : password.match(/[A-Z]/) && password.match(/[0-9]/) ? 2
      : 1
    : 0;

  const strengthLabel = ["", "Weak", "Fair", "Strong"][pwStrength];
  const strengthColor = ["", "bg-red-500/60", "bg-amber-500/60", "bg-emerald-500/60"][pwStrength];

  return (
    <div className="fixed inset-0 flex bg-[#0d0e12]">
      {/* ── LEFT: Brand ── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-b from-[#0a0a0f] via-[#0d0e12] to-[#08090c]">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(103,232,249,0.07) 0%, transparent 65%)" }} />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,1) 0px, transparent 1px, transparent 2px)", backgroundSize: "80px 100%" }} />

        <div className="relative z-10 flex flex-col justify-center px-16 py-20 h-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] mb-8 shadow-lg">
              <MessageSquareText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white leading-[1.1]">
              Aquavern
              <span className="block text-2xl text-white/40 font-normal mt-2">Internal Intelligence System</span>
            </h1>
            <div className="mt-12 space-y-4">
              {[
                { icon: Anchor, text: "Ship-to-ship coordination" },
                { icon: MessageSquareText, text: "Encrypted communications" },
                { icon: Lock, text: "Secure authentication" },
              ].map((item, i) => (
                <motion.div key={item.text} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06]"><item.icon className="h-4 w-4 text-white/40" /></div>
                  <span className="text-sm text-white/45">{item.text}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-auto pt-20 border-t border-white/[0.04]">
              <p className="text-xs text-white/20">Aquavern Technologies &mdash; Maritime Intelligence Network</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── RIGHT: Form ── */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full" style={{ background: "radial-gradient(circle, rgba(103,232,249,0.04) 0%, transparent 70%)" }} />

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 w-full max-w-sm px-6 sm:px-0">
          {/* Mobile brand */}
          <div className="lg:hidden flex flex-col items-center mb-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] mb-4"><MessageSquareText className="h-6 w-6 text-white" /></div>
            <h1 className="text-xl font-bold tracking-tight text-white">AQUAVERN</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mt-1">Internal Intelligence System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Feedback */}
            {error && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} role="alert" className="rounded-xl border border-red-500/15 bg-red-500/8 px-4 py-3">
                <p className="text-xs text-red-400/90">{error}</p>
              </motion.div>
            )}
            {successMessage && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} role="alert" className="rounded-xl border border-emerald-500/15 bg-emerald-500/8 px-4 py-3">
                <p className="text-xs text-emerald-400/90">{successMessage}</p>
              </motion.div>
            )}

            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/45">Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                  <input
                    id="email" type="email" autoComplete="email"
                    placeholder="name@company.com" value={email} maxLength={MAX_EMAIL}
                    onChange={(e) => { setEmail(e.target.value); setError(null); setFieldErrors((p) => ({ ...p, email: null })); }}
                    disabled={loading}
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? "email-error" : undefined}
                    className="w-full h-11 rounded-xl border border-white/[0.08] bg-white/[0.03] pl-10 pr-4 text-sm text-white placeholder:text-white/25 outline-none transition-all duration-300 focus:border-white/20 focus:bg-white/[0.05] focus:shadow-[0_0_0_1px_rgba(255,255,255,0.1)] disabled:opacity-40 aria-[invalid=true]:border-red-500/30"
                  />
                </div>
                {fieldErrors.email && <p id="email-error" className="text-[11px] text-red-400/70 mt-1">{fieldErrors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/45">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                  <input
                    id="password" type={showPassword ? "text" : "password"}
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    placeholder={isSignUp ? "Create a password (min 6 chars)" : "Enter password"}
                    value={password} maxLength={MAX_PW}
                    onChange={(e) => { setPassword(e.target.value); setError(null); setFieldErrors((p) => ({ ...p, password: null })); }}
                    disabled={loading}
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? "pw-error" : isSignUp ? "pw-strength" : undefined}
                    className="w-full h-11 rounded-xl border border-white/[0.08] bg-white/[0.03] pl-10 pr-10 text-sm text-white placeholder:text-white/25 outline-none transition-all duration-300 focus:border-white/20 focus:bg-white/[0.05] focus:shadow-[0_0_0_1px_rgba(255,255,255,0.1)] disabled:opacity-40 aria-[invalid=true]:border-red-500/30"
                  />
                  <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors" tabIndex={-1} aria-label={showPassword ? "Hide" : "Show"}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.password && <p id="pw-error" className="text-[11px] text-red-400/70 mt-1">{fieldErrors.password}</p>}

                {/* Password strength (sign-up only) */}
                {isSignUp && password.length > 0 && !fieldErrors.password && (
                  <div className="mt-2 space-y-1.5" id="pw-strength">
                    <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${strengthColor}`} style={{ width: `${(pwStrength / 3) * 100}%` }} />
                    </div>
                    <p className="text-[10px] text-white/25">{strengthLabel}</p>
                  </div>
                )}
                {isSignUp && (
                  <ul className="mt-1.5 space-y-1">
                    {[
                      { label: "At least 6 characters", met: password.length >= MIN_PW },
                      { label: "Contains a number", met: /\d/.test(password) },
                      { label: "Contains a symbol", met: /[^A-Za-z0-9]/.test(password) },
                    ].map((req) => (
                      <li key={req.label} className={`flex items-center gap-1.5 text-[10px] ${req.met ? "text-emerald-400/60" : "text-white/20"}`}>
                        <span className={`h-1 w-1 rounded-full ${req.met ? "bg-emerald-400/60" : "bg-white/20"}`} />
                        {req.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Remember me */}
            {!isSignUp && (
              <label className="flex items-center gap-2.5 select-none group">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} disabled={loading} className="sr-only" />
                <div className={`flex h-[17px] w-[17px] items-center justify-center rounded-md border transition-all duration-300 ${rememberMe ? "border-white/30 bg-white text-black" : "border-white/[0.10] bg-white/[0.03] group-hover:border-white/20"} ${loading ? "opacity-40" : ""}`}>
                  {rememberMe && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                </div>
                <span className={`text-xs text-white/40 transition-colors group-hover:text-white/60 ${loading ? "opacity-40" : ""}`}>Remember me</span>
              </label>
            )}

            <Button type="submit" disabled={loading} loading={loading} className="w-full text-sm font-medium h-11">
              {loading ? (isSignUp ? "Creating Account" : "Signing In") : (isSignUp ? "Create Account" : "Sign In")}
            </Button>

            <div className="text-center pt-1">
              <button type="button" onClick={() => { setIsSignUp((p) => !p); setError(null); setSuccessMessage(null); setFieldErrors({}); }} className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors">
                {isSignUp ? <><LogIn className="h-3.5 w-3.5" /> Already have an account? Sign in</> : <><UserPlus className="h-3.5 w-3.5" /> Don't have an account? Sign up</>}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}