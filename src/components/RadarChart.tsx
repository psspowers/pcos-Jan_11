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
}

export const MentalWellnessRadar: React.FC<RadarChartProps> = ({
  anxiety,
  depression,
  stress,
  sleepQuality,
  bodyImage
}) => {
  const data = {
    labels: ['Anxiety', 'Low Mood', 'Stress', 'Sleep', 'Body Image'],
    datasets: [
      {
        label: 'Today',
        data: [
          anxiety,
          depression,
          stress,
          5 - sleepQuality,
          5 - bodyImage
        ],
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: 'rgba(239, 68, 68, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(239, 68, 68, 1)'
      }
    ]
  };

  const options: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        angleLines: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        pointLabels: {
          color: 'rgba(241, 245, 249, 0.7)',
          font: {
            size: 11,
            family: 'Inter, system-ui, sans-serif'
          }
        },
        ticks: {
          color: 'rgba(241, 245, 249, 0.5)',
          backdropColor: 'transparent',
          stepSize: 1,
          maxTicksLimit: 6
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
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: 'rgba(241, 245, 249, 0.9)',
        bodyColor: 'rgba(241, 245, 249, 0.8)',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const value = context.parsed.r;
            const label = context.label || '';

            if (label === 'Sleep' || label === 'Body Image') {
              return `${label}: ${5 - value}/5`;
            }
            return `${label}: ${value}/5`;
          }
        }
      }
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Radar data={data} options={options} />
    </div>
  );
};
