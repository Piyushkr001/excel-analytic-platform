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

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/excel/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(res.data.data);
    } catch (err) {
      console.error('❌ Upload failed:', err);
      alert('Upload failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">
          <FiUploadCloud className="text-3xl" />
          Upload Excel File
        </h2>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="border border-gray-300 rounded px-4 py-2 text-sm w-full md:w-auto"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`px-6 py-2 rounded text-white text-sm font-semibold transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        {/* Display Parsed Data */}
        {data.length > 0 && (
          <div className="mt-8 overflow-auto">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Parsed Data:</h3>
            <div className="w-full overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-green-100 text-left text-sm">
                    {Object.keys(data[0]).map((key) => (
                      <th key={key} className="border px-4 py-2">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} text-sm`}
                    >
                      {Object.values(row).map((val, i) => (
                        <td key={i} className="border px-4 py-2">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
