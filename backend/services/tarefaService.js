import pool from "../db.js"

const createTask = async (data) => {
  if (!data.projectId) {
    throw new Error("Projeto obrigatório para a tarefa")
  }
  if (!data.title || data.title.trim() === "") {
    throw new Error("Título da tarefa obrigatório")
  }

  const connection = await pool.getConnection()
  try {
    const status = data.status || "Pendente"
    const result = await connection.execute(
      "INSERT INTO Tasks (title, description, status, projectId) VALUES (?, ?, ?, ?)",
      [data.title, data.description || null, status, data.projectId],
    )
    return { id: result[0].insertId, ...data, status }
  } finally {
    connection.release()
  }
}

const updateTask = async (id, data) => {
  const connection = await pool.getConnection()
  try {
    if (data.status && !["Pendente", "Em Andamento", "Concluída"].includes(data.status)) {
      throw new Error("Status inválido")
    }

    // Verificar se existe
    const [tasks] = await connection.execute("SELECT * FROM Tasks WHERE id = ?", [id])
    if (tasks.length === 0) {
      throw new Error("Tarefa não encontrada")
    }

    const task = tasks[0]

    // Preparar para atualizar
    const updates = []
    const values = []
    if (data.title !== undefined) {
      updates.push("title = ?")
      values.push(data.title)
    }
    if (data.description !== undefined) {
      updates.push("description = ?")
      values.push(data.description)
    }
    if (data.status !== undefined) {
      updates.push("status = ?")
      values.push(data.status)
    }
    if (data.projectId !== undefined) {
      updates.push("projectId = ?")
      values.push(data.projectId)
    }

    if (updates.length === 0) {
      return task
    }

    values.push(id)
    await connection.execute(`UPDATE Tasks SET ${updates.join(", ")} WHERE id = ?`, values)

    // Retornar atualizada
    const [updated] = await connection.execute("SELECT * FROM Tasks WHERE id = ?", [id])
    return updated[0]
  } finally {
    connection.release()
  }
}

const deleteTask = async (id) => {
  const connection = await pool.getConnection()
  try {
    // Verificar se existe
    const [tasks] = await connection.execute("SELECT * FROM Tasks WHERE id = ?", [id])
    if (tasks.length === 0) {
      throw new Error("Tarefa não encontrada")
    }

    await connection.execute("DELETE FROM Tasks WHERE id = ?", [id])
    return { message: "Tarefa deletada" }
  } finally {
    connection.release()
  }
}

const getAllTasks = async () => {
  const connection = await pool.getConnection()
  try {
    const [tasks] = await connection.execute("SELECT * FROM Tasks")
    return tasks
  } finally {
    connection.release()
  }
}

const getTaskById = async (id) => {
  const connection = await pool.getConnection()
  try {
    const [tasks] = await connection.execute("SELECT * FROM Tasks WHERE id = ?", [id])
    if (tasks.length === 0) {
      throw new Error("Tarefa não encontrada")
    }
    return tasks[0]
  } finally {
    connection.release()
  }
}

const getTasksByProject = async (projectId) => {
  const connection = await pool.getConnection()
  try {
    const [tasks] = await connection.execute("SELECT * FROM Tasks WHERE projectId = ?", [projectId])
    return tasks
  } finally {
    connection.release()
  }
}

export { createTask, updateTask, deleteTask, getAllTasks, getTaskById, getTasksByProject }
