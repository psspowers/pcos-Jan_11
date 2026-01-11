import React, { useEffect, useMemo, useState } from 'react';
import { db, DailyLog } from '@/lib/db';
import { Card } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { TrendingDown, TrendingUp, Minus, Info } from 'lucide-react';
import { calculateVelocity, calculateFactorImpact, getFactorLabel, FactorImpact } from '@/lib/velocityAnalysis';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const HyperandrogenismInsights: React.FC = () => {
  const [logs, setLogs] = useState<DailyLog[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const allLogs = await db.dailyLogs.orderBy('date').reverse().toArray();
      setLogs(allLogs);
    };
    loadData();
  }, []);

  const { current30, past30 } = useMemo(() => {
    const current30 = logs.slice(0, 30).reverse();
    const past30 = logs.slice(30, 60).reverse();
    return { current30, past30 };
  }, [logs]);

  const trendData = useMemo(() => {
    if (current30.length === 0) return null;

    const currentAcne = current30.map(l => l.hyperandrogenism.acne);
    const pastAcne = past30.map(l => l.hyperandrogenism.acne);
    const velocity = calculateVelocity(currentAcne, pastAcne);

    const labels = current30.map((_, i) => `Day ${i + 1}`);

    return {
      labels,
      datasets: [
        {
          label: 'Current Period',
          data: currentAcne,
          borderColor: 'rgb(45, 212, 191)',
          backgroundColor: 'rgba(45, 212, 191, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          fill: true
        },
        {
          label: 'Previous Period',
          data: pastAcne.length > 0 ? pastAcne : new Array(current30.length).fill(null),
          borderColor: 'rgb(71, 85, 105)',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4
        }
      ],
      velocity
    };
  }, [current30, past30]);

  const factorData = useMemo(() => {
    if (logs.length < 14) return null;

    const factors: FactorImpact[] = [
      calculateFactorImpact(logs, 'acne', 'sleepQuality', 7),
      calculateFactorImpact(logs, 'acne', 'stress', 5),
      calculateFactorImpact(logs, 'acne', 'waterIntake', 8),
      calculateFactorImpact(logs, 'acne', 'exerciseMinutes', 30)
    ];

    const validFactors = factors
      .filter(f => f.sampleSizeHigh > 3 && f.sampleSizeLow > 3)
      .sort((a, b) => b.improvementPercent - a.improvementPercent)
      .slice(0, 5);

    if (validFactors.length === 0) return null;

    return {
      labels: validFactors.map(f => getFactorLabel(f.factor)),
      datasets: [
        {
          label: 'Improvement %',
          data: validFactors.map(f => f.improvementPercent),
          backgroundColor: validFactors.map(f =>
            f.improvementPercent > 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'
          ),
          borderColor: validFactors.map(f =>
            f.improvementPercent > 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
          ),
          borderWidth: 2
        }
      ],
      factors: validFactors
    };
  }, [logs]);

  const radarData = useMemo(() => {
    if (current30.length === 0) return null;

    const currentAvg = {
      acne: current30.reduce((sum, l) => sum + l.hyperandrogenism.acne, 0) / current30.length,
      hirsutism: current30.reduce((sum, l) => sum + l.hyperandrogenism.hirsutism, 0) / current30.length,
      hairLoss: current30.reduce((sum, l) => sum + l.hyperandrogenism.hairLoss, 0) / current30.length,
      bodyImage: current30.reduce((sum, l) => sum + l.psychological.bodyImage, 0) / current30.length
    };

    const pastAvg = past30.length > 0 ? {
      acne: past30.reduce((sum, l) => sum + l.hyperandrogenism.acne, 0) / past30.length,
      hirsutism: past30.reduce((sum, l) => sum + l.hyperandrogenism.hirsutism, 0) / past30.length,
      hairLoss: past30.reduce((sum, l) => sum + l.hyperandrogenism.hairLoss, 0) / past30.length,
      bodyImage: past30.reduce((sum, l) => sum + l.psychological.bodyImage, 0) / past30.length
    } : currentAvg;

    return {
      labels: ['Acne', 'Hirsutism', 'Hair Loss', 'Body Image'],
      datasets: [
        {
          label: 'Current',
          data: [currentAvg.acne, currentAvg.hirsutism, currentAvg.hairLoss, currentAvg.bodyImage],
          borderColor: 'rgb(45, 212, 191)',
          backgroundColor: 'rgba(45, 212, 191, 0.2)',
          borderWidth: 3,
          pointBackgroundColor: 'rgb(45, 212, 191)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(45, 212, 191)'
        },
        {
          label: 'Past',
          data: [pastAvg.acne, pastAvg.hirsutism, pastAvg.hairLoss, pastAvg.bodyImage],
          borderColor: 'rgb(71, 85, 105)',
          backgroundColor: 'rgba(71, 85, 105, 0.1)',
          borderWidth: 2,
          borderDash: [5, 5],
          pointBackgroundColor: 'rgb(71, 85, 105)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(71, 85, 105)'
        }
      ]
    };
  }, [current30, past30]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: 'rgb(148, 163, 184)',
          font: { size: 12, weight: '500' as const },
          usePointStyle: true,
          padding: 16
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: 'rgb(226, 232, 240)',
        bodyColor: 'rgb(203, 213, 225)',
        borderColor: 'rgba(45, 212, 191, 0.3)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y ?? context.parsed;
            return `${label}: ${typeof value === 'number' ? value.toFixed(1) : value}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'rgb(148, 163, 184)', font: { size: 10 } },
        border: { display: false }
      },
      y: {
        grid: { color: 'rgba(71, 85, 105, 0.1)', drawBorder: false },
        ticks: { color: 'rgb(148, 163, 184)', font: { size: 10 } },
        border: { display: false },
        min: 0,
        max: 10
      }
    }
  };

  const barOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: 'rgb(226, 232, 240)',
        bodyColor: 'rgb(203, 213, 225)',
        borderColor: 'rgba(45, 212, 191, 0.3)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context: any) => `${context.parsed.x.toFixed(1)}% improvement`
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(71, 85, 105, 0.1)', drawBorder: false },
        ticks: { color: 'rgb(148, 163, 184)', font: { size: 10 } },
        border: { display: false }
      },
      y: {
        grid: { display: false },
        ticks: { color: 'rgb(148, 163, 184)', font: { size: 11, weight: '500' as const } },
        border: { display: false }
      }
    }
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: 'rgb(148, 163, 184)',
          font: { size: 12, weight: '500' as const },
          usePointStyle: true,
          padding: 16
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: 'rgb(226, 232, 240)',
        bodyColor: 'rgb(203, 213, 225)',
        borderColor: 'rgba(45, 212, 191, 0.3)',
        borderWidth: 1,
        padding: 12
      }
    },
    scales: {
      r: {
        min: 0,
        max: 10,
        beginAtZero: true,
        grid: { color: 'rgba(71, 85, 105, 0.15)' },
        angleLines: { color: 'rgba(71, 85, 105, 0.15)' },
        pointLabels: {
          color: 'rgb(148, 163, 184)',
          font: { size: 12, weight: '600' as const }
        },
        ticks: {
          color: 'rgb(100, 116, 139)',
          font: { size: 9 },
          backdropColor: 'transparent',
          stepSize: 2
        }
      }
    }
  };

  if (logs.length < 7) {
    return (
      <Card className="border-slate-700/50 bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-xl">
        <div className="p-8 text-center">
          <Info className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">Not Enough Data</h3>
          <p className="text-slate-400 text-sm">Log at least 7 days to see hyperandrogenism insights</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Hyperandrogenism Insights</h2>
        <p className="text-slate-400 text-sm">Track acne, hirsutism, and hair loss trends over time</p>
      </div>

      {trendData && (
        <Card className="border-slate-700/50 bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-purple-500/5 to-transparent pointer-events-none" />
          <div className="absolute inset-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),inset_0_-1px_0_0_rgba(0,0,0,0.3)] pointer-events-none rounded-xl" />

          <div className="relative p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Acne Trend</h3>
                <p className="text-sm text-slate-400">30-day comparison</p>
              </div>
              <Badge
                variant={trendData.velocity.trend === 'improving' ? 'default' : 'destructive'}
                className={`flex items-center gap-1 ${
                  trendData.velocity.trend === 'improving'
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                    : trendData.velocity.trend === 'worsening'
                    ? 'bg-red-500/20 text-red-300 border-red-500/30'
                    : 'bg-slate-500/20 text-slate-300 border-slate-500/30'
                }`}
              >
                {trendData.velocity.trend === 'improving' ? (
                  <TrendingDown className="w-3 h-3" />
                ) : trendData.velocity.trend === 'worsening' ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <Minus className="w-3 h-3" />
                )}
                {trendData.velocity.trend === 'improving' ? '↓' : trendData.velocity.trend === 'worsening' ? '↑' : '~'}
                {trendData.velocity.changePerWeek.toFixed(1)}/week
              </Badge>
            </div>
            <div className="h-64">
              <Line data={trendData} options={chartOptions} />
            </div>
          </div>
        </Card>
      )}

      {factorData && (
        <Card className="border-slate-700/50 bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-purple-500/5 to-transparent pointer-events-none" />
          <div className="absolute inset-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),inset_0_-1px_0_0_rgba(0,0,0,0.3)] pointer-events-none rounded-xl" />

          <div className="relative p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">Lifestyle Factor Impact</h3>
              <p className="text-sm text-slate-400">Which factors reduce acne symptoms the most</p>
            </div>
            <div className="h-64">
              <Bar data={factorData} options={barOptions} />
            </div>
          </div>
        </Card>
      )}

      {radarData && (
        <Card className="border-slate-700/50 bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-purple-500/5 to-transparent pointer-events-none" />
          <div className="absolute inset-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),inset_0_-1px_0_0_rgba(0,0,0,0.3)] pointer-events-none rounded-xl" />

          <div className="relative p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">Symptom Overview</h3>
              <p className="text-sm text-slate-400">Current vs previous 30-day period</p>
            </div>
            <div className="h-80">
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
