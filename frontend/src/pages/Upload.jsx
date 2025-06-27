import React, { useState } from 'react';
import axios from 'axios';
import { FiUploadCloud } from 'react-icons/fi';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert('Please select a file.');

    const formData = new FormData();
    formData.append('excel', file);

    const token = localStorage.getItem('token');

    try {
      setLoading(true);
      const res = await axios.post(
        'http://localhost:8000/api/excel/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(res.data.data);
    } catch (err) {
      console.error('❌ Upload failed:', err);
      alert('Upload failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-4 sm:p-6 max-w-7xl bg-gradient-to-br mx-auto">
      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Upload and Analyze{' '}
            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Excel
            </span>{' '}
            Data Instantly
          </h1>
        </div>

        {/* ✅ Hide on mobile */}
        <div className="hidden md:flex justify-center">
          <img
            src="/src/assets/Images/Upload Illustration.png"
            alt="Excel illustration"
            className="w-full max-w-sm object-contain"
          />
        </div>
      </div>

      {/* Upload Card */}
      <div className="bg-white shadow-xl rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">
          <FiUploadCloud className="text-3xl" />
          Upload Excel File
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="border border-gray-300 rounded px-4 py-2 text-sm w-full sm:w-auto"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`px-6 py-2 rounded text-white font-semibold text-sm transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        {/* Parsed Data Table */}
        {data.length > 0 && (
          <div className="mt-8 overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Parsed Data:
            </h3>
            <table className="min-w-full text-sm border border-gray-300">
              <thead>
                <tr className="bg-green-100 text-left">
                  {Object.keys(data[0]).map((key) => (
                    <th key={key} className="px-4 py-2 border">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    {Object.values(row).map((val, i) => (
                      <td key={i} className="px-4 py-2 border">
                        {typeof val === 'object' ? JSON.stringify(val) : val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && data.length === 0 && (
          <p className="text-gray-500 mt-6 text-sm italic">
            No data uploaded yet.
          </p>
        )}
      </div>
    </section>
  );
}
