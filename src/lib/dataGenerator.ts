import { db, DailyLog } from './db';

export const generate30DaysOfData = async (): Promise<void> => {
  const today = new Date();
  const logs: DailyLog[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];

    const dayInCycle = 29 - i;

    const isPeriod = dayInCycle >= 0 && dayInCycle <= 4;
    const isOvulation = dayInCycle >= 12 && dayInCycle <= 15;
    const isPMS = dayInCycle >= 26 && dayInCycle <= 29;

    const sineBase = Math.sin(i / 4.5);
    const cosineBase = Math.cos(i / 5);

    const anxietyBase = 1 + Math.abs(sineBase) * 2;
    let anxiety = anxietyBase;
    if (isPeriod) anxiety += 1.2;
    if (isPMS) anxiety += 1.8;
    if (isOvulation) anxiety -= 0.8;
    anxiety = Math.max(0, Math.min(5, anxiety));

    const stressBase = 1.5 + Math.abs(cosineBase) * 1.8;
    let stress = stressBase;
    if (isPeriod) stress += 0.8;
    if (isPMS) stress += 1.5;
    if (isOvulation) stress -= 0.5;
    stress = Math.max(0, Math.min(5, stress));

    let depression = 0.8 + Math.abs(Math.sin(i / 3.5)) * 2;
    if (isPMS) depression += 1.5;
    if (isPeriod) depression += 0.8;
    if (isOvulation) depression -= 0.8;
    depression = Math.max(0, Math.min(5, depression));

    let sleepQuality = 3.5 - Math.abs(Math.sin(i / 4)) * 1.5;
    if (isPMS) sleepQuality -= 1.2;
    if (isPeriod) sleepQuality -= 0.6;
    if (isOvulation) sleepQuality += 0.8;
    sleepQuality = Math.max(1, Math.min(5, sleepQuality));

    let bodyImage = 3 + Math.sin(i / 3) * 1;
    if (isPMS) bodyImage -= 1.5;
    if (isPeriod) bodyImage -= 0.8;
    if (isOvulation) bodyImage += 0.8;
    bodyImage = Math.max(1, Math.min(5, bodyImage));

    let bloating = Math.abs(Math.sin(i / 3)) * 2;
    if (isPMS) bloating += 2;
    if (isPeriod) bloating += 1.5;
    if (isOvulation) bloating = Math.max(0, bloating - 1);
    bloating = Math.max(0, Math.min(5, bloating));

    let cravings = Math.abs(Math.cos(i / 4)) * 2;
    if (isPMS) cravings += 2.5;
    if (isPeriod) cravings += 1;
    cravings = Math.max(0, Math.min(5, cravings));

    const cycleFlow = isPeriod
      ? dayInCycle === 0 || dayInCycle === 4
        ? 'light'
        : dayInCycle === 1 || dayInCycle === 3
        ? 'moderate'
        : 'heavy'
      : 'none';

    const acne = Math.max(0, Math.min(5, 1 + Math.abs(Math.sin(i / 6)) * 2 + (isPMS ? 1.5 : 0)));
    const hirsutism = Math.max(0, Math.min(5, 1.5 + Math.abs(Math.cos(i / 8)) * 1));
    const hairLoss = Math.max(0, Math.min(5, 0.5 + Math.abs(Math.sin(i / 7)) * 1.5));

    logs.push({
      date: dateString,
      cycleFlow: cycleFlow as 'none' | 'spotting' | 'light' | 'moderate' | 'heavy',
      hyperandrogenism: {
        hirsutism: Math.round(hirsutism * 10) / 10,
        acne: Math.round(acne * 10) / 10,
        hairLoss: Math.round(hairLoss * 10) / 10
      },
      metabolic: {
        bloating: Math.round(bloating * 10) / 10,
        cravings: Math.round(cravings * 10) / 10,
        eatingPattern: isPMS || isPeriod ? 'binge' : isOvulation ? 'balanced' : 'balanced'
      },
      psychological: {
        anxiety: Math.round(anxiety * 10) / 10,
        depression: Math.round(depression * 10) / 10,
        bodyImage: Math.round(bodyImage * 10) / 10,
        stress: Math.round(stress * 10) / 10,
        sleepQuality: Math.round(sleepQuality * 10) / 10
      }
    });
  }

  await db.dailyLogs.bulkPut(logs);

  const plantState = await db.plantState.get('primary');
  if (plantState) {
    await db.plantState.update('primary', {
      totalLogs: 30,
      currentStreak: 30,
      lastLogDate: logs[logs.length - 1].date,
      health: 95
    });
  }
};
