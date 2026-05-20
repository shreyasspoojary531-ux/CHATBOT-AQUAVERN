import { motion } from "framer-motion";

export default function TypingDots() {
  return (
    <div className="flex h-6 items-center gap-1.5" aria-label="Typing">
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          className="h-1.5 w-1.5 rounded-full bg-white/65"
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
          transition={{
            duration: 0.85,
            repeat: Infinity,
            delay: dot * 0.12,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
