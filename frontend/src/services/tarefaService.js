import api from '../utils/api';

const API_URL = '/tarefas';

export const tarefaService = {
  // Listar todas as tarefas
  getAllTasks: async () => {
    try {
      const response = await api.get(API_URL);
      return { data: response.data, status: response.status };
    } catch (error) {
      throw {
        message: error.response?.data?.error || 'Erro ao buscar tarefas',
        status: error.response?.status || 500
      };
    }
  },

  // Listar tarefas de um projeto
  getTasksByProject: async (projectId) => {
    try {
      const response = await api.get(`${API_URL}/project/${projectId}`);
      return { data: response.data, status: response.status };
    } catch (error) {
      throw {
        message: error.response?.data?.error || 'Erro ao buscar tarefas do projeto',
        status: error.response?.status || 500
      };
    }
  },

  // Buscar tarefa por ID
  getTaskById: async (id) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      return { data: response.data, status: response.status };
    } catch (error) {
      throw {
        message: error.response?.data?.error || 'Erro ao buscar tarefa',
        status: error.response?.status || 500
      };
    }
  },

  // Criar tarefa
  createTask: async (taskData) => {
    try {
      const response = await api.post(API_URL, taskData);
      return { data: response.data, status: response.status };
    } catch (error) {
      throw {
        message: error.response?.data?.error || 'Erro ao criar tarefa',
        status: error.response?.status || 500
      };
    }
  },

  // Atualizar tarefa (incluindo status)
  updateTask: async (id, taskData) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, taskData);
      return { data: response.data, status: response.status };
    } catch (error) {
      throw {
        message: error.response?.data?.error || 'Erro ao atualizar tarefa',
        status: error.response?.status || 500
      };
    }
  },

  // Atualizar status da tarefa
  updateTaskStatus: async (id, status) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, { status });
      return { data: response.data, status: response.status };
    } catch (error) {
      throw {
        message: error.response?.data?.error || 'Erro ao atualizar status da tarefa',
        status: error.response?.status || 500
      };
    }
  },

  // Deletar tarefa
  deleteTask: async (id) => {
    try {
      const response = await api.delete(`${API_URL}/${id}`);
      return { data: response.data, status: response.status };
    } catch (error) {
      throw {
        message: error.response?.data?.error || 'Erro ao deletar tarefa',
        status: error.response?.status || 500
      };
    }
  }
};
