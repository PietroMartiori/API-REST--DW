import ProjetoModel from "../models/ProjetoModel.js";

class ProjetoController {

  static async getAll(req, res) {
    res.json(await ProjetoModel.getAll());
  }

  static async getById(req, res) {
    res.json(await ProjetoModel.getById(req.params.id));
  }

  static async create(req, res) {
    res.json(await ProjetoModel.create(req.body));
  }

  static async update(req, res) {
    res.json(await ProjetoModel.update(req.params.id, req.body));
  }

  static async delete(req, res) {
    await ProjetoModel.delete(req.params.id);
    res.json({ message: "Projeto removido" });
  }
}

export default ProjetoController;
