import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiClock } from 'react-icons/fi';

export default function History() {
  const [groupedRecords, setGroupedRecords] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Missing token');

        const res = await axios.get('http://localhost:8000/api/excel/history', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;

        // ✅ Group by uploadId using .records inside each group
        const groups = {};
        data.forEach((upload) => {
          const key = upload._id || 'unknown';
          groups[key] = upload.records;
        });

        setGroupedRecords(groups);
      } catch (err) {
        console.error('❌ Error fetching history:', err);
        alert('Failed to fetch history. Try logging in again.');
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
          Your Uploads History
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : Object.keys(groupedRecords).length === 0 ? (
          <p className="text-gray-500">No upload history found.</p>
        ) : (
          Object.entries(groupedRecords).map(([uploadId, records], index) => (
            <div key={uploadId} className="mb-10">
              <h3 className="text-lg font-semibold mb-2">
                Upload #{index + 1} – ID:{' '}
                <span className="text-sm text-gray-500">{uploadId}</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 text-sm mb-6">
                  <thead>
                    <tr className="bg-green-100 text-left">
                      {Object.keys(records?.[0] || {}).filter(k => k !== '__v').map((key) => (
                        <th key={key} className="border px-4 py-2">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {Object.keys(records?.[0] || {}).filter(k => k !== '__v').map((key) => (
                          <td key={key} className="border px-4 py-2">
                            {typeof row[key] === 'object'
                              ? JSON.stringify(row[key])
                              : row[key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
