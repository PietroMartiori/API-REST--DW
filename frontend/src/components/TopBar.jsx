import useAuth from '../hooks/useAuth';

const TopBar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <div>
        <h1>Projetos & Tarefas</h1>
        {user && <p className="muted">Bem-vindo(a), {user.nome}</p>}
      </div>
      <button className="ghost-button" type="button" onClick={logout}>
        Sair
      </button>
    </header>
  );
};

export default TopBar;

