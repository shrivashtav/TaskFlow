import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false
}) {
  const isEditing = !!initialData;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [status, setStatus] = useState('TODO');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || '');
        setDescription(initialData.description || '');
        setPriority(initialData.priority || 'MEDIUM');
        setStatus(initialData.status || 'TODO');
        setDueDate(initialData.due_date ? initialData.due_date.slice(0, 10) : '');
        setAssignedTo(initialData.assigned_to || '');
      } else {
        setTitle('');
        setDescription('');
        setPriority('MEDIUM');
        setStatus('TODO');
        setDueDate('');
        setAssignedTo('');
      }
      setError('');
      setTouched(false);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);

    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    if (!priority) {
      setError('Priority is required');
      return;
    }
    if (!status) {
      setError('Status is required');
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        due_date: dueDate ? dueDate : null,
        assigned_to: assignedTo.trim() ? assignedTo.trim() : null
      });
    } catch (err) {
      setError(err.message || 'Failed to save task. Please try again.');
    }
  };

  const isTitleInvalid = touched && !title.trim();

  return (
    <div className="modal-overlay" onClick={isLoading ? undefined : onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{isEditing ? 'Edit Task' : 'Add New Task'}</h3>
          {!isLoading && (
            <button onClick={onClose} className="modal-close-btn" title="Close">
              <X size={18} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--danger-bg)',
                  border: '1px solid var(--danger-border)',
                  color: 'var(--danger-text)',
                  fontSize: '0.8125rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-title">
                Task Title <span className="required-star">*</span>
              </label>
              <input
                id="task-title"
                type="text"
                className={`form-control ${isTitleInvalid ? 'is-invalid' : ''}`}
                placeholder="e.g. Design Landing Page UI"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError('');
                }}
                onBlur={() => setTouched(true)}
                autoFocus
              />
              {isTitleInvalid && (
                <div className="invalid-feedback">
                  <AlertCircle size={14} />
                  Task title is required
                </div>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-desc">
                Description
              </label>
              <textarea
                id="task-desc"
                className="form-control"
                rows="3"
                placeholder="Detailed task description and instructions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Priority & Status in 2 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label className="form-label" htmlFor="task-priority">
                  Priority <span className="required-star">*</span>
                </label>
                <select
                  id="task-priority"
                  className="form-control"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div>
                <label className="form-label" htmlFor="task-status">
                  Status <span className="required-star">*</span>
                </label>
                <select
                  id="task-status"
                  className="form-control"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="TODO">Todo</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>

            {/* Due Date & Assigned To in 2 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: 0 }}>
              <div>
                <label className="form-label" htmlFor="task-due-date">
                  Due Date
                </label>
                <input
                  id="task-due-date"
                  type="date"
                  className="form-control"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label" htmlFor="task-assigned-to">
                  Assigned To
                </label>
                <input
                  id="task-assigned-to"
                  type="text"
                  className="form-control"
                  placeholder="e.g. John Doe"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner spinner-sm" style={{ borderTopColor: '#fff' }} />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Task' : 'Add Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
