// cliente.js - Versión Profesional para Vercel
const api = axios.create({
    // buscará la API en el mismo sitio donde esté la web.
    baseURL: '/api/v1', 
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
});

const taskApi = {
    // GET: Obtener todas las tareas
    async getAll() {
        const response = await api.get('/tasks');
        return response.data; // Axios ya nos da el JSON listo
    },

    // POST: Crear una tarea
    async create(taskData) {
        const response = await api.post('/tasks', taskData);
        return response.data;
    },

    // PUT: Actualizar estado
    async update(id, updates) {
        const response = await api.put(`/tasks/${id}`, updates);
        return response.data;
    },

    // DELETE: Borrar tarea
    async delete(id) {
        await api.delete(`/tasks/${id}`);
    }
};