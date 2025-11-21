import TarefaModel from "../models/TarefaModel.js";

class TarefaController {

  static async getAllByProjeto(req, res) {
    res.json(await TarefaModel.getAllByProjeto(req.params.projeto_id));
  }

  static async create(req, res) {
    res.json(await TarefaModel.create(req.body));
  }

  static async updateStatus(req, res) {
    await TarefaModel.updateStatus(req.params.id, req.body.status);
    res.json({ message: "Status atualizado" });
  }

  static async delete(req, res) {
    await TarefaModel.delete(req.params.id);
    res.json({ message: "Tarefa removida" });
  }
}

export default TarefaController;
