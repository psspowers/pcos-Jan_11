import React, { useState, useEffect } from 'react';
import { DailyLog as DailyLogType, saveLog, getLogByDate } from '@/lib/storage';
import { SymptomSlider, ToggleGroup } from './SymptomSlider';
import { LifestyleSection } from './LifestyleLog';
import { GoalTips } from './GoalTips';
import { WelcomeHero } from './WelcomeHero';
import { QuickStats } from './QuickStats';
import { Droplet, Frown, Sparkles, Wind, Cookie, Brain, Zap, Check, Scissors } from 'lucide-react';

const today = () => new Date().toISOString().split('T')[0];

const defaultLog = (): DailyLogType => ({
  date: today(),
  cycleStatus: 'none',
  symptoms: { cramps: 1, acne: 1, hairLoss: 1, facialHair: 1, bloating: 1, cravings: 1, moodSwings: 1, energy: 3, sleepQuality: 3 },
  lifestyle: { sleepHours: 7, activity: 'light', sugarIntake: 'medium', hydrationMet: false, stressLevel: 3 }
});

export const DailyLogFull: React.FC = () => {
  const [date, setDate] = useState(today());
  const [log, setLog] = useState<DailyLogType>(defaultLog());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = getLogByDate(date);
    setLog(existing || { ...defaultLog(), date });
    setSaved(!!existing);
  }, [date]);

  const save = (updated: DailyLogType) => {
    setLog(updated);
    saveLog(updated);
    setSaved(true);
  };

  const updateSymptom = (key: keyof DailyLogType['symptoms'], val: number) => {
    save({ ...log, symptoms: { ...log.symptoms, [key]: val } });
  };

  const updateLifestyle = (key: keyof DailyLogType['lifestyle'], val: any) => {
    save({ ...log, lifestyle: { ...log.lifestyle, [key]: val } });
  };

  return (
    <div className="space-y-5">
      <WelcomeHero />
      <QuickStats />
      <GoalTips />
      
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-sage-800">Log for Today</h2>
        <div className="flex items-center gap-2">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} max={today()}
            className="px-3 py-2 rounded-lg border border-sage-200 text-sage-700 text-sm" />
          {saved && <Check className="w-5 h-5 text-sage-600" />}
        </div>
      </div>

      <ToggleGroup label="Cycle Status" icon={<Droplet className="w-5 h-5" />}
        options={[{ value: 'period', label: 'Period' }, { value: 'spotting', label: 'Spotting' }, { value: 'none', label: 'None' }]}
        selected={log.cycleStatus} onChange={v => save({ ...log, cycleStatus: v as any })} />

      <div className="space-y-3">
        <h3 className="font-semibold text-sage-700">Symptoms</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <SymptomSlider label="Cramps" icon={<Frown className="w-5 h-5" />} value={log.symptoms.cramps} onChange={v => updateSymptom('cramps', v)} />
          <SymptomSlider label="Acne" icon={<Sparkles className="w-5 h-5" />} value={log.symptoms.acne} onChange={v => updateSymptom('acne', v)} />
          <SymptomSlider label="Hair Loss" icon={<Wind className="w-5 h-5" />} value={log.symptoms.hairLoss} onChange={v => updateSymptom('hairLoss', v)} />
          <SymptomSlider label="Facial Hair" icon={<Scissors className="w-5 h-5" />} value={log.symptoms.facialHair} onChange={v => updateSymptom('facialHair', v)} />
          <SymptomSlider label="Bloating" icon={<Wind className="w-5 h-5" />} value={log.symptoms.bloating} onChange={v => updateSymptom('bloating', v)} />
          <SymptomSlider label="Cravings" icon={<Cookie className="w-5 h-5" />} value={log.symptoms.cravings} onChange={v => updateSymptom('cravings', v)} />
          <SymptomSlider label="Mood" icon={<Brain className="w-5 h-5" />} value={log.symptoms.moodSwings} onChange={v => updateSymptom('moodSwings', v)} />
          <SymptomSlider label="Energy" icon={<Zap className="w-5 h-5" />} value={log.symptoms.energy} onChange={v => updateSymptom('energy', v)} />
        </div>
      </div>

      <LifestyleSection log={log} onUpdate={updateLifestyle} />
    </div>
  );
};
