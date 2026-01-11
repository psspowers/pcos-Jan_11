import { db, DailyLog } from './db';
import { subDays, format } from 'date-fns';

export const generateSampleHyperandrogenismData = async (days: number = 60) => {
  const logs: DailyLog[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = subDays(today, days - i - 1);
    const dateStr = format(date, 'yyyy-MM-dd');

    const dayIndex = i;
    const weekProgress = (dayIndex % 30) / 30;

    const baseAcne = 6 - (weekProgress * 2);
    const baseHirsutism = 5 - (weekProgress * 1.5);
    const baseHairLoss = 4 - (weekProgress * 1);

    const sleepQuality = Math.min(10, 5 + Math.floor(weekProgress * 4) + Math.random() * 2);
    const waterIntake = Math.min(12, 6 + Math.floor(weekProgress * 3) + Math.random() * 2);
    const exerciseMinutes = Math.min(60, 15 + Math.floor(weekProgress * 30) + Math.random() * 15);
    const stress = Math.max(1, 7 - Math.floor(weekProgress * 4) + Math.random() * 2);

    const log: DailyLog = {
      date: dateStr,
      cycleFlow: 'none',
      hyperandrogenism: {
        acne: Math.max(0, Math.min(10, baseAcne + (Math.random() * 2 - 1))),
        hirsutism: Math.max(0, Math.min(10, baseHirsutism + (Math.random() * 2 - 1))),
        hairLoss: Math.max(0, Math.min(10, baseHairLoss + (Math.random() * 2 - 1)))
      },
      metabolic: {
        bloating: Math.floor(Math.random() * 5),
        cravings: Math.floor(Math.random() * 5),
        eatingPattern: 'balanced'
      },
      psychological: {
        anxiety: Math.floor(Math.random() * 5) + 2,
        depression: Math.floor(Math.random() * 4) + 1,
        bodyImage: Math.max(0, Math.min(10, 5 + weekProgress * 3 + (Math.random() * 2 - 1))),
        stress: Math.max(0, Math.min(10, stress)),
        sleepQuality: Math.max(0, Math.min(10, sleepQuality))
      },
      lifestyle: {
        waterIntake: Math.floor(waterIntake),
        exerciseMinutes: Math.floor(exerciseMinutes),
        sleepHours: Math.max(4, Math.min(10, 6 + weekProgress * 2 + (Math.random() * 1.5 - 0.75)))
      }
    };

    logs.push(log);
  }

  await db.dailyLogs.bulkPut(logs);

  return logs.length;
};

export const clearSampleData = async () => {
  await db.dailyLogs.clear();
};
