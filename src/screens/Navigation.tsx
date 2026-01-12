import React from 'react';
import { Home, TrendingUp, BookOpen, Settings, Shield } from 'lucide-react';
import { StreakBadge } from '@/components/StreakBadge';
import { triggerHaptic } from '@/lib/haptics';

export type Screen = 'home' | 'insights' | 'learn' | 'settings';

interface Props {
  current: Screen;
  onChange: (screen: Screen) => void;
}

const navItems: { id: Screen; icon: React.ElementType; label: string }[] = [
  { id: 'home', icon: Home, label: 'Log' },
  { id: 'insights', icon: TrendingUp, label: 'Insights' },
  { id: 'learn', icon: BookOpen, label: 'Learn' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export const BottomNav: React.FC<Props> = ({ current, onChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-t border-sage-200/50 dark:border-gray-700/50 px-4 py-2 z-50 safe-area-inset-bottom shadow-lg">
      <div className="max-w-lg mx-auto flex justify-around">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => {
              triggerHaptic('light');
              onChange(item.id);
            }}
            className={`group relative flex flex-col items-center py-2 px-4 rounded-2xl transition-all duration-300 transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 dark:focus-visible:ring-sage-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-800 ${
              current === item.id
                ? 'text-sage-800 dark:text-sage-200 bg-sage-100/80 dark:bg-sage-900/60 scale-105 shadow-md'
                : 'text-sage-500 dark:text-gray-400 hover:text-sage-700 dark:hover:text-sage-300 hover:bg-sage-50/50 dark:hover:bg-gray-700/30'
            }`}
          >
            <item.icon className={`w-5 h-5 transition-all duration-300 ${
              current === item.id ? 'scale-110' : 'group-hover:scale-105'
            }`} />
            <span className={`text-xs mt-1 transition-all duration-200 ${
              current === item.id ? 'font-semibold' : 'font-medium'
            }`}>{item.label}</span>
            {current === item.id && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-sage-600 dark:bg-sage-400 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-sage-200/50 dark:border-gray-700/50 px-4 py-2 sticky top-0 z-50 shadow-sm">
      <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center">
          <img
            src="/logo.png"
            alt="Blossom - Your PCOS Buddy"
            className="h-20 object-contain transition-transform hover:scale-105"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs text-red-700 dark:text-red-300 bg-red-50/90 dark:bg-red-900/40 backdrop-blur-sm px-3 py-1.5 rounded-full border-2 border-red-500/70 dark:border-red-600/70 shadow-md">
            <Shield className="w-3.5 h-3.5" />
            <span className="font-bold tracking-tight">Private</span>
          </div>
          <StreakBadge />
        </div>
      </div>
    </header>
  );
};
