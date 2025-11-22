const { Task } = require('../models');

const createTask = async (data) => {
  if (!data.projectId) {
    throw new Error('Projeto obrigatório para a tarefa');
  }
  return await Task.create(data);
};

const updateTask = async (id, data) => {
  const { status } = data;
  if (status && !['Pendente', 'Em Andamento', 'Concluída'].includes(status)) {
    throw new Error('Status inválido');
  }
  const task = await Task.findByPk(id);
  if (!task) {
    throw new Error('Tarefa não encontrada');
  }
  await task.update(data);
  return task;
};

const deleteTask = async (id) => {
  const task = await Task.findByPk(id);
  if (!task) {
    throw new Error('Tarefa não encontrada');
  }
  await task.destroy();
  return { message: 'Tarefa deletada' };
};

const getAllTasks = async () => {
  return await Task.findAll();
};

const getTaskById = async (id) => {
  const task = await Task.findByPk(id);
  if (!task) {
    throw new Error('Tarefa não encontrada');
  }
  return task;
};

const getTasksByProject = async (projectId) => {
  return await Task.findAll({ where: { projectId } });
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  getTasksByProject
};