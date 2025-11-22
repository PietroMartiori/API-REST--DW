const { Project } = require('../models');

const createProject = async (data) => {
  if (!data.name || data.name.trim() === '') {
    throw new Error('Nome do projeto obrigatório');
  }
  return await Project.create(data);
};

const updateProject = async (id, data) => {
  const project = await Project.findByPk(id);
  if (!project) {
    throw new Error('Projeto não encontrado');
  }
  await project.update(data);
  return project;
};

const deleteProject = async (id) => {
  const project = await Project.findByPk(id);
  if (!project) {
    throw new Error('Projeto não encontrado');
  }
  await project.destroy();
  return { message: 'Projeto deletado' };
};

const getAllProjects = async () => {
  return await Project.findAll();
};

const getProjectById = async (id) => {
  const project = await Project.findByPk(id);
  if (!project) {
    throw new Error('Projeto não encontrado');
  }
  return project;
};

module.exports = {
  createProject,
  updateProject,
  deleteProject,
  getAllProjects,
  getProjectById
};