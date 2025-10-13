const express = require('../../node_modules/express');
const router = express.Router();
const controller = require('../controllers/taskController.js');

router.get('/tasks', controller.getAllTasks);

router.get('/tasks/:id', controller.getTask);

router.post('/tasks', controller.validateTask, controller.postTask);

router.patch('/tasks/:id', controller.validateTask, controller.patchTask);

router.delete('/tasks/:id', controller.deleteTask);

module.exports = router;
