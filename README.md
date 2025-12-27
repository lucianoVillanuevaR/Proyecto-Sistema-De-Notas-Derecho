\# Sistema de Notas — Derecho (Web)

Aplicación web para **gestión de evaluaciones, calificaciones, apelaciones y asistencia** en la carrera de Derecho.

Incluye:
- **Estudiantes**: consultar su **informe académico**, ver **notificaciones**, registrar **asistencia** (según flujo) y **apelar** notas.
- **Profesores**: gestionar **evaluaciones** y **calificaciones**, y revisar apelaciones.
- **Trazabilidad**: registro de acciones (consultas/descargas/gestión de notas) en historial.

---

## Stack tecnológico

**Backend**
- Node.js + Express
- TypeORM + PostgreSQL
- JWT (autenticación)
- Joi (validaciones)
- PDFKit (generación de PDF)

**Frontend**
- React + Vite
- Axios (con interceptor Bearer token)
- React Router
- SweetAlert2

---

## Estructura del repositorio

```text
Proyecto-Sistema-De-Notas-Derecho/
	README.md
	backend/
		src/
			index.js
			routes/
			controllers/
			services/
			entities/
			middleware/
			validations/
			seeds/
	frontend/
		src/
			pages/
			services/
			hooks/
			components/
			context/
```

---

## Requisitos previos

- Node.js (recomendado LTS)
- PostgreSQL

---

## Configuración (Backend)

El backend usa variables de entorno (cargadas con `dotenv`). Variables referenciadas en `backend/src/config/configEnv.js`:

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
- `FRONTEND_URL` controla CORS.
- El backend expone la API bajo el prefijo **`/api`**.

---

## Instalación y ejecución

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

Servidor (por defecto): `http://localhost:3000`

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

UI (por defecto): `http://localhost:5173`

---

## Seed (datos de prueba)

Para poblar la base de datos con usuarios, evaluaciones y notas:

```bash
cd backend
npm run seed
```

Credenciales de ejemplo se definen en `backend/src/seeds/seed.js`.

---

## Autenticación

- El login devuelve un **JWT**.
- El frontend lo guarda en cookie `jwt-auth` y envía `Authorization: Bearer <token>` (ver `frontend/src/services/root.service.js`).

---

## Roles y permisos (estado actual)

En el backend se usan roles como strings en el JWT y en el middleware `checkRole(...)`.

Roles vistos en el código:
- `estudiante`
- `profesor`
- `admin` (usado por varias rutas)

Además, la validación de registro permite `administrador` (ver `backend/src/validations/usuario.validation.js`).

> Importante: actualmente hay inconsistencia entre `admin` y `administrador` (ver “Limitaciones conocidas”).

---

## Módulos (qué hace el sistema y dónde está)

### 1) Reportes (Informe + Historial + PDF)

**Qué hace**
- Obtiene notas del estudiante.
- Calcula `promedioGeneral` y `promediosPorEvaluacion` (considera solo puntajes válidos 10–70).
- Genera PDF con PDFKit (incluye coloreo de nota: azul si aprueba, rojo si reprueba; gris si N/A).
- Registra trazabilidad en historial: `consulta_informe`, `consulta_historial`, `descargar_informe_pdf`.

**Backend**
- Rutas: `backend/src/routes/reports.routes.js`
- Controlador: `backend/src/controllers/report.controller.js`
- Servicios usados: `backend/src/services/notas.services.js`, `backend/src/services/history.service.js`

**Frontend**
- Página (estudiante): `frontend/src/pages/RequestReport.jsx`
- Servicio: `frontend/src/services/report.service.js`

### 2) Notas (Calificaciones)

**Qué hace**
- CRUD de notas (profesor/admin), lectura individual con control por propietario (estudiante) y reglas adicionales.
- En create/update/delete registra historial y genera notificaciones (según controlador).

**Backend**
- Rutas: `backend/src/routes/grades.routes.js`
- Controlador: `backend/src/controllers/user.controller.js` (clase `NotasController`)
- Servicio: `backend/src/services/notas.services.js`
- Validaciones: `backend/src/validations/grades.validation.js`

**Frontend**
- Página: `frontend/src/pages/GradesManager.jsx`
- Servicio: `frontend/src/services/grades.service.js`

### 3) Evaluaciones

**Qué hace**
- CRUD de evaluaciones (crear/editar/eliminar para profesor/admin).

**Backend**
- Rutas: `backend/src/routes/evaluacion.routes.js`
- Controlador: `backend/src/controllers/evaluacion.controller.js`

**Frontend**
- Páginas: `frontend/src/pages/Evaluaciones.jsx`, `frontend/src/pages/CreateEvaluacion.jsx`
- Servicio: `frontend/src/services/evaluacion.service.js`

### 4) Asistencia (por evaluación)

**Qué hace**
- Registrar asistencia vía endpoint autenticado.

**Backend**
- Rutas: `backend/src/routes/asistenciaEv.routes.js`
- Controlador: `backend/src/controllers/asistenciaEv.controller.js`

### 5) Apelaciones

**Qué hace**
- Crear apelaciones (estudiante/admin).
- Listar y obtener apelaciones.
- Listar notas “apelables”.
- Actualizar apelación (admin/profesor).

**Backend**
- Rutas: `backend/src/routes/appeal.routes.js`
- Controlador: `backend/src/controllers/appeal.controller.js`

**Frontend**
- Páginas: `frontend/src/pages/Appeals.jsx`, `frontend/src/pages/StudentAppeals.jsx`, `frontend/src/pages/ProfessorAppeals.jsx`
- Servicio: `frontend/src/services/appeal.service.js`

