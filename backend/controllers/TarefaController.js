import * as tarefaService from "../services/tarefaService.js"

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await tarefaService.getAllTasks()
    res.status(200).json(tasks)
  } catch (error) {
    console.error("[v0] Erro ao buscar tarefas:", error)
    res.status(500).json({ error: error.message })
  }
}

export const getTaskById = async (req, res) => {
  try {
    const task = await tarefaService.getTaskById(req.params.id)
    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada" })
    }
    res.status(200).json(task)
  } catch (error) {
    console.error("[v0] Erro ao buscar tarefa:", error)
    res.status(500).json({ error: error.message })
  }
}

export const getTasksByProject = async (req, res) => {
  try {
    const tasks = await tarefaService.getTasksByProject(req.params.projectId)
    res.status(200).json(tasks)
  } catch (error) {
    console.error("[v0] Erro ao buscar tarefas do projeto:", error)
    res.status(500).json({ error: error.message })
  }
}

export const createTask = async (req, res) => {
  try {
    const { title, description, status, project_id } = req.body

    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "Título da tarefa é obrigatório" })
    }

    if (!project_id) {
      return res.status(400).json({ error: "ID do projeto é obrigatório" })
    }

    const task = await tarefaService.createTask({ title, description, status, project_id })
    res.status(201).json(task)
  } catch (error) {
    console.error("[v0] Erro ao criar tarefa:", error)
    res.status(400).json({ error: error.message })
  }
}

export const updateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body
    const task = await tarefaService.updateTask(req.params.id, { title, description, status })

    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada" })
    }

    res.status(200).json(task)
  } catch (error) {
    console.error("[v0] Erro ao atualizar tarefa:", error)
    res.status(400).json({ error: error.message })
  }
}

export const deleteTask = async (req, res) => {
  try {
    await tarefaService.deleteTask(req.params.id)
    res.status(204).send()
  } catch (error) {
    console.error("[v0] Erro ao deletar tarefa:", error)
    res.status(404).json({ error: error.message })
  }
}
