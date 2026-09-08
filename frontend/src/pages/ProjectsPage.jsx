import React, { useState, useEffect, useCallback } from 'react';
import { projectService } from '../services/projectService';
import { useToast } from '../context/ToastContext';
import { useDebounce } from '../hooks/useDebounce';
import ProjectTable from '../components/ProjectTable';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import ConfirmDialog from '../components/ConfirmDialog';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { Plus, LayoutGrid, List } from 'lucide-react';

export default function ProjectsPage() {
  const { showToast } = useToast();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & View Mode
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 350);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Modals & Dialogs
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProjects = useCallback(async (searchQuery = '') => {
    try {
      setLoading(true);
      setError(null);
      const res = await projectService.getProjects(searchQuery);
      if (res.success && res.data) {
        setProjects(res.data);
      }
    } catch (err) {
      setError(err.message || 'Unable to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch when debouncedSearch changes
  useEffect(() => {
    fetchProjects(debouncedSearch);
  }, [debouncedSearch, fetchProjects]);

  // Create Project
  const handleCreate = async (formData) => {
    try {
      setActionLoading(true);
      const res = await projectService.createProject(formData);
      if (res.success) {
        showToast('Project created successfully', 'success');
        setIsCreateOpen(false);
        fetchProjects(debouncedSearch);
      }
    } catch (err) {
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // Edit Project
  const handleEdit = async (formData) => {
    if (!editingProject) return;
    try {
      setActionLoading(true);
      const res = await projectService.updateProject(editingProject.id, formData);
      if (res.success) {
        showToast('Project updated successfully', 'success');
        setEditingProject(null);
        fetchProjects(debouncedSearch);
      }
    } catch (err) {
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Project
  const handleDelete = async () => {
    if (!deletingProject) return;
    try {
      setActionLoading(true);
      const res = await projectService.deleteProject(deletingProject.id);
      if (res.success) {
        showToast('Project and its tasks deleted successfully', 'success');
        setDeletingProject(null);
        fetchProjects(debouncedSearch);
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete project', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Projects</h1>
          <p className="page-header-desc">
            Organize work streams, assign tasks, and track project progress.
          </p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="btn btn-primary">
          <Plus size={18} />
          Create Project
        </button>
      </div>

      {/* Filter and Controls Toolbar */}
      <div className="search-filter-bar">
        <SearchBar
          placeholder="Search projects by name or description..."
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          width="380px"
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setViewMode('table')}
            className={`btn-icon-only ${viewMode === 'table' ? 'btn-secondary' : ''}`}
            title="Table View"
            style={viewMode === 'table' ? { background: 'var(--slate-100)', color: 'var(--slate-900)' } : {}}
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`btn-icon-only ${viewMode === 'grid' ? 'btn-secondary' : ''}`}
            title="Grid View"
            style={viewMode === 'grid' ? { background: 'var(--slate-100)', color: 'var(--slate-900)' } : {}}
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && <ErrorMessage message={error} onRetry={() => fetchProjects(debouncedSearch)} />}

      {/* Loading state */}
      {loading ? (
        <LoadingSpinner message="Loading projects from MySQL..." />
      ) : projects.length === 0 ? (
        debouncedSearch ? (
          <EmptyState
            title="No matching projects found."
            description={`No projects matched your search query "${debouncedSearch}".`}
            actionLabel="Clear Search"
            onAction={() => setSearchTerm('')}
            iconType="search"
          />
        ) : (
          <EmptyState
            title="No projects found."
            description="Get started by creating your first project."
            actionLabel="+ Create Project"
            onAction={() => setIsCreateOpen(true)}
            iconType="folder"
          />
        )
      ) : viewMode === 'table' ? (
        <ProjectTable
          projects={projects}
          onEdit={(proj) => setEditingProject(proj)}
          onDelete={(proj) => setDeletingProject(proj)}
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {projects.map((proj) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onEdit={(p) => setEditingProject(p)}
              onDelete={(p) => setDeletingProject(p)}
            />
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <ProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        isLoading={actionLoading}
      />

      {/* Edit Project Modal */}
      <ProjectModal
        isOpen={!!editingProject}
        initialData={editingProject}
        onClose={() => setEditingProject(null)}
        onSubmit={handleEdit}
        isLoading={actionLoading}
      />

      {/* Delete Project Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deletingProject}
        title="Delete Project"
        message={`Are you sure you want to delete this project "${deletingProject?.name}"? All associated tasks will be permanently removed.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={actionLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeletingProject(null)}
      />
    </div>
  );
}
