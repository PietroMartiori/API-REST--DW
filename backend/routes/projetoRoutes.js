const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/ProjectoController');

router.get('/', projectsController.getProjects);
router.get('/:id', projectsController.getProject);
router.post('/', projectsController.createProject);
router.put('/:id', projectsController.updateProject);
router.delete('/:id', projectsController.deleteProject);

module.exports = router;
