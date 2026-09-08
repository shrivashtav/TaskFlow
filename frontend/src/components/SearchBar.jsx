import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  width
}) {
  return (
    <div className="search-input-wrapper" style={width ? { maxWidth: width } : {}}>
      <Search className="search-icon" size={17} />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          onClick={onClear}
          className="btn-icon-only"
          style={{
            position: 'absolute',
            right: '0.625rem',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '0.25rem'
          }}
          title="Clear search"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
