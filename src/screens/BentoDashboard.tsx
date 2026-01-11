import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Settings, Shield, Download, Moon, Sun } from 'lucide-react';
import { PlantHero } from '@/components/PlantHero';
import { LogSheet } from '@/components/LogSheet';
import { MentalWellnessRadar } from '@/components/RadarChart';
import { db, initializeApp, PlantState, DailyLog, exportAllData, deleteAllData } from '@/lib/db';
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
    const logs = await db.dailyLogs.orderBy('date').reverse().limit(7).toArray();

    setPlantState(plant || null);
    setTodayLog(log || null);
    setRecentLogs(logs);
  };

  useEffect(() => {
    loadData();
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
        backgroundColor: ['rgba(236, 72, 153, 0.6)', 'rgba(148, 163, 184, 0.3)'],
        borderColor: ['rgba(236, 72, 153, 1)', 'rgba(148, 163, 184, 0.5)'],
        borderWidth: 2
      }
    ]
  };

  const trendData = {
    labels: recentLogs.map(l => new Date(l.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })).reverse(),
    datasets: [
      {
        label: 'Anxiety',
        data: recentLogs.map(l => l.psychological.anxiety).reverse(),
        borderColor: 'rgba(239, 68, 68, 0.8)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Stress',
        data: recentLogs.map(l => l.psychological.stress).reverse(),
        borderColor: 'rgba(251, 191, 36, 0.8)',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        ticks: {
          color: 'rgba(241, 245, 249, 0.5)'
        }
      },
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        ticks: {
          color: 'rgba(241, 245, 249, 0.5)'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'rgba(241, 245, 249, 0.7)',
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: 'rgba(241, 245, 249, 0.9)',
        bodyColor: 'rgba(241, 245, 249, 0.8)',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        borderWidth: 1
      }
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
      <header className="border-b border-slate-800/50 backdrop-blur-xl bg-slate-900/50 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-light text-white/90 tracking-tight">Blossom</h1>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30">
              <Shield className="w-3 h-3 text-red-400" />
              <span className="text-xs font-semibold text-red-400 tracking-tight">100% Private</span>
            </div>
          </div>

          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Settings className="w-5 h-5 text-white/60" />
          </button>
        </div>
      </header>

      {settingsOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto px-4 py-4 bg-slate-900/50 border-b border-slate-800/50"
        >
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 text-sm flex items-center gap-2 border border-white/10"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 text-sm flex items-center gap-2 border border-white/10"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>
            <button
              onClick={handleDeleteAll}
              className="px-4 py-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm flex items-center gap-2 border border-red-500/30"
            >
              Delete All Data
            </button>
          </div>
        </motion.div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <PlantHero
          health={plantState?.health || 50}
          streak={plantState?.currentStreak || 0}
          name={plantState?.name || 'Your Companion'}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800/50 p-6"
          >
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Cycle Phase</h3>
            <div className="h-48 flex items-center justify-center">
              <Doughnut data={cycleData} options={{ maintainAspectRatio: true, plugins: { legend: { display: false } } }} />
            </div>
            <div className="mt-4 text-center text-sm text-white/50">
              {recentLogs.filter(l => l.cycleFlow !== 'none').length} period days in last 7 days
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800/50 p-6"
          >
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Mental State</h3>
            {todayLog ? (
              <MentalWellnessRadar
                anxiety={todayLog.psychological.anxiety}
                depression={todayLog.psychological.depression}
                stress={todayLog.psychological.stress}
                sleepQuality={todayLog.psychological.sleepQuality}
                bodyImage={todayLog.psychological.bodyImage}
              />
            ) : (
              <div className="h-48 flex items-center justify-center text-white/40 text-sm">
                Log today to see your mental wellness snapshot
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800/50 p-6"
        >
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">7-Day Trend</h3>
          <div className="h-64">
            <Line data={trendData} options={trendOptions} />
          </div>
        </motion.div>
      </main>

      <motion.button
        onClick={() => setLogSheetOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus className="w-8 h-8" />
      </motion.button>

      <LogSheet
        isOpen={logSheetOpen}
        onClose={handleLogClose}
        existingLog={todayLog || undefined}
        date={today}
      />
    </div>
  );
};
