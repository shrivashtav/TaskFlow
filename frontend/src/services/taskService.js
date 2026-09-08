import { request } from './api';

export const taskService = {
  getTasksByProject: async (projectId, params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    if (params.priority) query.append('priority', params.priority);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/projects/${projectId}/tasks${queryString}`, {
      method: 'GET'
    });
  },

  createTask: async (projectId, taskData) => {
    return request(`/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  },

  getTaskById: async (id) => {
    return request(`/tasks/${id}`, {
      method: 'GET'
    });
  },

  updateTask: async (id, taskData) => {
    return request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData)
    });
  },

  deleteTask: async (id) => {
    return request(`/tasks/${id}`, {
      method: 'DELETE'
    });
  }
};

export default taskService;
