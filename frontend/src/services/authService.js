import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

export const authService = {
  // Registrar novo usuário
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return { data: response.data, status: response.status };
    } catch (error) {
      throw {
        message: error.response?.data?.error || 'Erro ao registrar usuário',
        status: error.response?.status || 500
      };
    }
  },

  // Login
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      return { data: response.data, status: response.status };
    } catch (error) {
      throw {
        message: error.response?.data?.error || 'Erro ao fazer login',
        status: error.response?.status || 500
      };
    }
  },

  // Obter dados do usuário atual
  getMe: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { data: response.data, status: response.status };
    } catch (error) {
      throw {
        message: error.response?.data?.error || 'Erro ao buscar dados do usuário',
        status: error.response?.status || 500
      };
    }
  }
};





