import Dexie, { Table } from 'dexie';

export interface DailyLog {
  date: string;
  cycleFlow: 'none' | 'spotting' | 'light' | 'moderate' | 'heavy';

  hyperandrogenism: {
    hirsutism: number;
    acne: number;
    hairLoss: number;
  };

  metabolic: {
    weight?: number;
    bloating: number;
    cravings: number;
    eatingPattern: 'balanced' | 'binge' | 'restrict' | 'not-tracked';
  };

  psychological: {
    anxiety: number;
    depression: number;
    bodyImage: number;
    stress: number;
    sleepQuality: number;
  };

  customMetrics?: Array<{
    name: string;
    value: number;
  }>;
}

export interface PlantState {
  id: string;
  name: string;
  currentStreak: number;
  totalLogs: number;
  lastLogDate: string | null;
  unlockedFeatures: string[];
  health: number;
}

export interface UserProfile {
  id: string;
  age?: number;
  diagnosisYear?: number;
  primaryGoal: 'hormonal' | 'metabolic' | 'mental' | 'fertility';
  onboardingComplete: boolean;
  reminderEnabled: boolean;
  reminderTime?: string;
}

export class BlossomDB extends Dexie {
  dailyLogs!: Table<DailyLog, string>;
  plantState!: Table<PlantState, string>;
  userProfile!: Table<UserProfile, string>;

  constructor() {
    super('BlossomMonashDB');

    this.version(1).stores({
      dailyLogs: 'date',
      plantState: 'id',
      userProfile: 'id'
    });
  }
}

export const db = new BlossomDB();

export const getDefaultLog = (date: string): DailyLog => ({
  date,
  cycleFlow: 'none',
  hyperandrogenism: {
    hirsutism: 0,
    acne: 0,
    hairLoss: 0
  },
  metabolic: {
    bloating: 0,
    cravings: 0,
    eatingPattern: 'not-tracked'
  },
  psychological: {
    anxiety: 0,
    depression: 0,
    bodyImage: 3,
    stress: 0,
    sleepQuality: 3
  }
});

export const getDefaultPlantState = (): PlantState => ({
  id: 'primary',
  name: 'Your Companion',
  currentStreak: 0,
  totalLogs: 0,
  lastLogDate: null,
  unlockedFeatures: [],
  health: 50
});

export const getDefaultProfile = (): UserProfile => ({
  id: 'primary',
  primaryGoal: 'hormonal',
  onboardingComplete: false,
  reminderEnabled: false
});

export const calculateStreak = async (): Promise<number> => {
  const logs = await db.dailyLogs.orderBy('date').reverse().toArray();

  if (logs.length === 0) return 0;

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < logs.length; i++) {
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);
    const expectedDateStr = expectedDate.toISOString().split('T')[0];

    if (logs[i].date === expectedDateStr) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export const updatePlantState = async (): Promise<void> => {
  const streak = await calculateStreak();
  const totalLogs = await db.dailyLogs.count();
  const logs = await db.dailyLogs.orderBy('date').reverse().limit(1).toArray();
  const lastLogDate = logs.length > 0 ? logs[0].date : null;

  let health = 50;
  if (streak >= 90) health = 100;
  else if (streak >= 60) health = 95;
  else if (streak >= 30) health = 85;
  else if (streak >= 14) health = 75;
  else if (streak >= 7) health = 65;
  else if (streak >= 3) health = 55;
  else if (streak > 0) health = 50 + (streak * 2);

  const unlockedFeatures: string[] = [];
  if (streak >= 1) unlockedFeatures.push('stem');
  if (streak >= 3) unlockedFeatures.push('firstLeaf');
  if (streak >= 7) unlockedFeatures.push('secondLeaf');
  if (streak >= 14) unlockedFeatures.push('branches');
  if (streak >= 30) unlockedFeatures.push('flower');
  if (streak >= 60) unlockedFeatures.push('fruit');

  await db.plantState.put({
    id: 'primary',
    name: (await db.plantState.get('primary'))?.name || 'Your Companion',
    currentStreak: streak,
    totalLogs,
    lastLogDate,
    unlockedFeatures,
    health
  });
};

export const exportAllData = async (): Promise<string> => {
  const logs = await db.dailyLogs.toArray();
  const plant = await db.plantState.get('primary');
  const profile = await db.userProfile.get('primary');

  return JSON.stringify({
    exportDate: new Date().toISOString(),
    profile,
    plant,
    logs
  }, null, 2);
};

export const deleteAllData = async (): Promise<void> => {
  await db.dailyLogs.clear();
  await db.plantState.clear();
  await db.userProfile.clear();
};

export const initializeApp = async (): Promise<void> => {
  const profile = await db.userProfile.get('primary');
  if (!profile) {
    await db.userProfile.add(getDefaultProfile());
  }

  const plant = await db.plantState.get('primary');
  if (!plant) {
    await db.plantState.add(getDefaultPlantState());
  }
};
