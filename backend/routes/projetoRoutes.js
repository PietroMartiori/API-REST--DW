import express from "express"
import * as projetoController from "../controllers/projetoController.js"

const router = express.Router()

router.get("/", projetoController.getAllProjects)
router.get("/:id", projetoController.getProjectById)
router.post("/", projetoController.createProject)
router.put("/:id", projetoController.updateProject)
router.delete("/:id", projetoController.deleteProject)

export default router
