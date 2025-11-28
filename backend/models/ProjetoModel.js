import pool from '../db.js';

class ProjetoModel {

  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM projetos");
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query("SELECT * FROM projetos WHERE id = ?", [id]);
    return rows[0];
  }

  static async create(projeto) {
    const { nome, descricao } = projeto;
    const [result] = await pool.query(
      "INSERT INTO projetos (nome, descricao) VALUES (?, ?)",
      [nome, descricao]
    );
    return { id: result.insertId, ...projeto };
  }

  static async update(id, projeto) {
    const { nome, descricao } = projeto;
    await pool.query(
      "UPDATE projetos SET nome = ?, descricao = ? WHERE id = ?",
      [nome, descricao, id]
    );
    return { id, ...projeto };
  }

  static async delete(id) {
    await pool.query("DELETE FROM projetos WHERE id = ?", [id]);
    return true;
  }
}

export default ProjetoModel;
