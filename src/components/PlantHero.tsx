import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PlantHeroProps {
  health: number;
  streak: number;
  name: string;
}

export const PlantHero: React.FC<PlantHeroProps> = ({ health, streak, name }) => {
  const [glowIntensity, setGlowIntensity] = useState(0.6);

  useEffect(() => {
    setGlowIntensity(Math.max(0.3, health / 150));
  }, [health]);

  const baseColor = health >= 80 ? '#10b981' : health >= 50 ? '#f59e0b' : '#ef4444';
  const accentColor = health >= 80 ? '#34d399' : health >= 50 ? '#fbbf24' : '#f87171';

  return (
    <div className="relative w-full h-80 flex flex-col items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/50">
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            `radial-gradient(circle at 50% 50%, ${baseColor}22, transparent 70%)`,
            `radial-gradient(circle at 50% 50%, ${accentColor}22, transparent 70%)`,
            `radial-gradient(circle at 50% 50%, ${baseColor}22, transparent 70%)`
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <motion.div
          className="relative w-48 h-48"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="petalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={baseColor} stopOpacity="0.8" />
                <stop offset="100%" stopColor={accentColor} stopOpacity="0.9" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation={4 * glowIntensity} result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {[0, 60, 120, 180, 240, 300].map((rotation, index) => (
              <motion.g
                key={rotation}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: streak >= (index + 1) * 3 ? 1 : 0.2,
                  scale: streak >= (index + 1) * 3 ? 1 : 0.5,
                  rotate: [rotation, rotation + 5, rotation]
                }}
                transition={{
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.5 },
                  rotate: {
                    duration: 3 + index * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                style={{ transformOrigin: '100px 100px' }}
              >
                <path
                  d="M 100 100 Q 120 80 140 70 Q 150 65 155 75 Q 150 85 140 90 Q 120 100 100 100 Z"
                  fill="url(#petalGradient)"
                  filter="url(#glow)"
                  opacity="0.9"
                />
              </motion.g>
            ))}

            <motion.circle
              cx="100"
              cy="100"
              r="20"
              fill={baseColor}
              filter="url(#glow)"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            <motion.circle
              cx="100"
              cy="100"
              r="10"
              fill={accentColor}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </svg>

          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${baseColor}40, transparent 70%)`,
              filter: 'blur(30px)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        <div className="text-center space-y-2">
          <motion.h2
            className="text-2xl font-light text-white/90 tracking-wide"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {name}
          </motion.h2>

          <motion.div
            className="flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              <span className="text-sm text-white/60 font-light">Streak</span>
              <span className="text-lg font-semibold text-white/90">{streak}</span>
              <span className="text-sm">🔥</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              <span className="text-sm text-white/60 font-light">Health</span>
              <span className="text-lg font-semibold text-white/90">{health}%</span>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="text-xs text-white/40 font-light tracking-widest uppercase">
          {streak === 0 ? 'Begin Your Journey' : 'Keep Growing'}
        </div>
      </motion.div>
    </div>
  );
};
