import React, { useState } from 'react';
import axios from 'axios';
import { FiUploadCloud, FiSave } from 'react-icons/fi';

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
  /* -------------- local state -------------- */
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);   // parsed rows
  const [uploadId, setId] = useState(null); // 🌟 returned by backend
  const [loading, setLoading] = useState(false);

  // chart selections
  const [xField, setXField] = useState('');
  const [yField, setYField] = useState('');
  const [chartType, setChartType] = useState('line');
  const [saving, setSaving] = useState(false);

  /* -------------- helpers -------------- */
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
            backgroundColor: 'rgba(16,185,129,0.4)',   // emerald-500 @ 40 %
            borderColor: 'rgb(16,185,129)',
          },
        ],
      }
      : null;

  /* -------------- handlers -------------- */
  const handleFileChange = (e) => setFile(e.target.files[0]);

  // ① upload Excel
  const handleUpload = async () => {
    if (!file) return alert('Please select a file');

    const token = localStorage.getItem('token');
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

      setRows(data.data);         // rows to table / chart
      setId(data.uploadId);       // 🌟 remember for “Save chart”
      setXField('');
      setYField('');
    } catch (err) {
      console.error('❌ Upload failed:', err);
      alert(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  // ② save chart config
  const handleSaveChart = async () => {
    if (!uploadId || !xField || !yField) return alert("Missing required fields");

    const token = localStorage.getItem('token');
    if (!token) return alert("You must be logged in");

    try {
      setSaving(true);
       await axios.post(                             // <- just await it
      'http://localhost:8000/api/charts',
      { uploadId, xField, yField, chartType },
      { headers: { Authorization: `Bearer ${token}` } }
    );
      alert('Chart configuration saved ✔');
    } catch (err) {
      console.error('❌ Save chart failed:', err.response?.data || err.message);
      alert(err.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  /* -------------- UI -------------- */
  return (
    <section className="mx-auto max-w-7xl p-4 sm:p-6 bg-gradient-to-br from-green-50 via-white to-sky-50 min-h-screen">
      {/* ---------- Hero ---------- */}
      <header className="mb-10 grid gap-8 md:grid-cols-2 items-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-800">
          Upload and&nbsp;
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
            Visualize
          </span>
          &nbsp;Excel&nbsp;Data
        </h1>

        <img
          src="/src/assets/Images/Upload Illustration.png"
          alt="Illustration"
          className="hidden md:block w-full max-w-sm mx-auto"
        />
      </header>

      {/* ---------- Upload Card ---------- */}
      <div className="rounded-2xl bg-white shadow-xl border border-gray-200 p-6 space-y-6">
        {/* upload */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="w-full sm:w-auto border border-gray-300 rounded px-4 py-2 text-sm"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded text-white transition ${loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
              }`}
          >
            <FiUploadCloud className="text-lg" />
            {loading ? 'Uploading…' : 'Upload'}
          </button>
        </div>

        {/* ---------- Column selectors ---------- */}
        {rows.length > 0 && (
          <div className="grid gap-4 md:grid-cols-3">
            <Selector
              label="X-Axis Column"
              value={xField}
              options={columns}
              onChange={setXField}
            />
            <Selector
              label="Y-Axis Column"
              value={yField}
              options={columns}
              onChange={setYField}
            />
            <Selector
              label="Chart Type"
              value={chartType}
              options={['line', 'bar']}
              onChange={setChartType}
            />
          </div>
        )}

        {/* ---------- Chart ---------- */}
        {chartData && (
          <div className="mt-8 space-y-4">
            {chartType === 'bar' ? (
              <Bar data={chartData} options={{ responsive: true }} />
            ) : (
              <Line data={chartData} options={{ responsive: true }} />
            )}

            {/* ----- Save button ----- */}
            <button
              onClick={handleSaveChart}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition disabled:opacity-60"
            >
              <FiSave /> {saving ? 'Saving…' : 'Save chart'}
            </button>
          </div>
        )}

        {/* ---------- Raw table ---------- */}
        {rows.length > 0 && (
          <details className="mt-8">
            <summary className="cursor-pointer text-sm text-gray-600">
              Show raw&nbsp;table
            </summary>
            <RawTable rows={rows} />
          </details>
        )}
      </div>
    </section>
  );
}

/* ---------- small sub-components ---------- */
function Selector({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-gray-300 p-2 text-sm"
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
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full text-sm border border-gray-300">
        <thead>
          <tr className="bg-green-100 text-left">
            {cols.map((k) => (
              <th key={k} className="px-4 py-2 border">
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className={idx % 2 ? 'bg-gray-50' : 'bg-white'}>
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
