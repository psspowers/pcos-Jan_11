import { motion } from 'framer-motion';
import { PlantState } from '../lib/logic/plant';
import { ThemeState } from '../lib/logic/mode';

interface BioOrbProps {
  plantState: PlantState;
  themeState: ThemeState;
}

export function BioOrb({ plantState, themeState }: BioOrbProps) {
  const { health, pulseSpeed } = plantState;
  const { primaryColor, glowColor } = themeState;

  return (
    <div className="relative flex flex-col items-center justify-center py-20">
      <div className="relative">
        <motion.div
          className="absolute inset-0 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.8, 0.6]
          }}
          transition={{
            duration: pulseSpeed,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />

        <motion.div
          className="relative w-48 h-48 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${primaryColor}40, ${primaryColor}20)`,
            boxShadow: `0 0 60px ${glowColor}, inset 0 0 40px ${glowColor}`
          }}
          animate={{
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: pulseSpeed,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <div className="absolute inset-4 rounded-full border border-white/10 backdrop-blur-sm" />
          <div className="absolute inset-8 rounded-full border border-white/5" />

          <div className="relative z-10 text-center">
            <motion.div
              className="text-6xl font-bold tracking-tight"
              style={{ color: primaryColor }}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{
                duration: pulseSpeed * 0.8,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              {health}
            </motion.div>
            <div className="text-sm text-slate-400 tracking-widest uppercase mt-1">
              Vitality
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-lg text-white/90 font-medium">
          {themeState.message}
        </p>
        <p className="text-sm text-slate-400 mt-2">
          {plantState.streak} day streak
        </p>
      </motion.div>
    </div>
  );
}
