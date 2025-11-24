import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmacao: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (form.senha !== form.confirmacao) {
      setError('As senhas precisam ser iguais.');
      return;
    }

    setLoading(true);
    try {
      await register({ nome: form.nome, email: form.email, senha: form.senha });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Não foi possível concluir o cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <form className="card" onSubmit={handleSubmit}>
        <h2>Criar conta</h2>
        <label htmlFor="nome">Nome completo</label>
        <input
          id="nome"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Maria Silva"
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="usuario@exemplo.com"
          required
        />

        <label htmlFor="senha">Senha</label>
        <input
          id="senha"
          name="senha"
          type="password"
          value={form.senha}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />

        <label htmlFor="confirmacao">Confirmar senha</label>
        <input
          id="confirmacao"
          name="confirmacao"
          type="password"
          value={form.confirmacao}
          onChange={handleChange}
          placeholder="Repita sua senha"
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Criando conta...' : 'Cadastrar'}
        </button>

        <p className="auth-links">
          Já possui conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;


