const Project = require('../models/ProjectoModel');

const getAllProjects = (callback) => {
  Project.getAll(callback);
};

const getProjectById = (id, callback) => {
  Project.getById(id, callback);
};

const createProject = (project, callback) => {
  Project.create(project, callback);
};

const updateProject = (id, project, callback) => {
  Project.update(id, project, callback);
};

const deleteProject = (id, callback) => {
  Project.delete(id, callback);
};

module.exports = { getAllProjects, getProjectById, createProject, updateProject, deleteProject };
