import { useState, useEffect } from 'react';
import { calculatePlantHealth, PlantState } from '../logic/plant';
import { determineInterfaceMode, ThemeState } from '../logic/mode';
import { getAllVelocities, VelocityResult } from '../logic/velocity';
import { calculateAchievements, AchievementData } from '../logic/achievements';
import { getLastNDays, LogEntry } from '../db';

export function usePlantState() {
  const [plantState, setPlantState] = useState<PlantState>({
    phase: 'seed',
    health: 0,
    pulseSpeed: 2.5,
    streak: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlantState = async () => {
      const state = await calculatePlantHealth();
      setPlantState(state);
      setLoading(false);
    };

    loadPlantState();
  }, []);

  const refresh = async () => {
    const state = await calculatePlantHealth();
    setPlantState(state);
  };

  return { plantState, loading, refresh };
}

export function useInterfaceMode() {
  const [themeState, setThemeState] = useState<ThemeState>({
    mode: 'steady',
    primaryColor: '#2dd4bf',
    glowColor: 'rgba(45, 212, 191, 0.4)',
    message: 'Begin your wellness journey'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMode = async () => {
      const state = await determineInterfaceMode();
      setThemeState(state);
      setLoading(false);
    };

    loadMode();
  }, []);

  const refresh = async () => {
    const state = await determineInterfaceMode();
    setThemeState(state);
  };

  return { themeState, loading, refresh };
}

export function useVelocities() {
  const [velocities, setVelocities] = useState<Record<string, VelocityResult | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVelocities = async () => {
      const results = await getAllVelocities();
      setVelocities(results);
      setLoading(false);
    };

    loadVelocities();
  }, []);

  const refresh = async () => {
    const results = await getAllVelocities();
    setVelocities(results);
  };

  return { velocities, loading, refresh };
}

export type InsightCategory = 'hyperandrogenism' | 'metabolic' | 'psych' | 'all';

type MetricPolarity = 'direct' | 'inverse';

const METRIC_POLARITY: Record<string, MetricPolarity> = {
  sleep: 'direct',
  exercise: 'direct',
  diet: 'direct',
  waterIntake: 'direct',
  mood: 'direct',
  bodyImage: 'direct',
  acne: 'inverse',
  hirsutism: 'inverse',
  hairLoss: 'inverse',
  bloat: 'inverse',
  cramps: 'inverse',
  stress: 'inverse',
  anxiety: 'inverse'
};

function getMetricPolarity(metric: string): MetricPolarity {
  return METRIC_POLARITY[metric] || 'inverse';
}

function getTargetSymptomForCategory(category: InsightCategory): { metric: string; label: string } {
  switch (category) {
    case 'hyperandrogenism':
      return { metric: 'acne', label: 'Acne' };
    case 'psych':
      return { metric: 'anxiety', label: 'Anxiety' };
    case 'metabolic':
      return { metric: 'energy', label: 'Energy' };
    case 'all':
      return { metric: 'acne', label: 'Acne' };
    default:
      return { metric: 'acne', label: 'Acne' };
  }
}

export interface VelocityInsight {
  value: number;
  direction: 'improving' | 'worsening' | 'stable';
  symptomName: string;
  percentChange: number;
  polarity: MetricPolarity;
}

export interface RadarDataset {
  label: string;
  data: number[];
}

export interface FactorImpact {
  factor: string;
  impact: number;
  description: string;
  targetSymptom: string;
  targetSymptomLabel: string;
}

export interface InsightsData {
  velocity: VelocityInsight | null;
  radarCurrent: RadarDataset;
  radarBaseline: RadarDataset;
  radarLabels: string[];
  factorImpacts: FactorImpact[];
  trendData: { date: string; value: number }[];
  baselineTrendData: { date: string; value: number }[];
  targetSymptom: string;
  targetSymptomLabel: string;
}

function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

function getSymptomValue(log: LogEntry, field: string): number | undefined {
  const symptomValue = log.symptoms[field as keyof typeof log.symptoms];
  if (symptomValue !== undefined) return symptomValue;
  if (log.customValues && log.customValues[field] !== undefined) {
    return log.customValues[field];
  }
  return undefined;
}

