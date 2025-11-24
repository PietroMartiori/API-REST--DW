import pool from '../db.js';

class UsuarioModel {
  static async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT id, nome, email, senha FROM usuarios WHERE email = ? LIMIT 1',
      [email]
    );
    return rows[0];
  }

  static async create({ nome, email, senhaHash }) {
    const [result] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, senhaHash],
    );

    return {
      id: result.insertId,
      nome,
      email,
    };
  }
}

export default UsuarioModel;