### 6) Notificaciones

**Qué hace**
- Listar notificaciones del usuario autenticado.
- Marcar notificación como leída.
- Crear notificación (endpoint interno/protegido).

**Backend**
- Rutas: `backend/src/routes/notifications.routes.js`
- Controlador: `backend/src/controllers/notification.controller.js`
- Servicio: `backend/src/services/notification.service.js`

**Frontend**
- Páginas: `frontend/src/pages/Notifications.jsx`, `frontend/src/pages/Notificaciones.jsx`
- Hook: `frontend/src/hooks/useNotifications.js`
- Componente: `frontend/src/components/NotificationButton.jsx`

### 7) Perfil

**Qué hace**
- Consultar perfil privado del usuario autenticado.
- Actualizar/eliminar perfil propio.
- Actualizar/eliminar perfil por id como “admin”.

**Backend**
- Rutas: `backend/src/routes/profile.routes.js`
- Controlador: `backend/src/controllers/profile.controller.js`

**Frontend**
- Página: `frontend/src/pages/Profile.jsx`
- Servicio (perfil): `frontend/src/services/user.service.js` (función `getProfile`)

### 8) Autenticación

**Backend**
- Rutas: `backend/src/routes/auth.routes.js`
- Controlador: `backend/src/controllers/auth.controller.js`

**Frontend**
- Páginas: `frontend/src/pages/Login.jsx`, `frontend/src/pages/Register.jsx`
- Servicio: `frontend/src/services/auth.service.js`
- Contexto: `frontend/src/context/AuthContext.jsx`

---

## API (Endpoints)

Base URL (backend): `http://localhost:3000/api`

> Salvo login/registro, los endpoints requieren `Authorization: Bearer <token>`.

### Auth (`/auth`)
- `POST /api/auth/login`
- `POST /api/auth/register`

### Profile (`/profile`)
- `GET /api/profile/public`
- `GET /api/profile/private`
- `PATCH /api/profile/private`
- `DELETE /api/profile/private`
- `PATCH /api/profile/:id` (requiere role `admin`)
- `DELETE /api/profile/:id` (requiere role `admin`)

### Reports (`/reports`)
- `GET /api/reports/me/report`
- `GET /api/reports/me/history`
- `GET /api/reports/me/report/pdf`

- `GET /api/reports/student/:studentId/report`
- `GET /api/reports/student/:studentId/history`
- `GET /api/reports/student/:studentId/report/pdf`

- `GET /api/reports/students?q=` (requiere role `profesor` o `admin`)

### Grades (`/grades`)
- `GET /api/grades` (role `profesor` o `admin`)
- `POST /api/grades` (role `profesor` o `admin`)
- `GET /api/grades/:id` (acceso controlado en controlador)
- `PATCH /api/grades/:id` (role `profesor` o `admin`)
- `DELETE /api/grades/:id` (role `profesor` o `admin`)

### Evaluaciones (`/evaluaciones`)
- `GET /api/evaluaciones`
- `GET /api/evaluaciones/:id`
- `POST /api/evaluaciones` (role `profesor` o `admin`)
- `PUT /api/evaluaciones/:id` (role `profesor` o `admin`)
- `DELETE /api/evaluaciones/:id` (role `profesor` o `admin`)

### Asistencias (`/asistencias`)
- `POST /api/asistencias/marcarAsistencia`

### Apelaciones (`/appeal`)
- `POST /api/appeal/crear` (role `admin` o `estudiante`)
- `GET /api/appeal/obtener`
- `GET /api/appeal/obtener/id/:id`
- `GET /api/appeal/obtener/notas`
- `PATCH /api/appeal/actualizar/:id` (role `admin` o `profesor`)

### Notificaciones (`/notifications`)
- `GET /api/notifications/me`
- `POST /api/notifications/mark-read/:id`
- `POST /api/notifications/create`

---

## Modelo de datos (TypeORM Entities)

Entidades principales en `backend/src/entities/`:
- `user.entity.js`
- `evaluacion.entity.js`
- `grade.entity.js`
- `notification.entity.js`
- `history.entity.js`
- `appeal.entity.js`
- `asistenciaEv.entity.js`

---

## Scripts

**Backend** (`backend/package.json`)
- `npm run dev`
- `npm run start`
- `npm run seed`

**Frontend** (`frontend/package.json`)
- `npm run dev`
- `npm run build`
- `npm run preview`

---

## Limitaciones conocidas (para presentación / evaluación)

1) **Inconsistencia de rol**
- Algunas rutas exigen role `admin` (ej.: `profile/:id`, `appeal` y varios módulos).
- En cambio, el validador de registro permite `administrador`.
- Si un usuario se registra con role `administrador`, probablemente no pasará `checkRole("admin")`.

2) **Pantalla de “Usuarios” en frontend**
- El frontend incluye `frontend/src/pages/Users.jsx` y `frontend/src/services/user.service.js` con llamadas a `GET/PUT/DELETE /users`.
- En el backend **no existe** un módulo montado como `/api/users` (ver `backend/src/routes/index.routes.js`).
- Resultado: esa vista puede fallar hasta que se implemente o se ajuste a endpoints existentes.

3) **“Profesor responsable”**
- En reportes/PDF existe un bloque reservado para restringir acceso de profesor/admin (actualmente vacío). Dependiendo del requisito, puede requerir endurecer esa regla.

---

## Licencia

Proyecto académico / educativo.
