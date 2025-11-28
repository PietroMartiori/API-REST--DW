import React, { useState } from 'react';
import ProjectList from '../components/ProjectList';
import CreateProjectForm from '../components/CreateProjectForm';
import './Pages.css';

const ProjectsPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleProjectUpdated = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="page-header">
          <h2>Gerenciamento de Projetos</h2>
          <p>Crie e gerencie seus projetos</p>
        </div>

        <div className="page-grid">
          <div className="page-form-section">
            <CreateProjectForm onProjectCreated={handleProjectCreated} />
          </div>

          <div className="page-list-section">
            <ProjectList 
              key={refreshKey}
              onSelectProject={handleSelectProject}
              selectedProjectId={selectedProject?.id}
              onProjectUpdated={handleProjectUpdated}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;

