import { getLogs, DailyLog } from './storage';

export type InterfaceMode = 'nurture' | 'steady' | 'thrive';

interface ModeConfig {
  name: string;
  icon: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  message: string;
  encouragement: string[];
}

export const MODE_CONFIGS: Record<InterfaceMode, ModeConfig> = {
  nurture: {
    name: 'Nurture Mode',
    icon: '🌱',
    primaryColor: 'from-purple-100 to-pink-100',
    secondaryColor: 'text-purple-700',
    backgroundColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
    message: "We're here for you today. Take your time.",
    encouragement: [
      "Every small step counts",
      "Rest is part of healing",
      "You're doing your best",
      "Be gentle with yourself",
      "One day at a time"
    ]
  },
  steady: {
    name: 'Steady State',
    icon: '🌿',
    primaryColor: 'from-sage-100 to-peach-100',
    secondaryColor: 'text-sage-700',
    backgroundColor: 'bg-gradient-to-br from-sage-50 to-peach-50',
    message: "You're building great habits!",
    encouragement: [
      "Consistency is your strength",
      "Progress is happening",
      "Keep up the good work",
      "You're on the right track",
      "Patterns are emerging"
    ]
  },
  thrive: {
    name: 'Thrive Mode',
    icon: '✨',
    primaryColor: 'from-yellow-100 to-green-100',
    secondaryColor: 'text-green-700',
    backgroundColor: 'bg-gradient-to-br from-yellow-50 to-green-50',
    message: "You're thriving! Amazing progress!",
    encouragement: [
      "You're doing incredible",
      "Your dedication shows",
      "Keep shining bright",
      "You're an inspiration",
      "Wellness looks good on you"
    ]
  }
};

const calculateAvgSymptoms = (log: DailyLog): number => {
  const symptoms = Object.values(log.symptoms);
  return symptoms.reduce((sum, val) => sum + val, 0) / symptoms.length;
};

const calculateStreak = (logs: DailyLog[]): number => {
  let streak = 0;
  const dates = logs.map(l => l.date).sort().reverse();
  const today = new Date().toISOString().split('T')[0];

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

export const determineInterfaceMode = (): InterfaceMode => {
  const logs = getLogs();

  if (logs.length === 0) return 'steady';

  const recent7 = logs.slice(0, 7);
  const streak = calculateStreak(logs);

  if (recent7.length === 0) return 'steady';

  const avgSymptoms = recent7.reduce((sum, log) =>
    sum + calculateAvgSymptoms(log), 0) / recent7.length;

  const avgSleep = recent7.reduce((sum, log) =>
    sum + log.lifestyle.sleepHours, 0) / recent7.length;

  const avgEnergy = recent7.reduce((sum, log) =>
    sum + log.symptoms.energy, 0) / recent7.length;

  const highSymptomCount = recent7.filter(log => {
    const symptoms = Object.values(log.symptoms);
    return symptoms.filter(s => s >= 7).length >= 3;
  }).length;

  if (avgSymptoms >= 7 || highSymptomCount >= 3 || streak < 3) {
    return 'nurture';
  }

  if (
    avgSymptoms <= 3 &&
    streak >= 14 &&
    avgSleep >= 7 &&
    avgEnergy >= 6
  ) {
    return 'thrive';
  }

  return 'steady';
};

export const getModeMessage = (mode: InterfaceMode): string => {
  const config = MODE_CONFIGS[mode];
  const randomIndex = Math.floor(Math.random() * config.encouragement.length);
  return config.encouragement[randomIndex];
};

export const getModeTransitionMessage = (oldMode: InterfaceMode, newMode: InterfaceMode): string => {
  if (oldMode === newMode) return '';

  if (newMode === 'nurture') {
    return "Your interface has adjusted to provide extra support. Take your time today.";
  }

  if (newMode === 'thrive') {
    return "🎉 You're thriving! Your interface now celebrates your progress!";
  }

  if (oldMode === 'nurture' && newMode === 'steady') {
    return "Great to see you feeling better! Your interface has updated.";
  }

  return "Your interface has updated to match your current wellness state.";
};
