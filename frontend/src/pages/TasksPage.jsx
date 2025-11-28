import React, { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';
import CreateTaskForm from '../components/CreateTaskForm';
import { projetoService } from '../services/projetoService';
import './Pages.css';

const TasksPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoadingProjects(true);
      const response = await projetoService.getAllProjects();
      setProjects(response.data);
    } catch (err) {
      console.error('Erro ao carregar projetos:', err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleTaskCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleTaskUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    const project = projects.find(p => p.id === parseInt(projectId));
    setSelectedProject(project || null);
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="page-header">
          <h2>Gerenciamento de Tarefas</h2>
        </div>

        <div className="page-grid">
          <div className="page-form-section">
            <div className="project-selector">
              <label htmlFor="project-select">Selecione um Projeto:</label>
              <select
                id="project-select"
                value={selectedProject?.id || ''}
                onChange={handleProjectChange}
                disabled={loadingProjects}
                className="project-select"
              >
                <option value="">Selecione um projeto</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <CreateTaskForm 
              selectedProjectId={selectedProject?.id}
              onTaskCreated={handleTaskCreated}
            />
          </div>

          <div className="page-list-section">
            <TaskList 
              key={`${refreshKey}-${selectedProject?.id}`}
              projectId={selectedProject?.id}
              projectName={selectedProject?.name}
              onTaskUpdate={handleTaskUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;

