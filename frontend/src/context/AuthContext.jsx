import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { loginRequest, registerRequest } from '../api/auth';

export const AuthContext = createContext(undefined);

const storageKey = 'auth_state';

const readPersistedState = () => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const persistState = (state) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    /* ignore */
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const persisted = readPersistedState();
    if (persisted?.token) {
      setToken(persisted.token);
      setUser(persisted.user);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) {
      persistState({ token, user });
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem(storageKey);
      localStorage.removeItem('token');
    }
  }, [token, user]);

  const login = useCallback(async (credentials) => {
    const response = await loginRequest(credentials);
    setToken(response.token);
    setUser(response.usuario);
    return response;
  }, []);

  const register = useCallback(async (payload) => {
    const response = await registerRequest(payload);
    setToken(response.token);
    setUser(response.usuario);
    return response;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [token, user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

