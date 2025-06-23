import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function History() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/excel/history');
        setRecords(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch history:', err);
        alert('Could not load history.');
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Upload History</h2>
      {records.length === 0 ? (
        <p className="text-gray-600">No uploads found.</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-green-100">
              <tr>
                {Object.keys(records[0]).map((key) =>
                  key !== '__v' && key !== '_id' ? (
                    <th key={key} className="border px-4 py-2 text-sm text-left">{key}</th>
                  ) : null
                )}
              </tr>
            </thead>
            <tbody>
              {records.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {Object.entries(row).map(([key, val]) =>
                    key !== '__v' && key !== '_id' ? (
                      <td key={key} className="border px-4 py-2 text-sm">{val}</td>
                    ) : null
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
