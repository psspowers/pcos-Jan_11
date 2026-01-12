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
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute w-full h-full rounded-full blur-3xl ${theme.core} opacity-20`}
        />

        <motion.div
          animate={{
            rotate: 360,
            borderRadius: [
              "60% 40% 30% 70% / 60% 30% 70% 40%",
              "30% 60% 70% 40% / 50% 60% 30% 60%",
              "60% 40% 30% 70% / 60% 30% 70% 40%"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className={`absolute w-48 h-48 border-2 border-white/20 backdrop-blur-sm`}
          style={{ boxShadow: "inset 0 0 20px rgba(255,255,255,0.1)" }}
        />

        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`relative w-32 h-32 rounded-full bg-gradient-to-tr ${theme.gradient} flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.3)]`}
        >
          <div className="text-center text-white">
            <span className="block text-4xl font-bold tracking-tighter">{health}</span>
            <span className="text-[10px] uppercase tracking-widest opacity-80">Vitality</span>
          </div>
        </motion.div>
      </div>

      <p className="mt-4 text-slate-400 text-sm font-medium tracking-wide">
        {streak} day streak
      </p>
    </div>
  );
};
