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
      light: 'bg-purple-400',
      ring: 'border-purple-500/30',
      dot: 'bg-purple-400'
    },
    steady: {
      main: 'bg-teal-500',
      light: 'bg-teal-400',
      ring: 'border-teal-500/30',
      dot: 'bg-teal-400'
    },
    thrive: {
      main: 'bg-amber-500',
      light: 'bg-amber-400',
      ring: 'border-amber-500/30',
      dot: 'bg-amber-400'
    }
  };

  const theme = themes[mode] || themes.steady;

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-64 h-64 flex items-center justify-center">

        {/* 1. The Orbiting Dots Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-full h-full rounded-full border border-white/5 flex items-center justify-center"
        >
          {/* 6 Orbiting Nodes positioned radially */}
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 rounded-full ${theme.dot} shadow-[0_0_10px_rgba(255,255,255,0.5)]`}
              style={{
                transform: `rotate(${deg}deg) translate(7.5rem)`
              }}
            />
          ))}
        </motion.div>

        {/* 2. The Morphing Organic Membrane */}
        <motion.div
          animate={{
            rotate: -180,
            borderRadius: [
              "60% 40% 30% 70% / 60% 30% 70% 40%",
              "30% 60% 70% 40% / 50% 60% 30% 60%",
              "60% 40% 30% 70% / 60% 30% 70% 40%"
            ]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className={`absolute w-48 h-48 border-2 ${theme.ring} blur-[1px]`}
        />

        {/* 3. The Solid Core Nucleus */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className={`relative w-32 h-32 rounded-full ${theme.main} shadow-[0_0_40px_rgba(45,212,191,0.3)] flex items-center justify-center`}
        >
           {/* Pure visual core, looks like a biological nucleus */}
        </motion.div>

      </div>

      {/* 4. Text & Stats Below */}
      <div className="mt-4 text-center space-y-4">
        <h2 className="text-3xl font-light text-white tracking-wide opacity-90">
          Your Companion
        </h2>

        <div className="flex items-center gap-4 justify-center">
          {/* Streak Badge */}
          <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2 shadow-lg">
            <span className="text-slate-400 text-sm font-medium">Streak</span>
            <span className="text-white font-bold text-xl">{streak}</span>
            <span className="text-xl">🔥</span>
          </div>

          {/* Vitality Badge */}
          <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2 shadow-lg">
            <span className="text-slate-400 text-sm font-medium">Vitality</span>
            <span className="text-white font-bold text-xl">{health}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
