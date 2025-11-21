import { Router } from "express";
import TarefaController from "../controllers/TarefaController.js";

const router = Router();

router.get("/:projeto_id", TarefaController.getAllByProjeto);
router.post("/", TarefaController.create);
router.put("/:id/status", TarefaController.updateStatus);
router.delete("/:id", TarefaController.delete);

export default router;
