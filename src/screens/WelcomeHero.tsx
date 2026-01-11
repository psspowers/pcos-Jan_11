import React from 'react';
import { getProfile, getLogs } from '@/lib/storage';
import { Calendar, TrendingUp, Heart } from 'lucide-react';

export const WelcomeHero: React.FC = () => {
  const profile = getProfile();
  const logs = getLogs();
  const today = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(l => l.date === today);
  const streak = calculateStreak(logs);

  function calculateStreak(logs: any[]): number {
    if (logs.length === 0) return 0;
    const sorted = logs.map(l => l.date).sort().reverse();
    let streak = 0;
    const now = new Date();

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(now);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      if (sorted.includes(dateStr)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="relative rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-cream-100 to-sage-50 dark:from-gray-800 dark:to-gray-700 border-2 border-sage-200/50 dark:border-gray-600">
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1 text-sage-800 dark:text-sage-100">{greeting()}!</h1>
            <p className="text-sage-600 dark:text-sage-300 text-sm mb-4">
              {todayLog ? "You've checked in today - you're doing great!" : "Let's see how you're feeling today"}
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sage-500 dark:text-sage-400" />
                <span className="text-sm text-sage-700 dark:text-sage-300">{logs.length} days logged</span>
              </div>
              {streak > 1 && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-sage-500 dark:text-sage-400" />
                  <span className="text-sm text-sage-700 dark:text-sage-300">{streak} day streak</span>
                </div>
              )}
            </div>
          </div>
          <img
            src="/logo.png"
            alt="Blossom - Your PCOS Buddy"
            className="h-16 object-contain ml-4 flex-shrink-0"
          />
        </div>
      </div>
    </div>
  );
};
