import * as projetoService from "../services/projetoService.js"

export const getAllProjects = async (req, res) => {
  try {
    const projects = await projetoService.getAllProjects()
    res.status(200).json(projects)
  } catch (error) {
    console.error("[v0] Erro ao buscar projetos:", error)
    res.status(500).json({ error: error.message })
  }
}

export const getProjectById = async (req, res) => {
  try {
    const project = await projetoService.getProjectById(req.params.id)
    if (!project) {
      return res.status(404).json({ error: "Projeto não encontrado" })
    }
    res.status(200).json(project)
  } catch (error) {
    console.error("[v0] Erro ao buscar projeto:", error)
    res.status(500).json({ error: error.message })
  }
}

export const createProject = async (req, res) => {
  try {
    const { name, description, status } = req.body

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Nome do projeto é obrigatório" })
    }

    const project = await projetoService.createProject({ name, description, status })
    res.status(201).json(project)
  } catch (error) {
    console.error("[v0] Erro ao criar projeto:", error)
    res.status(400).json({ error: error.message })
  }
}

export const updateProject = async (req, res) => {
  try {
    const { name, description, status } = req.body
    const project = await projetoService.updateProject(req.params.id, { name, description, status })

    if (!project) {
      return res.status(404).json({ error: "Projeto não encontrado" })
    }

    res.status(200).json(project)
  } catch (error) {
    console.error("[v0] Erro ao atualizar projeto:", error)
    res.status(400).json({ error: error.message })
  }
}

export const deleteProject = async (req, res) => {
  try {
    await projetoService.deleteProject(req.params.id)
    res.status(204).send()
  } catch (error) {
    console.error("[v0] Erro ao deletar projeto:", error)
    res.status(404).json({ error: error.message })
  }
}
