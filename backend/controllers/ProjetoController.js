import * as projectService from '../services/projetoService.js';

export const createProject = async (req, res) => {
  try {
    const newProject = await projectService.createProject(req.body);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const updatedProject = await projectService.updateProject(req.params.id, req.body);
    res.json(updatedProject);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const result = await projectService.deleteProject(req.params.id);
    res.status(204).json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await projectService.getAllProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno' });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    res.json(project);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};