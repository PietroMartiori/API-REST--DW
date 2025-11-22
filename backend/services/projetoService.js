import pool from '../db.js';

export const createProject = async (data) => {
  if (!data.name || data.name.trim() === '') {
    throw new Error('Nome do projeto obrigatório');
  }

  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      'INSERT INTO Projects (name, description, status) VALUES (?, ?, ?)',
      [data.name, data.description || null, data.status || 'Ativo']
    );
    return { id: result.insertId, ...data };
  } finally {
    connection.release();
  }
};

export const updateProject = async (id, data) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM Projects WHERE id = ?', [id]);
    if (rows.length === 0) {
      throw new Error('Projeto não encontrado');
    }

    await connection.execute(
      'UPDATE Projects SET name = ?, description = ?, status = ? WHERE id = ?',
      [data.name || rows[0].name, data.description || rows[0].description, data.status || rows[0].status, id]
    );

    const [updated] = await connection.execute('SELECT * FROM Projects WHERE id = ?', [id]);
    return updated[0];
  } finally {
    connection.release();
  }
};

export const deleteProject = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM Projects WHERE id = ?', [id]);
    if (rows.length === 0) {
      throw new Error('Projeto não encontrado');
    }

    await connection.execute('DELETE FROM Projects WHERE id = ?', [id]);
    return { message: 'Projeto deletado' };
  } finally {
    connection.release();
  }
};

export const getAllProjects = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM Projects');
    return rows;
  } finally {
    connection.release();
  }
};

export const getProjectById = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM Projects WHERE id = ?', [id]);
    if (rows.length === 0) {
      throw new Error('Projeto não encontrado');
    }
    return rows[0];
  } finally {
    connection.release();
  }
};