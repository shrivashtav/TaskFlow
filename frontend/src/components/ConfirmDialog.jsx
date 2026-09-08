import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDestructive = true,
  isLoading = false,
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={isLoading ? undefined : onCancel}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            {isDestructive && (
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--danger-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <AlertCircle size={18} color="var(--danger-dot)" />
              </div>
            )}
            <h3 className="modal-title">{title}</h3>
          </div>
          {!isLoading && (
            <button onClick={onCancel} className="modal-close-btn" title="Close">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.9375rem', color: 'var(--slate-600)', lineHeight: '1.6' }}>
            {message}
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn ${isDestructive ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner spinner-sm" style={{ borderTopColor: '#fff' }} />
                {confirmLabel.endsWith('e') ? `${confirmLabel.slice(0, -1)}ing...` : `${confirmLabel}ing...`}
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
