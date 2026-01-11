import { DailyLog } from './db';

export interface VelocityResult {
  slope: number;
  trend: 'improving' | 'stable' | 'worsening';
  changePerWeek: number;
}

export const calculateVelocity = (
  currentData: number[],
  pastData: number[]
): VelocityResult => {
  if (currentData.length === 0 && pastData.length === 0) {
    return { slope: 0, trend: 'stable', changePerWeek: 0 };
  }

  const currentAvg = currentData.length > 0
    ? currentData.reduce((sum, val) => sum + val, 0) / currentData.length
    : 0;

  const pastAvg = pastData.length > 0
    ? pastData.reduce((sum, val) => sum + val, 0) / pastData.length
    : currentAvg;

  const slope = linearRegressionSlope(currentData);
  const changePerWeek = ((currentAvg - pastAvg) / pastData.length) * 7;

  let trend: 'improving' | 'stable' | 'worsening' = 'stable';

  if (Math.abs(changePerWeek) < 0.3) {
    trend = 'stable';
  } else if (changePerWeek < 0) {
    trend = 'improving';
  } else {
    trend = 'worsening';
  }

  return {
    slope,
    trend,
    changePerWeek: Math.abs(changePerWeek)
  };
};

const linearRegressionSlope = (data: number[]): number => {
  if (data.length < 2) return 0;

  const n = data.length;
  const xMean = (n - 1) / 2;
  const yMean = data.reduce((sum, val) => sum + val, 0) / n;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (i - xMean) * (data[i] - yMean);
    denominator += (i - xMean) ** 2;
  }

  return denominator === 0 ? 0 : numerator / denominator;
};

export interface FactorImpact {
  factor: string;
  improvementPercent: number;
  avgWhenHigh: number;
  avgWhenLow: number;
  sampleSizeHigh: number;
  sampleSizeLow: number;
}

export const calculateFactorImpact = (
  logs: DailyLog[],
  symptom: 'acne' | 'hirsutism' | 'hairLoss',
  factor: 'sleepQuality' | 'stress' | 'waterIntake' | 'exerciseMinutes',
  threshold: number
): FactorImpact => {
  const highFactorLogs: number[] = [];
  const lowFactorLogs: number[] = [];

  logs.forEach(log => {
    const symptomValue = log.hyperandrogenism[symptom];
    let factorValue: number = 0;

    if (factor === 'sleepQuality' || factor === 'stress') {
      factorValue = log.psychological[factor];
    } else if (factor === 'waterIntake' || factor === 'exerciseMinutes') {
      factorValue = log.lifestyle?.[factor] ?? 0;
    }

    if (factorValue >= threshold) {
      highFactorLogs.push(symptomValue);
    } else {
      lowFactorLogs.push(symptomValue);
    }
  });

  const avgWhenHigh = highFactorLogs.length > 0
    ? highFactorLogs.reduce((sum, val) => sum + val, 0) / highFactorLogs.length
    : 0;

  const avgWhenLow = lowFactorLogs.length > 0
    ? lowFactorLogs.reduce((sum, val) => sum + val, 0) / lowFactorLogs.length
    : 0;

  const improvementPercent = avgWhenLow > 0
    ? ((avgWhenLow - avgWhenHigh) / avgWhenLow) * 100
    : 0;

  return {
    factor,
    improvementPercent,
    avgWhenHigh,
    avgWhenLow,
    sampleSizeHigh: highFactorLogs.length,
    sampleSizeLow: lowFactorLogs.length
  };
};

export const getFactorLabel = (factor: string): string => {
  const labels: Record<string, string> = {
    sleepQuality: 'Sleep Quality',
    stress: 'Stress Management',
    waterIntake: 'Water Intake',
    exerciseMinutes: 'Exercise'
  };
  return labels[factor] || factor;
};
