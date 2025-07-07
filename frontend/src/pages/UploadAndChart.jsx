/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiUploadCloud, FiSave, FiDownload, FiFileText } from 'react-icons/fi';
import { Loader2 } from 'lucide-react';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  BubbleController,
  ScatterController,
  Tooltip,
  Legend,
} from 'chart.js';

import {
  Line,
  Bar,
  Pie,
  Doughnut,
  Scatter,
  Bubble,
} from 'react-chartjs-2';

import Dropdown from '../components/Dropdown';
import RawTable from '../components/RawTable';
import ThreeChartWrapper from '../components/ThreeChartsWrapper';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  BubbleController,
  ScatterController,
  Tooltip,
  Legend
);

export default function UploadAndChart() {
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [uploadId, setUploadId] = useState(null);

  const [xField, setXField] = useState('');
  const [yField, setYField] = useState('');
  const [chartType, setChartType] = useState('line');
  const [chartView, setChartView] = useState('2d');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  const chartRef = useRef(null);

  const columns = rows.length ? Object.keys(rows[0]) : [];

  // Generate a unique color palette for every pie/doughnut slice
  const generateColors = (count) =>
    Array.from({ length: count }, (_, i) => `hsl(${(i * 360) / count}, 70%, 55%)`);

  const pieOrDoughnutColors = Array.from({ length: rows.length || 1 }, (_, i) => `rgb(${(i * 47) % 255}, ${(i * 91) % 255}, ${(i * 67) % 255})`);

  const chartData =
    rows.length && xField && yField
      ? {
          labels: rows.map((r) => r[xField]),
          datasets: [
            {
              label: `${yField} vs ${xField}`,
              data:
                chartType === 'bubble'
                  ? rows.map((r) => ({
                      x: Number(r[xField]),
                      y: Number(r[yField]),
                      r: 5 + Math.random() * 10,
                    }))
                  : chartType === 'scatter'
                  ? rows.map((r) => ({
                      x: Number(r[xField]),
                      y: Number(r[yField]),
                    }))
                  : rows.map((r) => Number(r[yField]) || 0),
              backgroundColor:
                chartType === 'pie' || chartType === 'doughnut'
                  ? pieOrDoughnutColors
                  : 'rgba(59,130,246,0.35)',
              borderColor: 'rgb(59,130,246)',
              borderWidth: 2,
              fill: chartType === 'area',
            },
          ],
        }
      : null;

      
  const handleUpload = async () => {
    if (!file) return toast.error('Please select a file');
    const token = localStorage.getItem('token');
    if (!token) return toast.error('Please login');

    const formData = new FormData();
    formData.append('excel', file);

    try {
      setLoading(true);
      const { data } = await axios.post(
        'http://localhost:8000/api/excel/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRows(data.data);
      setUploadId(data.uploadId ?? data.data[0]?.uploadId);
      setXField('');
      setYField('');
      toast.success('Excel parsed 🎉');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChart = async () => {
    if (!uploadId || !xField || !yField)
      return toast.error('Choose X & Y columns first');

    const token = localStorage.getItem('token');
    if (!token) return toast.error('Please login');

    try {
      setSaving(true);
      await axios.post(
        'http://localhost:8000/api/charts',
        { uploadId, xField, yField, chartType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Chart saved ✔');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const exportPNG = () => {
    if (!chartRef.current) return;
    const url = chartRef.current.toBase64Image();
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chart.png';
    a.click();
  };

  const exportPDF = async () => {
    if (!chartRef.current) return;
    try {
      setExporting(true);
      const canvas = await html2canvas(chartRef.current.canvas);
      const img = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(img, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('chart.pdf');
    } catch (e) {
      toast.error('PDF export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl p-4 sm:p-6 bg-gradient-to-br from-green-50 via-white to-sky-50 min-h-screen">
      <header className="mb-10 flex flex-col-reverse lg:flex-row items-center gap-8">
        <div className="text-center lg:text-left flex-1">
          <h1 className="text-4xl font-bold text-gray-800">
            Upload &nbsp;
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
              Excel Data
            </span>{' '}
            & Visualize
          </h1>
        </div>
        <div className="flex justify-center lg:justify-end flex-1">
          <img
            src="/src/assets/Images/Upload Illustration.png"
            alt="illustration"
            className="w-64 object-contain"
          />
        </div>
      </header>

      <div className="bg-white border rounded-2xl shadow-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="file"
            accept=".xls,.xlsx"
            onChange={(e) => setFile(e.target.files[0])}
            className="border rounded px-4 py-2 text-sm w-full sm:w-auto"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
          >
            {loading ? <Loader2 className="animate-spin" /> : <FiUploadCloud />}
            {loading ? 'Uploading…' : 'Upload'}
          </button>
        </div>

        {rows.length > 0 && (
          <div className="grid gap-4 md:grid-cols-3">
            <Dropdown label="X-Axis" value={xField} onChange={setXField} options={columns} />
            <Dropdown label="Y-Axis" value={yField} onChange={setYField} options={columns} />
            <Dropdown
              label="Chart type"
              value={chartType}
              onChange={setChartType}
              options={['line', 'area', 'bar', 'pie', 'doughnut', 'scatter', 'bubble']}
            />
          </div>
        )}

        {chartData && (
          <div className="flex items-center gap-3 flex-wrap">
            <label className="font-medium text-sm">View:</label>
            <select
              value={chartView}
              onChange={(e) => setChartView(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="2d">2-D View</option>
              <option value="3d">3-D View</option>
            </select>
          </div>
        )}

        {chartData && chartView === '2d' && (
          <div className="w-full overflow-x-auto">
            {{
              line: <Line ref={chartRef} data={chartData} options={{ responsive: true }} />,
              area: <Line ref={chartRef} data={chartData} options={{ responsive: true }} />,
              bar: <Bar ref={chartRef} data={chartData} options={{ responsive: true }} />,
              pie: <Pie ref={chartRef} data={chartData} options={{ responsive: true }} />,
              doughnut: <Doughnut ref={chartRef} data={chartData} options={{ responsive: true }} />,
              scatter: <Scatter ref={chartRef} data={chartData} options={{ responsive: true }} />,
              bubble: <Bubble ref={chartRef} data={chartData} options={{ responsive: true }} />,
            }[chartType]}
          </div>
        )}

        {chartData && chartView === '3d' && (
          <div className="w-full overflow-x-auto">
            <ThreeChartWrapper
              chartType={chartType}
              data={rows}
              xField={xField}
              yField={yField}
            />
          </div>
        )}

        {chartData && (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSaveChart}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded disabled:opacity-60"
            >
              {saving ? <Loader2 className="animate-spin" /> : <FiSave />}
              {saving ? 'Saving…' : 'Save chart'}
            </button>

            {chartView === '2d' && (
              <>
                <button
                  onClick={exportPNG}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  <FiDownload /> PNG
                </button>
                <button
                  onClick={exportPDF}
                  disabled={exporting}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded disabled:opacity-60"
                >
                  {exporting ? <Loader2 className="animate-spin" /> : <FiFileText />}
                  PDF
                </button>
              </>
            )}
          </div>
        )}

        {rows.length > 0 && (
          <details className="mt-6">
            <summary className="cursor-pointer text-sm text-gray-600">
              Show raw table
            </summary>
            <RawTable rows={rows} />
          </details>
        )}
      </div>
    </section>
  );
}