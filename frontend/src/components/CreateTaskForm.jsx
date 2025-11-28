import React, { useState, useEffect } from 'react';
import { tarefaService } from '../services/tarefaService';
import { projetoService } from '../services/projetoService';
import { validateTask } from '../utils/validation';
import { formatErrorMessage } from '../utils/errorHandler';
import './CreateTaskForm.css';

const CreateTaskForm = ({ selectedProjectId, onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: selectedProjectId || ''
  });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      setFormData(prev => ({ ...prev, projectId: selectedProjectId }));
    }
  }, [selectedProjectId]);

  const loadProjects = async () => {
    try {
      const response = await projetoService.getAllProjects();
      setProjects(response.data);
    } catch (err) {
      setError('Erro ao carregar projetos');
    } finally {
      setLoadingProjects(false);
    }
  };

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
    
    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      projectId: parseInt(formData.projectId)
    };

    const validation = validateTask(taskData);
    if (!validation.isValid) {
      setError(formatErrorMessage(validation.error));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await tarefaService.createTask(taskData);
      
      if (response.status === 201) {
        setSuccess(true);
        setFormData({ 
          title: '', 
          description: '',
          projectId: selectedProjectId || formData.projectId
        });
        
        if (onTaskCreated) {
          onTaskCreated();
        }

        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      const errorMsg = err.message || err.response?.data?.error || 'Erro ao criar tarefa';
      setError(formatErrorMessage(errorMsg));
    } finally {
      setLoading(false);
    }
  };

  if (loadingProjects) {
    return <div className="loading">Carregando projetos...</div>;
  }

  return (
    <div className="create-task-form-container">
      <h2>Criar Nova Tarefa</h2>
      {selectedProjectId && (
        <p style={{ marginBottom: '15px', color: '#666', fontSize: '14px' }}>
          Projeto selecionado: {projects.find(p => p.id === selectedProjectId)?.name || 'Carregando...'}
        </p>
      )}
      <form onSubmit={handleSubmit} className="task-form">
        {!selectedProjectId && (
          <div className="form-group">
            <label htmlFor="projectId">Projeto</label>
            <select
              id="projectId"
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um projeto</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="title">Título da Tarefa</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Digite o título da tarefa"
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
            placeholder="Digite a descrição da tarefa"
            rows="4"
          />
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">Tarefa criada com sucesso!</div>}

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Criando...' : 'Criar Tarefa'}
        </button>
      </form>
    </div>
  );
};

export default CreateTaskForm;

