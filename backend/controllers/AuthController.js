import Joi from 'joi';
import AuthService from '../services/authService.js';

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required(),
});

const registerSchema = Joi.object({
  nome: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required(),
});

class AuthController {
  static async login(req, res) {
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: 'Dados inválidos',
        detalhes: error.details.map((detail) => detail.message),
      });
    }

    try {
      const authResponse = await AuthService.login(value.email, value.senha);
      if (!authResponse) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      return res.status(200).json(authResponse);
    } catch (err) {
      console.error('Erro ao realizar login:', err);
      return res.status(500).json({ message: 'Erro interno ao realizar login' });
    }
  }

  static async register(req, res) {
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: 'Dados inválidos',
        detalhes: error.details.map((detail) => detail.message),
      });
    }

    try {
      const authResponse = await AuthService.register(value);
      return res.status(201).json(authResponse);
    } catch (err) {
      if (err.code === 'EMAIL_IN_USE') {
        return res.status(409).json({ message: err.message });
      }
      console.error('Erro ao cadastrar usuário:', err);
      return res.status(500).json({ message: 'Erro interno ao cadastrar usuário' });
    }
  }
}

export default AuthController;

