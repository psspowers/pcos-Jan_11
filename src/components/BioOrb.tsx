import React from 'react';
import { motion } from 'framer-motion';

interface BioOrbProps {
  health: number;
  streak: number;
  mode: 'nurture' | 'steady' | 'thrive';
}

export const BioOrb: React.FC<BioOrbProps> = ({ health, streak, mode }) => {
  const colors = {
    nurture: { core: 'bg-purple-500', glow: 'shadow-purple-500/50', gradient: 'from-purple-400 to-pink-400' },
    steady: { core: 'bg-teal-500', glow: 'shadow-teal-500/50', gradient: 'from-teal-400 to-emerald-400' },
    thrive: { core: 'bg-amber-500', glow: 'shadow-amber-500/50', gradient: 'from-amber-400 to-orange-400' }
  };
  const theme = colors[mode];

  return (
    <div className="relative flex flex-col items-center justify-center py-10">
      <div className="relative w-64 h-64 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute w-full h-full rounded-full blur-3xl ${theme.core} opacity-30`}
        />

        <motion.div
          animate={{
            rotate: [0, 180, 360],
            scale: [1, 1.1, 0.95, 1.05, 1],
            borderRadius: [
              "45% 55% 60% 40% / 55% 45% 55% 45%",
              "70% 30% 30% 70% / 40% 60% 40% 60%",
              "35% 65% 55% 45% / 65% 35% 65% 35%",
              "55% 45% 35% 65% / 50% 50% 50% 50%",
              "45% 55% 60% 40% / 55% 45% 55% 45%"
            ]
          }}
          transition={{
            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
            scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            borderRadius: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
          className={`absolute w-52 h-52 border-2 border-white/20 backdrop-blur-sm`}
          style={{ boxShadow: "inset 0 0 30px rgba(255,255,255,0.15), 0 0 40px rgba(255,255,255,0.1)" }}
        />

        <motion.div
          animate={{
            scale: [1, 1.08, 0.96, 1.04, 1],
            borderRadius: [
              "55% 45% 45% 55% / 50% 60% 40% 50%",
              "40% 60% 55% 45% / 60% 40% 60% 40%",
              "60% 40% 50% 50% / 45% 55% 45% 55%",
              "45% 55% 40% 60% / 55% 45% 55% 45%",
              "55% 45% 45% 55% / 50% 60% 40% 50%"
            ]
          }}
          transition={{
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.6, 0.8, 1] },
            borderRadius: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className={`relative w-32 h-32 bg-gradient-to-tr ${theme.gradient} flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.3)]`}
        >
          <motion.div
            animate={{ scale: [1, 0.98, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-center text-white"
          >
            <span className="block text-4xl font-bold tracking-tighter">{health}</span>
            <span className="text-[10px] uppercase tracking-widest opacity-80">Vitality</span>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className={`absolute w-40 h-40 border border-white/10`}
          style={{
            borderRadius: "40% 60% 70% 30% / 60% 40% 60% 40%",
            filter: "blur(1px)"
          }}
        />
      </div>

      <p className="mt-4 text-slate-400 text-sm font-medium tracking-wide">
        {streak} day streak
      </p>
    </div>
  );
};
