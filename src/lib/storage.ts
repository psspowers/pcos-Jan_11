// Local storage utilities for PCOS Companion - Privacy First
export interface UserProfile {
  age?: number;
  weight?: number;
  height?: number;
  diagnosisYear?: number;
  primaryGoal: 'cycle' | 'fertility' | 'metabolic' | 'mood';
  onboardingComplete: boolean;
  reminderEnabled: boolean;
}

export interface DailyLog {
  date: string;
  cycleStatus: 'period' | 'spotting' | 'none';
  symptoms: {
    cramps: number;
    acne: number;
    hairLoss: number;
    facialHair: number;
    bloating: number;
    cravings: number;
    moodSwings: number;
    energy: number;
    sleepQuality: number;
  };
  lifestyle: {
    sleepHours: number;
    activity: 'none' | 'light' | 'moderate' | 'intense';
    sugarIntake: 'low' | 'medium' | 'high';
    hydrationMet: boolean;
    stressLevel: number;
  };
}

const PROFILE_KEY = 'pcos_profile';
const LOGS_KEY = 'pcos_logs';

export const getProfile = (): UserProfile | null => {
  const data = localStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveProfile = (profile: UserProfile): void => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const getLogs = (): DailyLog[] => {
  const data = localStorage.getItem(LOGS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveLog = (log: DailyLog): void => {
  const logs = getLogs();
  const idx = logs.findIndex(l => l.date === log.date);
  if (idx >= 0) logs[idx] = log;
  else logs.push(log);
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
};

export const getLogByDate = (date: string): DailyLog | null => {
  const logs = getLogs();
  return logs.find(l => l.date === date) || null;
};

export const exportData = (): string => {
  return JSON.stringify({ profile: getProfile(), logs: getLogs() }, null, 2);
};

export const deleteAllData = (): void => {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(LOGS_KEY);
};
