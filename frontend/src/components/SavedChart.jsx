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

export default function SavedCharts() {
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

    fetchCharts();
  }, []);

  if (charts.length === 0) {
    return (
      <p className="text-gray-500 text-center mt-8">No charts saved yet.</p>
    );
  }

  return (
    <div className="w-full mt-12">
      <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">
        📊 Your Saved Charts
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {charts.map((chart) => {
          const labels = chart.data.map((row) => row[chart.xField]);
          const values = chart.data.map((row) => Number(row[chart.yField]) || 0);

          const chartData = {
            labels,
            datasets: [
              {
                label: `${chart.yField} vs ${chart.xField}`,
                data: values,
                backgroundColor: 'rgba(59,130,246,0.35)',
                borderColor: 'rgb(59,130,246)',
                borderWidth: 2,
              },
            ],
          };

          return (
            <div
              key={chart._id}
              className="bg-white rounded-xl shadow-md p-4 sm:p-5 border border-gray-100 w-full max-w-xs"
            >
              <h3 className="text-sm font-semibold mb-3">
                {chart.chartType.toUpperCase()} · {chart.xField} vs {chart.yField}
              </h3>

              <div className="relative w-full h-40 sm:h-48">
                {chart.chartType === 'bar' ? (
                  <Bar
                    data={chartData}
                    options={{
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: {
                          ticks: { font: { size: 10 } },
                        },
                      },
                    }}
                  />
                ) : (
                  <Line
                    data={chartData}
                    options={{
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      elements: { point: { radius: 2 } },
                      scales: {
                        y: {
                          ticks: { font: { size: 10 } },
                        },
                      },
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
