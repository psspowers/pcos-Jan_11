import React from 'react';
import Plant from './Plant';
import { MoodType } from '../types';
import { Flame } from 'lucide-react';

interface PlantContainerProps {
  streak: number;
  mood?: 'great' | 'okay' | 'rough';
  plantName?: string;
}

export const PlantContainer: React.FC<PlantContainerProps> = ({ streak, mood = 'okay', plantName = 'Your companion' }) => {
  const moodMap: Record<string, MoodType> = {
    'great': 'Great',
    'okay': 'Okay',
    'rough': 'Rough'
  };

  const plantMood = moodMap[mood] || 'Okay';

  const getSkyGradient = () => {
    if (mood === 'great') return 'from-peach-100 via-amber-50 to-cream-100';
    if (mood === 'rough') return 'from-orange-100 via-amber-50 to-cream-100';
    return 'from-sky-100 via-blue-50 to-cream-50';
  };

  const getBadgeGradient = () => {
    if (streak >= 30) return 'from-amber-500 to-orange-600';
    if (streak >= 14) return 'from-orange-400 to-orange-600';
    if (streak >= 7) return 'from-peach-400 to-peach-600';
    return 'from-sage-400 to-sage-600';
  };

  return (
    <div className="relative">
      <div className="text-center mb-3">
        <p className="text-sm font-medium text-sage-600" style={{ fontFamily: '"Outfit", sans-serif', letterSpacing: '0.02em' }}>
          {plantName} is growing
        </p>
      </div>

      <div className={`relative rounded-3xl overflow-visible border-2 border-sage-200/50 shadow-lg transition-all duration-700 bg-gradient-to-b ${getSkyGradient()}`}>
        {streak > 0 && (
          <div className={`absolute -top-3 -right-3 z-10 flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-br ${getBadgeGradient()} shadow-xl border-2 border-white transition-all hover:scale-110 cursor-pointer`}>
            <Flame className="w-4 h-4 text-white drop-shadow" />
            <span className="text-sm font-bold text-white drop-shadow">
              {streak}
            </span>
          </div>
        )}

        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute top-8 left-12 w-16 h-8 bg-white/40 rounded-full blur-sm animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute top-16 right-16 w-20 h-10 bg-white/30 rounded-full blur-sm animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-24 left-1/3 w-12 h-6 bg-white/35 rounded-full blur-sm animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="relative px-8 pt-12 pb-4">
          <Plant
            streak={streak}
            mood={plantMood}
          />
        </div>

        <div className="relative mt-2">
          <div className="h-3 bg-gradient-to-b from-amber-200/40 to-amber-300/60 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/30 to-transparent" />
          </div>
          <div className="h-1 bg-amber-300/50" />
        </div>
      </div>
    </div>
  );
};
