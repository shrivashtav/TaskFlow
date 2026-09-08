import React from 'react';

export default function DashboardCard({
  title,
  value,
  icon: Icon,
  variant = 'primary',
  subtitle
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon-wrapper stat-icon-${variant}`}>
        {Icon && <Icon size={24} />}
      </div>
      <div className="stat-info">
        <span className="stat-label">{title}</span>
        <span className="stat-value">{value}</span>
        {subtitle && (
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '0.2rem' }}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
