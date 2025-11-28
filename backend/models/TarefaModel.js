import pool from '../db.js';

class TarefaModel {

  static async getAllByProjeto(projeto_id) {
    const [rows] = await pool.query(
      "SELECT * FROM tarefas WHERE projeto_id = ?",
      [projeto_id]
    );
    return rows;
  }

  static async create(tarefa) {
    const { projeto_id, titulo, descricao } = tarefa;
    const [result] = await pool.query(
      "INSERT INTO tarefas (projeto_id, titulo, descricao) VALUES (?, ?, ?)",
      [projeto_id, titulo, descricao]
    );
    return { id: result.insertId, ...tarefa };
  }

  static async updateStatus(id, status) {
    await pool.query(
      "UPDATE tarefas SET status = ? WHERE id = ?",
      [status, id]
    );
    return true;
  }

  static async delete(id) {
    await pool.query("DELETE FROM tarefas WHERE id = ?", [id]);
    return true;
  }
}

export default TarefaModel;
