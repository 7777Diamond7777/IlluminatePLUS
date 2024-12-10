import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { NetworkStats } from '../../types/network';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface NetworkGraphProps {
  stats: NetworkStats;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ stats }) => {
  const dataPoints = useRef<number[]>([]);
  const labels = useRef<string[]>([]);

  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();
    dataPoints.current.push(stats.packetsPerSecond);
    labels.current.push(timestamp);

    if (dataPoints.current.length > 60) {
      dataPoints.current.shift();
      labels.current.shift();
    }
  }, [stats]);

  const data = {
    labels: labels.current,
    datasets: [
      {
        label: 'Packets/s',
        data: dataPoints.current,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(156, 163, 175)'
        }
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        ticks: {
          color: 'rgb(156, 163, 175)'
        }
      }
    }
  };

  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  );
};

export default NetworkGraph;