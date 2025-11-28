import express from "express";
import * as authController from "../controllers/AuthController.js";
import { validateRegister, validateLogin } from "../middlewares/validation.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);
router.get("/me", authenticate, authController.getMe);

export default router;





