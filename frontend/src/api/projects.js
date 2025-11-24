import api from './client';

export const getProjects = async () => {
  const { data } = await api.get('/projetos');
  return data;
};

export const createProject = async (payload) => {
  const { data } = await api.post('/projetos', payload);
  return data;
};

export const deleteProject = async (projectId) => {
  await api.delete(`/projetos/${projectId}`);
};

export const updateProject = async (projectId, payload) => {
  const { data } = await api.put(`/projetos/${projectId}`, payload);
  return data;
};

