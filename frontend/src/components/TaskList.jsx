import React, { useState, useEffect } from 'react';
import { tarefaService } from '../services/tarefaService';
import { validateTaskUpdate } from '../utils/validation';
import { formatErrorMessage } from '../utils/errorHandler';
import './TaskList.css';

const TaskList = ({ projectId, projectName, onTaskUpdate }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = async () => {
    if (!projectId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await tarefaService.getTasksByProject(projectId);
      setTasks(response.data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  const handleStatusChange = async (taskId, currentStatus) => {
    const statusOrder = ['Pendente', 'Em Andamento', 'Concluída'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    const newStatus = statusOrder[nextIndex];

    // Validação usando o mesmo padrão do backend
    const validation = validateTaskUpdate({ status: newStatus });
    if (!validation.isValid) {
      alert(`Erro de validação: ${formatErrorMessage(validation.error)}`);
      return;
    }

    try {
      await tarefaService.updateTaskStatus(taskId, newStatus);
      await loadTasks();
      if (onTaskUpdate) {
        onTaskUpdate();
      }
    } catch (err) {
      // O serviço lança { message, status }, mas também pode vir diretamente do axios
      const errorMsg = err.message || err.response?.data?.error || 'Erro ao atualizar status';
      alert(`Erro ao atualizar status: ${formatErrorMessage(errorMsg)}`);
    }
  };

  const handleDelete = async (taskId, e) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await tarefaService.deleteTask(taskId);
        await loadTasks();
        if (onTaskUpdate) {
          onTaskUpdate();
        }
      } catch (err) {
        alert(formatErrorMessage(err.message || 'Erro ao excluir tarefa'));
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendente':
        return 'status-pending';
      case 'Em Andamento':
        return 'status-in-progress';
      case 'Concluída':
        return 'status-completed';
      default:
        return '';
    }
  };

  if (!projectId) {
    return (
      <div className="task-list-container">
        <p className="empty-message">Selecione um projeto para ver suas tarefas</p>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Carregando tarefas...</div>;
  }

  if (error) {
    return <div className="error">Erro: {error}</div>;
  }

  return (
    <div className="task-list-container">
      <h2>Tarefas do Projeto: {projectName}</h2>
      {tasks.length === 0 ? (
        <p className="empty-message">Nenhuma tarefa encontrada para este projeto.</p>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-header">
                <h3>{task.title}</h3>
                <span className={`status-badge ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>
              {task.description && <p className="task-description">{task.description}</p>}
              <div className="task-actions">
                <button
                  className="btn-status"
                  onClick={() => handleStatusChange(task.id, task.status)}
                >
                  Alterar Status
                </button>
                <button
                  className="btn-delete-task"
                  onClick={(e) => handleDelete(task.id, e)}
                  title="Excluir tarefa"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;

