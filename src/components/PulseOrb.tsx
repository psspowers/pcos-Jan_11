import React from 'react';

interface PulseOrbProps {
  streak: number;
}

export const PulseOrb: React.FC<PulseOrbProps> = ({ streak }) => {
  const intensity = Math.min(streak / 30, 1);
  const glowColor = intensity > 0.7 ? '#22d3ee' : intensity > 0.3 ? '#fb7185' : '#71717a';

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className="absolute inset-0 rounded-full animate-orb-pulse"
        style={{
          background: `radial-gradient(circle, ${glowColor}40 0%, transparent 70%)`,
        }}
      />
      <div
        className="relative w-32 h-32 rounded-full"
        style={{
          background: `linear-gradient(135deg, ${glowColor}60, ${glowColor}20)`,
          boxShadow: `0 0 60px ${glowColor}60, inset 0 0 20px ${glowColor}40`,
        }}
      >
        <div className="absolute inset-4 rounded-full bg-black/20 backdrop-blur-sm" />
        <div className="absolute inset-8 rounded-full" style={{
          background: `radial-gradient(circle at 30% 30%, ${glowColor}80, transparent)`,
        }} />
      </div>
      <div className="absolute text-center">
        <div className="text-4xl font-light tracking-tighter text-white">{streak}</div>
        <div className="text-xs text-white/50 uppercase tracking-wider mt-1">days</div>
      </div>
    </div>
  );
};
