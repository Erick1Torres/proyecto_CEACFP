const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/env');
const taskRouters = require('./routers/task.router');

const app = express();

// Middlewares (Configuraciones de seguridad y datos)
app.use(cors());
app.use(express.json());

app.use('/api/v1/tasks', taskRouters);

// --- MIDDLEWARE GLOBAL DE ERRORES (Mapeo Semántico) ---
app.use((err, req, res, next) => {
    //Mapeo semántico de errores conocidos
    if (err.message === 'NOT_FOUND') {
        return res.status(404).json({
            error: "Recurso no encontrado",
            message: "La tarea solicitada no existe en nuestra base de datos."
        });
    }

    //Errores de validación
    if (err.message.includes("obligatorio") || err.status === 400) {
        return res.status(400).json({
            error: "Petición incorrecta",
            message: err.message
        });
    }

    // FALLOS NO CONTROLADOS (Seguridad y Logs)
    // Registramos la traza completa solo en la consola del servidor
    console.error("Fallo critico", err); 

    // Devolvemos un 500 genérico sin filtrar detalles técnicos sensibles
    res.status(500).json({
        error: "Error interno del servidor",
        message: "Lo sentimos, algo salió mal de nuestro lado. Inténtalo más tarde."
    });
});

module.exports = app;