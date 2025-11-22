import express from 'express';
import * as taskController from '../controllers/TarefaController.js';
import { validateTask, validateTaskUpdate } from '../middlewares/validation.js';

const router = express.Router();

router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', validateTask, taskController.createTask);
router.put('/:id', validateTaskUpdate, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.get('/project/:projectId', taskController.getTasksByProject);

export default router;