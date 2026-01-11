import { getLogs, DailyLog } from './storage';

export interface Correlation {
  id: string;
  type: 'sleep' | 'activity' | 'hydration' | 'stress' | 'cycle';
  title: string;
  description: string;
  strength: 'strong' | 'moderate' | 'weak';
  icon: string;
  color: string;
  actionable: string;
  dataPoints: number;
}

const calculateAvgSymptoms = (logs: DailyLog[]): number => {
  if (logs.length === 0) return 0;
  const allSymptoms = logs.flatMap(log => Object.values(log.symptoms));
  return allSymptoms.reduce((sum, val) => sum + val, 0) / allSymptoms.length;
};

const getCorrelationStrength = (difference: number): 'strong' | 'moderate' | 'weak' => {
  if (Math.abs(difference) >= 2.5) return 'strong';
  if (Math.abs(difference) >= 1.5) return 'moderate';
  return 'weak';
};

export const discoverCorrelations = (): Correlation[] => {
  const logs = getLogs();
  const correlations: Correlation[] = [];

  if (logs.length < 14) {
    return [];
  }

  const goodSleepLogs = logs.filter(l => l.lifestyle.sleepHours >= 7.5);
  const poorSleepLogs = logs.filter(l => l.lifestyle.sleepHours < 6);

  if (goodSleepLogs.length >= 5 && poorSleepLogs.length >= 5) {
    const goodSleepAvg = calculateAvgSymptoms(goodSleepLogs);
    const poorSleepAvg = calculateAvgSymptoms(poorSleepLogs);
    const difference = poorSleepAvg - goodSleepAvg;

    if (difference > 1) {
      const strength = getCorrelationStrength(difference);
      correlations.push({
        id: 'sleep_symptoms',
        type: 'sleep',
        title: 'Sleep Pattern Observed',
        description: `In your logged data, symptoms were ${difference.toFixed(1)} points lower on average on days after 7.5+ hours of sleep.`,
        strength,
        icon: '😴',
        color: 'text-blue-600',
        actionable: 'Consider getting 7-9 hours of sleep consistently. Research shows sleep helps regulate hormones.',
        dataPoints: goodSleepLogs.length + poorSleepLogs.length
      });
    }
  }

  const activeLogs = logs.filter(l => l.lifestyle.activity === 'moderate' || l.lifestyle.activity === 'intense');
  const sedentaryLogs = logs.filter(l => l.lifestyle.activity === 'none' || l.lifestyle.activity === 'light');

  if (activeLogs.length >= 5 && sedentaryLogs.length >= 5) {
    const activeAvg = calculateAvgSymptoms(activeLogs);
    const sedentaryAvg = calculateAvgSymptoms(sedentaryLogs);
    const difference = sedentaryAvg - activeAvg;

    if (difference > 1) {
      const strength = getCorrelationStrength(difference);
      correlations.push({
        id: 'activity_symptoms',
        type: 'activity',
        title: 'Activity Pattern Observed',
        description: `In your logged data, symptoms were ${difference.toFixed(1)} points lower on days with moderate activity.`,
        strength,
        icon: '🏃‍♀️',
        color: 'text-green-600',
        actionable: 'Research suggests moderate exercise may help balance hormones and manage PCOS symptoms.',
        dataPoints: activeLogs.length + sedentaryLogs.length
      });
    }
  }

  const hydratedLogs = logs.filter(l => l.lifestyle.hydrationMet);
  const dehydratedLogs = logs.filter(l => !l.lifestyle.hydrationMet);

  if (hydratedLogs.length >= 5 && dehydratedLogs.length >= 5) {
    const hydratedBloating = hydratedLogs.reduce((sum, l) => sum + l.symptoms.bloating, 0) / hydratedLogs.length;
    const dehydratedBloating = dehydratedLogs.reduce((sum, l) => sum + l.symptoms.bloating, 0) / dehydratedLogs.length;
    const difference = dehydratedBloating - hydratedBloating;

    if (difference > 1.5) {
      const strength = getCorrelationStrength(difference);
      correlations.push({
        id: 'hydration_bloating',
        type: 'hydration',
        title: 'Hydration Pattern Observed',
        description: `In your logged data, bloating was ${difference.toFixed(1)} points lower on days you met water goals.`,
        strength,
        icon: '💧',
        color: 'text-blue-400',
        actionable: 'Consider aiming for 8 glasses of water daily. Hydration may help reduce water retention.',
        dataPoints: hydratedLogs.length + dehydratedLogs.length
      });
    }
  }

  const lowStressLogs = logs.filter(l => l.lifestyle.stressLevel <= 2);
  const highStressLogs = logs.filter(l => l.lifestyle.stressLevel >= 4);

  if (lowStressLogs.length >= 5 && highStressLogs.length >= 5) {
    const lowStressMood = lowStressLogs.reduce((sum, l) => sum + l.symptoms.moodSwings, 0) / lowStressLogs.length;
    const highStressMood = highStressLogs.reduce((sum, l) => sum + l.symptoms.moodSwings, 0) / highStressLogs.length;
    const difference = highStressMood - lowStressMood;

    if (difference > 1.5) {
      const strength = getCorrelationStrength(difference);
      correlations.push({
        id: 'stress_mood',
        type: 'stress',
        title: 'Stress Pattern Observed',
        description: `In your logged data, mood swings were ${difference.toFixed(1)} points higher on high-stress days.`,
        strength,
        icon: '🧘‍♀️',
        color: 'text-purple-600',
        actionable: 'Consider stress-reduction techniques like meditation, yoga, or deep breathing exercises.',
        dataPoints: lowStressLogs.length + highStressLogs.length
      });
    }
  }

  const periodLogs = logs.filter(l => l.cycleStatus === 'period');
  const nonPeriodLogs = logs.filter(l => l.cycleStatus === 'none');

  if (periodLogs.length >= 5 && nonPeriodLogs.length >= 5) {
    const periodAvg = calculateAvgSymptoms(periodLogs);
    const nonPeriodAvg = calculateAvgSymptoms(nonPeriodLogs);
    const difference = periodAvg - nonPeriodAvg;

    if (difference > 2) {
      const strength = getCorrelationStrength(difference);
      correlations.push({
        id: 'period_symptoms',
        type: 'cycle',
        title: 'Cycle Phase Pattern Observed',
        description: `In your logged data, symptoms were ${difference.toFixed(1)} points higher during your period.`,
        strength,
        icon: '📅',
        color: 'text-pink-600',
        actionable: 'Consider planning self-care activities during your period. Extra rest and gentle movement may help.',
        dataPoints: periodLogs.length + nonPeriodLogs.length
      });
    }
  }

  const energyGoodSleep = goodSleepLogs.length > 0
    ? goodSleepLogs.reduce((sum, l) => sum + l.symptoms.energy, 0) / goodSleepLogs.length
    : 0;
  const energyPoorSleep = poorSleepLogs.length > 0
    ? poorSleepLogs.reduce((sum, l) => sum + l.symptoms.energy, 0) / poorSleepLogs.length
    : 0;
  const energyDiff = energyGoodSleep - energyPoorSleep;

  if (goodSleepLogs.length >= 5 && poorSleepLogs.length >= 5 && energyDiff > 1.5) {
    const strength = getCorrelationStrength(energyDiff);
    correlations.push({
      id: 'sleep_energy',
      type: 'sleep',
      title: 'Sleep-Energy Pattern Observed',
      description: `In your logged data, energy was ${energyDiff.toFixed(1)} points higher after nights with good sleep.`,
      strength,
      icon: '⚡',
      color: 'text-yellow-600',
      actionable: 'Consider prioritizing sleep to support energy levels throughout the day.',
      dataPoints: goodSleepLogs.length + poorSleepLogs.length
    });
  }

  return correlations.sort((a, b) => {
    const strengthOrder = { strong: 3, moderate: 2, weak: 1 };
    return strengthOrder[b.strength] - strengthOrder[a.strength];
  });
};

export const getCorrelationInsight = (correlations: Correlation[]): string | null => {
  if (correlations.length === 0) return null;

  const strongest = correlations.find(c => c.strength === 'strong');
  if (strongest) {
    return `💡 Discovery: ${strongest.title}. ${strongest.actionable}`;
  }

  const moderate = correlations.find(c => c.strength === 'moderate');
  if (moderate) {
    return `💡 Pattern: ${moderate.title}. ${moderate.actionable}`;
  }

  return null;
};
