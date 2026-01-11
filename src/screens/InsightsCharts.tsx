import React from 'react';
import { DailyLog } from '@/lib/storage';
import { Lightbulb, TrendingUp, TrendingDown } from 'lucide-react';

interface Props { logs: DailyLog[]; }

export const CycleChart: React.FC<Props> = ({ logs }) => {
  const periodDays = logs.filter(l => l.cycleStatus === 'period').map(l => l.date).sort();
  const cycles: { start: string; length: number }[] = [];
  
  let cycleStart = periodDays[0];
  for (let i = 1; i < periodDays.length; i++) {
    const diff = (new Date(periodDays[i]).getTime() - new Date(periodDays[i-1]).getTime()) / (1000 * 60 * 60 * 24);
    if (diff > 5) {
      const length = (new Date(periodDays[i]).getTime() - new Date(cycleStart).getTime()) / (1000 * 60 * 60 * 24);
      if (length > 15 && length < 90) cycles.push({ start: cycleStart, length: Math.round(length) });
      cycleStart = periodDays[i];
    }
  }

  const maxCycle = Math.max(...cycles.map(c => c.length), 35);
  const last6 = cycles.slice(-6);

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-sage-100">
      <h3 className="font-semibold text-sage-800 mb-4">Cycle Length Trend</h3>
      {last6.length > 0 ? (
        <>
          <div className="flex items-end gap-3 h-28 mb-2">
            {last6.map((c, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <span className="text-xs text-sage-600 mb-1 font-medium">{c.length}d</span>
                <div 
                  className="w-full bg-gradient-to-t from-sage-600 to-sage-400 rounded-t-lg transition-all"
                  style={{ height: `${(c.length / maxCycle) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-sage-500 text-center">Last {last6.length} cycles</p>
        </>
      ) : (
        <div className="text-center py-6">
          <p className="text-sage-500 text-sm">Log period days to see cycle trends</p>
          <p className="text-sage-400 text-xs mt-1">Mark "Period" on your cycle status when bleeding</p>
        </div>
      )}
    </div>
  );
};

export const SymptomHeatmap: React.FC<Props> = ({ logs }) => {
  const last14 = logs.slice(-14);
  const symptoms = ['cramps', 'acne', 'bloating', 'cravings', 'moodSwings'] as const;
  const labels = ['Cramps', 'Acne', 'Bloating', 'Cravings', 'Mood'];
  const colors = ['bg-sage-100', 'bg-sage-200', 'bg-amber-200', 'bg-orange-300', 'bg-red-400'];

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-sage-100">
      <h3 className="font-semibold text-sage-800 mb-4">Symptom Heatmap</h3>
      {last14.length > 0 ? (
        <div className="space-y-2">
          {symptoms.map((sym, idx) => (
            <div key={sym} className="flex items-center gap-2">
              <span className="text-xs text-sage-600 w-16">{labels[idx]}</span>
              <div className="flex gap-1 flex-1">
                {last14.map((log, i) => (
                  <div key={i} className={`flex-1 h-5 rounded ${colors[log.symptoms[sym] - 1]}`} title={`${log.date}: ${log.symptoms[sym]}/5`} />
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-between text-xs text-sage-400 mt-2 px-16">
            <span>14 days ago</span>
            <span>Today</span>
          </div>
        </div>
      ) : (
        <p className="text-sage-500 text-sm text-center py-4">Start logging to see symptom patterns</p>
      )}
    </div>
  );
};

export const InsightCards: React.FC<Props> = ({ logs }) => {
  if (logs.length < 7) return null;

  const insights: { text: string; type: 'positive' | 'neutral' }[] = [];
  
  const goodSleep = logs.filter(l => l.lifestyle.sleepHours >= 7);
  const poorSleep = logs.filter(l => l.lifestyle.sleepHours < 7);
  
  if (goodSleep.length >= 3 && poorSleep.length >= 3) {
    const avgCravGood = goodSleep.reduce((a, l) => a + l.symptoms.cravings, 0) / goodSleep.length;
    const avgCravPoor = poorSleep.reduce((a, l) => a + l.symptoms.cravings, 0) / poorSleep.length;
    if (avgCravGood < avgCravPoor - 0.3) {
      insights.push({ text: `Days with 7+ hours sleep show ${Math.round((1 - avgCravGood/avgCravPoor) * 100)}% fewer cravings`, type: 'positive' });
    }
  }

  const active = logs.filter(l => l.lifestyle.activity !== 'none');
  const inactive = logs.filter(l => l.lifestyle.activity === 'none');
  if (active.length >= 3 && inactive.length >= 2) {
    const avgEnergyActive = active.reduce((a, l) => a + l.symptoms.energy, 0) / active.length;
    const avgEnergyInactive = inactive.reduce((a, l) => a + l.symptoms.energy, 0) / inactive.length;
    if (avgEnergyActive > avgEnergyInactive + 0.3) {
      insights.push({ text: 'Active days correlate with higher energy levels', type: 'positive' });
    }
  }

  const lowSugar = logs.filter(l => l.lifestyle.sugarIntake === 'low');
  if (lowSugar.length >= 3) {
    const avgMood = lowSugar.reduce((a, l) => a + l.symptoms.moodSwings, 0) / lowSugar.length;
    if (avgMood < 2.5) {
      insights.push({ text: 'Low sugar days show more stable mood patterns', type: 'positive' });
    }
  }

  return insights.length > 0 ? (
    <div className="space-y-3">
      <h3 className="font-semibold text-sage-700 flex items-center gap-2">
        <Lightbulb className="w-5 h-5" /> Your Insights
      </h3>
      {insights.map((ins, i) => (
        <div key={i} className="bg-gradient-to-r from-sage-50 to-peach-50 rounded-xl p-4 border border-sage-200 flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
          <p className="text-sage-700 text-sm">{ins.text}</p>
        </div>
      ))}
    </div>
  ) : null;
};
