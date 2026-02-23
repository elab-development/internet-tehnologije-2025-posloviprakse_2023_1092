import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);