const taskService = require('../services/task.service');

const ObtenerTodasTareas = (req, res, next) => {
    try {
        const tasks = taskService.obtenerTodas();
        res.json(tasks);
    } catch (error) {
        next(error);
    }
};

const CreaNuevaTarea = (req, res, next) => {
    try {
        const { title, priority, category, dueDate } = req.body;

        // Si el título no llega, el servidor responde con error 400
        if (!title) {
            return res.status(400).json({ error: "El título es obligatorio." });
        }

        const nuevaTarea = taskService.crearTarea({ title, priority, category, dueDate });
        res.status(201).json(nuevaTarea);
    } catch (error) {
        next(error);
    }
};

const EliminarTarea = (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: "ID de tarea no válido." });
        }

        taskService.eliminarTarea(id); // Corregido: minúscula según el estándar
        res.status(204).send();
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ error: "La tarea no existe." });
        }
        next(error); 
    }
};

const actualizarTarea = (req, res, next) => {
    try {
        const { id } = req.params;
        const datos = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: "ID de tarea no válido." });
        }

        const tareaEditada = taskService.actualizarTarea(id, datos); 
        res.json(tareaEditada);
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ error: "No se encontró la tarea." });
        }
        next(error);
    }
};

module.exports = {
    ObtenerTodasTareas,
    CreaNuevaTarea,
    EliminarTarea,
    actualizarTarea
};