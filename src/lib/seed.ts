import { db, LogEntry } from './db';
import { format, subDays } from 'date-fns';

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRecoveryDay(daysAgo: number): LogEntry {
  return {
    date: format(subDays(new Date(), daysAgo), 'yyyy-MM-dd'),
    cyclePhase: 'follicular',
    symptoms: {
      acne: randomInRange(1, 3),
      hirsutism: randomInRange(2, 4),
      hairLoss: randomInRange(1, 3),
      bloat: randomInRange(1, 2),
      cramps: randomInRange(0, 2)
    },
    psych: {
      stress: randomInRange(2, 3),
      bodyImage: randomInRange(6, 8),
      mood: randomInRange(7, 9),
      anxiety: randomInRange(1, 3)
    },
    lifestyle: {
      sleepHours: randomInRange(7, 8),
      waterIntake: randomInRange(8, 10),
      exerciseIntensity: randomInRange(5, 7),
      dietQuality: randomInRange(6, 8)
    }
  };
}

function generateCrashDay(daysAgo: number): LogEntry {
  return {
    date: format(subDays(new Date(), daysAgo), 'yyyy-MM-dd'),
    cyclePhase: 'menstrual',
    symptoms: {
      acne: randomInRange(6, 8),
      hirsutism: randomInRange(5, 7),
      hairLoss: randomInRange(5, 7),
      bloat: randomInRange(7, 9),
      cramps: randomInRange(6, 9)
    },
    psych: {
      stress: randomInRange(7, 9),
      bodyImage: randomInRange(2, 4),
      mood: randomInRange(2, 4),
      anxiety: randomInRange(7, 9)
    },
    lifestyle: {
      sleepHours: randomInRange(4, 5),
      waterIntake: randomInRange(3, 5),
      exerciseIntensity: randomInRange(1, 3),
      dietQuality: randomInRange(2, 4)
    }
  };
}

function generateBaselineDay(daysAgo: number): LogEntry {
  const phases: Array<'follicular' | 'ovulatory' | 'luteal'> = ['follicular', 'ovulatory', 'luteal'];
  const phase = phases[Math.floor(Math.random() * phases.length)];

  return {
    date: format(subDays(new Date(), daysAgo), 'yyyy-MM-dd'),
    cyclePhase: phase,
    symptoms: {
      acne: randomInRange(3, 6),
      hirsutism: randomInRange(3, 6),
      hairLoss: randomInRange(3, 5),
      bloat: randomInRange(3, 6),
      cramps: randomInRange(2, 6)
    },
    psych: {
      stress: randomInRange(4, 6),
      bodyImage: randomInRange(4, 6),
      mood: randomInRange(4, 6),
      anxiety: randomInRange(3, 6)
    },
    lifestyle: {
      sleepHours: randomInRange(6, 7),
      waterIntake: randomInRange(5, 8),
      exerciseIntensity: randomInRange(3, 6),
      dietQuality: randomInRange(4, 6)
    }
  };
}

export async function seedDatabase(): Promise<void> {
  const existingLogs = await db.logs.count();

  if (existingLogs > 0) {
    console.log('Database already has data. Skipping seed.');
    return;
  }

  const syntheticData: LogEntry[] = [];

  for (let daysAgo = 1; daysAgo <= 7; daysAgo++) {
    syntheticData.push(generateRecoveryDay(daysAgo));
  }

  for (let daysAgo = 8; daysAgo <= 14; daysAgo++) {
    syntheticData.push(generateCrashDay(daysAgo));
  }

  for (let daysAgo = 15; daysAgo <= 30; daysAgo++) {
    syntheticData.push(generateBaselineDay(daysAgo));
  }

  await db.logs.bulkAdd(syntheticData);

  console.log(`✅ Seeded ${syntheticData.length} days of synthetic data`);
  console.log('📊 Data Narrative:');
  console.log('  Days 1-7: Recovery (Low stress, High sleep)');
  console.log('  Days 8-14: The Crash (High stress, Low sleep)');
  console.log('  Days 15-30: Baseline (Mixed data)');
}
