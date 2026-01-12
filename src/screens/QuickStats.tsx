import React from 'react';
import { getLogs } from '@/lib/storage';
import { Droplet, TrendingUp, Zap, Moon } from 'lucide-react';

export const QuickStats: React.FC = () => {
  const logs = getLogs();
  
  if (logs.length < 3) return null;

  const last7 = logs.slice(-7);
  const periodDays = last7.filter(l => l.cycleStatus === 'period').length;
  const avgEnergy = (last7.reduce((a, l) => a + l.symptoms.energy, 0) / last7.length).toFixed(1);
  const avgSleep = (last7.reduce((a, l) => a + l.lifestyle.sleepHours, 0) / last7.length).toFixed(1);
  
  // Calculate trend
  const first3 = logs.slice(-7, -4);
  const last3 = logs.slice(-3);
  const energyTrend = first3.length > 0 && last3.length > 0
    ? (last3.reduce((a, l) => a + l.symptoms.energy, 0) / last3.length) - 
      (first3.reduce((a, l) => a + l.symptoms.energy, 0) / first3.length)
    : 0;

  return (
    <div className="grid grid-cols-4 gap-2 mb-6">
      <div className="bg-white rounded-xl p-3 shadow-sm border border-sage-100 text-center">
        <Droplet className="w-4 h-4 text-red-400 mx-auto mb-1" />
        <div className="text-lg font-bold text-sage-800">{periodDays}</div>
        <div className="text-xs text-sage-500">Period days</div>
      </div>
      <div className="bg-white rounded-xl p-3 shadow-sm border border-sage-100 text-center">
        <Zap className="w-4 h-4 text-amber-500 mx-auto mb-1" />
        <div className="text-lg font-bold text-sage-800">{avgEnergy}</div>
        <div className="text-xs text-sage-500">Avg Energy</div>
      </div>
      <div className="bg-white rounded-xl p-3 shadow-sm border border-sage-100 text-center">
        <Moon className="w-4 h-4 text-purple-500 mx-auto mb-1" />
        <div className="text-lg font-bold text-sage-800">{avgSleep}h</div>
        <div className="text-xs text-sage-500">Avg Sleep</div>
      </div>
      <div className="bg-white rounded-xl p-3 shadow-sm border border-sage-100 text-center">
        <TrendingUp className={`w-4 h-4 mx-auto mb-1 ${energyTrend > 0 ? 'text-green-500' : energyTrend < 0 ? 'text-red-400' : 'text-sage-400'}`} />
        <div className="text-lg font-bold text-sage-800">
          {energyTrend > 0 ? '+' : ''}{energyTrend.toFixed(1)}
        </div>
        <div className="text-xs text-sage-500">Energy trend</div>
      </div>
    </div>
  );
};
