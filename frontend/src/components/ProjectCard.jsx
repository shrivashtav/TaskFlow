import React from 'react';
import { Link } from 'react-router-dom';
import { Folder, CheckCircle2, ArrowRight, MoreVertical, Edit2, Trash2 } from 'lucide-react';

export default function ProjectCard({ project, onEdit, onDelete, compact = false }) {
  const total = project.total_tasks || 0;
  const completed = project.completed_tasks || 0;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-50)',
              color: 'var(--primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Folder size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)' }}>
              {project.name}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
              Created {new Date(project.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {!compact && (
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button
              onClick={() => onEdit && onEdit(project)}
              className="btn-icon-only"
              title="Edit project"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete && onDelete(project)}
              className="btn-icon-only"
              style={{ color: 'var(--danger-dot)' }}
              title="Delete project"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--slate-600)',
          marginBottom: '1.25rem',
          lineHeight: '1.5',
          flex: 1
        }}
      >
        {project.description || 'No description provided.'}
      </p>

      {/* Progress & Task Counts */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.8125rem',
            color: 'var(--slate-500)',
            marginBottom: '0.4rem',
            fontWeight: 500
          }}
        >
          <span>Progress ({percent}%)</span>
          <span>
            {completed} of {total} completed
          </span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <Link
        to={`/projects/${project.id}`}
        className="btn btn-secondary"
        style={{ width: '100%', justifyContent: 'center' }}
      >
        View Project Details
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}
