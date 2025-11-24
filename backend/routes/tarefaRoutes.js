import express from "express"
import * as tarefaController from "../controllers/tarefaController.js"

const router = express.Router()

router.get("/", tarefaController.getAllTasks)
router.get("/:id", tarefaController.getTaskById)
router.get("/projeto/:projectId", tarefaController.getTasksByProject)
router.post("/", tarefaController.createTask)
router.put("/:id", tarefaController.updateTask)
router.delete("/:id", tarefaController.deleteTask)

export default router
