const Joi = require('joi');

const validateTask = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    status: Joi.string().valid('Pendente', 'Em Andamento', 'Concluída'),
    projectId: Joi.number().integer().required()
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  next();
};

const validateTaskUpdate = (req, res, next) => {
  const schema = Joi.object({
    status: Joi.string().valid('Pendente', 'Em Andamento', 'Concluída')
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  next();
};

const validateProject = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required()
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  next();
};

module.exports = {
  validateTask,
  validateTaskUpdate,
  validateProject
};