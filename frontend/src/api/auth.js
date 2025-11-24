import api from './client';

export const loginRequest = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials, {
    headers: { Authorization: undefined },
  });
  return data;
};

export const registerRequest = async (payload) => {
  const { data } = await api.post('/auth/register', payload, {
    headers: { Authorization: undefined },
  });
  return data;
};

