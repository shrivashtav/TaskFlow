import { request } from './api';

export const projectService = {
  getProjects: async (search = '') => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request(`/projects${query}`, {
      method: 'GET'
    });
  },

  getProjectById: async (id) => {
    return request(`/projects/${id}`, {
      method: 'GET'
    });
  },

  createProject: async (projectData) => {
    return request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
  },

  updateProject: async (id, projectData) => {
    return request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData)
    });
  },

  deleteProject: async (id) => {
    return request(`/projects/${id}`, {
      method: 'DELETE'
    });
  }
};

export default projectService;
