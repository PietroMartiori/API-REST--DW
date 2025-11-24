import { useCallback, useEffect, useMemo, useState } from 'react';
import TopBar from '../components/TopBar';
import useAuth from '../hooks/useAuth';

const taskStatuses = ['Pendente', 'Em Andamento', 'Concluída'];
const API_URL = 'http://localhost:3000';

const Dashboard = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [projectForm, setProjectForm] = useState({ name: '', description: '' });
  const [taskForm, setTaskForm] = useState({ title: '', description: '', status: 'Pendente' });

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) || null,
    [projects, selectedProjectId],
  );

  const showMessage = useCallback((message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  }, []);

  const request = useCallback(
    async (path, options = {}) => {
      const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined,
          ...(options.headers || {}),
        },
      });

      if (response.status === 204) {
        return null;
      }

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        const error = new Error(payload.error || payload.message || 'Erro ao comunicar com o backend');
        error.response = { data: payload };
        throw error;
      }

      return response.json();
    },
    [token],
  );

  const fetchProjects = useCallback(async () => {
    setLoadingProjects(true);
    try {
      const data = await request('/projetos');
      setProjects(data);
      if (!selectedProjectId && data.length) {
        setSelectedProjectId(data[0].id);
      }
    } catch (err) {
      showMessage(err.response?.data?.error || 'Não foi possível carregar projetos', 'error');
    } finally {
      setLoadingProjects(false);
    }
  }, [request, selectedProjectId, showMessage]);

  const fetchTasks = useCallback(
    async (projectId) => {
      if (!projectId) {
        setTasks([]);
        return;
      }
      setLoadingTasks(true);
      try {
        const data = await request(`/tarefas/project/${projectId}`);
        setTasks(data);
      } catch (err) {
        showMessage(err.response?.data?.error || 'Erro ao carregar tarefas', 'error');
      } finally {
        setLoadingTasks(false);
      }
    },
    [request, showMessage],
  );

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchTasks(selectedProjectId);
  }, [selectedProjectId, fetchTasks]);

  const handleProjectChange = (event) => {
    setSelectedProjectId(Number(event.target.value));
  };

  const handleProjectSubmit = async (event) => {
    event.preventDefault();
    try {
      const created = await request('/projetos', {
        method: 'POST',
        body: JSON.stringify(projectForm),
      });
      showMessage('Projeto criado com sucesso!');
      setProjectForm({ name: '', description: '' });
      setProjects((prev) => [...prev, created]);
      setSelectedProjectId(created.id);
    } catch (err) {
      showMessage(err.response?.data?.error || 'Erro ao criar projeto', 'error');
    }
  };

  const handleProjectDelete = async (projectId) => {
    if (!window.confirm('Deseja realmente excluir este projeto?')) return;
    try {
      await request(`/projetos/${projectId}`, { method: 'DELETE' });
      showMessage('Projeto excluído');
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
      if (selectedProjectId === projectId) {
        setSelectedProjectId(null);
      }
    } catch (err) {
      showMessage(err.response?.data?.error || 'Erro ao excluir projeto', 'error');
    }
  };

  const handleTaskSubmit = async (event) => {
    event.preventDefault();
    if (!selectedProjectId) {
      showMessage('Selecione um projeto antes de criar tarefas', 'error');
      return;
    }
    try {
      const payload = { ...taskForm, projectId: selectedProjectId };
      const created = await request('/tarefas', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      showMessage('Tarefa criada!');
      setTaskForm({ title: '', description: '', status: 'Pendente' });
      setTasks((prev) => [...prev, created]);
    } catch (err) {
      showMessage(err.response?.data?.error || 'Erro ao criar tarefa', 'error');
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (!window.confirm('Deseja realmente excluir esta tarefa?')) return;
    try {
      await request(`/tarefas/${taskId}`, { method: 'DELETE' });
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      showMessage('Tarefa excluída');
    } catch (err) {
      showMessage(err.response?.data?.error || 'Erro ao excluir tarefa', 'error');
    }
  };

  const handleTaskStatusChange = async (taskId, status) => {
    try {
      const updated = await request(`/tarefas/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      setTasks((prev) => prev.map((task) => (task.id === taskId ? updated : task)));
      showMessage('Status atualizado');
    } catch (err) {
      showMessage(err.response?.data?.error || 'Erro ao atualizar status', 'error');
    }
  };

  return (
    <div className="dashboard-wrapper">
      <TopBar />

      {feedback && <div className={`alert ${feedback.type}`}>{feedback.message}</div>}

      <section className="card">
        <h2>Projetos</h2>

        {loadingProjects ? (
          <p>Carregando projetos...</p>
        ) : (
          <>
            {projects.length === 0 ? (
              <p className="muted">Nenhum projeto cadastrado ainda.</p>
            ) : (
              <div className="project-select">
                <label htmlFor="projectSelect">Projeto ativo</label>
                <select id="projectSelect" value={selectedProjectId ?? ''} onChange={handleProjectChange}>
                  <option value="" disabled>
                    Selecione
                  </option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                {selectedProject && (
                  <button type="button" className="danger-button" onClick={() => handleProjectDelete(selectedProject.id)}>
                    Excluir projeto
                  </button>
                )}
              </div>
            )}
          </>
        )}

        <form className="grid-form" onSubmit={handleProjectSubmit}>
          <h3>Novo projeto</h3>
          <label htmlFor="projectName">Nome</label>
          <input
            id="projectName"
            name="name"
            value={projectForm.name}
            onChange={(event) => setProjectForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Website corporativo"
            required
          />

          <label htmlFor="projectDescription">Descrição</label>
          <textarea
            id="projectDescription"
            name="description"
            value={projectForm.description}
            onChange={(event) => setProjectForm((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="Escopo, objetivos..."
          />

          <button type="submit">Criar projeto</button>
        </form>
      </section>

      <section className="card">
        <div className="section-head">
          <h2>Tarefas do projeto</h2>
          {selectedProject && <p className="muted">Projeto atual: {selectedProject.name}</p>}
        </div>

        {loadingTasks ? (
          <p>Carregando tarefas...</p>
        ) : tasks.length === 0 ? (
          <p className="muted">Nenhuma tarefa ainda.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className="task-item">
                <div>
                  <h3>{task.title}</h3>
                  {task.description && <p>{task.description}</p>}
                  <span className="badge">{task.status}</span>
                </div>
                <div className="task-actions">
                  <select
                    value={task.status}
                    onChange={(event) => handleTaskStatusChange(task.id, event.target.value)}
                  >
                    {taskStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button type="button" className="danger-button" onClick={() => handleTaskDelete(task.id)}>
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <form className="grid-form" onSubmit={handleTaskSubmit}>
          <h3>Nova tarefa</h3>
          <label htmlFor="taskTitle">Título</label>
          <input
            id="taskTitle"
            name="title"
            value={taskForm.title}
            onChange={(event) => setTaskForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Definir layout"
            required
          />

          <label htmlFor="taskDescription">Descrição</label>
          <textarea
            id="taskDescription"
            name="description"
            value={taskForm.description}
            onChange={(event) => setTaskForm((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="Detalhes adicionais"
          />

          <label htmlFor="taskStatus">Status</label>
          <select
            id="taskStatus"
            name="status"
            value={taskForm.status}
            onChange={(event) => setTaskForm((prev) => ({ ...prev, status: event.target.value }))}
          >
            {taskStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <button type="submit" disabled={!selectedProjectId}>
            Criar tarefa
          </button>
        </form>
      </section>
    </div>
  );
};

export default Dashboard;

