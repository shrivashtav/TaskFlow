import React from 'react';

export default function FilterDropdown({
  label,
  value,
  onChange,
  options = []
}) {
  return (
    <select
      className="filter-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
