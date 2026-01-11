import React, { useMemo } from 'react';
import { getLogs, DailyLog } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { TrendingUp, TrendingDown, Minus, Calendar, Zap, Moon, Droplet, Activity } from 'lucide-react';
import { GrowthIndicator } from '@/components/GrowthIndicator';

interface WeeklyStats {
  weekNumber: number;
  dateRange: string;
  logsCount: number;
  avgSymptoms: number;
  symptomTrend: 'up' | 'down' | 'stable';
  avgEnergy: number;
  avgSleep: number;
  avgCramps: number;
  topSymptom: { name: string; value: number };
  periodDays: number;
  activeLifestyle: boolean;
}

const calculateAvgSymptoms = (log: DailyLog): number => {
  const symptoms = Object.values(log.symptoms);
  return symptoms.reduce((sum, val) => sum + val, 0) / symptoms.length;
};

const getWeekNumber = (date: Date): number => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
};

export const WeeklySummary: React.FC = () => {
  const weeklyStats = useMemo(() => {
    const logs = getLogs();
    if (logs.length === 0) return [];

    const weekGroups = new Map<string, DailyLog[]>();

    logs.forEach(log => {
      const date = new Date(log.date);
      const year = date.getFullYear();
      const week = getWeekNumber(date);
      const key = `${year}-W${week}`;

      if (!weekGroups.has(key)) {
        weekGroups.set(key, []);
      }
      weekGroups.get(key)!.push(log);
    });

    const stats: WeeklyStats[] = [];

    Array.from(weekGroups.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 8)
      .forEach(([key, weekLogs]) => {
        const [year, weekStr] = key.split('-W');
        const weekNumber = parseInt(weekStr);

        const dates = weekLogs.map(l => new Date(l.date)).sort((a, b) => a.getTime() - b.getTime());
        const firstDate = dates[0];
        const lastDate = dates[dates.length - 1];
        const dateRange = `${firstDate.toLocaleDateString('default', { month: 'short', day: 'numeric' })} - ${lastDate.toLocaleDateString('default', { month: 'short', day: 'numeric' })}`;

        const avgSymptoms = weekLogs.reduce((sum, log) =>
          sum + calculateAvgSymptoms(log), 0) / weekLogs.length;

        const avgEnergy = weekLogs.reduce((sum, log) =>
          sum + log.symptoms.energy, 0) / weekLogs.length;

        const avgSleep = weekLogs.reduce((sum, log) =>
          sum + log.lifestyle.sleepHours, 0) / weekLogs.length;

        const avgCramps = weekLogs.reduce((sum, log) =>
          sum + log.symptoms.cramps, 0) / weekLogs.length;

        const symptomTotals: Record<string, number> = {};
        weekLogs.forEach(log => {
          Object.entries(log.symptoms).forEach(([key, value]) => {
            symptomTotals[key] = (symptomTotals[key] || 0) + value;
          });
        });

        const topSymptomEntry = Object.entries(symptomTotals)
          .sort(([, a], [, b]) => b - a)[0];
        const topSymptom = {
          name: topSymptomEntry[0].replace(/([A-Z])/g, ' $1').trim(),
          value: topSymptomEntry[1] / weekLogs.length
        };

        const periodDays = weekLogs.filter(l => l.cycleStatus === 'period').length;

        const activeLifestyle = weekLogs.filter(l =>
          l.lifestyle.activity === 'moderate' || l.lifestyle.activity === 'intense'
        ).length >= weekLogs.length * 0.5;

        const previousIndex = stats.length > 0 ? 0 : -1;
        let symptomTrend: 'up' | 'down' | 'stable' = 'stable';
        if (previousIndex >= 0) {
          const diff = stats[previousIndex].avgSymptoms - avgSymptoms;
          if (diff > 1) symptomTrend = 'down';
          else if (diff < -1) symptomTrend = 'up';
        }

        stats.push({
          weekNumber,
          dateRange,
          logsCount: weekLogs.length,
          avgSymptoms,
          symptomTrend,
          avgEnergy,
          avgSleep,
          avgCramps,
          topSymptom,
          periodDays,
          activeLifestyle
        });
      });

    return stats;
  }, []);

  if (weeklyStats.length === 0) {
    return (
      <Card className="border-sage-200 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-sage-800 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Weekly Summaries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-3">
            <div className="text-6xl">📊</div>
            <h3 className="text-lg font-semibold text-sage-800">Start Tracking to See Summaries</h3>
            <p className="text-sage-600 max-w-md mx-auto">
              Weekly summaries will appear here after you've logged a few days.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentWeek = weeklyStats[0];

  return (
    <div className="space-y-4">
      <GrowthIndicator />

      <Card className="border-sage-200 shadow-lg bg-gradient-to-br from-sage-100 to-peach-100">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-sage-800 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            This Week's Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sage-600 font-medium">{currentWeek.dateRange}</span>
            <span className="text-sage-800 font-bold">{currentWeek.logsCount} / 7 days logged</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/80 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-600" />
                <span className="text-xs text-sage-600">Avg Energy</span>
              </div>
              <p className="text-2xl font-bold text-sage-800">
                {currentWeek.avgEnergy.toFixed(1)}<span className="text-sm text-sage-500">/10</span>
              </p>
            </div>

            <div className="bg-white/80 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Moon className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-sage-600">Avg Sleep</span>
              </div>
              <p className="text-2xl font-bold text-sage-800">
                {currentWeek.avgSleep.toFixed(1)}<span className="text-sm text-sage-500">h</span>
              </p>
            </div>

            <div className="bg-white/80 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-green-600" />
                <span className="text-xs text-sage-600">Symptoms</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-sage-800">
                  {currentWeek.avgSymptoms.toFixed(1)}<span className="text-sm text-sage-500">/10</span>
                </p>
                {currentWeek.symptomTrend === 'down' && (
                  <TrendingDown className="w-5 h-5 text-green-600" />
                )}
                {currentWeek.symptomTrend === 'up' && (
                  <TrendingUp className="w-5 h-5 text-red-600" />
                )}
                {currentWeek.symptomTrend === 'stable' && (
                  <Minus className="w-5 h-5 text-gray-600" />
                )}
              </div>
            </div>

            <div className="bg-white/80 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Droplet className="w-4 h-4 text-pink-600" />
                <span className="text-xs text-sage-600">Period Days</span>
              </div>
              <p className="text-2xl font-bold text-sage-800">
                {currentWeek.periodDays}
              </p>
            </div>
          </div>

          {currentWeek.symptomTrend === 'down' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
              <span className="font-semibold">Great progress! </span>
              Your symptoms improved compared to last week.
            </div>
          )}

          {currentWeek.symptomTrend === 'up' && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-800">
              <span className="font-semibold">Hang in there. </span>
              This week was tougher, but tracking helps you understand why.
            </div>
          )}

          {currentWeek.activeLifestyle && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <span className="font-semibold">Active week! </span>
              You maintained regular exercise this week.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="text-lg font-bold text-sage-800">Previous Weeks</h3>
        {weeklyStats.slice(1).map((week, idx) => (
          <Card key={idx} className="border-sage-200 shadow-sm">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-sage-700">{week.dateRange}</span>
                <span className="text-xs text-sage-500">{week.logsCount} days</span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <p className="text-xs text-sage-600 mb-1">Symptoms</p>
                  <p className="text-lg font-bold text-sage-800">{week.avgSymptoms.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-xs text-sage-600 mb-1">Energy</p>
                  <p className="text-lg font-bold text-sage-800">{week.avgEnergy.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-xs text-sage-600 mb-1">Sleep</p>
                  <p className="text-lg font-bold text-sage-800">{week.avgSleep.toFixed(1)}h</p>
                </div>
                <div>
                  <p className="text-xs text-sage-600 mb-1">Trend</p>
                  <div className="flex items-center justify-center">
                    {week.symptomTrend === 'down' && <TrendingDown className="w-5 h-5 text-green-600" />}
                    {week.symptomTrend === 'up' && <TrendingUp className="w-5 h-5 text-red-600" />}
                    {week.symptomTrend === 'stable' && <Minus className="w-5 h-5 text-gray-600" />}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
