# TaskFlow Pro

**TaskFlow Pro** es una solución avanzada de gestión de tareas que ha evolucionado de una herramienta de persistencia local a una arquitectura **Fullstack Asíncrona**. Implementa un robusto backend en **Node.js** y un frontend reactivo de alto rendimiento diseñado con **Vanilla JavaScript** y **Tailwind CSS**.

---

## Arquitectura del Sistema

El proyecto se rige por el principio de **Separación de Concernimientos (SoC)**, estructurado en capas independientes para facilitar el mantenimiento y la escalabilidad:

1.  **Capa de Presentación (UI):** Diseño atómico y responsivo mediante Tailwind CSS, con un motor de inyección de estilos dinámicos en tiempo de ejecución.
2.  **Lógica de Orquestación (App Core):** Un módulo encapsulado (IIFE) en `app.js` que gestiona el estado de la interfaz, los filtros y la reactividad del DOM sin contaminar el scope global.
3.  **Capa de Abstracción de Red (API Client):** Localizada en `cliente.js`, esta capa encapsula las peticiones `fetch`, abstrayendo la lógica de comunicación HTTP del resto de la aplicación.

---

## Características

-   **Interfaz Moderna:** Uso de Tailwind CSS (JIT Mode) para una experiencia fluida y adaptable.
-   **Modo Oscuro Pro:** Persistencia inteligente de tema (`dark`/`light`) basada en `localStorage`.
-   **Identidad Visual Dinámica:** Selector de color que sobreescribe variables CSS (`:root`) para unificar el branding en header, botones y estados activos.
-   **Gestión de Tareas Completa:** Sistema de categorías (Trabajo, Casa, Estudios) y prioridades (Baja, Media, Alta).
-   **Búsqueda en Tiempo Real:** Motor de filtrado por texto que procesa la colección de tareas en memoria.

### Gestión de Estados de Red (UX/UI)
La aplicación gestiona la latencia y la comunicación con el servidor Node.js mediante tres estados fundamentales:
-   **Estado de Carga (Loading):** Durante las peticiones, el botón de acción muestra un *spinner* animado (`loader-2`) y la lista se atenúa (`opacity-40`) para evitar acciones duplicadas.
-   **Estado de Éxito (Success):** Notificaciones flotantes (*Toasts*) confirman visualmente cada operación exitosa (Crear, Actualizar, Eliminar) en el servidor.
-   **Estado de Error (Fallback):** Si el servidor no responde, el sistema activa automáticamente el **Modo Offline**, garantizando la continuidad mediante `localStorage`.

### Validaciones y Lógica de Negocio
-   **Validación de Título:** Bloqueo de envío para entradas vacías o menores a 3 caracteres, con feedback mediante animación `shake`, borde rojo y cambio dinámico de `placeholder`.
-   **Lógica de Fechas Inteligente:** Si una tarea se crea sin fecha, el sistema asigna y renderiza automáticamente el estado **"⏳ Sin límite"**.

---

### Funcionamiento de Middlewares (Terminología Técnica)

En el backend de TaskFlow, los Middlewares son funciones intermedias que procesan la solicitud (`req`) antes de que llegue al manejador de ruta final. Hemos implementado:

CORS (Cross-Origin Resource Sharing): Este middleware gestiona la política de seguridad del navegador. Permite que el frontend (ej. `localhost:5500`) realice peticiones al backend (`localhost:3000`), validando los encabezados `Access-Control-Allow-Origin`.

Built-in JSON Parsing: Utiliza `express.json()`. Este middleware intercepta las peticiones con el encabezado `Content-Type: application/json`, analiza el flujo de datos (stream) y deserializa el JSON, inyectándolo en el objeto `req.body`.

Error Handling Middleware: Un mecanismo global que captura excepciones durante el ciclo de vida de la petición, garantizando que el servidor responda con un código de estado adecuado (500 o 400) en lugar de colapsar la instancia de Node.js.

---

## Guía de Interacción con la API REST (v1)

La comunicación con el servidor Node.js se realiza mediante el protocolo HTTP y formato JSON. La URL base por defecto es `http://localhost:3000/api/v1/tasks`.

### 1. Obtener listado de tareas (GET).
Recupera todas las tareas almacenadas en el servidor.


```javascript
// Ejemplo con Fetch API
const response = await fetch('http://localhost:3000/api/v1/tasks');
const tasks = await response.json();
console.log(tasks);
```
Terminal (URL): `curl -X GET http://localhost:3000/api/v1/tasks`

----

