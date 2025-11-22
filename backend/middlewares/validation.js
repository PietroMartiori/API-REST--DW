import Joi from "joi"

const validateTask = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(null, ""),
    status: Joi.string().valid("Pendente", "Em Andamento", "Concluída"),
    projectId: Joi.number().integer().required(),
  })
  const { error } = schema.validate(req.body)
  if (error) return res.status(400).json({ error: error.message })
  next()
}

const validateTaskUpdate = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string(),
    description: Joi.string().allow(null, ""),
    status: Joi.string().valid("Pendente", "Em Andamento", "Concluída"),
    projectId: Joi.number().integer(),
  }).min(1)

  const { error } = schema.validate(req.body)
  if (error) return res.status(400).json({ error: error.message })
  next()
}

const validateProject = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(null, ""),
    status: Joi.string(),
  })
  const { error } = schema.validate(req.body)
  if (error) return res.status(400).json({ error: error.message })
  next()
}

export { validateTask, validateTaskUpdate, validateProject }
