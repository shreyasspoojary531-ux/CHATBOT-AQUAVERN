import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquareText, Lock, User, Check } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  // Redirect to home if already logged in
  useEffect(() => {
    if (accessToken) {
      navigate("/home", { replace: true });
    }
  }, [accessToken, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://aquavern.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include", // Ensure refreshToken cookie exchange works
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Invalid username or password.");
      }

      const data = await response.json();
      if (!data.accessToken) {
        throw new Error("No access token returned from system.");
      }

      // Store ONLY in memory (Zustand)
      setAccessToken(data.accessToken);

      // Handle remembered username
      if (rememberMe) {
        localStorage.setItem("remembered_username", username);
      } else {
        localStorage.removeItem("remembered_username");
      }

      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to connect. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Populate remembered username if available
  useEffect(() => {
    const savedUsername = localStorage.getItem("remembered_username");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col items-center justify-center overflow-hidden bg-[#0d0e12] text-white">
      {/* Background grids & gradients */}
      <div className="soft-grid pointer-events-none fixed inset-0 opacity-60" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-96 bg-gradient-to-b from-white/[0.09] to-transparent" />

      {/* Decorative Glow Orb */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          className="h-80 w-80 rounded-full bg-cyan-200/[0.045] blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel relative z-10 w-full max-w-md rounded-xl p-8 sm:p-10"
      >
        {/* Top edge glow line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/30 to-transparent" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            whileHover={{ rotate: -8, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 320, damping: 20 }}
            className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] shadow-[0_0_48px_rgba(255,255,255,0.08)]"
          >
            <MessageSquareText className="h-7 w-7 text-white" />
          </motion.div>
          <div className="mt-4">
            <h2 className="text-xl font-bold tracking-wider text-white uppercase">AQUAVERN</h2>
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/35">INTERNAL INTELLIGENCE SYSTEM</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-400"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">
                Username
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 h-4.5 w-4.5 text-white/35" />
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError(null);
                  }}
                  disabled={loading}
                  className="w-full rounded-lg border border-white/12 bg-white/[0.035] py-3 pl-11 pr-4 text-sm text-white placeholder-white/70 outline-none transition-all duration-300 focus:border-white/28 focus:bg-white/[0.06] focus:ring-1 focus:ring-white/15 disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4.5 w-4.5 text-white/35" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  disabled={loading}
                  className="w-full rounded-lg border border-white/12 bg-white/[0.035] py-3 pl-11 pr-4 text-sm text-white placeholder-white/70 outline-none transition-all duration-300 focus:border-white/28 focus:bg-white/[0.06] focus:ring-1 focus:ring-white/15 disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between">
            <label className="group flex cursor-pointer items-center gap-2.5">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                  className="sr-only"
                />
                <div className={`flex h-[18px] w-[18px] items-center justify-center rounded border transition-all duration-300 ${
                  rememberMe 
                    ? "border-cyan-200/30 bg-white text-black" 
                    : "border-white/12 bg-white/[0.03] group-hover:border-white/25"
                } ${loading ? "opacity-40 cursor-not-allowed" : ""}`}>
                  {rememberMe && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
              </div>
              <span className={`select-none text-xs font-medium text-white/60 transition-colors group-hover:text-white/80 ${
                loading ? "opacity-40" : ""
              }`}>
                Remember me
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full text-sm font-semibold active:scale-[0.985] shadow-[0_12px_40px_rgba(255,255,255,0.06)]"
          >
            {loading ? "Accessing Workspace..." : "Access Workspace"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
