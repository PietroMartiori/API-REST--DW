const connection = require('../db.js');

const Task = {
  getAll: (callback) => {
    connection.query('SELECT * FROM tasks', callback);
  },
  getById: (id, callback) => {
    connection.query('SELECT * FROM tasks WHERE id = ?', [id], callback);
  },
  create: (task, callback) => {
    connection.query('INSERT INTO tasks (name, status, project_id) VALUES (?, ?, ?)', [task.name, task.status || 'Pendente', task.project_id], callback);
  },
  update: (id, task, callback) => {
    connection.query('UPDATE tasks SET name = ?, status = ?, project_id = ? WHERE id = ?', [task.name, task.status, task.project_id, id], callback);
  },
  delete: (id, callback) => {
    connection.query('DELETE FROM tasks WHERE id = ?', [id], callback);
  },
  getByProject: (projectId, callback) => {
    connection.query('SELECT * FROM tasks WHERE project_id = ?', [projectId], callback);
  }
};

module.exports = Task;
