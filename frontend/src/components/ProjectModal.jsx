import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

export default function ProjectModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false
}) {
  const isEditing = !!initialData;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || '');
        setDescription(initialData.description || '');
      } else {
        setName('');
        setDescription('');
      }
      setError('');
      setTouched(false);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);

    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim()
      });
    } catch (err) {
      setError(err.message || 'Failed to save project. Please try again.');
    }
  };

  const isNameInvalid = touched && !name.trim();

  return (
    <div className="modal-overlay" onClick={isLoading ? undefined : onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{isEditing ? 'Edit Project' : 'Create New Project'}</h3>
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

            <div className="form-group">
              <label className="form-label" htmlFor="project-name">
                Project Name <span className="required-star">*</span>
              </label>
              <input
                id="project-name"
                type="text"
                className={`form-control ${isNameInvalid ? 'is-invalid' : ''}`}
                placeholder="e.g. Website Redesign"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                onBlur={() => setTouched(true)}
                autoFocus
              />
              {isNameInvalid && (
                <div className="invalid-feedback">
                  <AlertCircle size={14} />
                  Project name is required
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="project-description">
                Description
              </label>
              <textarea
                id="project-description"
                className="form-control"
                rows="4"
                placeholder="Brief summary of project goals and objectives..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
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
                isEditing ? 'Update Project' : 'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
