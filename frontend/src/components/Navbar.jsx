import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>Gerenciador de Projetos e Tarefas</h1>
        </div>
        <div className="navbar-right">
          <ul className="navbar-menu">
            <li>
              <Link 
                to="/projetos" 
                className={location.pathname === '/projetos' ? 'active' : ''}
              >
                Projetos
              </Link>
            </li>
            <li>
              <Link 
                to="/tarefas" 
                className={location.pathname === '/tarefas' ? 'active' : ''}
              >
                Tarefas
              </Link>
            </li>
          </ul>
          <div className="navbar-user">
            <span className="user-name">{user?.name}</span>
            <button onClick={handleLogout} className="btn-logout">
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
