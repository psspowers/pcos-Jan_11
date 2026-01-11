import { usePlantState, useInterfaceMode } from '../lib/hooks/useInsights';
import { BioOrb } from './BioOrb';
import { WellnessRadar } from './WellnessRadar';
import { TrendVelocity } from './TrendVelocity';
import { CycleRing } from './CycleRing';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { DailyLog } from './DailyLog';

export function Dashboard() {
  const { plantState, loading: plantLoading } = usePlantState();
  const { themeState, loading: themeLoading } = useInterfaceMode();
  const [showDailyLog, setShowDailyLog] = useState(false);

  if (plantLoading || themeLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(45, 212, 191, 0.1), transparent 50%)'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Blossom
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Your PCOS wellness companion
          </p>
        </header>

        <BioOrb health={plantState.health} streak={plantState.streak} mode={themeState.mode} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <div className="glass-card h-80">
            <div className="p-4 border-b border-white/10">
              <h2 className="text-sm font-medium text-white/90 uppercase tracking-wide">
                Wellness Balance
              </h2>
            </div>
            <WellnessRadar />
          </div>

          <div className="glass-card h-80">
            <TrendVelocity />
          </div>

          <div className="glass-card h-80">
            <div className="p-4 border-b border-white/10">
              <h2 className="text-sm font-medium text-white/90 uppercase tracking-wide">
                Cycle Status
              </h2>
            </div>
            <CycleRing />
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowDailyLog(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-teal-400 hover:bg-teal-300 transition-all shadow-lg hover:shadow-xl flex items-center justify-center group hover:scale-105"
        style={{
          boxShadow: '0 0 30px rgba(45, 212, 191, 0.5)'
        }}
      >
        <Plus className="w-8 h-8 text-slate-950 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {showDailyLog && <DailyLog onClose={() => setShowDailyLog(false)} />}
    </div>
  );
}
