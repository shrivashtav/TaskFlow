import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ message = 'An error occurred while loading data.', onRetry }) {
  return (
    <div
      style={{
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--danger-bg)',
        border: '1px solid var(--danger-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '1rem 0'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <AlertTriangle size={22} color="var(--danger-dot)" />
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--danger-text)' }}>
          {message}
        </span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-secondary btn-sm"
          style={{ background: '#ffffff', color: 'var(--danger-text)', borderColor: 'var(--danger-border)' }}
        >
          <RefreshCw size={14} />
          Retry
        </button>
      )}
    </div>
  );
}
