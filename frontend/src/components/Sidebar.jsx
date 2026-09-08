import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, Layers, ShieldCheck } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <CheckSquare size={20} />
          </div>
          <span className="brand-name">TaskFlow</span>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-heading">Main Navigation</span>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <FolderKanban size={18} />
            <span>Projects</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-pill">
            <ShieldCheck size={16} color="var(--primary-600)" />
            <span>MySQL 8.0 &bull; REST API</span>
          </div>
        </div>
      </aside>
    </>
  );
}
