const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller'); 

router.get('/', taskController.ObtenerTodasTareas); 

router.post('/', taskController.CreaNuevaTarea); 

router.delete('/:id', taskController.EliminarTarea); 

router.put('/:id', taskController.actualizarTarea);

module.exports = router;