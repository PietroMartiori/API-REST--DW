import api from './client';

export const getTasksByProject = async (projectId) => {
  if (!projectId) {
    return [];
  }
  const { data } = await api.get(`/tarefas/project/${projectId}`);
  return data;
};

export const createTask = async (payload) => {
  const { data } = await api.post('/tarefas', payload);
  return data;
};

export const updateTask = async (taskId, payload) => {
  const { data } = await api.put(`/tarefas/${taskId}`, payload);
  return data;
};

export const deleteTask = async (taskId) => {
  await api.delete(`/tarefas/${taskId}`);
};