### 2. Crear una nueva tarea (POST).
Envía una tarea al servidor para su persistencia.
```javascript
const newTask = {
    title: "Aprender Arquitectura Senior",
    category: "estudios",
    priority: "alta",
    dueDate: "2024-12-31" // La fecha puede no ponerse si la tarea no esta prevista para ningún día.
};

await fetch('http://localhost:3000/api/v1/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTask)
});
```
Terminal URL: `curl -X POST -H "Content-Type: application/json" -d '{"title":"Nueva Tarea"}' http://localhost:3000/api/v1/tasks`

----

### 3. Actualizar estado de tarea (PUT).

Permite modificar el estado de completado o los datos de una tarea mediante su ID.

```javascript
await fetch(`http://localhost:3000/api/v1/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: true })
});
```
----

### 4. Eliminar tarea (DELETE).
Elimina permanentemente la tarea del registro del servidor.
```javascript
await fetch(`http://localhost:3000/api/v1/tasks/${id}`, {
    method: 'DELETE'
});
```
---

### Estructura del Proyecto.

```Plaintext
TaskFlow/
|_______________________
│   ├── data/tasks.json
│   └── server.js ──src -> api(cliente), config(env), controllers(controller), routers(router), services(service), index.js                   
│   ├── index.html                
│   ├── app.js                                           
└── README.md                     

# Servidor Node.js
# Base de datos persistente (JSON)
# API REST y Middlewares (CORS, Express JSON)
# Cliente SPA
# Vista y Tailwind Config
# Lógica de UI y Estados (IIFE)
# Abstracción de peticiones Fetch
# Documentación técnica
```
--------


### Inicio Rápido.

1. Levantar el Servidor:
```bash
cd backend
node server.js
```
2. Abrir el Cliente: Lanza `index.html` usando un servidor local (ej. Live Server en VS Code).
3. Uso:
Crea tareas (mínimo 3 caracteres), cambia el color de identidad y experimenta la sincronización en tiempo real.


---
### Documentación Técnica de la API.

#### 1. Documentación con Swagger (OpenAPI 3.0)
Swagger permite que otros desarrolladores entiendan tu API sin leer una línea de código. En un entorno profesional, esto se sirve en `/api-docs`.

Definición del Recurso Tarea:

- POST `/tasks:Cuerpo:`
`{ "title": string, "priority": string, "category": string }`

- Validación: Si `title` tiene menos de 3 caracteres -> 400 Bad Request.
- GET `/tasks/{id}`:
  Parámetro: `id` (numérico/timestamp).
  Error: Si el ID no existe -> 404 Not Found.

### 2. Pruebas de Estrés y Errores (Postman / Thunder Client)
Para garantizar la calidad, debemos "romper" la API intencionadamente. Aquí tienes cómo configurar tus pruebas:

A. Forzando el Error 400 (Bad Request)
Escenario: El usuario envía una tarea vacía o con datos mal formateados.

Request: `POST /api/v1/tasks` con el body `{"title": "Ab"}` (demasiado corto).

Resultado esperado:

```JSON
{
  "status": "error",
  "code": 400,
  "message": "Validación fallida: El título debe tener al menos 3 caracteres."
}
```

B. Forzando el Error 404 (Not Found)
Escenario: Intentar actualizar o borrar una tarea que ya no existe.

Request: `DELETE /api/v1/tasks/999999`

Resultado esperado:
```JSON
{
  "status": "error",
  "code": 404,
  "message": "Recurso no encontrado: La tarea con ID 999999 no existe en el servidor."
}
```

C. Forzando el Error 500 (Internal Server Error)
Escenario: Error en la persistencia (archivo `tasks.json` bloqueado o sin permisos).

Simulación: Cambia temporalmente los permisos del archivo a "Solo lectura" e intenta guardar una tarea.

Resultado esperado:
```JSON
{
  "status": "error",
  "code": 500,
  "message": "Error crítico: No se pudo escribir en la base de datos de persistencia."
}
```
---

### Estados de Respuesta HTTP (Status Codes).

El servidor comunica el resultado de las operaciones mediante códigos estandarizados:

- 200 OK: Operación exitosa (Lectura/Actualización/Borrado).

- 201 Created: Recurso creado con éxito en el servidor.

- 400 Bad Request: Datos enviados inválidos (ej. título menor a 3 caracteres).

- 404 Not Found: El ID de la tarea no existe en el registro.

- 500 Internal Server Error: Fallo crítico en la escritura del archivo de persistencia.

---

### Autor
Erick Cáceres
