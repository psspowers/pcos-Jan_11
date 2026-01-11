import React, { useEffect, useState } from 'react';

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  velocityX: number;
  velocityY: number;
  rotationSpeed: number;
}

interface CelebrationProps {
  trigger: boolean;
  type?: 'confetti' | 'sparkles' | 'hearts';
  color?: 'rainbow' | 'sage' | 'peach' | 'success';
  duration?: number;
  particleCount?: number;
}

const COLORS = {
  rainbow: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'],
  sage: ['#4d7c5a', '#6b9f80', '#8fbc8f', '#a8d5ba'],
  peach: ['#ff9a8b', '#ffa97f', '#ffb873', '#ffc767'],
  success: ['#22c55e', '#4ade80', '#86efac', '#bbf7d0']
};

export const Celebration: React.FC<CelebrationProps> = ({
  trigger,
  type = 'confetti',
  color = 'rainbow',
  duration = 3000,
  particleCount = 50
}) => {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true);
      generateParticles();

      const timeout = setTimeout(() => {
        setIsActive(false);
        setParticles([]);
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [trigger]);

  const generateParticles = () => {
    const colors = COLORS[color];
    const newParticles: ConfettiParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocityX: (Math.random() - 0.5) * 4,
        velocityY: 2 + Math.random() * 3,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }

    setParticles(newParticles);
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute ${
            type === 'confetti' ? 'w-3 h-3' : type === 'hearts' ? 'w-4 h-4' : 'w-2 h-2'
          }`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
            animation: `fall ${2 + Math.random()}s linear forwards`,
            backgroundColor: type === 'confetti' ? particle.color : 'transparent'
          }}
        >
          {type === 'hearts' && <span style={{ color: particle.color }}>💚</span>}
          {type === 'sparkles' && <span style={{ color: particle.color }}>✨</span>}
        </div>
      ))}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(120vh) rotate(${Math.random() * 720}deg) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

interface CelebrationOverlayProps {
  show: boolean;
  title: string;
  message?: string;
  icon?: React.ReactNode;
  confettiType?: 'confetti' | 'sparkles' | 'hearts';
  confettiColor?: 'rainbow' | 'sage' | 'peach' | 'success';
}

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  show,
  title,
  message,
  icon,
  confettiType = 'confetti',
  confettiColor = 'rainbow'
}) => {
  if (!show) return null;

  return (
    <>
      <Celebration trigger={show} type={confettiType} color={confettiColor} />
      <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm mx-4 text-center space-y-4 animate-in slide-in-from-bottom duration-700">
          {icon && (
            <div className="flex justify-center animate-bounce">
              {icon}
            </div>
          )}
          <h2 className="text-3xl font-bold text-sage-800 animate-in fade-in duration-1000">
            {title}
          </h2>
          {message && (
            <p className="text-sage-600 text-lg animate-in fade-in duration-1000 delay-200">
              {message}
            </p>
          )}
        </div>
      </div>
    </>
  );
};
