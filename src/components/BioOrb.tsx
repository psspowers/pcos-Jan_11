import React from 'react';
import { motion } from 'framer-motion';

interface BioOrbProps {
  health: number;
  streak: number;
  mode: 'nurture' | 'steady' | 'thrive';
}

export const BioOrb: React.FC<BioOrbProps> = ({ health, streak, mode }) => {
  const colors = {
    nurture: { core: 'bg-purple-500', glow: 'shadow-purple-500/50', gradient: 'from-purple-400 to-pink-400', ring: 'border-purple-400/30' },
    steady: { core: 'bg-teal-500', glow: 'shadow-teal-500/50', gradient: 'from-teal-400 to-cyan-300', ring: 'border-teal-400/30' },
    thrive: { core: 'bg-amber-500', glow: 'shadow-amber-500/50', gradient: 'from-amber-400 to-orange-400', ring: 'border-amber-400/30' }
  };
  const theme = colors[mode];

  const satellites = [0, 60, 120, 180, 240, 300];

  return (
    <div className="relative flex flex-col items-center justify-center py-10">
      <div className="relative w-80 h-80 flex items-center justify-center">

        <motion.div
          animate={{ scale: [1, 1.2, 1.1, 1], opacity: [0.2, 0.4, 0.2, 0.2] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute w-full h-full rounded-full blur-3xl ${theme.core} opacity-20`}
        />

        <motion.div
          className={`absolute w-60 h-60 rounded-full border-2 ${theme.ring} border-dashed`}
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className={`absolute w-44 h-44 rounded-full border ${theme.ring} border-dashed`}
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />

        {satellites.map((angle, i) => (
          <motion.div
            key={i}
            className={`absolute w-4 h-4 rounded-full bg-gradient-to-br ${theme.gradient} shadow-lg`}
            style={{
              left: '50%',
              top: '50%',
              marginLeft: '-8px',
              marginTop: '-8px',
            }}
            animate={{
              x: [
                Math.cos((angle * Math.PI) / 180) * 120,
                Math.cos(((angle + 360) * Math.PI) / 180) * 120,
              ],
              y: [
                Math.sin((angle * Math.PI) / 180) * 120,
                Math.sin(((angle + 360) * Math.PI) / 180) * 120,
              ],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5,
            }}
          />
        ))}

        <motion.div
          animate={{
            scale: [1, 1.05, 0.98, 1.02, 1],
          }}
          transition={{
            scale: { duration: 12, repeat: Infinity, ease: "easeInOut" },
          }}
          className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${theme.gradient} shadow-2xl`}
          style={{
            boxShadow: `0 0 60px 20px ${mode === 'steady' ? 'rgba(45, 212, 191, 0.3)' : mode === 'nurture' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(251, 191, 36, 0.3)'}`
          }}
        />
      </div>

      <h2 className="mt-8 text-2xl font-light text-slate-200 tracking-wider">
        Your Companion
      </h2>

      <div className="flex gap-4 mt-6">
        <div className="px-6 py-3 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50">
          <span className="text-slate-300 font-medium">Streak <span className="text-white font-bold">{streak}</span> 🔥</span>
        </div>
        <div className="px-6 py-3 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50">
          <span className="text-slate-300 font-medium">Vitality <span className="text-white font-bold">{health}%</span></span>
        </div>
      </div>
    </div>
  );
};
