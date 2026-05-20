import { motion } from "framer-motion";

export default function TypingDots({ className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          className="h-2 w-2 rounded-full bg-white/45"
          animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: dot * 0.15 }}
        />
      ))}
    </div>
  );
}
