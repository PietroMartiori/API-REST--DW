import pool from "../db.js"

const createProject = async (data, userId) => {
  if (!data.name || data.name.trim() === "") {
    throw new Error("Nome do projeto obrigatório")
  }

  const connection = await pool.getConnection()
  try {
    const status = data.status || "Ativo"
    const result = await connection.execute(
      "INSERT INTO Projects (name, description, status, userId) VALUES (?, ?, ?, ?)",
      [data.name, data.description || null, status, userId]
    )
    return { id: result[0].insertId, ...data, status, userId }
  } finally {
    connection.release()
  }
}

const updateProject = async (id, data, userId) => {
  const connection = await pool.getConnection()
  try {
    // verificar se existe e pertence ao usuário
    const [projects] = await connection.execute(
      "SELECT * FROM Projects WHERE id = ? AND userId = ?",
      [id, userId]
    )
    if (projects.length === 0) {
      throw new Error("Projeto não encontrado")
    }

    const project = projects[0]

    // preparar para atualizar
    const updates = []
    const values = []
    if (data.name !== undefined) {
      updates.push("name = ?")
      values.push(data.name)
    }
    if (data.description !== undefined) {
      updates.push("description = ?")
      values.push(data.description)
    }
    if (data.status !== undefined) {
      updates.push("status = ?")
      values.push(data.status)
    }

    if (updates.length === 0) {
      return project
    }

    values.push(id, userId)
    await connection.execute(
      `UPDATE Projects SET ${updates.join(", ")} WHERE id = ? AND userId = ?`,
      values
    )

    // Retornar atualizado
    const [updated] = await connection.execute(
      "SELECT * FROM Projects WHERE id = ? AND userId = ?",
      [id, userId]
    )
    return updated[0]
  } finally {
    connection.release()
  }
}

const deleteProject = async (id, userId) => {
  const connection = await pool.getConnection()
  try {
    // verificar se existe e pertence ao usuário
    const [projects] = await connection.execute(
      "SELECT * FROM Projects WHERE id = ? AND userId = ?",
      [id, userId]
    )
    if (projects.length === 0) {
      throw new Error("Projeto não encontrado")
    }

    await connection.execute("DELETE FROM Projects WHERE id = ? AND userId = ?", [id, userId])
    return { message: "Projeto deletado" }
  } finally {
    connection.release()
  }
}

const getAllProjects = async (userId) => {
  const connection = await pool.getConnection()
  try {
    const [projects] = await connection.execute(
      "SELECT * FROM Projects WHERE userId = ?",
      [userId]
    )
    return projects
  } finally {
    connection.release()
  }
}

const getProjectById = async (id, userId) => {
  const connection = await pool.getConnection()
  try {
    const [projects] = await connection.execute(
      "SELECT * FROM Projects WHERE id = ? AND userId = ?",
      [id, userId]
    )
    if (projects.length === 0) {
      throw new Error("Projeto não encontrado")
    }
    return projects[0]
  } finally {
    connection.release()
  }
}

export { createProject, updateProject, deleteProject, getAllProjects, getProjectById }
