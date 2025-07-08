import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ChartWrapper from '../components/ChartWrapper';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import { FiDownload, FiFileText } from 'react-icons/fi'; // icons

export default function SavedCharts() {
  const [charts, setCharts] = useState([]);
  const chartRefs = useRef({}); // map<chartId, ChartJS>

  /* fetch once */
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:8000/api/charts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCharts(data);
      } catch (err) {
        console.error('Failed to fetch charts:', err);
      }
    })();
  }, []);

  /* helper to persist each child ref */
  const attachRef = (id) => (instance) => {
    if (instance) chartRefs.current[id] = instance;
  };

  /* ---------- download helpers ---------- */

  const downloadPNG = (id, fileName) => {
    const chart = chartRefs.current[id];
    if (!chart) return toast.error('Chart not ready');
    const link = document.createElement('a');
    link.href = chart.toBase64Image('image/png', 1);
    link.download = `${fileName}.png`;
    link.click();
  };

  const downloadPDF = (id, meta) => {
    const chart = chartRefs.current[id];
    if (!chart) return toast.error('Chart not ready');

    const imgData = chart.toBase64Image('image/png', 1);
    const { width, height } = chart;
    const pdf = new jsPDF({
      orientation: width > height ? 'landscape' : 'portrait',
      unit: 'pt',
      format: [width + 80, height + 160], // leave room for header
    });

    pdf.setFontSize(14);
    pdf.text(`Chart Type : ${meta.chartType.toUpperCase()}`, 40, 30);
    pdf.text(`X-Axis     : ${meta.xField}`, 40, 50);
    pdf.text(`Y-Axis     : ${meta.yField}`, 40, 70);
    pdf.addImage(imgData, 'PNG', 40, 100, width, height);
    pdf.save(`${meta.chartType}-${meta.xField}-vs-${meta.yField}.pdf`);
  };

  /* ---------- render ---------- */

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
          /* ---------- build data + options exactly as before ---------- */
          const labels = chart.data.map((r) => r[chart.xField]);
          const values = chart.data.map((r) => Number(r[chart.yField]) || 0);

          const chartData =
            chart.chartType === 'scatter'
              ? {
                  datasets: [
                    {
                      label: `${chart.yField} vs ${chart.xField}`,
                      data: chart.data.map((r) => ({
                        x: Number(r[chart.xField]) || 0,
                        y: Number(r[chart.yField]) || 0,
                      })),
                      backgroundColor: 'rgba(59,130,246,0.6)',
                    },
                  ],
                }
              : chart.chartType === 'bubble'
              ? {
                  datasets: [
                    {
                      label: `${chart.yField} vs ${chart.xField}`,
                      data: chart.data.map((r) => ({
                        x: Number(r[chart.xField]) || 0,
                        y: Number(r[chart.yField]) || 0,
                        r: Number(r.radius) || 5,
                      })),
                      backgroundColor: 'rgba(59,130,246,0.6)',
                    },
                  ],
                }
              : chart.chartType === 'pie' || chart.chartType === 'doughnut'
              ? {
                  labels,
                  datasets: [
                    {
                      label: chart.yField,
                      data: values,
                      backgroundColor: [
                        '#60A5FA', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6',
                        '#3B82F6', '#F472B6', '#34D399', '#F87171', '#A78BFA',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }
              : {
                  labels,
                  datasets: [
                    {
                      label: `${chart.yField} vs ${chart.xField}`,
                      data: values,
                      backgroundColor:
                        chart.chartType === 'bar'
                          ? 'rgba(59,130,246,0.35)'
                          : 'rgba(59,130,246,0.15)',
                      borderColor: 'rgb(59,130,246)',
                      borderWidth: 2,
                      fill: chart.chartType === 'area',
                      tension: 0.3,
                    },
                  ],
                };

          const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true }, title: { display: false } },
            scales:
              ['scatter', 'line', 'bar', 'area', 'bubble'].includes(chart.chartType)
                ? {
                    x: { ticks: { font: { size: 10 } } },
                    y: { ticks: { font: { size: 10 } } },
                  }
                : undefined,
            elements:
              chart.chartType === 'line' || chart.chartType === 'area'
                ? { point: { radius: 3 }, line: { fill: chart.chartType === 'area' } }
                : {},
          };

          return (
            <article
              key={chart._id}
              className="flex w-full flex-col overflow-hidden rounded-xl border border-gray-300 bg-white shadow transition-all hover:border-gray-400"
            >
              {/* header + action icons */}
              <header className="flex items-center justify-between px-4 pt-4 text-sm font-medium">
                <span>
                  {chart.chartType.toUpperCase()} · {chart.xField} vs {chart.yField}
                </span>

                <div className="flex gap-2">
                  {/* PNG */}
                  <button
                    title="Download PNG"
                    className="rounded-md p-1 hover:bg-gray-100"
                    onClick={() =>
                      downloadPNG(chart._id, `${chart.xField}-${chart.yField}`)
                    }
                  >
                    <FiDownload className="h-4 w-4" />
                  </button>

                  {/* PDF */}
                  <button
                    title="Download PDF"
                    className="rounded-md p-1 hover:bg-gray-100"
                    onClick={() => downloadPDF(chart._id, chart)}
                  >
                    <FiFileText className="h-4 w-4" />
                  </button>
                </div>
              </header>

              {/* the chart */}
              <div className="relative w-full grow">
                <div className="aspect-[4/3]">
                  <ChartWrapper
                    id={`chart-${chart._id}`}
                    type={chart.chartType}
                    data={chartData}
                    options={options}
                    onChartReady={attachRef(chart._id)}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
