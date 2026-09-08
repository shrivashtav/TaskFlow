import React from 'react';
import { Calendar, User, Edit2, Trash2, CheckCircle2, Clock } from 'lucide-react';

export default function TaskTable({
  tasks = [],
  onEdit,
  onDelete,
  onStatusChange
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="badge badge-status-completed">
            <span className="badge-dot" />
            Completed
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="badge badge-status-in-progress">
            <span className="badge-dot" />
            In Progress
          </span>
        );
      default:
        return (
          <span className="badge badge-status-todo">
            <span className="badge-dot" />
            Todo
          </span>
        );
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'HIGH':
        return (
          <span className="badge badge-priority-high">
            <span className="badge-dot" />
            High
          </span>
        );
      case 'LOW':
        return (
          <span className="badge badge-priority-low">
            <span className="badge-dot" />
            Low
          </span>
        );
      default:
        return (
          <span className="badge badge-priority-medium">
            <span className="badge-dot" />
            Medium
          </span>
        );
    }
  };

  const formatDueDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isPast = date < today;
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: isPast ? 'var(--danger-dot)' : 'inherit' }}>
        <Calendar size={14} />
        {dateStr}
      </span>
    );
  };

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ minWidth: '220px' }}>Task</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Assigned To</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      fontWeight: 600,
                      color: 'var(--slate-900)',
                      textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none',
                      opacity: task.status === 'COMPLETED' ? 0.75 : 1
                    }}
                  >
                    {task.title}
                  </span>
                  {task.description && (
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--slate-500)',
                        marginTop: '0.2rem',
                        maxWidth: '300px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={task.description}
                    >
                      {task.description}
                    </span>
                  )}
                </div>
              </td>

              <td>{getPriorityBadge(task.priority)}</td>

              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <select
                    value={task.status}
                    onChange={(e) => onStatusChange && onStatusChange(task, e.target.value)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--slate-200)',
                      background: '#ffffff',
                      cursor: 'pointer'
                    }}
                    title="Change Status"
                  >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
              </td>

              <td style={{ fontSize: '0.8125rem', color: 'var(--slate-600)' }}>
                {formatDueDate(task.due_date)}
              </td>

              <td>
                {task.assigned_to ? (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.8125rem',
                      color: 'var(--slate-700)',
                      fontWeight: 500
                    }}
                  >
                    <User size={14} color="var(--slate-400)" />
                    {task.assigned_to}
                  </span>
                ) : (
                  <span style={{ color: 'var(--slate-400)', fontSize: '0.8125rem' }}>Unassigned</span>
                )}
              </td>

              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <button
                    onClick={() => onEdit(task)}
                    className="btn-icon-only"
                    title="Edit Task"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(task)}
                    className="btn-icon-only"
                    style={{ color: 'var(--danger-dot)' }}
                    title="Delete Task"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
