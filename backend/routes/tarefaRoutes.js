import express from "express"
import * as taskController from "../controllers/TarefaController.js"
import { validateTask, validateTaskUpdate } from "../middlewares/validation.js"
import { authenticate } from "../middlewares/auth.js"

const router = express.Router()

// Todas as rotas requerem autenticação
router.use(authenticate)

router.get("/", taskController.getAllTasks)
router.post("/", validateTask, taskController.createTask)
router.get("/project/:projectId", taskController.getTasksByProject)
router.get("/:id", taskController.getTaskById)
router.put("/:id", validateTaskUpdate, taskController.updateTask)
router.delete("/:id", taskController.deleteTask)

export default router
