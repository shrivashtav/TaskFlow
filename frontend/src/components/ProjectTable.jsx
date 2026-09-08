import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit2, Trash2, Folder } from 'lucide-react';

export default function ProjectTable({ projects = [], onEdit, onDelete }) {
  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Description</th>
            <th>Tasks</th>
            <th>Progress</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => {
            const total = project.total_tasks || 0;
            const completed = project.completed_tasks || 0;
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <tr key={project.id}>
                <td style={{ fontWeight: 600, color: 'var(--slate-900)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <Folder size={18} color="var(--primary-600)" />
                    <Link
                      to={`/projects/${project.id}`}
                      style={{ color: 'var(--slate-900)', fontWeight: 600 }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-600)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--slate-900)')}
                    >
                      {project.name}
                    </Link>
                  </div>
                </td>
                <td style={{ color: 'var(--slate-600)', maxWidth: '320px' }}>
                  <div
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    title={project.description || ''}
                  >
                    {project.description || '—'}
                  </div>
                </td>
                <td>
                  <span style={{ fontWeight: 600, color: 'var(--slate-700)' }}>
                    {total} {total === 1 ? 'task' : 'tasks'}
                  </span>
                </td>
                <td style={{ width: '160px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div className="progress-bar-bg" style={{ flex: 1 }}>
                      <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', minWidth: '32px' }}>
                      {percent}%
                    </span>
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Link
                      to={`/projects/${project.id}`}
                      className="btn-icon-only"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </Link>
                    <button
                      onClick={() => onEdit(project)}
                      className="btn-icon-only"
                      title="Edit Project"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(project)}
                      className="btn-icon-only"
                      style={{ color: 'var(--danger-dot)' }}
                      title="Delete Project"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
