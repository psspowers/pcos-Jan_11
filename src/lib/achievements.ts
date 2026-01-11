import { getLogs, getProfile } from './storage';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: 1 | 2 | 3;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  total: number;
}

export const checkAchievements = (): Achievement[] => {
  const logs = getLogs();
  const profile = getProfile();
  const today = new Date().toISOString().split('T')[0];

  const calculateStreak = () => {
    let streak = 0;
    const dates = logs.map(l => l.date).sort().reverse();

    for (let i = 0; i < dates.length; i++) {
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      const expected = expectedDate.toISOString().split('T')[0];

      if (dates[i] === expected || (i === 0 && dates[i] === today)) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = calculateStreak();
  const totalLogs = logs.length;

  const hasFullCycle = () => {
    const periodLogs = logs.filter(l => l.cycleStatus === 'period');
    if (periodLogs.length < 2) return false;

    const dates = periodLogs.map(l => new Date(l.date)).sort((a, b) => a.getTime() - b.getTime());
    for (let i = 1; i < dates.length; i++) {
      const diff = Math.floor((dates[i].getTime() - dates[i-1].getTime()) / (1000 * 60 * 60 * 24));
      if (diff >= 21 && diff <= 40) return true;
    }
    return false;
  };

  const hasCorrelationDiscovery = () => {
    if (logs.length < 14) return false;

    const goodSleepLogs = logs.filter(l => l.lifestyle.sleepHours >= 7);
    if (goodSleepLogs.length < 7) return false;

    const avgSymptomsGoodSleep = goodSleepLogs.reduce((sum, l) => {
      const symptoms = Object.values(l.symptoms);
      return sum + symptoms.reduce((s, v) => s + v, 0) / symptoms.length;
    }, 0) / goodSleepLogs.length;

    const poorSleepLogs = logs.filter(l => l.lifestyle.sleepHours < 7);
    if (poorSleepLogs.length < 7) return false;

    const avgSymptomsPoorSleep = poorSleepLogs.reduce((sum, l) => {
      const symptoms = Object.values(l.symptoms);
      return sum + symptoms.reduce((s, v) => s + v, 0) / symptoms.length;
    }, 0) / poorSleepLogs.length;

    return avgSymptomsGoodSleep < avgSymptomsPoorSleep - 1;
  };

  const hasSymptomImprovement = () => {
    if (logs.length < 30) return false;

    const recent = logs.slice(0, 14);
    const older = logs.slice(14, 28);

    const recentAvg = recent.reduce((sum, l) => {
      const symptoms = Object.values(l.symptoms);
      return sum + symptoms.reduce((s, v) => s + v, 0) / symptoms.length;
    }, 0) / recent.length;

    const olderAvg = older.reduce((sum, l) => {
      const symptoms = Object.values(l.symptoms);
      return sum + symptoms.reduce((s, v) => s + v, 0) / symptoms.length;
    }, 0) / older.length;

    return recentAvg < olderAvg * 0.5;
  };

  const waterGoalDays = logs.filter(l => l.lifestyle.hydrationMet).length;
  const sevenHourSleepDays = logs.filter(l => l.lifestyle.sleepHours >= 7).length;

  const achievements: Achievement[] = [
    {
      id: 'first_step',
      title: 'Seed Planted',
      description: 'Log your first day',
      icon: '🌱',
      tier: 1,
      unlocked: totalLogs >= 1,
      unlockedAt: totalLogs >= 1 ? logs[logs.length - 1]?.date : undefined,
      progress: Math.min(totalLogs, 1),
      total: 1
    },
    {
      id: 'week_warrior',
      title: 'First Sprout',
      description: 'Log 7 consecutive days',
      icon: '🌿',
      tier: 1,
      unlocked: streak >= 7,
      progress: Math.min(streak, 7),
      total: 7
    },
    {
      id: 'two_week_streak',
      title: 'Growing Strong',
      description: 'Log 14 consecutive days',
      icon: '🪴',
      tier: 1,
      unlocked: streak >= 14,
      progress: Math.min(streak, 14),
      total: 14
    },
    {
      id: 'month_master',
      title: 'In Full Bloom',
      description: 'Log 30 consecutive days',
      icon: '🌸',
      tier: 2,
      unlocked: streak >= 30,
      progress: Math.min(streak, 30),
      total: 30
    },
    {
      id: 'three_month_legend',
      title: 'Mighty Tree',
      description: 'Log 90 consecutive days',
      icon: '🌳',
      tier: 3,
      unlocked: streak >= 90,
      progress: Math.min(streak, 90),
      total: 90
    },
    {
      id: 'sleep_scientist',
      title: 'Sleep Wisdom',
      description: 'Discover how rest nurtures your wellbeing',
      icon: '🌙',
      tier: 2,
      unlocked: hasCorrelationDiscovery(),
      progress: Math.min(logs.length, 14),
      total: 14
    },
    {
      id: 'hydration_hero',
      title: 'Nourished Roots',
      description: 'Meet water goals for 14 days',
      icon: '💧',
      tier: 2,
      unlocked: waterGoalDays >= 14,
      progress: Math.min(waterGoalDays, 14),
      total: 14
    },
    {
      id: 'cycle_tracker',
      title: 'Natural Rhythms',
      description: 'Track a complete cycle',
      icon: '🌊',
      tier: 2,
      unlocked: hasFullCycle(),
      progress: logs.filter(l => l.cycleStatus === 'period').length,
      total: 2
    },
    {
      id: 'symptom_slayer',
      title: 'Blossoming Health',
      description: 'Reduce average symptoms by 50%',
      icon: '🌺',
      tier: 3,
      unlocked: hasSymptomImprovement(),
      progress: Math.min(logs.length, 30),
      total: 30
    },
    {
      id: 'rest_master',
      title: 'Restful Garden',
      description: 'Get 7+ hours of sleep for 21 days',
      icon: '🌜',
      tier: 2,
      unlocked: sevenHourSleepDays >= 21,
      progress: Math.min(sevenHourSleepDays, 21),
      total: 21
    },
    {
      id: 'data_detective',
      title: 'Pattern Finder',
      description: 'Log 50 total days of growth',
      icon: '🔍',
      tier: 2,
      unlocked: totalLogs >= 50,
      progress: Math.min(totalLogs, 50),
      total: 50
    },
    {
      id: 'wellness_warrior',
      title: 'Flourishing Forest',
      description: 'Log 100 total days of growth',
      icon: '🌲',
      tier: 3,
      unlocked: totalLogs >= 100,
      progress: Math.min(totalLogs, 100),
      total: 100
    }
  ];

  return achievements.sort((a, b) => {
    if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
    if (a.tier !== b.tier) return a.tier - b.tier;
    return 0;
  });
};

export const getNewlyUnlockedAchievements = (previous: Achievement[], current: Achievement[]): Achievement[] => {
  const previousUnlocked = new Set(previous.filter(a => a.unlocked).map(a => a.id));
  return current.filter(a => a.unlocked && !previousUnlocked.has(a.id));
};
