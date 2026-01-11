import React, { useState, useMemo } from 'react';
import { getLogs, DailyLog } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { ChevronLeft, ChevronRight, Circle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from '@/ui/button';

interface DayData {
  date: string;
  log?: DailyLog;
  avgSymptoms: number;
  isToday: boolean;
  isCurrentMonth: boolean;
}

const calculateAvgSymptoms = (log: DailyLog): number => {
  const symptoms = Object.values(log.symptoms);
  return symptoms.reduce((sum, val) => sum + val, 0) / symptoms.length;
};

const getDayColor = (avgSymptoms: number): string => {
  if (avgSymptoms === 0) return 'bg-gray-100';
  if (avgSymptoms <= 2) return 'bg-green-200';
  if (avgSymptoms <= 4) return 'bg-green-300';
  if (avgSymptoms <= 6) return 'bg-yellow-300';
  if (avgSymptoms <= 8) return 'bg-orange-400';
  return 'bg-red-400';
};

const getDayBorder = (log: DailyLog): string => {
  if (log.cycleStatus === 'period') return 'border-2 border-pink-500';
  if (log.cycleStatus === 'spotting') return 'border-2 border-pink-300';
  return '';
};

export const HeatmapCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const logs = getLogs();

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: DayData[] = [];
    const today = new Date().toISOString().split('T')[0];

    for (let i = 0; i < startDayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, -startDayOfWeek + i + 1);
      const dateStr = prevMonthDay.toISOString().split('T')[0];
      const log = logs.find(l => l.date === dateStr);
      days.push({
        date: dateStr,
        log,
        avgSymptoms: log ? calculateAvgSymptoms(log) : 0,
        isToday: dateStr === today,
        isCurrentMonth: false
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const log = logs.find(l => l.date === dateStr);
      days.push({
        date: dateStr,
        log,
        avgSymptoms: log ? calculateAvgSymptoms(log) : 0,
        isToday: dateStr === today,
        isCurrentMonth: true
      });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonthDay = new Date(year, month + 1, i);
      const dateStr = nextMonthDay.toISOString().split('T')[0];
      const log = logs.find(l => l.date === dateStr);
      days.push({
        date: dateStr,
        log,
        avgSymptoms: log ? calculateAvgSymptoms(log) : 0,
        isToday: dateStr === today,
        isCurrentMonth: false
      });
    }

    return days;
  }, [currentDate, logs]);

  const monthStats = useMemo(() => {
    const currentMonthLogs = calendarData
      .filter(d => d.isCurrentMonth && d.log)
      .map(d => d.log!);

    if (currentMonthLogs.length === 0) {
      return { avgSymptoms: 0, loggedDays: 0, trend: 'stable' };
    }

    const avgSymptoms = currentMonthLogs.reduce((sum, log) =>
      sum + calculateAvgSymptoms(log), 0) / currentMonthLogs.length;

    const firstHalf = currentMonthLogs.slice(0, Math.floor(currentMonthLogs.length / 2));
    const secondHalf = currentMonthLogs.slice(Math.floor(currentMonthLogs.length / 2));

    const firstAvg = firstHalf.reduce((sum, log) =>
      sum + calculateAvgSymptoms(log), 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, log) =>
      sum + calculateAvgSymptoms(log), 0) / secondHalf.length;

    let trend: 'improving' | 'worsening' | 'stable' = 'stable';
    if (secondAvg < firstAvg - 1) trend = 'improving';
    else if (secondAvg > firstAvg + 1) trend = 'worsening';

    return {
      avgSymptoms: avgSymptoms.toFixed(1),
      loggedDays: currentMonthLogs.length,
      trend
    };
  }, [calendarData]);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    const today = new Date();
    const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    if (next <= today) {
      setCurrentDate(next);
    }
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const isCurrentMonth = currentDate.getMonth() === new Date().getMonth() &&
                         currentDate.getFullYear() === new Date().getFullYear();

  return (
    <div className="space-y-4">
      <Card className="border-sage-200 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={previousMonth}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="text-lg font-bold text-sage-800">{monthName}</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={nextMonth}
              disabled={isCurrentMonth}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-sage-600 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarData.map((day, idx) => {
              const dayNum = new Date(day.date).getDate();
              const colorClass = day.log ? getDayColor(day.avgSymptoms) : 'bg-gray-50';
              const borderClass = day.log ? getDayBorder(day.log) : '';

              return (
                <button
                  key={idx}
                  onClick={() => day.log && setSelectedDay(day)}
                  disabled={!day.log}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center text-xs font-medium
                    transition-all duration-200
                    ${colorClass} ${borderClass}
                    ${day.isCurrentMonth ? 'text-sage-800' : 'text-sage-400 opacity-50'}
                    ${day.isToday ? 'ring-2 ring-sage-600 ring-offset-1' : ''}
                    ${day.log ? 'hover:scale-110 hover:shadow-md cursor-pointer' : 'cursor-default'}
                    ${selectedDay?.date === day.date ? 'scale-110 shadow-lg' : ''}
                  `}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-sage-200 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-sage-600">Days Logged:</span>
              <span className="font-bold text-sage-800">{monthStats.loggedDays}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-sage-600">Avg Symptoms:</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sage-800">{monthStats.avgSymptoms}/10</span>
                {monthStats.trend === 'improving' && (
                  <div className="flex items-center gap-1 text-green-600 text-xs">
                    <TrendingDown className="w-3 h-3" />
                    <span>Better</span>
                  </div>
                )}
                {monthStats.trend === 'worsening' && (
                  <div className="flex items-center gap-1 text-orange-600 text-xs">
                    <TrendingUp className="w-3 h-3" />
                    <span>Worse</span>
                  </div>
                )}
                {monthStats.trend === 'stable' && (
                  <div className="flex items-center gap-1 text-sage-600 text-xs">
                    <Minus className="w-3 h-3" />
                    <span>Stable</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs justify-center pt-2 border-t border-sage-200">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-300"></div>
              <span className="text-sage-600">Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-yellow-300"></div>
              <span className="text-sage-600">Moderate</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-400"></div>
              <span className="text-sage-600">High</span>
            </div>
            <div className="flex items-center gap-1">
              <Circle className="w-3 h-3 text-pink-500" />
              <span className="text-sage-600">Period</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedDay && selectedDay.log && (
        <Card className="border-sage-200 shadow-md animate-in slide-in-from-bottom duration-300">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-sage-800">
              {new Date(selectedDay.date).toLocaleDateString('default', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-sage-50 rounded-lg p-3">
                <p className="text-xs text-sage-600 mb-1">Avg Symptoms</p>
                <p className="text-xl font-bold text-sage-800">
                  {selectedDay.avgSymptoms.toFixed(1)}/10
                </p>
              </div>
              <div className="bg-peach-50 rounded-lg p-3">
                <p className="text-xs text-peach-600 mb-1">Cycle Status</p>
                <p className="text-sm font-semibold text-peach-700 capitalize">
                  {selectedDay.log.cycleStatus}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-sage-600">Top Symptoms:</p>
              <div className="space-y-1">
                {Object.entries(selectedDay.log.symptoms)
                  .filter(([_, val]) => val > 0)
                  .sort(([_, a], [__, b]) => b - a)
                  .slice(0, 3)
                  .map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="text-sage-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-sage-500 rounded-full"
                            style={{ width: `${(val / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-sage-600 font-medium w-8">{val}/10</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-2 border-t border-sage-200 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-sage-600">Sleep: </span>
                <span className="font-semibold text-sage-800">
                  {selectedDay.log.lifestyle.sleepHours}h
                </span>
              </div>
              <div>
                <span className="text-sage-600">Activity: </span>
                <span className="font-semibold text-sage-800 capitalize">
                  {selectedDay.log.lifestyle.activity}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
