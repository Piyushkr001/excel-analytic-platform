/* -------------------------------------------------------------------------- */
/* Re-usable select component                                                 */
/* -------------------------------------------------------------------------- */

import React from 'react';

export default function Dropdown({ label, value, onChange, options }) {
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
