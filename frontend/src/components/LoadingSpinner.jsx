import React from 'react';

export default function LoadingSpinner({ message = 'Loading...', size = 'default' }) {
  const isSmall = size === 'small';

  return (
    <div className="spinner-container" style={isSmall ? { padding: '1rem', flexDirection: 'row' } : {}}>
      <div className={`spinner ${isSmall ? 'spinner-sm' : ''}`} />
      {message && (
        <span style={{ fontSize: isSmall ? '0.8125rem' : '0.875rem', color: 'var(--slate-500)', fontWeight: 500 }}>
          {message}
        </span>
      )}
    </div>
  );
}
