
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);


const StatsChart = ({ data, labels, title }) => {
  // Gradijent boje za stubove
  const getGradient = (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    return gradient;
  };

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: title || 'Broj prijava po mesecu',
        data: data,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          return getGradient(ctx);
        },
        borderColor: '#667eea',
        borderWidth: 2,
        datalabels: {
          color: '#222',
          anchor: 'end',
          align: 'top',
          font: {
            weight: 'bold',
            size: 14,
          },
        },
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#333',
          font: {
            size: 16,
            weight: 'bold',
          },
        },
      },
      title: {
        display: !!title,
        text: title,
        color: '#764ba2',
        font: {
          size: 20,
          weight: 'bold',
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#667eea',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#764ba2',
        borderWidth: 1,
        padding: 12,
        titleFont: { size: 16, weight: 'bold' },
        bodyFont: { size: 14 },
      },
      datalabels: {
        display: true,
        color: '#222',
        font: {
          weight: 'bold',
          size: 14,
        },
        anchor: 'end',
        align: 'top',
        formatter: (value) => value,
      },
    },
    animation: {
      duration: 1200,
      easing: 'easeOutQuart',
    },
    scales: {
      x: {
        ticks: {
          color: '#333',
          font: { size: 14, weight: 'bold' },
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#333',
          font: { size: 14, weight: 'bold' },
        },
        grid: { color: '#eee' },
      },
    },
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #667eea22', padding: 24 }}>
      <Bar data={chartData} options={options} plugins={[ChartDataLabels]} />
    </div>
  );
};

export default StatsChart;
