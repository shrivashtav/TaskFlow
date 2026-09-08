import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { useToast } from '../context/ToastContext';
import { useDebounce } from '../hooks/useDebounce';
import TaskTable from '../components/TaskTable';
import TaskModal from '../components/TaskModal';
import ProjectModal from '../components/ProjectModal';
import ConfirmDialog from '../components/ConfirmDialog';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { ArrowLeft, Plus, Edit2, Calendar, CheckCircle2, Layers } from 'lucide-react';

export default function ProjectDetailsPage() {
  const { id: projectId } = useParams();
  const { showToast } = useToast();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 350);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Modals & Action states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch Project metadata
  const fetchProjectDetails = useCallback(async () => {
    try {
      const res = await projectService.getProjectById(projectId);
      if (res.success && res.data) {
        setProject(res.data);
      }
    } catch (err) {
      setError(err.message || 'Project not found or failed to load.');
    }
  }, [projectId]);

  // Fetch Tasks with server-side query filters
  const fetchTasks = useCallback(async () => {
    try {
      setTasksLoading(true);
      const res = await taskService.getTasksByProject(projectId, {
        search: debouncedSearch,
        status: statusFilter,
        priority: priorityFilter
      });
      if (res.success && res.data) {
        setTasks(res.data);
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setTasksLoading(false);
    }
  }, [projectId, debouncedSearch, statusFilter, priorityFilter]);

  // Initial load
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      await fetchProjectDetails();
      await fetchTasks();
      setLoading(false);
    }
    loadData();
  }, [projectId, fetchProjectDetails, fetchTasks]);

  // Refetch tasks when filters or debounced search changes
  useEffect(() => {
    if (!loading) {
      fetchTasks();
    }
  }, [debouncedSearch, statusFilter, priorityFilter, fetchTasks]);

  // Task Creation
  const handleCreateTask = async (taskData) => {
    try {
      setActionLoading(true);
      const res = await taskService.createTask(projectId, taskData);
      if (res.success) {
        showToast('Task added successfully', 'success');
        setIsTaskModalOpen(false);
        await fetchTasks();
        await fetchProjectDetails();
      }
    } catch (err) {
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // Task Editing
  const handleEditTask = async (taskData) => {
    if (!editingTask) return;
    try {
      setActionLoading(true);
      const res = await taskService.updateTask(editingTask.id, taskData);
      if (res.success) {
        showToast('Task updated successfully', 'success');
        setEditingTask(null);
        await fetchTasks();
        await fetchProjectDetails();
      }
    } catch (err) {
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // Quick Status Change from table dropdown
  const handleStatusChange = async (task, newStatus) => {
    try {
      const res = await taskService.updateTask(task.id, { status: newStatus });
      if (res.success) {
        showToast(`Task marked as ${newStatus}`, 'success');
        await fetchTasks();
        await fetchProjectDetails();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  // Task Deletion
  const handleDeleteTask = async () => {
    if (!deletingTask) return;
    try {
      setActionLoading(true);
      const res = await taskService.deleteTask(deletingTask.id);
      if (res.success) {
        showToast('Task deleted successfully', 'success');
        setDeletingTask(null);
        await fetchTasks();
        await fetchProjectDetails();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete task', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Edit Project info
  const handleUpdateProject = async (formData) => {
    try {
      setActionLoading(true);
      const res = await projectService.updateProject(projectId, formData);
      if (res.success) {
        showToast('Project updated successfully', 'success');
        setIsEditProjectOpen(false);
        await fetchProjectDetails();
      }
    } catch (err) {
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner message="Loading project details from MySQL..." />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="page-container">
        <Link to="/projects" className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to Projects
        </Link>
        <ErrorMessage message={error || 'Project not found'} />
      </div>
    );
  }

  const isFiltered = debouncedSearch || statusFilter || priorityFilter;

  return (
    <div className="page-container">
      {/* Back Link */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Link
          to="/projects"
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={15} />
          Back to Projects
        </Link>
      </div>

      {/* Project Banner & Details */}
      <div
        className="card"
        style={{
          padding: '1.75rem 2rem',
          marginBottom: '2rem',
          background: '#ffffff',
          borderLeft: '4px solid var(--primary-600)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                {project.name}
              </h1>
              <button
                onClick={() => setIsEditProjectOpen(true)}
                className="btn-icon-only"
                title="Edit Project Details"
              >
                <Edit2 size={16} />
              </button>
            </div>
            <p style={{ fontSize: '0.9375rem', color: 'var(--slate-600)', marginTop: '0.5rem', maxWidth: '800px', lineHeight: '1.6' }}>
              {project.description || 'No description provided for this project.'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase' }}>
                Tasks
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                {project.completed_tasks} / {project.total_tasks}
              </div>
            </div>
            <button onClick={() => setIsTaskModalOpen(true)} className="btn btn-primary">
              <Plus size={16} />
              Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Task Management Section Header & Filters */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={20} color="var(--primary-600)" />
            Project Tasks
          </h2>

          {isFiltered && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setPriorityFilter('');
              }}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="search-filter-bar">
          <SearchBar
            placeholder="Search tasks by title, description, assignee..."
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
            width="340px"
          />

          <div className="filter-group">
            <FilterDropdown
              label="Status Filter"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'TODO', label: 'Todo' },
                { value: 'IN_PROGRESS', label: 'In Progress' },
                { value: 'COMPLETED', label: 'Completed' }
              ]}
            />

            <FilterDropdown
              label="Priority Filter"
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={[
                { value: '', label: 'All Priorities' },
                { value: 'LOW', label: 'Low' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'HIGH', label: 'High' }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Task List Table or Empty State */}
      {tasksLoading ? (
        <LoadingSpinner message="Filtering tasks from MySQL..." />
      ) : tasks.length === 0 ? (
        isFiltered ? (
          <EmptyState
            title="No matching tasks found."
            description="No tasks match your selected search query or filter options."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchTerm('');
              setStatusFilter('');
              setPriorityFilter('');
            }}
            iconType="search"
          />
        ) : (
          <EmptyState
            title="No tasks available for this project."
            description="Start organizing work by adding the first task to this project."
            actionLabel="+ Add Task"
            onAction={() => setIsTaskModalOpen(true)}
            iconType="inbox"
          />
        )
      ) : (
        <TaskTable
          tasks={tasks}
          onEdit={(task) => setEditingTask(task)}
          onDelete={(task) => setDeletingTask(task)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Add Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        isLoading={actionLoading}
      />

      {/* Edit Task Modal */}
      <TaskModal
        isOpen={!!editingTask}
        initialData={editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleEditTask}
        isLoading={actionLoading}
      />

      {/* Edit Project Details Modal */}
      <ProjectModal
        isOpen={isEditProjectOpen}
        initialData={project}
        onClose={() => setIsEditProjectOpen(false)}
        onSubmit={handleUpdateProject}
        isLoading={actionLoading}
      />

      {/* Delete Task Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deletingTask}
        title="Delete Task"
        message={`Are you sure you want to delete this task "${deletingTask?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={actionLoading}
        onConfirm={handleDeleteTask}
        onCancel={() => setDeletingTask(null)}
      />
    </div>
  );
}
