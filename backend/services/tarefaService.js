import pool from "../db.js"

const createTask = async (data, userId) => {
  if (!data.projectId) {
    throw new Error("Projeto obrigatório para a tarefa")
  }
  if (!data.title || data.title.trim() === "") {
    throw new Error("Título da tarefa obrigatório")
  }

  const connection = await pool.getConnection()
  try {
    // Verificar se o projeto pertence ao usuário
    const [projects] = await connection.execute(
      "SELECT * FROM Projects WHERE id = ? AND userId = ?",
      [data.projectId, userId]
    )
    if (projects.length === 0) {
      throw new Error("Projeto não encontrado")
    }

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

const updateTask = async (id, data, userId) => {
  const connection = await pool.getConnection()
  try {
    if (data.status && !["Pendente", "Em Andamento", "Concluída"].includes(data.status)) {
      throw new Error("Status inválido")
    }

    // Verificar se existe e se o projeto pertence ao usuário
    const [tasks] = await connection.execute(
      "SELECT t.* FROM Tasks t INNER JOIN Projects p ON t.projectId = p.id WHERE t.id = ? AND p.userId = ?",
      [id, userId]
    )
    if (tasks.length === 0) {
      throw new Error("Tarefa não encontrada")
    }

    const task = tasks[0]

    // Se projectId for alterado, verificar se o novo projeto pertence ao usuário
    if (data.projectId !== undefined && data.projectId !== task.projectId) {
      const [projects] = await connection.execute(
        "SELECT * FROM Projects WHERE id = ? AND userId = ?",
        [data.projectId, userId]
      )
      if (projects.length === 0) {
        throw new Error("Projeto não encontrado")
      }
    }

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

const deleteTask = async (id, userId) => {
  const connection = await pool.getConnection()
  try {
    // Verificar se existe e se o projeto pertence ao usuário
    const [tasks] = await connection.execute(
      "SELECT t.* FROM Tasks t INNER JOIN Projects p ON t.projectId = p.id WHERE t.id = ? AND p.userId = ?",
      [id, userId]
    )
    if (tasks.length === 0) {
      throw new Error("Tarefa não encontrada")
    }

    await connection.execute("DELETE FROM Tasks WHERE id = ?", [id])
    return { message: "Tarefa deletada" }
  } finally {
    connection.release()
  }
}

const getAllTasks = async (userId) => {
  const connection = await pool.getConnection()
  try {
    const [tasks] = await connection.execute(
      "SELECT t.* FROM Tasks t INNER JOIN Projects p ON t.projectId = p.id WHERE p.userId = ?",
      [userId]
    )
    return tasks
  } finally {
    connection.release()
  }
}

const getTaskById = async (id, userId) => {
  const connection = await pool.getConnection()
  try {
    const [tasks] = await connection.execute(
      "SELECT t.* FROM Tasks t INNER JOIN Projects p ON t.projectId = p.id WHERE t.id = ? AND p.userId = ?",
      [id, userId]
    )
    if (tasks.length === 0) {
      throw new Error("Tarefa não encontrada")
    }
    return tasks[0]
  } finally {
    connection.release()
  }
}

const getTasksByProject = async (projectId, userId) => {
  const connection = await pool.getConnection()
  try {
    // Verificar se o projeto pertence ao usuário
    const [projects] = await connection.execute(
      "SELECT * FROM Projects WHERE id = ? AND userId = ?",
      [projectId, userId]
    )
    if (projects.length === 0) {
      throw new Error("Projeto não encontrado")
    }

    const [tasks] = await connection.execute(
      "SELECT * FROM Tasks WHERE projectId = ?",
      [projectId]
    )
    return tasks
  } finally {
    connection.release()
  }
}

export { createTask, updateTask, deleteTask, getAllTasks, getTaskById, getTasksByProject }
