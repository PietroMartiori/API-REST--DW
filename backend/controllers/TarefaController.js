import * as taskService from '../services/tarefaService.js';

export const createTask = async (req, res) => {
  try {
    const newTask = await taskService.createTask(req.body);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const updatedTask = await taskService.updateTask(req.params.id, req.body);
    res.json(updatedTask);
  } catch (error) {
    if (error.message === 'Tarefa não encontrada') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

export const deleteTask = async (req, res) => {
  try {
    const result = await taskService.deleteTask(req.params.id);
    res.status(204).json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno' });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    res.json(task);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getTasksByProject = async (req, res) => {
  try {
    const tasks = await taskService.getTasksByProject(req.params.projectId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno' });
  }
};