import express from "express"
import * as projectController from "../controllers/ProjetoController.js"
import { validateProject } from "../middlewares/validation.js"
import { authenticate } from "../middlewares/auth.js"

const router = express.Router()

// Todas as rotas requerem autenticação
router.use(authenticate)

router.get("/", projectController.getAllProjects)
router.post("/", validateProject, projectController.createProject)
router.get("/:id", projectController.getProjectById)
router.put("/:id", validateProject, projectController.updateProject)
router.delete("/:id", projectController.deleteProject)

export default router
