import React, { useState } from 'react';
import { getLogs, DailyLog } from '@/lib/storage';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarView: React.FC<{ onSelectDate: (date: string) => void }> = ({ onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const logs = getLogs();
  const logMap = new Map(logs.map(l => [l.date, l]));

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];
    
    // Add empty slots for days before the first day
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Add all days in the month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const today = new Date().toISOString().split('T')[0];

  const getLogIndicator = (log: DailyLog | undefined) => {
    if (!log) return null;
    if (log.cycleStatus === 'period') return 'bg-red-400';
    if (log.cycleStatus === 'spotting') return 'bg-red-200';
    return 'bg-sage-300';
  };

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-sage-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1 hover:bg-sage-100 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-2"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-sage-600" />
        </button>
        <h3 className="font-semibold text-sage-800">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-sage-100 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-2"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-sage-600" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-sage-500 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (!day) return <div key={i} />;
          const dateStr = day.toISOString().split('T')[0];
          const log = logMap.get(dateStr);
          const isToday = dateStr === today;
          const indicator = getLogIndicator(log);
          
          return (
            <button
              key={i}
              onClick={() => onSelectDate(dateStr)}
              className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-1
                ${isToday ? 'ring-2 ring-sage-500' : ''}
                ${log ? 'hover:bg-sage-100' : 'text-sage-400 hover:bg-sage-50'}
              `}
              aria-label={`${day.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}${log ? ' - logged' : ''}`}
            >
              <span className={log ? 'text-sage-800 font-medium' : ''}>{day.getDate()}</span>
              {indicator && <div className={`w-1.5 h-1.5 rounded-full ${indicator} mt-0.5`} />}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-4 mt-3 text-xs text-sage-500">
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-400" /> Period</span>
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-200" /> Spotting</span>
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-sage-300" /> Logged</span>
      </div>
    </div>
  );
};
