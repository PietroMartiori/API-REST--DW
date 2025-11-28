const connection = require('../db.js');

const Project = {
  getAll: (callback) => {
    connection.query('SELECT * FROM projects', callback);
  },
  getById: (id, callback) => {
    connection.query('SELECT * FROM projects WHERE id = ?', [id], callback);
  },
  create: (project, callback) => {
    connection.query('INSERT INTO projects (name, description, status) VALUES (?, ?, ?)', [project.name, project.description, project.status || 'Pendente'], callback);
  },
  update: (id, project, callback) => {
    connection.query('UPDATE projects SET name = ?, description = ?, status = ? WHERE id = ?', [project.name, project.description, project.status, id], callback);
  },
  delete: (id, callback) => {
    connection.query('DELETE FROM projects WHERE id = ?', [id], callback);
  }
};

module.exports = Project;

