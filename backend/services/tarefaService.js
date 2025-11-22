import pool from '../db.js';

export const createTask = async (data) => {
  if (!data.projectId) {
    throw new Error('Projeto obrigatório para a tarefa');
  }

  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      'INSERT INTO Tasks (title, description, status, projectId) VALUES (?, ?, ?, ?)',
      [data.title, data.description || null, data.status || 'Pendente', data.projectId]
    );
    return { id: result.insertId, ...data };
  } finally {
    connection.release();
  }
};

export const updateTask = async (id, data) => {
  const validStatuses = ['Pendente', 'Em Andamento', 'Concluída'];
  if (data.status && !validStatuses.includes(data.status)) {
    throw new Error('Status inválido');
  }

  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM Tasks WHERE id = ?', [id]);
    if (rows.length === 0) {
      throw new Error('Tarefa não encontrada');
    }

    const updates = [];
    const values = [];

    if (data.title !== undefined) {
      updates.push('title = ?');
      values.push(data.title);
    }
    if (data.description !== undefined) {
      updates.push('description = ?');
      values.push(data.description);
    }
    if (data.status !== undefined) {
      updates.push('status = ?');
      values.push(data.status);
    }

    if (updates.length > 0) {
      values.push(id);
      await connection.execute(`UPDATE Tasks SET ${updates.join(', ')} WHERE id = ?`, values);
    }

    const [updated] = await connection.execute('SELECT * FROM Tasks WHERE id = ?', [id]);
    return updated[0];
  } finally {
    connection.release();
  }
};

export const deleteTask = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM Tasks WHERE id = ?', [id]);
    if (rows.length === 0) {
      throw new Error('Tarefa não encontrada');
    }

    await connection.execute('DELETE FROM Tasks WHERE id = ?', [id]);
    return { message: 'Tarefa deletada' };
  } finally {
    connection.release();
  }
};

export const getAllTasks = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM Tasks');
    return rows;
  } finally {
    connection.release();
  }
};

export const getTaskById = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM Tasks WHERE id = ?', [id]);
    if (rows.length === 0) {
      throw new Error('Tarefa não encontrada');
    }
    return rows[0];
  } finally {
    connection.release();
  }
};

export const getTasksByProject = async (projectId) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM Tasks WHERE projectId = ?', [projectId]);
    return rows;
  } finally {
    connection.release();
  }
};