function convertLifestyleToNumber(value: string, field: string): number {
  if (field === 'sleep') {
    if (value === '<6h') return 5;
    if (value === '6-7h') return 6.5;
    if (value === '7-8h') return 7.5;
    if (value === '>8h') return 8.5;
  }
  if (field === 'exercise') {
    if (value === 'rest') return 1;
    if (value === 'light') return 3;
    if (value === 'moderate') return 6;
    if (value === 'intense') return 9;
  }
  if (field === 'diet') {
    if (value === 'balanced') return 8;
    if (value === 'cravings') return 4;
    if (value === 'restrictive') return 3;
  }
  return 5;
}

function convertPsychToNumber(value: string | number, field: string): number {
  if (typeof value === 'number') return value;
  if (field === 'stress') {
    if (value === 'low') return 3;
    if (value === 'medium') return 5;
    if (value === 'high') return 8;
  }
  if (field === 'anxiety') {
    if (value === 'none') return 0;
    if (value === 'low') return 3;
    if (value === 'high') return 8;
  }
  if (field === 'bodyImage') {
    if (value === 'positive') return 8;
    if (value === 'neutral') return 5;
    if (value === 'negative') return 2;
  }
  return 5;
}

async function calculateInsights(category: InsightCategory, days: number): Promise<InsightsData> {
  const logs = await getLastNDays(days * 2);
  const targetSymptomInfo = getTargetSymptomForCategory(category);

  if (logs.length < 3) {
    return {
      velocity: null,
      radarCurrent: { label: 'Current', data: [] },
      radarBaseline: { label: 'Baseline', data: [] },
      radarLabels: [],
      factorImpacts: [],
      trendData: [],
      baselineTrendData: [],
      targetSymptom: targetSymptomInfo.metric,
      targetSymptomLabel: targetSymptomInfo.label
    };
  }

  const sortedLogs = logs.sort((a, b) => a.date.localeCompare(b.date));
  const midpoint = Math.floor(sortedLogs.length / 2);
  const baselineLogs = sortedLogs.slice(0, midpoint);
  const currentLogs = sortedLogs.slice(midpoint);

  let mainMetric: string;
  let radarMetrics: string[];
  let radarLabels: string[];

  if (category === 'hyperandrogenism') {
    mainMetric = 'acne';
    radarMetrics = ['acne', 'hirsutism', 'hairLoss', 'bloat', 'cramps'];
    radarLabels = ['Acne', 'Hirsutism', 'Hair Loss', 'Bloat', 'Cramps'];
  } else if (category === 'metabolic') {
    mainMetric = 'sleep';
    radarMetrics = ['sleep', 'exercise', 'diet', 'waterIntake'];
    radarLabels = ['Sleep', 'Exercise', 'Diet', 'Water'];
  } else if (category === 'psych') {
    mainMetric = 'mood';
    radarMetrics = ['mood', 'stress', 'anxiety', 'bodyImage'];
    radarLabels = ['Mood', 'Stress', 'Anxiety', 'Body Image'];
  } else {
    mainMetric = 'acne';
    radarMetrics = ['acne', 'mood', 'sleep', 'exercise'];
    radarLabels = ['Physical', 'Mood', 'Sleep', 'Exercise'];
  }

  const getMetricValue = (log: LogEntry, metric: string): number | undefined => {
    if (['acne', 'hirsutism', 'hairLoss', 'bloat', 'cramps'].includes(metric)) {
      return getSymptomValue(log, metric);
    }
    if (['sleep', 'exercise', 'diet'].includes(metric)) {
      const val = log.lifestyle[metric as keyof typeof log.lifestyle];
      if (typeof val === 'string') return convertLifestyleToNumber(val, metric);
      return val as number;
    }
    if (['mood', 'stress', 'anxiety', 'bodyImage'].includes(metric)) {
      const val = log.psych[metric as keyof typeof log.psych];
      if (val !== undefined) return convertPsychToNumber(val, metric);
    }
    if (log.customValues && log.customValues[metric] !== undefined) {
      return log.customValues[metric];
    }
    return undefined;
  };

  const baselineValues = baselineLogs
    .map(log => getMetricValue(log, mainMetric))
    .filter((v): v is number => v !== undefined);
  const currentValues = currentLogs
    .map(log => getMetricValue(log, mainMetric))
    .filter((v): v is number => v !== undefined);

  const baselineAvg = calculateAverage(baselineValues);
  const currentAvg = calculateAverage(currentValues);

  const percentChange = baselineAvg === 0 ? 0 : ((currentAvg - baselineAvg) / baselineAvg) * 100;
  const polarity = getMetricPolarity(mainMetric);

  let direction: 'improving' | 'worsening' | 'stable';
  if (Math.abs(percentChange) < 5) {
    direction = 'stable';
  } else if (polarity === 'direct') {
    direction = percentChange > 0 ? 'improving' : 'worsening';
  } else {
    direction = percentChange < 0 ? 'improving' : 'worsening';
  }

  const velocity: VelocityInsight = {
    value: Math.abs(Math.round(percentChange)),
    direction,
    symptomName: radarLabels[0],
    percentChange: Math.round(percentChange),
    polarity
  };

  const radarCurrentData = radarMetrics.map(metric => {
    const values = currentLogs
      .map(log => getMetricValue(log, metric))
      .filter((v): v is number => v !== undefined);
    return calculateAverage(values);
  });

  const radarBaselineData = radarMetrics.map(metric => {
    const values = baselineLogs
      .map(log => getMetricValue(log, metric))
      .filter((v): v is number => v !== undefined);
    return calculateAverage(values);
  });

  const factorImpacts: FactorImpact[] = [];
  const targetMetric = targetSymptomInfo.metric;

  const goodSleepLogs = currentLogs.filter(log => {
    const sleep = log.lifestyle.sleep;
    return sleep === '7-8h' || sleep === '>8h';
  });
  const poorSleepLogs = currentLogs.filter(log => {
    const sleep = log.lifestyle.sleep;
    return sleep === '<6h' || sleep === '6-7h';
  });

  if (goodSleepLogs.length > 0 && poorSleepLogs.length > 0) {
    const goodSleepSymptoms = calculateAverage(
      goodSleepLogs.map(log => getMetricValue(log, targetMetric) || 0)
    );
    const poorSleepSymptoms = calculateAverage(
      poorSleepLogs.map(log => getMetricValue(log, targetMetric) || 0)
    );
    const impact = poorSleepSymptoms === 0 ? 0 : ((poorSleepSymptoms - goodSleepSymptoms) / poorSleepSymptoms) * 100;
    if (Math.abs(impact) > 5) {
      const polarity = getMetricPolarity(targetMetric);
      const effectiveImpact = polarity === 'direct' ? -impact : impact;
      factorImpacts.push({
        factor: 'Good Sleep',
        impact: Math.round(effectiveImpact),
        description: effectiveImpact > 0 ? `Improves ${targetSymptomInfo.label}` : `Worsens ${targetSymptomInfo.label}`,
        targetSymptom: targetMetric,
        targetSymptomLabel: targetSymptomInfo.label
      });
    }
  }

  const exerciseLogs = currentLogs.filter(log => {
    const ex = log.lifestyle.exercise;
    return ex === 'moderate' || ex === 'intense';
  });
  const restLogs = currentLogs.filter(log => log.lifestyle.exercise === 'rest');

  if (exerciseLogs.length > 0 && restLogs.length > 0) {
    const exerciseSymptoms = calculateAverage(
      exerciseLogs.map(log => getMetricValue(log, targetMetric) || 0)
    );
    const restSymptoms = calculateAverage(
      restLogs.map(log => getMetricValue(log, targetMetric) || 0)
    );
    const impact = restSymptoms === 0 ? 0 : ((restSymptoms - exerciseSymptoms) / restSymptoms) * 100;
    if (Math.abs(impact) > 5) {
      const polarity = getMetricPolarity(targetMetric);
      const effectiveImpact = polarity === 'direct' ? -impact : impact;
      factorImpacts.push({
        factor: 'Regular Exercise',
        impact: Math.round(effectiveImpact),
        description: effectiveImpact > 0 ? `Improves ${targetSymptomInfo.label}` : `Worsens ${targetSymptomInfo.label}`,
        targetSymptom: targetMetric,
        targetSymptomLabel: targetSymptomInfo.label
      });
    }
  }

  const balancedDietLogs = currentLogs.filter(log => log.lifestyle.diet === 'balanced');
  const cravingsDietLogs = currentLogs.filter(log => log.lifestyle.diet === 'cravings');

  if (balancedDietLogs.length > 0 && cravingsDietLogs.length > 0) {
    const balancedSymptoms = calculateAverage(
      balancedDietLogs.map(log => getMetricValue(log, targetMetric) || 0)
    );
    const cravingsSymptoms = calculateAverage(
      cravingsDietLogs.map(log => getMetricValue(log, targetMetric) || 0)
    );
    const impact = cravingsSymptoms === 0 ? 0 : ((cravingsSymptoms - balancedSymptoms) / cravingsSymptoms) * 100;
    if (Math.abs(impact) > 5) {
      const polarity = getMetricPolarity(targetMetric);
      const effectiveImpact = polarity === 'direct' ? -impact : impact;
      factorImpacts.push({
        factor: 'Balanced Diet',
        impact: Math.round(effectiveImpact),
        description: effectiveImpact > 0 ? `Improves ${targetSymptomInfo.label}` : `Worsens ${targetSymptomInfo.label}`,
        targetSymptom: targetMetric,
        targetSymptomLabel: targetSymptomInfo.label
      });
    }
  }

  const lowStressLogs = currentLogs.filter(log => {
    const stress = log.psych.stress;
    return stress === 'low';
  });
  const highStressLogs = currentLogs.filter(log => {
    const stress = log.psych.stress;
    return stress === 'high' || stress === 'medium';
  });

  if (lowStressLogs.length > 0 && highStressLogs.length > 0) {
    const lowStressSymptoms = calculateAverage(
      lowStressLogs.map(log => getMetricValue(log, targetMetric) || 0)
    );
    const highStressSymptoms = calculateAverage(
      highStressLogs.map(log => getMetricValue(log, targetMetric) || 0)
    );
    const impact = highStressSymptoms === 0 ? 0 : ((highStressSymptoms - lowStressSymptoms) / highStressSymptoms) * 100;
    if (Math.abs(impact) > 5) {
      const polarity = getMetricPolarity(targetMetric);
      const effectiveImpact = polarity === 'direct' ? -impact : impact;
      factorImpacts.push({
        factor: 'Low Stress',
        impact: Math.round(effectiveImpact),
        description: effectiveImpact > 0 ? `Improves ${targetSymptomInfo.label}` : `Worsens ${targetSymptomInfo.label}`,
        targetSymptom: targetMetric,
        targetSymptomLabel: targetSymptomInfo.label
      });
    }
  }

  factorImpacts.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

  const trendData = currentLogs.map(log => ({
    date: log.date,
    value: getMetricValue(log, mainMetric) || 0
  }));

  const baselineTrendData = baselineLogs.map(log => ({
    date: log.date,
    value: getMetricValue(log, mainMetric) || 0
  }));

  return {
    velocity,
    radarCurrent: { label: 'Current', data: radarCurrentData },
    radarBaseline: { label: 'Baseline', data: radarBaselineData },
    radarLabels,
    factorImpacts: factorImpacts.slice(0, 3),
    trendData,
    baselineTrendData,
    targetSymptom: targetSymptomInfo.metric,
    targetSymptomLabel: targetSymptomInfo.label
  };
}

export function useCategoryInsights(category: InsightCategory, days: number) {
  const [insights, setInsights] = useState<InsightsData>({
    velocity: null,
    radarCurrent: { label: 'Current', data: [] },
    radarBaseline: { label: 'Baseline', data: [] },
    radarLabels: [],
    factorImpacts: [],
    trendData: [],
    baselineTrendData: [],
    targetSymptom: '',
    targetSymptomLabel: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      setLoading(true);
      const data = await calculateInsights(category, days);
      setInsights(data);
      setLoading(false);
    };

    loadInsights();
  }, [category, days]);

  return { insights, loading };
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<AchievementData>({
    totalStreak: 0,
    totalLogs: 0,
    badges: [],
    nextBadge: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAchievements = async () => {
      setLoading(true);
      const data = await calculateAchievements();
      setAchievements(data);
      setLoading(false);
    };

    loadAchievements();
  }, []);

  const refresh = async () => {
    const data = await calculateAchievements();
    setAchievements(data);
  };

  return { achievements, loading, refresh };
}
