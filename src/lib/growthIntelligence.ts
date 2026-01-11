import { DailyLog, getLogs } from './storage';

export interface GrowthMetrics {
  totalPoints: number;
  consistencyBonus: number;
  improvementBonus: number;
  lifestyleBonus: number;
  currentStreak: number;
  isDormant: boolean;
  daysSinceLastLog: number;
}

export interface GrowthStage {
  stage: 'seed' | 'sprout' | 'plant' | 'bloom' | 'tree';
  label: string;
  color: string;
  bg: string;
  pointsRequired: number;
  narrative: string;
  wisdom: string;
}

const GROWTH_STAGES: GrowthStage[] = [
  {
    stage: 'seed',
    label: 'Planted Seed',
    color: 'text-sage-400',
    bg: 'bg-gradient-to-br from-sage-50 to-white',
    pointsRequired: 0,
    narrative: "Every mighty tree starts as a single seed. You've planted yours.",
    wisdom: "🌱 Beginning is the most important step. You're already here."
  },
  {
    stage: 'sprout',
    label: 'First Sprout',
    color: 'text-sage-500',
    bg: 'bg-gradient-to-br from-sage-50 to-sage-100',
    pointsRequired: 50,
    narrative: "Your consistency is breaking through! Small daily actions create lasting change.",
    wisdom: "🌿 Regular tracking reveals patterns you couldn't see before."
  },
  {
    stage: 'plant',
    label: 'Growing Strong',
    color: 'text-sage-600',
    bg: 'bg-gradient-to-br from-sage-100 to-peach-50',
    pointsRequired: 150,
    narrative: "Your roots are deepening. You're understanding your body's unique patterns.",
    wisdom: "🍃 Knowledge is power - you're learning what works for YOU."
  },
  {
    stage: 'bloom',
    label: 'In Full Bloom',
    color: 'text-peach-600',
    bg: 'bg-gradient-to-br from-peach-100 to-peach-200',
    pointsRequired: 300,
    narrative: "You're flourishing! Your dedication is showing real results.",
    wisdom: "🌸 Your journey is inspiring. Every improvement matters."
  },
  {
    stage: 'tree',
    label: 'Mighty Oak',
    color: 'text-sage-700',
    bg: 'bg-gradient-to-br from-sage-200 to-peach-100',
    pointsRequired: 500,
    narrative: "You've built lasting habits and deep self-knowledge. You're unstoppable.",
    wisdom: "🌳 You've become a source of strength and wisdom for yourself."
  }
];

/**
 * Calculate symptom score (lower is better for negative symptoms, higher is better for positive ones)
 */
const calculateSymptomScore = (symptoms: DailyLog['symptoms']): number => {
  const negativeSymptoms =
    symptoms.cramps + symptoms.acne + symptoms.hairLoss +
    symptoms.facialHair + symptoms.bloating + symptoms.cravings +
    symptoms.moodSwings;

  const positiveSymptoms = symptoms.energy + symptoms.sleepQuality;

  // Score: higher positive symptoms and lower negative symptoms = better
  // Max negative: 70 (7 symptoms * 10), Max positive: 20
  // Normalize to 0-100 scale where 100 is best
  const negativeScore = Math.max(0, 70 - negativeSymptoms);
  const positiveScore = positiveSymptoms * 2; // Scale to 0-20

  return (negativeScore + positiveScore) / 90 * 100;
};

/**
 * Calculate lifestyle score
 */
const calculateLifestyleScore = (lifestyle: DailyLog['lifestyle']): number => {
  let score = 0;

  // Sleep (optimal: 7-9 hours)
  if (lifestyle.sleepHours >= 7 && lifestyle.sleepHours <= 9) score += 25;
  else if (lifestyle.sleepHours >= 6 && lifestyle.sleepHours <= 10) score += 15;
  else score += 5;

  // Activity
  const activityPoints = { none: 0, light: 15, moderate: 25, intense: 20 };
  score += activityPoints[lifestyle.activity];

  // Sugar intake
  const sugarPoints = { low: 25, medium: 15, high: 5 };
  score += sugarPoints[lifestyle.sugarIntake];

  // Hydration
  score += lifestyle.hydrationMet ? 15 : 0;

  // Stress (lower is better)
  score += Math.max(0, 10 - lifestyle.stressLevel);

  return score;
};

/**
 * Calculate trend (comparing recent logs to older logs)
 */
const calculateImprovementTrend = (logs: DailyLog[]): number => {
  if (logs.length < 7) return 0; // Need at least a week of data

  const sortedLogs = [...logs].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Compare last 7 days to previous 7 days
  const recent = sortedLogs.slice(0, 7);
  const previous = sortedLogs.slice(7, 14);

  if (previous.length < 7) return 0;

  const recentAvg = recent.reduce((sum, log) =>
    sum + calculateSymptomScore(log.symptoms), 0) / recent.length;

  const previousAvg = previous.reduce((sum, log) =>
    sum + calculateSymptomScore(log.symptoms), 0) / previous.length;

  // Return improvement percentage (-100 to +100)
  return recentAvg - previousAvg;
};

