import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  anxiety: number;
  depression: number;
  stress: number;
  sleepQuality: number;
  bodyImage: number;
  isMonthlyAverage?: boolean;
  baseline?: {
    anxiety: number;
    depression: number;
    stress: number;
    sleepQuality: number;
    bodyImage: number;
  };
}

export const MentalWellnessRadar: React.FC<RadarChartProps> = ({
  anxiety,
  depression,
  stress,
  sleepQuality,
  bodyImage,
  isMonthlyAverage = false,
  baseline
}) => {
  const datasets = [];

  if (baseline) {
    datasets.push({
      label: 'Last 30 Days',
      data: [
        baseline.anxiety,
        baseline.depression,
        baseline.stress,
        5 - baseline.sleepQuality,
        5 - baseline.bodyImage
      ],
      backgroundColor: 'transparent',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 2,
      borderDash: [5, 5],
      pointBackgroundColor: 'rgba(255, 255, 255, 0.2)',
      pointBorderColor: 'rgba(255, 255, 255, 0.3)',
      pointHoverBackgroundColor: 'rgba(255, 255, 255, 0.4)',
      pointHoverBorderColor: 'rgba(255, 255, 255, 0.5)',
      pointRadius: 3,
      pointHoverRadius: 5
    });
  }

  datasets.push({
    label: baseline ? 'Last 7 Days' : (isMonthlyAverage ? 'Monthly Baseline' : 'Today'),
    data: [
      anxiety,
      depression,
      stress,
      5 - sleepQuality,
      5 - bodyImage
    ],
    backgroundColor: 'rgba(45, 212, 191, 0.2)',
    borderColor: '#2dd4bf',
    borderWidth: 2.5,
    pointBackgroundColor: 'rgba(45, 212, 191, 1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(45, 212, 191, 1)',
    pointRadius: 4,
    pointHoverRadius: 6
  });

  const data = {
    labels: ['Anxiety', 'Mood Strain', 'Stress', 'Sleep', 'Body Image'],
    datasets
  };

  const options: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        angleLines: {
          color: 'rgba(148, 163, 184, 0.1)',
          lineWidth: 1
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          circular: true,
          lineWidth: 1
        },
        pointLabels: {
          color: 'rgba(241, 245, 249, 0.6)',
          font: {
            size: 11,
            family: 'Inter, system-ui, sans-serif',
            weight: '400'
          }
        },
        ticks: {
          color: 'rgba(241, 245, 249, 0.3)',
          backdropColor: 'transparent',
          stepSize: 1,
          maxTicksLimit: 6,
          display: false
        },
        suggestedMin: 0,
        suggestedMax: 5
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: 'rgba(45, 212, 191, 1)',
        bodyColor: 'rgba(241, 245, 249, 0.9)',
        borderColor: 'rgba(45, 212, 191, 0.3)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const value = context.parsed.r;
            const label = context.label || '';

            if (label === 'Sleep' || label === 'Body Image') {
              const displayValue = 5 - value;
              return `${label}: ${displayValue}/5 ${displayValue >= 4 ? '✨' : displayValue >= 3 ? '👌' : '💤'}`;
            }
            return `${label}: ${value}/5 ${value <= 1 ? '✨' : value <= 2 ? '👌' : '⚠️'}`;
          }
        }
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      {baseline && (
        <div className="text-center mb-2">
          <p className="text-xs text-white/40 font-light">Ghost: 30-Day Baseline</p>
          <p className="text-xs text-teal-400/80 font-semibold">Current: Last 7 Days</p>
        </div>
      )}
      {isMonthlyAverage && !baseline && (
        <div className="text-center mb-2">
          <p className="text-xs text-teal-400/80 font-light">30-Day Baseline</p>
        </div>
      )}
      <Radar data={data} options={options} />
    </div>
  );
};
