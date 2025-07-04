/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FiUploadCloud,
  FiSave,
  FiDownload,
  FiFileText,
} from 'react-icons/fi';
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
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import ThreeBarChart from '../components/ThreeBarChart';

/* ---------- Chart.js registration ---------- */
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

export default function UploadAndChart() {
  /* ----- state ----- */
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

  /* ----- refs ----- */
  const chartRef = useRef(null); // for PNG / PDF export

  /* ----- derived ----- */
  const columns = rows.length ? Object.keys(rows[0]) : [];
  const chartData =
    rows.length && xField && yField
      ? {
          labels: rows.map((r) => r[xField]),
          datasets: [
            {
              label: `${yField} vs ${xField}`,
              data: rows.map((r) => Number(r[yField]) || 0),
              borderWidth: 2,
              borderColor: 'rgb(16,185,129)',
              backgroundColor: 'rgba(16,185,129,0.35)',
            },
          ],
        }
      : null;

  /* =========================================================
     Upload Excel
  ========================================================= */
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

  /* =========================================================
     Save chart configuration
  ========================================================= */
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

  /* =========================================================
     PNG export
  ========================================================= */
  const exportPNG = () => {
    if (!chartRef.current) return;
    const url = chartRef.current.toBase64Image();
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chart.png';
    a.click();
  };

  /* =========================================================
     PDF export
  ========================================================= */
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

  /* =========================================================
     UI
  ========================================================= */
  return (
    <section className="mx-auto max-w-7xl p-4 sm:p-6 bg-gradient-to-br from-green-50 via-white to-sky-50 min-h-screen">
      {/* Header */}
      <header className="mb-10 grid gap-8 md:grid-cols-2 items-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800">
          Upload&nbsp;and&nbsp;
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
            Visualize
          </span>
          &nbsp;Excel&nbsp;Data
        </h1>
        <img
          src="/src/assets/Images/Upload Illustration.png"
          alt="illustration"
          className="hidden md:block w-full max-w-sm mx-auto"
        />
      </header>

      {/* Card */}
      <div className="bg-white border rounded-2xl shadow-xl p-6 space-y-6">
        {/* upload */}
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
            className={`flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded text-white ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? <Loader2 className="animate-spin" /> : <FiUploadCloud />}
            {loading ? 'Uploading…' : 'Upload'}
          </button>
        </div>

        {/* selectors */}
        {rows.length > 0 && (
          <div className="grid gap-4 md:grid-cols-3">
            <Dropdown label="X-Axis" value={xField} onChange={setXField} options={columns} />
            <Dropdown label="Y-Axis" value={yField} onChange={setYField} options={columns} />
            <Dropdown
              label="Chart type"
              value={chartType}
              onChange={setChartType}
              options={['line', 'bar']}
            />
          </div>
        )}

        {/* view toggle */}
        {chartData && (
          <div className="flex items-center gap-3 flex-wrap">
            <label className="font-medium text-sm">View:</label>
            <select
              value={chartView}
              onChange={(e) => setChartView(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="2d">2-D Chart.js</option>
              <option value="3d">3-D Three.js</option>
            </select>
          </div>
        )}

        {/* chart */}
        {chartData && chartView === '2d' && (
          <div className="w-full overflow-x-auto">
            {chartType === 'bar' ? (
              <Bar ref={chartRef} data={chartData} options={{ responsive: true }} />
            ) : (
              <Line ref={chartRef} data={chartData} options={{ responsive: true }} />
            )}
          </div>
        )}

        {chartView === '3d' && xField && yField && (
          <div className="w-full overflow-x-auto">
            <ThreeBarChart data={rows} xField={xField} yField={yField} />
          </div>
        )}

        {/* action buttons */}
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

            {/* export buttons only for 2-D */}
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
                  {exporting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <FiFileText />
                  )}
                  PDF
                </button>
              </>
            )}
          </div>
        )}

        {/* raw table */}
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

/* =========================================================
   Re-usable sub-components
========================================================= */
function Dropdown({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded px-3 py-2 text-sm"
      >
        <option value="">— choose —</option>
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function RawTable({ rows }) {
  const cols = Object.keys(rows[0] || {});
  return (
    <div className="overflow-x-auto mt-4 border rounded">
      <table className="min-w-full text-sm">
        <thead className="bg-green-100">
          <tr>
            {cols.map((k) => (
              <th key={k} className="px-4 py-2 border">
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 ? 'bg-gray-50' : 'bg-white'}>
              {cols.map((k) => (
                <td key={k} className="px-4 py-2 border">
                  {typeof row[k] === 'object' ? JSON.stringify(row[k]) : row[k]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
