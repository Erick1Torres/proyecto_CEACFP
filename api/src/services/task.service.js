// Simulamos una base de datos con un array
let tasks = [];

const obtenerTodas = () => {
    return tasks;
};

const crearTarea = (datos) => {
    const nuevaTarea = {
        id: Date.now(), // Genera un ID único basado en el tiempo
        ...datos,
        completed: false
    };
    tasks.push(nuevaTarea);
    return nuevaTarea;
};

// IMPORTANTE: El nombre debe ser 'eliminarTarea' (en minúscula) 
// para que coincida con la corrección del controlador.
const eliminarTarea = (id) => {
    const idNumerico = Number(id);
    const index = tasks.findIndex(t => t.id === idNumerico);

    if (index === -1) {
        throw new Error('NOT_FOUND');
    }

    tasks.splice(index, 1);
    return true;
};

const actualizarTarea = (id, datosActualizados) => {
    const idNumerico = Number(id);
    const index = tasks.findIndex(t => t.id === idNumerico);

    if (index === -1) {
        throw new Error('NOT_FOUND');
    }

    // Actualizamos la tarea mezclando los datos viejos con los nuevos
    tasks[index] = { ...tasks[index], ...datosActualizados };
    return tasks[index];
};

module.exports = {
    obtenerTodas,
    crearTarea,
    eliminarTarea,
    actualizarTarea
};