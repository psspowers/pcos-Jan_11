import React from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

const particles: Particle[] = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 60 + 30,
  duration: Math.random() * 20 + 15,
  delay: Math.random() * -20,
  color: [
    'bg-lavender-200/10',
    'bg-olive-200/10',
    'bg-terracotta-200/10',
    'bg-sage-200/10',
    'bg-peach-200/10'
  ][Math.floor(Math.random() * 5)]
}));

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-sage-50 via-lavender-50/30 to-peach-50 dark:from-gray-900 dark:via-lavender-950/20 dark:to-gray-800" />

      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full ${particle.color} blur-3xl animate-float-slow opacity-40`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(167,197,164,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(107,143,78,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(215,201,232,0.15),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_20%,rgba(157,135,201,0.08),transparent_50%)]" />
    </div>
  );
};
