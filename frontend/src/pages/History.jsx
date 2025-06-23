import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiClock } from 'react-icons/fi';

export default function History() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token'); // ✅ get JWT token
        const res = await axios.get('http://localhost:8000/api/excel/history', {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ send token to backend
          },
        });
        setRecords(res.data);
      } catch (err) {
        console.error('❌ Error fetching history:', err);
        alert('Failed to fetch history. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">
          <FiClock className="text-3xl" />
          Upload History
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : records.length === 0 ? (
          <p className="text-gray-500">No upload history found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-green-100 text-left text-sm">
                  {Object.keys(records[0]).map((key) => (
                    <th key={key} className="border px-4 py-2">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((record, idx) => (
                  <tr
                    key={idx}
                    className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} text-sm`}
                  >
                    {Object.values(record).map((val, i) => (
                      <td key={i} className="border px-4 py-2">
                        {typeof val === 'object' ? JSON.stringify(val) : val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
