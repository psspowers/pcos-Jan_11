import { useState } from 'react';
import { useCategoryInsights, InsightCategory } from '../lib/hooks/useInsights';
import { Line, Radar, Bar } from 'react-chartjs-2';
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
import { TrendingUp, TrendingDown, Minus, Activity, Brain, Heart } from 'lucide-react';

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

export function Insights() {
  const [category, setCategory] = useState<InsightCategory>('hyperandrogenism');
  const [timeframe, setTimeframe] = useState<7 | 30>(7);
  const { insights, loading } = useCategoryInsights(category, timeframe);

  const categoryConfig = {
    hyperandrogenism: {
      label: 'Physical',
      icon: Activity,
      color: 'rgba(251, 113, 133, 0.8)',
      bgColor: 'rgba(251, 113, 133, 0.1)',
      borderColor: 'rgb(251, 113, 133)'
    },
    metabolic: {
      label: 'Metabolic',
      icon: Heart,
      color: 'rgba(251, 191, 36, 0.8)',
      bgColor: 'rgba(251, 191, 36, 0.1)',
      borderColor: 'rgb(251, 191, 36)'
    },
    psych: {
      label: 'Emotional',
      icon: Brain,
      color: 'rgba(167, 139, 250, 0.8)',
      bgColor: 'rgba(167, 139, 250, 0.1)',
      borderColor: 'rgb(167, 139, 250)'
    }
  };

  const currentConfig = categoryConfig[category as keyof typeof categoryConfig];

  const lineData = {
    labels: insights.trendData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Symptom Trend',
        data: insights.trendData.map(d => d.value),
        fill: true,
        borderColor: currentConfig?.borderColor || 'rgb(45, 212, 191)',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, currentConfig?.color || 'rgba(45, 212, 191, 0.4)');
          gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
          return gradient;
        },
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: currentConfig?.borderColor || 'rgb(45, 212, 191)',
        pointBorderWidth: 2,
        pointBorderColor: 'rgba(15, 23, 42, 1)'
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
      },
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255, 255, 255, 0.5)', maxRotation: 45 }
      }
    }
  };

  const radarData = {
    labels: insights.radarLabels,
    datasets: [
      {
        label: 'Current',
        data: insights.radarCurrent.data,
        backgroundColor: currentConfig?.color || 'rgba(45, 212, 191, 0.2)',
        borderColor: currentConfig?.borderColor || 'rgb(45, 212, 191)',
        borderWidth: 2,
        pointBackgroundColor: currentConfig?.borderColor || 'rgb(45, 212, 191)',
        pointBorderColor: 'rgba(15, 23, 42, 1)',
        pointBorderWidth: 2,
        pointRadius: 4
      },
      {
        label: 'Baseline',
        data: insights.radarBaseline.data,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: 'rgba(255, 255, 255, 0.3)',
        pointBorderColor: 'rgba(15, 23, 42, 1)',
        pointBorderWidth: 2,
        pointRadius: 3
      }
    ]
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          padding: 15,
          font: { size: 11 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: { size: 11 }
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          backdropColor: 'transparent'
        }
      }
    }
  };

  const barData = {
    labels: insights.factorImpacts.map(f => f.factor),
    datasets: [
      {
        label: 'Impact %',
        data: insights.factorImpacts.map(f => f.impact),
        backgroundColor: insights.factorImpacts.map(f =>
          f.impact > 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'
        ),
        borderColor: insights.factorImpacts.map(f =>
          f.impact > 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
        ),
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  };

  const barOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context: any) => {
            const impact = insights.factorImpacts[context.dataIndex];
            return `${Math.abs(impact.impact)}% - ${impact.description}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          callback: (value: any) => `${value}%`
        }
      },
      y: {
        grid: { display: false },
        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
      }
    }
  };

  const VelocityBadge = () => {
    if (!insights.velocity) return null;

    const { direction, value, symptomName } = insights.velocity;
    const colors = {
      improving: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      worsening: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      stable: 'bg-slate-500/20 text-slate-300 border-slate-500/30'
    };

    const Icon = direction === 'improving' ? TrendingDown : direction === 'worsening' ? TrendingUp : Minus;

    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${colors[direction]}`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">
          {symptomName} {direction === 'stable' ? 'Stable' : `${direction} ${value}%`}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="mt-12 glass-card p-8">
        <div className="flex items-center justify-center">
          <div className="text-slate-400 animate-pulse">Loading insights...</div>
        </div>
      </div>
    );
  }

  const hasData = insights.trendData.length > 0;

  if (!hasData) {
    return (
      <div className="mt-12 glass-card p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">No Data Yet</h3>
          <p className="text-slate-400 text-sm">
            Start logging your daily data to see personalized insights and trends.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Insights Engine</h2>
          <p className="text-sm text-slate-400 mt-1">Evidence-based pattern analysis</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white/5 rounded-lg p-1 gap-1">
            {[7, 30].map(days => (
              <button
                key={days}
                onClick={() => setTimeframe(days as 7 | 30)}
                className={`px-4 py-1.5 rounded text-xs font-medium transition-all ${
                  timeframe === days
                    ? 'bg-teal-400 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {days}D
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        {Object.entries(categoryConfig).map(([key, config]) => {
          const Icon = config.icon;
          const isActive = category === key;
          return (
            <button
              key={key}
              onClick={() => setCategory(key as InsightCategory)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? 'bg-white/10 text-white border border-white/20 shadow-lg'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {config.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/90 uppercase tracking-wide">
              Velocity Trend
            </h3>
            <VelocityBadge />
          </div>
          <div style={{ height: '280px' }}>
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-white/90 uppercase tracking-wide">
              Holistic Balance
            </h3>
            <p className="text-xs text-slate-500 mt-1">Current vs Baseline comparison</p>
          </div>
          <div style={{ height: '280px' }}>
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-white/90 uppercase tracking-wide">
              What Helps
            </h3>
            <p className="text-xs text-slate-500 mt-1">Top factor correlations</p>
          </div>
          {insights.factorImpacts.length > 0 ? (
            <div style={{ height: '280px' }}>
              <Bar data={barData} options={barOptions} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-[280px]">
              <p className="text-slate-500 text-sm">Not enough data for correlations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
