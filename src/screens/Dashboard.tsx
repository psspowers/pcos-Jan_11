import React, { useState, useEffect } from 'react';
import { getLogs, getProfile } from '@/lib/storage';
import { PulseOrb } from '@/components/PulseOrb';
import { Activity, Calendar, Moon } from 'lucide-react';
import { VelocityLogger } from './VelocityLogger';

export const Dashboard: React.FC = () => {
  const [showLogger, setShowLogger] = useState(false);
  const [streak, setStreak] = useState(0);
  const [stats, setStats] = useState({
    avgSleep: 0,
    totalLogs: 0,
    cycleDay: 0,
  });

  useEffect(() => {
    const logs = getLogs();
    const today = new Date().toISOString().split('T')[0];

    let currentStreak = 0;
    const dates = logs.map(l => l.date).sort().reverse();

    for (let i = 0; i < dates.length; i++) {
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      const expected = expectedDate.toISOString().split('T')[0];

      if (dates[i] === expected || (i === 0 && dates[i] === today)) {
        currentStreak++;
      } else {
        break;
      }
    }

    setStreak(currentStreak);

    const recent7 = logs.slice(0, 7);
    const avgSleep = recent7.length > 0
      ? recent7.reduce((sum, l) => sum + l.lifestyle.sleepHours, 0) / recent7.length
      : 0;

    const lastPeriod = logs.find(l => l.cycleStatus === 'period');
    const cycleDay = lastPeriod
      ? Math.floor((new Date().getTime() - new Date(lastPeriod.date).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    setStats({
      avgSleep,
      totalLogs: logs.length,
      cycleDay,
    });
  }, [showLogger]);

  return (
    <>
      <div className="min-h-screen p-4 md:p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-light tracking-tighter text-white mb-1">PCOS</h1>
          <p className="text-sm text-white/40 uppercase tracking-wider">Companion</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="glass rounded-2xl p-6 col-span-1 aspect-square flex flex-col items-center justify-center">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="50"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="50"
                  stroke="#22d3ee"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(stats.cycleDay / 28) * 314} 314`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-light tracking-tighter text-white">{stats.cycleDay}</div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider">cycle</div>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 col-span-1 aspect-square">
            <PulseOrb streak={streak} />
          </div>

          <div className="glass rounded-2xl p-6 col-span-2 md:col-span-2 flex flex-col justify-between">
            <div className="text-xs text-white/50 uppercase tracking-wider mb-4">Quick Stats</div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Moon className="w-3 h-3 text-neon-cyan" />
                  <span className="text-xs text-white/50">Sleep</span>
                </div>
                <div className="text-2xl font-light tracking-tighter text-white">{stats.avgSleep.toFixed(1)}<span className="text-sm text-white/40">h</span></div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-3 h-3 text-neon-rose" />
                  <span className="text-xs text-white/50">Logs</span>
                </div>
                <div className="text-2xl font-light tracking-tighter text-white">{stats.totalLogs}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-3 h-3 text-zinc-400" />
                  <span className="text-xs text-white/50">Streak</span>
                </div>
                <div className="text-2xl font-light tracking-tighter text-white">{streak}</div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowLogger(true)}
          className="w-full glass rounded-2xl p-4 flex items-center justify-center gap-3 neon-glow-cyan hover:bg-white/10 transition-all"
        >
          <Activity className="w-5 h-5 text-neon-cyan" />
          <span className="text-white font-light tracking-tight">Log Data</span>
        </button>
      </div>

      {showLogger && <VelocityLogger onClose={() => setShowLogger(false)} />}
    </>
  );
};
