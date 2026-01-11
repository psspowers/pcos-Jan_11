import { DailyLog } from './storage';

export type PlantFeature =
  | 'stem'
  | 'firstLeaf'
  | 'secondLeaf'
  | 'flower'
  | 'fruit'
  | 'branches';

export interface FeatureMilestone {
  feature: PlantFeature;
  label: string;
  requiredStreak: number;
  requiredPoints?: number;
  description: string;
  icon: string;
}

export const PLANT_FEATURES: FeatureMilestone[] = [
  {
    feature: 'stem',
    label: 'Strong Stem',
    requiredStreak: 1,
    description: 'Your journey begins with a single stem',
    icon: '🌱'
  },
  {
    feature: 'firstLeaf',
    label: 'First Leaf',
    requiredStreak: 3,
    description: 'Your first leaf emerges - consistency is growing',
    icon: '🍃'
  },
  {
    feature: 'secondLeaf',
    label: 'Second Leaf',
    requiredStreak: 7,
    description: 'A full week! Your plant gains strength',
    icon: '🌿'
  },
  {
    feature: 'branches',
    label: 'Branches',
    requiredStreak: 14,
    requiredPoints: 150,
    description: 'Two weeks of growth - your habits branch out',
    icon: '🌳'
  },
  {
    feature: 'flower',
    label: 'First Flower',
    requiredStreak: 30,
    requiredPoints: 300,
    description: 'A month of dedication blooms beautifully',
    icon: '🌸'
  },
  {
    feature: 'fruit',
    label: 'Fruit',
    requiredStreak: 60,
    requiredPoints: 500,
    description: 'Your efforts bear fruit - visible health improvements',
    icon: '🍎'
  }
];

export interface PlantState {
  unlockedFeatures: PlantFeature[];
  nextMilestone: FeatureMilestone | null;
  progressToNext: number;
  totalHealth: number;
  stemCurve: number[];
  uniqueVariation: number;
}

export const getUnlockedFeatures = (
  streak: number,
  totalLogs: number
): PlantFeature[] => {
  return PLANT_FEATURES
    .filter(f => {
      const streakMet = streak >= f.requiredStreak;
      // Use total logs count instead of quality-based points
      const logsMet = !f.requiredPoints || totalLogs >= f.requiredPoints;
      return streakMet && logsMet;
    })
    .map(f => f.feature);
};

export const getNextMilestone = (
  streak: number,
  totalLogs: number
): FeatureMilestone | null => {
  for (const feature of PLANT_FEATURES) {
    const streakMet = streak >= feature.requiredStreak;
    // Use total logs count instead of quality-based points
    const logsMet = !feature.requiredPoints || totalLogs >= feature.requiredPoints;

    if (!streakMet || !logsMet) {
      return feature;
    }
  }
  return null;
};

export const getProgressToNextFeature = (
  streak: number,
  totalLogs: number
): number => {
  const next = getNextMilestone(streak, totalLogs);
  if (!next) return 100;

  const streakProgress = (streak / next.requiredStreak) * 100;

  if (next.requiredPoints) {
    // Use total logs count instead of quality-based points
    const logsProgress = (totalLogs / next.requiredPoints) * 100;
    return Math.min(100, Math.min(streakProgress, logsProgress));
  }

  return Math.min(100, streakProgress);
};

export const generateStemCurve = (
  streak: number,
  seed: number
): { x: number; y: number }[] => {
  const points: { x: number; y: number }[] = [];
  const baseSegments = 20;
  const additionalSegments = Math.floor(streak * 1.5);
  const segments = Math.min(baseSegments + additionalSegments, 70);

  const random = (min: number, max: number) => {
    seed = (seed * 9301 + 49297) % 233280;
    return min + (seed / 233280) * (max - min);
  };

  let x = 0;
  let y = 0;
  const drift = 0.5;

  points.push({ x, y });

  for (let i = 1; i <= segments; i++) {
    x += random(-drift, drift) * (i * 0.05);
    y += 5 + random(0, 2);
    points.push({ x, y });
  }

  return points;
};

export const calculatePlantHealth = (
  streak: number
): number => {
  // Plant health is based on CONSISTENCY (streak), not symptom quality
  // Users with bad symptom days shouldn't be punished with a wilting plant
  // The plant thrives because they are taking care of themselves by tracking

  if (streak === 0) return 50;
  if (streak >= 90) return 100;
  if (streak >= 60) return 95;
  if (streak >= 30) return 85;
  if (streak >= 14) return 75;
  if (streak >= 7) return 65;
  if (streak >= 3) return 55;
  return 50 + (streak * 2);
};

export const getPlantVariation = (userId: string | number): number => {
  const str = String(userId);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash % 1000) / 1000;
};
