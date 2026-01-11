import React from 'react';
import { motion } from 'framer-motion';

interface BioOrbProps {
  health: number;
  streak: number;
  mode: 'nurture' | 'steady' | 'thrive';
}

export const BioOrb: React.FC<BioOrbProps> = ({ health, streak, mode }) => {
  const colors = {
    nurture: {
      core: 'from-purple-400 to-pink-300',
      glow: 'bg-purple-500',
      border: 'border-purple-200/30'
    },
    steady: {
      core: 'from-teal-400 to-emerald-300',
      glow: 'bg-teal-500',
      border: 'border-teal-200/30'
    },
    thrive: {
      core: 'from-amber-400 to-orange-300',
      glow: 'bg-amber-500',
      border: 'border-amber-200/30'
    }
  };

  const currentTheme = colors[mode];

  return (
    <div className="relative flex flex-col items-center justify-center py-8">
      <div className="relative flex items-center justify-center w-64 h-64">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute w-32 h-32 rounded-full blur-[50px] opacity-40 ${currentTheme.glow}`}
        />

        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.05, 1],
            borderRadius: [
              "60% 40% 30% 70% / 60% 30% 70% 40%",
              "30% 60% 70% 40% / 50% 60% 30% 60%",
              "60% 40% 30% 70% / 60% 30% 70% 40%"
            ]
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            borderRadius: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
          className={`absolute w-40 h-40 border-2 ${currentTheme.border} blur-[1px]`}
        />

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute w-48 h-48 border border-white/10 rounded-full border-dashed"
        />

        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`relative flex items-center justify-center w-24 h-24 bg-gradient-to-tr ${currentTheme.core} rounded-full shadow-lg backdrop-blur-sm`}
        >
          <div className="text-center">
            <span className="block text-3xl font-bold text-white drop-shadow-md">
              {health}
            </span>
            <span className="text-[10px] font-medium text-white/90 uppercase tracking-widest">
              Vitality
            </span>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-center"
      >
        <p className="text-lg font-medium text-white/90">
          {mode === 'nurture' ? 'Healing & Rest' : mode === 'thrive' ? 'Radiating Energy' : 'Balanced Growth'}
        </p>
        <p className="text-sm text-slate-400">
          {streak} day streak
        </p>
      </motion.div>
    </div>
  );
};
