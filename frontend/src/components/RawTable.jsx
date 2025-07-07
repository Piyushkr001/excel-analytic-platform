/* -------------------------------------------------------------------------- */
/* Generic “show me the raw data” table                                       */
/* -------------------------------------------------------------------------- */

import React from 'react';

export default function RawTable({ rows }) {
  if (!rows?.length) return null;

  const cols = Object.keys(rows[0]);

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
