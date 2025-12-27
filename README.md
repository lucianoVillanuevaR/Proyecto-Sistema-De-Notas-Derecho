\# Sistema de Notas — Derecho (Web)

Aplicación web para **gestión de evaluaciones y calificaciones** en la carrera de Derecho. Permite a **estudiantes** consultar su rendimiento académico (notas, observaciones, promedios) y descargar un **informe en PDF**, y a **profesores** administrar/ajustar calificaciones con **notificaciones automáticas** y **trazabilidad** mediante historial.

---

## Funcionalidades principales

### Estudiante
- Consultar informe académico personal: listado de evaluaciones, nota, observación y promedio general.
- Descargar informe en **PDF**.
- Ver notificaciones cuando se registran o editan calificaciones.
- Ver historial (trazabilidad) de acciones relevantes asociadas a su perfil.

### Profesor
- Listar/gestionar calificaciones (según permisos).
- Crear, editar o eliminar calificaciones.
- Al crear/editar/eliminar una calificación se registra el evento en el historial y se notifica al estudiante.

### Trazabilidad / Auditoría
- El sistema registra eventos como: **consulta de informe**, **descarga de PDF**, **consulta de historial**, **crear/actualizar/eliminar nota**.

---

## Tecnologías

**Backend**
- Node.js + Express
- TypeORM + PostgreSQL
- JWT (autenticación)
- PDFKit (generación de PDF)
- Joi (validaciones)

**Frontend**
- React + Vite
- Axios
- React Router

---

## Estructura del repositorio

```
Proyecto-Sistema-De-Notas-Derecho/
	README.md
	backend/
	frontend/
```

---

## Requisitos previos

- Node.js (recomendado: LTS)
- PostgreSQL

---

## Configuración (variables de entorno)

El backend lee configuración desde `.env`.

Variables usadas en `backend/src/config/configEnv.js`:

```env
PORT=3000
SERVER_HOST=0.0.0.0

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DATABASE=notas_derecho

JWT_SECRET=un_secreto_seguro
COOKIE_KEY=opcional

FRONTEND_URL=http://localhost:5173
```

Notas:
- `FRONTEND_URL` se usa para CORS en el backend.
- Si no defines `PORT`, se usa `3000`.

---

## Instalación

### 1) Backend

```bash
cd backend
npm install
```

### 2) Frontend

```bash
cd frontend
npm install
```

---

## Ejecución en desarrollo

### Backend

```bash
cd backend
npm run dev
```

Servidor (por defecto): `http://localhost:3000`

### Frontend

```bash
cd frontend
npm run dev
```

Frontend (por defecto): `http://localhost:5173`

---

## Seed (datos de prueba)

El proyecto incluye un seed para poblar la base de datos con:
- Profesores
- Estudiantes
- Evaluaciones
- Notas

Ejecutar:

```bash
cd backend
npm run seed
```

Las credenciales de ejemplo se crean en el seed (ver `backend/src/seeds/seed.js`).

---

## Módulos y dónde está cada cosa

### Reportes (informe e historial)
- Rutas: `backend/src/routes/reports.routes.js`
- Controlador (lógica del informe + PDF + logging de consultas): `backend/src/controllers/report.controller.js`
- Servicio (frontend): `frontend/src/services/report.service.js`
- Vista (frontend, estudiante): `frontend/src/pages/RequestReport.jsx`

### Notas (crear/editar/eliminar)
- Rutas: `backend/src/routes/grades.routes.js`
- Controlador: `backend/src/controllers/user.controller.js` (clase `NotasController`)
- Servicio de datos: `backend/src/services/notas.services.js`
- Validaciones: `backend/src/validations/grades.validation.js`

### Notificaciones
- Rutas: `backend/src/routes/notifications.routes.js`
- Controlador: `backend/src/controllers/notification.controller.js`
- Servicio: `backend/src/services/notification.service.js`
- UI (ejemplo): `frontend/src/pages/Notifications.jsx` y hook `frontend/src/hooks/useNotifications.js`

### Autenticación y Roles
- Middleware JWT: `backend/src/middleware/auth.middleware.js`
- Middleware roles: `backend/src/middleware/role.middleware.js`

### Trazabilidad (Historial)
- Servicio historial: `backend/src/services/history.service.js`
- Entidad: `backend/src/entities/history.entity.js`

---

## Endpoints principales (backend)

Base URL: `http://localhost:3000`

> Todos requieren `Authorization: Bearer <token>` (salvo login/registro, si aplica).

### Reportes
- `GET /reports/me/report` → Informe del estudiante autenticado
- `GET /reports/me/report/pdf` → PDF del informe del estudiante autenticado
- `GET /reports/me/history` → Historial del estudiante autenticado

- `GET /reports/student/:studentId/report` → Informe de un estudiante (según permisos)
- `GET /reports/student/:studentId/report/pdf` → PDF del informe (según permisos)
- `GET /reports/student/:studentId/history` → Historial de un estudiante (según permisos)

- `GET /reports/students?q=` → Listado/búsqueda de estudiantes (profesor/admin)

### Notas (calificaciones)
- `GET /grades` → Lista de notas (profesor/admin)
- `POST /grades` → Crear nota (profesor/admin)
- `GET /grades/:id` → Obtener nota por id (estudiante dueño / profesor responsable)
- `PATCH /grades/:id` → Editar nota (profesor/admin)
- `DELETE /grades/:id` → Eliminar nota (profesor/admin)

### Notificaciones
- `GET /notifications/me` → Mis notificaciones
- `POST /notifications/mark-read/:id` → Marcar como leída

---

## Criterios del requisito (resumen)

- Informe académico y PDF: implementado en `report.controller.js`.
- Notificaciones por creación/edición de notas: implementado en `NotasController` + `notification.service.js`.
- Trazabilidad: implementado con `history.service.js` y llamadas desde controladores.

### Nota sobre “profesor responsable”
El sistema valida estrictamente el acceso del **estudiante** a su propio informe. Para el rol **profesor**, existen validaciones en algunos flujos (por ejemplo, acceso a nota individual), pero dependiendo de la definición de “responsable” en el modelo de datos, puede requerirse endurecer reglas para asegurar que **solo** el profesor asignado a la evaluación/estudiante pueda ver/editar.

---

## Scripts

### Backend (`backend/package.json`)
- `npm run dev` → servidor con nodemon
- `npm run start` → servidor en modo normal
- `npm run seed` → poblar base de datos

### Frontend (`frontend/package.json`)
- `npm run dev` → Vite dev server
- `npm run build` → build producción
- `npm run preview` → previsualizar build

---

## Troubleshooting

- Si hay errores de CORS, revisa `FRONTEND_URL` en el `.env` del backend.
- Si falla conexión a DB, revisa credenciales `DB_*` y que PostgreSQL esté levantado.

---

## Licencia

Proyecto académico / educativo.
