import React, { useState } from 'react';
import { projetoService } from '../services/projetoService';
import { validateProject } from '../utils/validation';
import { formatErrorMessage } from '../utils/errorHandler';
import './CreateProjectForm.css';

const CreateProjectForm = ({ onProjectCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Preparar dados: description vazio vira null (como no backend)
    const projectData = {
      name: formData.name.trim(),
      description: formData.description.trim() || null
    };

    // Validação usando o mesmo padrão do backend
    const validation = validateProject(projectData);
    if (!validation.isValid) {
      setError(formatErrorMessage(validation.error));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await projetoService.createProject(projectData);
      
      if (response.status === 201) {
        setSuccess(true);
        setFormData({ name: '', description: '' });
        
        if (onProjectCreated) {
          onProjectCreated();
        }

        // Limpar mensagem de sucesso após 3 segundos
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      // Formatar mensagem de erro do backend
      // O serviço lança { message, status }, mas também pode vir diretamente do axios
      const errorMsg = err.message || err.response?.data?.error || 'Erro ao criar projeto';
      setError(formatErrorMessage(errorMsg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-project-form-container">
      <h2>Criar Novo Projeto</h2>
      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-group">
          <label htmlFor="name">Nome do Projeto *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Digite o nome do projeto"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Digite a descrição do projeto (opcional)"
            rows="4"
          />
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">Projeto criado com sucesso!</div>}

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Criando...' : 'Criar Projeto'}
        </button>
      </form>
    </div>
  );
};

export default CreateProjectForm;

