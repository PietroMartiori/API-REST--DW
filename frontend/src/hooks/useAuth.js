import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return ctx;
};

export default useAuth;

