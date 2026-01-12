import React from 'react';
import { motion } from 'framer-motion';

interface BioOrbProps {
  health: number;
  streak: number;
  mode: 'nurture' | 'steady' | 'thrive';
}

export const BioOrb: React.FC<BioOrbProps> = ({ health, streak, mode }) => {
  const themes = {
    nurture: {
      main: 'bg-purple-500',
      ring: 'border-purple-500/30',
      dot: 'bg-purple-400'
    },
    steady: {
      main: 'bg-teal-500',
      ring: 'border-teal-500/30',
      dot: 'bg-teal-400'
    },
    thrive: {
      main: 'bg-amber-500',
      ring: 'border-amber-500/30',
      dot: 'bg-amber-400'
    }
  };

  const theme = themes[mode] || themes.steady;

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-64 h-64 flex items-center justify-center">

        {/* 1. The Fixed Sentinel Ring (Stationary) */}
        <div className="absolute w-full h-full rounded-full border border-white/5 flex items-center justify-center">
          {/* 8 Fixed Dots representing the "Normal Boundary" */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 rounded-full ${theme.dot} shadow-[0_0_8px_rgba(255,255,255,0.3)]`}
              style={{
                transform: `rotate(${deg}deg) translate(7.5rem)`
              }}
            />
          ))}
        </div>

        {/* 2. The Unpredictable Membrane */}
        <motion.div
          animate={{
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.05, 0.95, 1.35, 1],
            borderRadius: [
              "60% 40% 30% 70% / 60% 30% 70% 40%",
              "30% 60% 70% 40% / 50% 60% 30% 60%",
              "70% 30% 80% 20% / 30% 80% 20% 80%",
              "20% 80% 20% 80% / 80% 20% 80% 20%",
              "60% 40% 30% 70% / 60% 30% 70% 40%"
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.3, 0.6, 0.8, 1]
          }}
          className={`absolute w-48 h-48 border-2 ${theme.ring} blur-[1px]`}
        />

        {/* 3. The Solid Core (The Inner Resilience) */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className={`relative w-32 h-32 rounded-full ${theme.main} shadow-[0_0_40px_rgba(45,212,191,0.3)] flex items-center justify-center z-10`}
        >
        </motion.div>

      </div>

      {/* 4. Stats */}
      <div className="mt-4 text-center space-y-4">
        <h2 className="text-3xl font-light text-white tracking-wide opacity-90">
          Your Companion
        </h2>

        <div className="flex items-center gap-4 justify-center">
          <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2 shadow-lg">
            <span className="text-slate-400 text-sm font-medium">Streak</span>
            <span className="text-white font-bold text-xl">{streak}</span>
            <span className="text-xl">🔥</span>
          </div>

          <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2 shadow-lg">
            <span className="text-slate-400 text-sm font-medium">Vitality</span>
            <span className="text-white font-bold text-xl">{health}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
