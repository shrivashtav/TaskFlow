import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem'
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--slate-100)',
          color: 'var(--slate-500)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}
      >
        <FileQuestion size={32} />
      </div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--slate-900)' }}>
        404 - Page Not Found
      </h1>
      <p style={{ fontSize: '1rem', color: 'var(--slate-500)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/dashboard" className="btn btn-primary">
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>
    </div>
  );
}
