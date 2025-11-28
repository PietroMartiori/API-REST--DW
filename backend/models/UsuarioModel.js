import pool from '../db.js';

class UsuarioModel {
  static async create(usuario) {
    const { email, senha, nome } = usuario;
    const [result] = await pool.query(
      "INSERT INTO Users (email, password, name) VALUES (?, ?, ?)",
      [email, senha, nome]
    );
    return { id: result.insertId, email, name: nome };
  }

  static async findByEmail(email) {
    const [rows] = await pool.query(
      "SELECT * FROM Users WHERE email = ?",
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.query(
      "SELECT id, email, name FROM Users WHERE id = ?",
      [id]
    );
    return rows[0];
  }
}

export default UsuarioModel;





