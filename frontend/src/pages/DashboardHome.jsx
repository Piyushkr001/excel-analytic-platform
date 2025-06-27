import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

export default function DashboardHome() {
  const isAuthenticated = !!localStorage.getItem('token');
  const [charts, setCharts] = useState([]);

  useEffect(() => {
    const fetchCharts = async () => {
      const token = localStorage.getItem('token');
      try {
        const { data } = await axios.get('http://localhost:8000/api/charts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCharts(data);
      } catch (err) {
        console.error('Failed to fetch charts:', err);
      }
    };

    if (isAuthenticated) fetchCharts();
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col items-center text-center p-6">
      <img
        src="/src/assets/Images/DashBoard-Illustration.webp"
        alt="Dashboard illustration"
        className="w-full max-w-md mb-10"
      />
      <h1 className="text-3xl font-bold text-gray-800">
        Welcome to Excel Analytics Platform
      </h1>

      {isAuthenticated && (
        <>
          <p className="text-gray-600 mt-4 max-w-xl">
            You're now logged in 🎉 Use the sidebar to upload Excel files, view analysis
            history, or access admin tools. Start exploring your data visually!
          </p>

          <div className="w-full mt-12 space-y-8">
            <h2 className="text-xl font-semibold text-gray-700">📊 Your Saved Charts</h2>

            {charts.length === 0 && <p className="text-gray-500">No charts saved yet.</p>}

            {charts.map((chart) => {
              const labels = chart.data.map(row => row[chart.xField]);
              const dataPoints = chart.data.map(row => Number(row[chart.yField]) || 0);

              const chartData = {
                labels,
                datasets: [
                  {
                    label: `${chart.yField} vs ${chart.xField}`,
                    data: dataPoints,
                    borderWidth: 2,
                    backgroundColor: 'rgba(59,130,246,0.3)',
                    borderColor: 'rgb(59,130,246)',
                  },
                ],
              };

              return (
                <div key={chart._id} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-md font-semibold mb-2">
                    {chart.chartType.toUpperCase()} Chart: {chart.xField} vs {chart.yField}
                  </h3>
                  {chart.chartType === 'bar' ? (
                    <Bar data={chartData} options={{ responsive: true }} />
                  ) : (
                    <Line data={chartData} options={{ responsive: true }} />
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
