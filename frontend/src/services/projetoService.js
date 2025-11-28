import api from '../utils/api';

const API_URL = '/projetos';

export const projetoService = {
  // Listar todos os projetos
  getAllProjects: async () => {
    try {
      const response = await api.get(API_URL);
      return { data: response.data, status: response.status };
    } catch (error) {
      throw {
        message: error.response?.data?.error || 'Erro ao buscar projetos',
        status: error.response?.status || 500
      };
    }
  },

  // Buscar projeto por ID
  getProjectById: async (id) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      return { data: response.data, status: response.status };
    } catch (error) {
      throw {
        message: error.response?.data?.error || 'Erro ao buscar projeto',
        status: error.response?.status || 500
      };
    }
  },

  // Criar projeto
  createProject: async (projectData) => {
    try {
      const response = await api.post(API_URL, projectData);
      return { data: response.data, status: response.status };
    } catch (error) {
      throw {
        message: error.response?.data?.error || 'Erro ao criar projeto',
        status: error.response?.status || 500
      };
    }
  },

  // Atualizar projeto
  updateProject: async (id, projectData) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, projectData);
      return { data: response.data, status: response.status };
    } catch (error) {
      throw {
        message: error.response?.data?.error || 'Erro ao atualizar projeto',
        status: error.response?.status || 500
      };
    }
  },

  // Deletar projeto
  deleteProject: async (id) => {
    try {
      const response = await api.delete(`${API_URL}/${id}`);
      return { data: response.data, status: response.status };
    } catch (error) {
      throw {
        message: error.response?.data?.error || 'Erro ao deletar projeto',
        status: error.response?.status || 500
      };
    }
  }
};

