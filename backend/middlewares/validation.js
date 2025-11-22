import Joi from 'joi';

export const validateTask = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    status: Joi.string().valid('Pendente', 'Em Andamento', 'Concluída').optional(),
    projectId: Joi.number().integer().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  next();
};

export const validateTaskUpdate = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    status: Joi.string().valid('Pendente', 'Em Andamento', 'Concluída').optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  next();
};

export const validateProject = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    status: Joi.string().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  next();
};