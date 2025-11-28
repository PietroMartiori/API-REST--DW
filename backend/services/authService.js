import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UsuarioModel from '../models/UsuarioModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'seu_secret_key_aqui_mude_em_producao';
const JWT_EXPIRES_IN = '7d';

const register = async (data) => {
  const { email, password, name } = data;

  // Verificar se email já existe
  const existingUser = await UsuarioModel.findByEmail(email);
  if (existingUser) {
    throw new Error('Email já cadastrado');
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Criar usuário
  const user = await UsuarioModel.create({
    email,
    senha: hashedPassword,
    nome: name
  });

  // Gerar token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    user: { id: user.id, email: user.email, name: user.name },
    token
  };
};

const login = async (data) => {
  const { email, password } = data;

  // Buscar usuário
  const user = await UsuarioModel.findByEmail(email);
  if (!user) {
    throw new Error('Email ou senha inválidos');
  }

  // Verificar senha
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Email ou senha inválidos');
  }

  // Gerar token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    user: { id: user.id, email: user.email, name: user.name },
    token
  };
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Token inválido');
  }
};

export { register, login, verifyToken, JWT_SECRET };





