import React from 'react';
import { Menu, LogOut, CheckSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onToggleSidebar, title = 'TaskFlow' }) {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          onClick={onToggleSidebar}
          className="menu-toggle-btn"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>
        <div className="navbar-title">
          <span>{title}</span>
        </div>
      </div>

      <div className="navbar-right">
        {user && (
          <div className="user-profile-badge">
            <div className="user-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.email}</span>
            </div>
          </div>
        )}

        <button onClick={logout} className="logout-btn" title="Sign out of TaskFlow">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
