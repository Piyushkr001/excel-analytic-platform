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

    const token = localStorage.getItem('token'); // ✅ get token

    try {
      setLoading(true);
      const res = await axios.post(
        'http://localhost:8000/api/excel/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`, // ✅ send token in header
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
    <section className="p-6 max-w-7xl mx-auto">
      <div className="bg-white shadow-xl rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">
          <FiUploadCloud className="text-3xl" />
          Upload Excel File
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="border border-gray-300 rounded px-4 py-2 text-sm w-full sm:w-auto"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`px-6 py-2 rounded text-white font-semibold text-sm transition ${loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
              }`}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        {/* Parsed Data Table */}
        {data.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Parsed Data:</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-300">
                <thead>
                  <tr className="bg-green-100 text-left">
                    {Object.keys(data[0]).map((key) => (
                      <th key={key} className="px-4 py-2 border">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      {Object.values(row).map((val, i) => (
                        <td key={i} className="px-4 py-2 border">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && data.length === 0 && (
          <p className="text-gray-500 mt-6 text-sm italic">No data uploaded yet.</p>
        )}
      </div>
    </section>
  );
}
