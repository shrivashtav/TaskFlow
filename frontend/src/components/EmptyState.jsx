import React from 'react';
import { FolderPlus, Inbox, Search } from 'lucide-react';

export default function EmptyState({
  title = 'No items found',
  description = 'Get started by creating your first item.',
  actionLabel,
  onAction,
  iconType = 'inbox'
}) {
  const renderIcon = () => {
    switch (iconType) {
      case 'search':
        return <Search size={28} />;
      case 'folder':
        return <FolderPlus size={28} />;
      default:
        return <Inbox size={28} />;
    }
  };

  return (
    <div className="empty-state">
      <div className="empty-icon-circle">
        {renderIcon()}
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-desc">{description}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
