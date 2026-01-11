import React, { useEffect, useState } from 'react';
import { getLogs } from '@/lib/storage';
import { Celebration } from '@/components/Celebration';
import { Sprout, Leaf, TreeDeciduous } from 'lucide-react';

export const StreakBadge: React.FC = () => {
  const [streak, setStreak] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showMilestoneCelebration, setShowMilestoneCelebration] = useState(false);

  useEffect(() => {
    const calculateStreak = () => {
      const logs = getLogs();
      let currentStreak = 0;
      const dates = logs.map(l => l.date).sort().reverse();
      const today = new Date().toISOString().split('T')[0];

      for (let i = 0; i < dates.length; i++) {
        const expectedDate = new Date();
        expectedDate.setDate(expectedDate.getDate() - i);
        const expected = expectedDate.toISOString().split('T')[0];

        if (dates[i] === expected || (i === 0 && dates[i] === today)) {
          currentStreak++;
        } else {
          break;
        }
      }

      const previousStreak = streak;
      setStreak(currentStreak);

      if (currentStreak > previousStreak && currentStreak > 0) {
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 1000);

        if ([3, 7, 14, 30, 60, 90].includes(currentStreak)) {
          setShowMilestoneCelebration(true);
          setTimeout(() => setShowMilestoneCelebration(false), 3000);
        }
      }
    };

    calculateStreak();
    const interval = setInterval(calculateStreak, 30000);
    return () => clearInterval(interval);
  }, []);

  if (streak === 0) return null;

  const getStreakMessage = () => {
    if (streak === 1) return 'Seed planted';
    if (streak === 7) return 'First sprout';
    if (streak === 14) return 'Growing strong';
    if (streak === 30) return 'In full bloom';
    if (streak === 60) return 'Thriving garden';
    if (streak === 90) return 'Mighty tree';
    if (streak < 7) return `${streak} days growing`;
    if (streak < 30) return `${streak} days strong`;
    return `${streak} days flourishing`;
  };

  const getGrowthIcon = () => {
    if (streak >= 30) return TreeDeciduous;
    if (streak >= 7) return Leaf;
    return Sprout;
  };

  const getGrowthColor = () => {
    if (streak >= 30) return 'text-sage-700';
    if (streak >= 14) return 'text-sage-600';
    if (streak >= 7) return 'text-sage-500';
    return 'text-sage-400';
  };

  return (
    <>
      <Celebration
        trigger={showMilestoneCelebration}
        type="confetti"
        color={streak >= 30 ? 'rainbow' : 'success'}
        particleCount={80}
        duration={4000}
      />
      <div
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-sage-50 to-peach-50 dark:from-sage-900 dark:to-peach-900 border border-sage-300 dark:border-sage-600 shadow-sm transition-all ${
          showAnimation ? 'scale-110 shadow-lg shadow-sage-200/50' : 'scale-100'
        }`}
      >
        {React.createElement(getGrowthIcon(), {
          className: `w-4 h-4 ${getGrowthColor()} dark:text-sage-300 ${showAnimation ? 'animate-bounce' : ''}`
        })}
        <span className="text-xs font-semibold text-sage-800 dark:text-sage-200 whitespace-nowrap">
          {getStreakMessage()}
        </span>
      </div>
    </>
  );
};