/**
 * Calculate current streak
 */
const calculateStreak = (logs: DailyLog[]): number => {
  if (logs.length === 0) return 0;

  const sortedLogs = [...logs].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedLogs.length; i++) {
    const logDate = new Date(sortedLogs[i].date);
    logDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    expectedDate.setHours(0, 0, 0, 0);

    if (logDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Calculate days since last log
 */
const getDaysSinceLastLog = (logs: DailyLog[]): number => {
  if (logs.length === 0) return 0;

  const sortedLogs = [...logs].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const lastLog = new Date(sortedLogs[0].date);
  const today = new Date();
  lastLog.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(today.getTime() - lastLog.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

/**
 * Main function: Calculate growth metrics with intelligent scoring
 */
export const calculateGrowthMetrics = (): GrowthMetrics => {
  const logs = getLogs();

  if (logs.length === 0) {
    return {
      totalPoints: 0,
      consistencyBonus: 0,
      improvementBonus: 0,
      lifestyleBonus: 0,
      currentStreak: 0,
      isDormant: false,
      daysSinceLastLog: 0
    };
  }

  const currentStreak = calculateStreak(logs);
  const daysSinceLastLog = getDaysSinceLastLog(logs);
  const isDormant = daysSinceLastLog > 3;

  // Base points: 10 points per log (consistency matters)
  let consistencyBonus = logs.length * 10;

  // Streak bonus: exponential growth for maintaining streaks
  consistencyBonus += Math.min(currentStreak * currentStreak / 2, 200);

  // Recent activity bonus (counteracts dormancy)
  if (!isDormant) {
    consistencyBonus += 50;
  }

  // Improvement bonus: reward health improvements
  const improvementTrend = calculateImprovementTrend(logs);
  let improvementBonus = 0;

  if (improvementTrend > 0) {
    // Positive trend: bonus points
    improvementBonus = Math.min(improvementTrend * 5, 150);
  } else if (improvementTrend < -10) {
    // Significant negative trend: reduce growth (not punish, just slow)
    improvementBonus = Math.max(improvementTrend * 2, -50);
  }

  // Lifestyle bonus: reward healthy habits in recent logs
  const recentLogs = [...logs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);

  const lifestyleBonus = recentLogs.reduce((sum, log) =>
    sum + calculateLifestyleScore(log.lifestyle), 0) / recentLogs.length;

  const totalPoints = Math.max(0, consistencyBonus + improvementBonus + lifestyleBonus);

  return {
    totalPoints: Math.round(totalPoints),
    consistencyBonus: Math.round(consistencyBonus),
    improvementBonus: Math.round(improvementBonus),
    lifestyleBonus: Math.round(lifestyleBonus),
    currentStreak,
    isDormant,
    daysSinceLastLog
  };
};

/**
 * Get current growth stage based on points
 */
export const getCurrentGrowthStage = (metrics: GrowthMetrics): GrowthStage => {
  for (let i = GROWTH_STAGES.length - 1; i >= 0; i--) {
    if (metrics.totalPoints >= GROWTH_STAGES[i].pointsRequired) {
      return GROWTH_STAGES[i];
    }
  }
  return GROWTH_STAGES[0];
};

/**
 * Get next milestone
 */
export const getNextMilestone = (metrics: GrowthMetrics): GrowthStage | null => {
  for (const stage of GROWTH_STAGES) {
    if (metrics.totalPoints < stage.pointsRequired) {
      return stage;
    }
  }
  return null;
};

/**
 * Get personalized message based on current state
 */
export const getPersonalizedMessage = (metrics: GrowthMetrics): string => {
  if (metrics.isDormant && metrics.daysSinceLastLog > 7) {
    return "🌙 Your plant is resting, waiting for you. Come back whenever you're ready - no judgment, just support.";
  }

  if (metrics.isDormant) {
    return "💚 Welcome back! Your plant missed you. Every return is a victory.";
  }

  if (metrics.currentStreak >= 30) {
    return "🔥 30-day streak! You're building incredible consistency.";
  }

  if (metrics.currentStreak >= 7) {
    return "✨ A full week logged! You're building powerful habits.";
  }

  if (metrics.improvementBonus > 50) {
    return "🌟 Your symptoms are improving! Your efforts are paying off.";
  }

  if (metrics.lifestyleBonus > 70) {
    return "💪 Your healthy habits are outstanding! Keep it up.";
  }

  return "🌱 Every entry helps you understand your body better.";
};

/**
 * Get progress percentage to next milestone
 */
export const getProgressToNextMilestone = (metrics: GrowthMetrics): number => {
  const nextMilestone = getNextMilestone(metrics);
  if (!nextMilestone) return 100;

  const currentStage = getCurrentGrowthStage(metrics);
  const pointsInCurrentStage = metrics.totalPoints - currentStage.pointsRequired;
  const pointsNeeded = nextMilestone.pointsRequired - currentStage.pointsRequired;

  return Math.min(100, (pointsInCurrentStage / pointsNeeded) * 100);
};
