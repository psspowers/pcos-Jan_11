import React, { useState } from 'react';
import { getLogs, exportData } from '@/lib/storage';
import { triggerHaptic } from '@/lib/haptics';
import { CycleChart, SymptomHeatmap, InsightCards } from './InsightsCharts';
import { HeatmapCalendar } from './HeatmapCalendar';
import { AchievementsScreen } from './AchievementsScreen';
import { CorrelationsScreen } from './CorrelationsScreen';
import { WeeklySummary } from './WeeklySummary';
import { Download, FileText, Calendar, Zap, Moon, AlertCircle, BarChart3, Award, Lightbulb, TrendingUp } from 'lucide-react';

export const InsightsScreen: React.FC = () => {
  const [view, setView] = useState<'charts' | 'calendar' | 'achievements' | 'correlations' | 'weekly'>('weekly');
  const logs = getLogs().sort((a, b) => a.date.localeCompare(b.date));

  const handleExportCSV = () => {
    triggerHaptic('medium');
    const headers = ['Date', 'Cycle', 'Cramps', 'Acne', 'HairLoss', 'FacialHair', 'Bloating', 'Cravings', 'Mood', 'Energy', 'SleepQuality', 'SleepHrs', 'Activity', 'Sugar', 'Hydration', 'Stress'];
    const rows = logs.map(l => [
      l.date, l.cycleStatus, l.symptoms.cramps, l.symptoms.acne, l.symptoms.hairLoss, l.symptoms.facialHair,
      l.symptoms.bloating, l.symptoms.cravings, l.symptoms.moodSwings, l.symptoms.energy, l.symptoms.sleepQuality,
      l.lifestyle.sleepHours, l.lifestyle.activity, l.lifestyle.sugarIntake, l.lifestyle.hydrationMet ? 'Yes' : 'No', l.lifestyle.stressLevel
    ].join(','));
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `pcos-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleExportJSON = () => {
    triggerHaptic('medium');
    const blob = new Blob([exportData()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `pcos-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const avgEnergy = logs.length > 0 ? (logs.reduce((a, l) => a + l.symptoms.energy, 0) / logs.length).toFixed(1) : '-';
  const avgSleep = logs.length > 0 ? (logs.reduce((a, l) => a + l.lifestyle.sleepHours, 0) / logs.length).toFixed(1) : '-';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-sage-800">Insights</h2>
          <p className="text-sage-500 text-sm">Discover patterns in your data</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="flex items-center gap-1 px-3 py-2 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-2">
            <Download className="w-4 h-4" />CSV
          </button>
          <button onClick={handleExportJSON} className="flex items-center gap-1 px-3 py-2 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-2">
            <FileText className="w-4 h-4" />JSON
          </button>
        </div>
      </div>

      <div className="flex gap-2 bg-sage-100 p-1 rounded-xl overflow-x-auto">
        <button onClick={() => { triggerHaptic('light'); setView('weekly'); }} className={`flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs font-medium transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-1 ${view === 'weekly' ? 'bg-white text-sage-800 shadow-sm' : 'text-sage-600'}`}>
          <TrendingUp className="w-4 h-4" />Weekly
        </button>
        <button onClick={() => { triggerHaptic('light'); setView('calendar'); }} className={`flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs font-medium transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-1 ${view === 'calendar' ? 'bg-white text-sage-800 shadow-sm' : 'text-sage-600'}`}>
          <Calendar className="w-4 h-4" />Calendar
        </button>
        <button onClick={() => { triggerHaptic('light'); setView('achievements'); }} className={`flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs font-medium transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-1 ${view === 'achievements' ? 'bg-white text-sage-800 shadow-sm' : 'text-sage-600'}`}>
          <Award className="w-4 h-4" />Badges
        </button>
        <button onClick={() => { triggerHaptic('light'); setView('correlations'); }} className={`flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs font-medium transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-1 ${view === 'correlations' ? 'bg-white text-sage-800 shadow-sm' : 'text-sage-600'}`}>
          <Lightbulb className="w-4 h-4" />Patterns
        </button>
        <button onClick={() => { triggerHaptic('light'); setView('charts'); }} className={`flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs font-medium transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-1 ${view === 'charts' ? 'bg-white text-sage-800 shadow-sm' : 'text-sage-600'}`}>
          <BarChart3 className="w-4 h-4" />Charts
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-sage-100 text-center">
          <Calendar className="w-5 h-5 text-sage-500 mx-auto mb-1" />
          <div className="text-xl font-bold text-sage-800">{logs.length}</div>
          <div className="text-xs text-sage-500">Days</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-sage-100 text-center">
          <Zap className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <div className="text-xl font-bold text-sage-800">{avgEnergy}</div>
          <div className="text-xs text-sage-500">Energy</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-sage-100 text-center">
          <Moon className="w-5 h-5 text-purple-500 mx-auto mb-1" />
          <div className="text-xl font-bold text-sage-800">{avgSleep}h</div>
          <div className="text-xs text-sage-500">Sleep</div>
        </div>
      </div>

      {view === 'weekly' && <WeeklySummary />}
      {view === 'calendar' && <HeatmapCalendar />}
      {view === 'achievements' && <AchievementsScreen />}
      {view === 'correlations' && <CorrelationsScreen />}
      {view === 'charts' && (
        <>
          <InsightCards logs={logs} />
          <CycleChart logs={logs} />
          <SymptomHeatmap logs={logs} />
        </>
      )}

      {logs.length < 7 && (
        <div className="bg-sage-50 border border-sage-200 rounded-xl p-4 text-sm text-sage-700 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div><strong>Keep logging!</strong><p className="mt-1">Log at least 7 days to unlock personalized insights.</p></div>
        </div>
      )}
    </div>
  );
};
