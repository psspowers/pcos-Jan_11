import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Settings, Shield, Download, Moon, Sun, Sparkles, Zap, TrendingDown, TrendingUp, Activity } from 'lucide-react';
import { PlantHero } from '@/components/PlantHero';
import { LogSheet } from '@/components/LogSheet';
import { MentalWellnessRadar } from '@/components/RadarChart';
import { db, initializeApp, PlantState, DailyLog, exportAllData, deleteAllData } from '@/lib/db';
import { generate30DaysOfData } from '@/lib/dataGenerator';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { toast } from 'sonner';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const BentoDashboard: React.FC = () => {
  const [logSheetOpen, setLogSheetOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [plantState, setPlantState] = useState<PlantState | null>(null);
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [recentLogs, setRecentLogs] = useState<DailyLog[]>([]);
  const [darkMode, setDarkMode] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  const loadData = async () => {
    await initializeApp();
    const plant = await db.plantState.get('primary');
    const log = await db.dailyLogs.get(today);
    const logs = await db.dailyLogs.orderBy('date').reverse().limit(30).toArray();

    setPlantState(plant || null);
    setTodayLog(log || null);
    setRecentLogs(logs);
  };

  const handleGenerateData = async () => {
    try {
      toast.loading('Generating 30 days of realistic cycle data...');
      await generate30DaysOfData();
      await loadData();
      toast.dismiss();
      toast.success('30 days of realistic cycle data generated!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to generate data');
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await initializeApp();
      const allLogs = await db.dailyLogs.toArray();

      if (allLogs.length < 7) {
        toast.loading('Generating 30 days of cycle data for stress testing...');
        await generate30DaysOfData();
        toast.dismiss();
        toast.success('30 days of realistic data generated!');
      }

      await loadData();
    };

    initializeData();
  }, []);

  const handleLogClose = () => {
    setLogSheetOpen(false);
    loadData();
  };

  const handleExport = async () => {
    try {
      const data = await exportAllData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `blossom-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      toast.success('Data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleDeleteAll = async () => {
    if (confirm('⚠️ This will delete ALL your data permanently. Are you sure?')) {
      await deleteAllData();
      await loadData();
      toast.success('All data deleted');
    }
  };

  const cycleData = {
    labels: ['Period Days', 'Non-Period Days'],
    datasets: [
      {
        data: [
          recentLogs.filter(l => l.cycleFlow !== 'none').length,
          recentLogs.filter(l => l.cycleFlow === 'none').length
        ],
        backgroundColor: ['rgba(236, 72, 153, 0.1)', 'rgba(148, 163, 184, 0.05)'],
        borderColor: ['rgba(236, 72, 153, 1)', 'rgba(148, 163, 184, 0.4)'],
        borderWidth: 4,
        cutout: '80%',
        spacing: 2
      }
    ]
  };

  const trendData = {
    labels: recentLogs.map(l => new Date(l.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })).reverse(),
    datasets: [
      {
        label: 'Anxiety',
        data: recentLogs.map(l => l.psychological.anxiety).reverse(),
        borderColor: 'rgba(45, 212, 191, 1)',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(45, 212, 191, 0.6)');
          gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.4)');
          gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 8,
        pointBackgroundColor: 'rgba(45, 212, 191, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2.5,
        pointHoverBorderWidth: 3
      },
      {
        label: 'Stress',
        data: recentLogs.map(l => l.psychological.stress).reverse(),
        borderColor: 'rgba(168, 85, 247, 1)',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(168, 85, 247, 0.6)');
          gradient.addColorStop(0.5, 'rgba(45, 212, 191, 0.4)');
          gradient.addColorStop(1, 'rgba(45, 212, 191, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 8,
        pointBackgroundColor: 'rgba(168, 85, 247, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2.5,
        pointHoverBorderWidth: 3
      }
    ]
  };

  const calculateTrend = (data: number[]) => {
    if (data.length < 2) return { trend: 0, direction: 'stable' };
    const recent = data.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const previous = data.slice(0, -3).reduce((a, b) => a + b, 0) / Math.max(1, data.length - 3);
    const change = ((recent - previous) / Math.max(1, previous)) * 100;
    return {
      trend: Math.abs(Math.round(change)),
      direction: change < -5 ? 'down' : change > 5 ? 'up' : 'stable'
    };
  };

  const calculateSlope = (data: number[], windowSize: number = 5) => {
    if (data.length < windowSize) return 0;
    const window = data.slice(-windowSize);
    const n = window.length;
    const xMean = (n - 1) / 2;
    const yMean = window.reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      numerator += (i - xMean) * (window[i] - yMean);
      denominator += Math.pow(i - xMean, 2);
    }

    return denominator === 0 ? 0 : numerator / denominator;
  };

  const calculateRecentChange = (data: number[], windowSize: number = 3) => {
    if (data.length < windowSize) return 0;
    const window = data.slice(-windowSize);
    const first = window[0];
    const last = window[window.length - 1];
    if (first === 0) return 0;
    return ((last - first) / first) * 100;
  };

  const anxietyData = recentLogs.map(l => l.psychological.anxiety).reverse();
  const recentChange = calculateRecentChange(anxietyData, 3);
  const overallSlope = calculateSlope(anxietyData, 5);

  const trendInsight = recentChange > 10
    ? 'Alert: Recent symptom spike detected'
    : overallSlope < -0.15
    ? 'Recovery Detected: Symptoms are decelerating'
    : overallSlope > 0.15
    ? 'Trend Alert: Symptoms are intensifying'
    : 'Status: Symptoms are holding steady';

  const calculateAverage = (logs: DailyLog[]) => {
    if (logs.length === 0) return null;

    const sum = logs.reduce((acc, log) => ({
      anxiety: acc.anxiety + log.psychological.anxiety,
      depression: acc.depression + log.psychological.depression,
      stress: acc.stress + log.psychological.stress,
      sleepQuality: acc.sleepQuality + log.psychological.sleepQuality,
      bodyImage: acc.bodyImage + log.psychological.bodyImage
    }), { anxiety: 0, depression: 0, stress: 0, sleepQuality: 0, bodyImage: 0 });

    const count = logs.length;
    return {
      anxiety: Math.round((sum.anxiety / count) * 10) / 10,
      depression: Math.round((sum.depression / count) * 10) / 10,
      stress: Math.round((sum.stress / count) * 10) / 10,
      sleepQuality: Math.round((sum.sleepQuality / count) * 10) / 10,
      bodyImage: Math.round((sum.bodyImage / count) * 10) / 10
    };
  };

  const last7Days = recentLogs.slice(0, 7);
  const previous7Days = recentLogs.slice(7, 14);
  const allLogs = recentLogs;

  const weeklyAverage = calculateAverage(last7Days);
  const previousWeekAverage = calculateAverage(previous7Days);
  const monthlyAverage = calculateAverage(allLogs);
  const showVelocity = recentLogs.length >= 14;

  const calculateVelocity = (current: number, previous: number) => {
    if (previous === 0) return { change: 0, direction: 'stable' as const };
    const percentChange = ((current - previous) / previous) * 100;
    const absChange = Math.abs(percentChange);

    if (absChange < 2) {
      return { change: Math.round(absChange), direction: 'stable' as const };
    }

    return {
      change: Math.round(absChange),
      direction: percentChange < 0 ? 'down' : 'up' as 'down' | 'up' | 'stable'
    };
  };

  const stressVelocity = showVelocity && weeklyAverage && previousWeekAverage
    ? calculateVelocity(weeklyAverage.stress, previousWeekAverage.stress)
    : null;

  const anxietyVelocity = showVelocity && weeklyAverage && previousWeekAverage
    ? calculateVelocity(weeklyAverage.anxiety, previousWeekAverage.anxiety)
    : null;

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          color: 'rgba(241, 245, 249, 0.4)',
          font: {
            size: 11,
            weight: '300'
          },
          padding: 10
        }
      },
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          color: 'rgba(241, 245, 249, 0.4)',
          font: {
            size: 11,
            weight: '300'
          },
          padding: 10,
          maxRotation: 0,
          minRotation: 0,
          callback: function(value: any, index: number) {
            return index % 5 === 0 ? this.getLabelForValue(value) : '';
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: 'rgba(241, 245, 249, 1)',
        bodyColor: 'rgba(241, 245, 249, 0.9)',
        borderColor: 'rgba(148, 163, 184, 0.3)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        usePointStyle: true
      }
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
      <header className="border-b border-white/5 backdrop-blur-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/60 sticky top-0 z-40 shadow-lg shadow-black/20">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-extralight text-white/95 tracking-tight">Blossom</h1>
            <div className="relative group">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-md group-hover:blur-lg transition-all" />
              <div className="relative flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-400/30 backdrop-blur-xl">
                <Shield className="w-3.5 h-3.5 text-red-400" />
                <span className="text-xs font-semibold text-red-300 tracking-tight">100% Private</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="p-2.5 rounded-xl hover:bg-white/10 transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
          >
            <Settings className="w-5 h-5 text-white/60" />
          </button>
        </div>
      </header>

      {settingsOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto px-6 py-5 bg-gradient-to-b from-slate-900/60 to-slate-950/40 border-b border-white/5 backdrop-blur-xl"
        >
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 text-white/80 text-sm flex items-center gap-2 border border-white/10 backdrop-blur-xl transition-all hover:scale-105 active:scale-95"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              onClick={handleGenerateData}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-teal-500/10 to-cyan-500/5 hover:from-teal-500/20 hover:to-cyan-500/10 text-teal-300 text-sm flex items-center gap-2 border border-teal-400/30 backdrop-blur-xl transition-all hover:scale-105 active:scale-95"
            >
              <Zap className="w-4 h-4" />
              Generate 30-Day Data
            </button>
            <button
              onClick={handleExport}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 text-white/80 text-sm flex items-center gap-2 border border-white/10 backdrop-blur-xl transition-all hover:scale-105 active:scale-95"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>
            <button
              onClick={handleDeleteAll}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-red-500/10 to-red-600/5 hover:from-red-500/20 hover:to-red-600/10 text-red-300 text-sm flex items-center gap-2 border border-red-400/30 backdrop-blur-xl transition-all hover:scale-105 active:scale-95"
            >
              Delete All Data
            </button>
          </div>
        </motion.div>
      )}

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <PlantHero
          health={plantState?.health || 50}
          streak={plantState?.currentStreak || 0}
          name={plantState?.name || 'Your Companion'}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-[2rem] blur-2xl group-hover:blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="relative bg-gradient-to-br from-slate-900/60 to-slate-950/80 backdrop-blur-2xl rounded-[2rem] border border-white/10 p-8 hover:border-white/20 transition-all shadow-xl shadow-black/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                  <h3 className="text-xs font-semibold text-white/50 uppercase tracking-[0.2em]">Mental State</h3>
                </div>
                {anxietyVelocity && (
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg backdrop-blur-sm ${
                    anxietyVelocity.direction === 'down'
                      ? 'bg-emerald-500/10 border border-emerald-400/30'
                      : anxietyVelocity.direction === 'up'
                      ? 'bg-orange-500/10 border border-orange-400/30'
                      : 'bg-slate-500/10 border border-slate-400/30'
                  }`}>
                    {anxietyVelocity.direction === 'down' && <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />}
                    {anxietyVelocity.direction === 'up' && <TrendingUp className="w-3.5 h-3.5 text-orange-400" />}
                    {anxietyVelocity.direction === 'stable' && <Activity className="w-3.5 h-3.5 text-slate-400" />}
                    <span className={`text-xs font-semibold ${
                      anxietyVelocity.direction === 'down'
                        ? 'text-emerald-300'
                        : anxietyVelocity.direction === 'up'
                        ? 'text-orange-300'
                        : 'text-slate-300'
                    }`}>
                      {anxietyVelocity.direction === 'down' ? '↓' : anxietyVelocity.direction === 'up' ? '↑' : '→'} {anxietyVelocity.change}%
                    </span>
                  </div>
                )}
              </div>
              <div className="h-52 flex items-center justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-light text-white/90">{recentLogs.filter(l => l.cycleFlow !== 'none').length}</div>
                    <div className="text-xs text-white/40 mt-1">period days</div>
                  </div>
                </div>
                <Doughnut
                  data={cycleData}
                  options={{
                    maintainAspectRatio: true,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        titleColor: 'rgba(241, 245, 249, 1)',
                        bodyColor: 'rgba(241, 245, 249, 0.9)',
                        borderColor: 'rgba(148, 163, 184, 0.3)',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8
                      }
                    }
                  }}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-[2rem] blur-2xl group-hover:blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="relative bg-gradient-to-br from-slate-900/60 to-slate-950/80 backdrop-blur-2xl rounded-[2rem] border border-white/10 p-4 hover:border-white/20 transition-all shadow-xl shadow-black/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] h-full flex flex-col">
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  <h3 className="text-xs font-semibold text-white/50 uppercase tracking-[0.2em]">Wellness Balance</h3>
                </div>
                {stressVelocity && (
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg backdrop-blur-sm ${
                    stressVelocity.direction === 'down'
                      ? 'bg-emerald-500/10 border border-emerald-400/30'
                      : stressVelocity.direction === 'up'
                      ? 'bg-orange-500/10 border border-orange-400/30'
                      : 'bg-slate-500/10 border border-slate-400/30'
                  }`}>
                    {stressVelocity.direction === 'down' && <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />}
                    {stressVelocity.direction === 'up' && <TrendingUp className="w-3.5 h-3.5 text-orange-400" />}
                    {stressVelocity.direction === 'stable' && <Activity className="w-3.5 h-3.5 text-slate-400" />}
                    <span className={`text-xs font-semibold ${
                      stressVelocity.direction === 'down'
                        ? 'text-emerald-300'
                        : stressVelocity.direction === 'up'
                        ? 'text-orange-300'
                        : 'text-slate-300'
                    }`}>
                      {stressVelocity.direction === 'down' ? '↓' : stressVelocity.direction === 'up' ? '↑' : '→'} {stressVelocity.change}%
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-h-[480px]">
              {showVelocity && weeklyAverage && monthlyAverage ? (
                <MentalWellnessRadar
                  anxiety={weeklyAverage.anxiety}
                  depression={weeklyAverage.depression}
                  stress={weeklyAverage.stress}
                  sleepQuality={weeklyAverage.sleepQuality}
                  bodyImage={weeklyAverage.bodyImage}
                  baseline={monthlyAverage}
                />
              ) : monthlyAverage ? (
                <MentalWellnessRadar
                  anxiety={monthlyAverage.anxiety}
                  depression={monthlyAverage.depression}
                  stress={monthlyAverage.stress}
                  sleepQuality={monthlyAverage.sleepQuality}
                  bodyImage={monthlyAverage.bodyImage}
                  isMonthlyAverage={true}
                />
              ) : todayLog ? (
                <MentalWellnessRadar
                  anxiety={todayLog.psychological.anxiety}
                  depression={todayLog.psychological.depression}
                  stress={todayLog.psychological.stress}
                  sleepQuality={todayLog.psychological.sleepQuality}
                  bodyImage={todayLog.psychological.bodyImage}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/30 text-sm gap-3">
                  <Sparkles className="w-8 h-8 text-white/20" />
                  <p>Log today to see your snapshot</p>
                </div>
              )}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/10 rounded-[2rem] blur-2xl group-hover:blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
          <div className="relative bg-gradient-to-br from-slate-900/40 to-slate-950/60 backdrop-blur-2xl rounded-[2rem] border border-white/10 p-8 hover:border-white/20 transition-all shadow-xl shadow-black/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <h3 className="text-xs font-semibold text-white/50 uppercase tracking-[0.2em]">Wellness Trend</h3>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-teal-400" />
                  <span className="text-xs text-white/50">Anxiety</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <span className="text-xs text-white/50">Stress</span>
                </div>
              </div>
            </div>
            {recentLogs.length > 0 && (
              <div className="mb-4 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-sm text-white/70 font-light">
                  {trendInsight}
                </p>
              </div>
            )}
            <div className="h-64">
              <Line data={trendData} options={trendOptions} />
            </div>
          </div>
        </motion.div>
      </main>

      <div className="fixed bottom-8 right-8 z-40">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full blur-2xl opacity-50"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.button
          onClick={() => setLogSheetOpen(true)}
          className="relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 text-white shadow-2xl shadow-emerald-500/50 flex items-center justify-center border border-white/20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-8 h-8" />
        </motion.button>
      </div>

      <LogSheet
        isOpen={logSheetOpen}
        onClose={handleLogClose}
        existingLog={todayLog || undefined}
        date={today}
      />
    </div>
  );
};
