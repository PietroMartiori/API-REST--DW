import React, { useState, useEffect } from 'react';
import { projetoService } from '../services/projetoService';
import { formatErrorMessage } from '../utils/errorHandler';
import './ProjectList.css';

const ProjectList = ({ onSelectProject, selectedProjectId, onProjectUpdated }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', description: '' });

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await projetoService.getAllProjects();
      setProjects(response.data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleEdit = (project, e) => {
    e.stopPropagation();
    setEditingProject(project.id);
    setEditFormData({
      name: project.name,
      description: project.description || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setEditFormData({ name: '', description: '' });
  };

  const handleSaveEdit = async (projectId, e) => {
    e.stopPropagation();
    try {
      const projectData = {
        name: editFormData.name.trim(),
        description: editFormData.description.trim() || null
      };
      
      await projetoService.updateProject(projectId, projectData);
      setEditingProject(null);
      await loadProjects();
      if (onProjectUpdated) {
        onProjectUpdated();
      }
    } catch (err) {
      alert(formatErrorMessage(err.message || 'Erro ao atualizar projeto'));
    }
  };

  const handleDelete = async (projectId, e) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir este projeto? Todas as tarefas associadas também serão excluídas.')) {
      try {
        await projetoService.deleteProject(projectId);
        await loadProjects();
        if (onProjectUpdated) {
          onProjectUpdated();
        }
      } catch (err) {
        alert(formatErrorMessage(err.message || 'Erro ao excluir projeto'));
      }
    }
  };

  if (loading) {
    return <div className="loading">Carregando projetos...</div>;
  }

  if (error) {
    return <div className="error">Erro: {error}</div>;
  }

  return (
    <div className="project-list-container">
      <h2>Projetos</h2>
      {projects.length === 0 ? (
        <p className="empty-message">Nenhum projeto encontrado. Crie um novo projeto!</p>
      ) : (
        <div className="project-grid">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`project-card ${selectedProjectId === project.id ? 'selected' : ''}`}
            >
              {editingProject === project.id ? (
                <div className="project-edit-form" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="edit-input"
                    placeholder="Nome do projeto"
                  />
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="edit-textarea"
                    placeholder="Descrição (opcional)"
                    rows="3"
                  />
                  <div className="edit-actions">
                    <button
                      onClick={(e) => handleSaveEdit(project.id, e)}
                      className="btn-save"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="btn-cancel"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="project-card-content" onClick={() => onSelectProject && onSelectProject(project)}>
                    <h3>{project.name}</h3>
                    {project.description && <p>{project.description}</p>}
                    {project.status && (
                      <span className={`status-badge status-${project.status.toLowerCase()}`}>
                        {project.status}
                      </span>
                    )}
                  </div>
                  <div className="project-actions">
                    <button
                      onClick={(e) => handleEdit(project, e)}
                      className="btn-edit"
                      title="Editar projeto"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => handleDelete(project.id, e)}
                      className="btn-delete"
                      title="Excluir projeto"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;

