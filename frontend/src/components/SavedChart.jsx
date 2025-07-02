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
      try {
        const token = localStorage.getItem('token');
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

  if (!charts.length) {
    return (
      <p className="mt-10 text-center text-base text-gray-500">
        No charts saved yet.
      </p>
    );
  }

  return (
    <section className="mt-12 w-full rounded-3xl border border-gray-200 shadow-md">
      <h2 className="mb-8 mt-5 text-center text-2xl font-semibold text-gray-700">
        📊 Your Saved Charts
      </h2>

      <div className="mx-auto mb-10 grid max-w-7xl gap-6 px-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
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

          const commonOptions = {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } },
            scales: { y: { ticks: { font: { size: 10 } } } },
          };

          return (
            <article
              key={chart._id}
              className="flex w-full flex-col overflow-hidden rounded-xl border border-gray-300 bg-white shadow hover:border-gray-400 transition-all"
            >
              <header className="px-4 pt-4 text-sm font-medium">
                {chart.chartType.toUpperCase()} · {chart.xField} vs {chart.yField}
              </header>

              <div className="relative w-full grow">
                <div className="aspect-[4/3]">
                  {chart.chartType === 'bar' ? (
                    <Bar data={chartData} options={commonOptions} />
                  ) : (
                    <Line
                      data={chartData}
                      options={{
                        ...commonOptions,
                        elements: { point: { radius: 2 } },
                      }}
                    />
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
