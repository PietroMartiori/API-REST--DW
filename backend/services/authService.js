import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UsuarioModel from '../models/UsuarioModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

const buildAuthResponse = (usuario) => {
  const tokenPayload = {
    sub: usuario.id,
    email: usuario.email,
    nome: usuario.nome,
  };

  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    },
    expiresIn: JWT_EXPIRES_IN,
  };
};

class AuthService {
  static async login(email, senha) {
    const usuario = await UsuarioModel.findByEmail(email);
    if (!usuario) {
      return null;
    }

    const senhaConfere = await bcrypt.compare(senha, usuario.senha);
    if (!senhaConfere) {
      return null;
    }

    return buildAuthResponse(usuario);
  }

  static async register({ nome, email, senha }) {
    const existing = await UsuarioModel.findByEmail(email);
    if (existing) {
      const error = new Error('Email já cadastrado');
      error.code = 'EMAIL_IN_USE';
      throw error;
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = await UsuarioModel.create({ nome, email, senhaHash });

    return buildAuthResponse(novoUsuario);
  }
}

export default AuthService;

