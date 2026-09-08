import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import { projectService } from '../services/projectService';
import { useToast } from '../context/ToastContext';
import DashboardCard from '../components/DashboardCard';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { FolderKanban, CheckSquare, Clock, CheckCircle2, Plus, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardService.getStats();
      if (res.success && res.data) {
        setStats(res.data.stats);
        setRecentProjects(res.data.recent_projects || []);
      }
    } catch (err) {
      setError(err.message || 'Unable to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleCreateProject = async (data) => {
    try {
      setModalLoading(true);
      const res = await projectService.createProject(data);
      if (res.success) {
        showToast('Project created successfully!', 'success');
        setIsModalOpen(false);
        fetchDashboardData();
      }
    } catch (err) {
      throw err;
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Dashboard Overview</h1>
          <p className="page-header-desc">
            Monitor real-time system metrics, project progress, and task completion.
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={18} />
          Create Project
        </button>
      </div>

      {/* Error state */}
      {error && <ErrorMessage message={error} onRetry={fetchDashboardData} />}

      {/* Loading state */}
      {loading ? (
        <LoadingSpinner message="Fetching dashboard metrics from MySQL..." />
      ) : (
        <>
          {/* 4 Stats Cards */}
          <div className="stats-grid">
            <DashboardCard
              title="Total Projects"
              value={stats?.total_projects ?? 0}
              icon={FolderKanban}
              variant="primary"
              subtitle="Active client initiatives"
            />
            <DashboardCard
              title="Total Tasks"
              value={stats?.total_tasks ?? 0}
              icon={CheckSquare}
              variant="info"
              subtitle="Across all active projects"
            />
            <DashboardCard
              title="Pending Tasks"
              value={stats?.pending_tasks ?? 0}
              icon={Clock}
              variant="warning"
              subtitle="Todo & in progress"
            />
            <DashboardCard
              title="Completed Tasks"
              value={stats?.completed_tasks ?? 0}
              icon={CheckCircle2}
              variant="success"
              subtitle="Successfully delivered"
            />
          </div>

          {/* Recent Projects Section */}
          <div style={{ marginTop: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                  Recent Projects
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>
                  Recently updated projects and their task completion rates.
                </p>
              </div>
              <Link to="/projects" className="btn btn-secondary btn-sm">
                View All Projects
                <ArrowRight size={14} />
              </Link>
            </div>

            {recentProjects.length === 0 ? (
              <EmptyState
                title="No projects found."
                description="Get started by creating your first project."
                actionLabel="+ Create Project"
                onAction={() => setIsModalOpen(true)}
                iconType="folder"
              />
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '1.5rem'
                }}
              >
                {recentProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    compact={true}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Create Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
        isLoading={modalLoading}
      />
    </div>
  );
}
