import { motion } from "motion/react";

export default function TypingDots() {
  return (
    <div className="flex h-6 items-center gap-1" aria-label="Typing indicator">
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          className="h-1.5 w-1.5 rounded-full bg-white/50"
          animate={{
            opacity: [0.2, 0.9, 0.2],
            scale: [0.85, 1.15, 0.85],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: dot * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}