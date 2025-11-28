const projectService = require('../services/projetoService');

const getProjects = (req, res) => {
  projectService.getAllProjects((err, results) => {
    if (err) return res.status(500).json({ error: 'Erro interno' });
    res.status(200).json(results);
  });
};

const getProject = (req, res) => {
  const id = req.params.id;
  projectService.getProjectById(id, (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro interno' });
    if (!result.length) return res.status(404).json({ error: 'Projeto não encontrado' });
    res.status(200).json(result[0]);
  });
};

const createProject = (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Nome é obrigatório' });
  projectService.createProject({ name, description }, (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro interno' });
    res.status(201).json({ id: result.insertId, name, description, status: 'Pendente' });
  });
};

const updateProject = (req, res) => {
  const id = req.params.id;
  projectService.updateProject(id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro interno' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Projeto não encontrado' });
    res.status(200).json({ message: 'Projeto atualizado' });
  });
};

const deleteProject = (req, res) => {
  const id = req.params.id;
  projectService.deleteProject(id, (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro interno' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Projeto não encontrado' });
    res.status(204).send();
  });
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject };
