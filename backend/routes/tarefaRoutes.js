const express = require('express');
const router = express.Router();
const taskController = require('../controllers/TarefaController.js');
const { validateTask, validateTaskUpdate } = require('../middlewares/validation.js');

router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', validateTask, taskController.createTask);
router.put('/:id', validateTaskUpdate, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.get('/project/:projectId', taskController.getTasksByProject);

module.exports = router;