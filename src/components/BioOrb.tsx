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
          animate={{ scale: [1, 1.3, 1.1, 1], opacity: [0.3, 0.5, 0.2, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute w-full h-full rounded-full blur-3xl ${theme.core} opacity-30`}
        />

        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 0.9, 1.1, 1],
            borderRadius: [
              "60% 40% 30% 70% / 60% 30% 70% 40%",
              "30% 60% 70% 40% / 50% 60% 30% 60%",
              "68% 32% 49% 51% / 48% 68% 32% 52%",
              "41% 59% 38% 62% / 65% 35% 65% 35%",
              "60% 40% 30% 70% / 60% 30% 70% 40%"
            ]
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 7.3, repeat: Infinity, ease: "easeInOut" },
            borderRadius: { duration: 11, repeat: Infinity, ease: "easeInOut" }
          }}
          className={`absolute w-52 h-52 border-2 border-white/20 backdrop-blur-sm`}
          style={{ boxShadow: "inset 0 0 30px rgba(255,255,255,0.15), 0 0 40px rgba(255,255,255,0.1)" }}
        />

        <motion.div
          animate={{
            scale: [1, 1.05, 0.95, 1.08, 1],
            borderRadius: [
              "63% 37% 54% 46% / 55% 48% 52% 45%",
              "38% 62% 43% 57% / 48% 62% 38% 52%",
              "70% 30% 46% 54% / 30% 54% 70% 46%",
              "49% 51% 60% 40% / 63% 37% 63% 37%",
              "63% 37% 54% 46% / 55% 48% 52% 45%"
            ],
            x: [0, 3, -2, 4, 0],
            y: [0, -3, 2, -1, 0]
          }}
          transition={{
            scale: { duration: 5.7, repeat: Infinity, ease: "easeInOut" },
            borderRadius: { duration: 8.2, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 5.3, repeat: Infinity, ease: "easeInOut" }
          }}
          className={`relative w-32 h-32 bg-gradient-to-tr ${theme.gradient} flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.3)]`}
        >
          <div className="text-center text-white">
            <span className="block text-4xl font-bold tracking-tighter">{health}</span>
            <span className="text-[10px] uppercase tracking-widest opacity-80">Vitality</span>
          </div>
        </motion.div>

        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.18, 0.88, 1.05, 1],
            borderRadius: [
              "55% 45% 65% 35% / 60% 40% 60% 40%",
              "35% 65% 40% 60% / 45% 55% 35% 65%",
              "65% 35% 55% 45% / 35% 65% 45% 55%",
              "45% 55% 60% 40% / 55% 45% 55% 45%",
              "55% 45% 65% 35% / 60% 40% 60% 40%"
            ]
          }}
          transition={{
            rotate: { duration: 17, repeat: Infinity, ease: "linear" },
            scale: { duration: 6.7, repeat: Infinity, ease: "easeInOut" },
            borderRadius: { duration: 9.5, repeat: Infinity, ease: "easeInOut" }
          }}
          className={`absolute w-40 h-40 border border-white/10`}
          style={{ filter: "blur(1px)" }}
        />
      </div>

      <p className="mt-4 text-slate-400 text-sm font-medium tracking-wide">
        {streak} day streak
      </p>
    </div>
  );
};
