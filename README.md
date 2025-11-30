# Sistema de Gestión de Notas - Facultad de Derecho

Sistema web completo para la gestión académica de estudiantes de la Facultad de Derecho, desarrollado con **Node.js**, **React** y **PostgreSQL**.

##  Características Principales

### Para Estudiantes
-  **Visualización de Calificaciones**: Consulta todas tus notas en tiempo real con diseño profesional
-  **Cálculo Automático de Promedios**: Promedio general y por evaluación
-  **Generación de Informes PDF**: Descarga tu informe académico oficial
-  **Sistema de Notificaciones**: Recibe alertas cuando se actualicen tus notas
-  **Gestión de Perfil**: Actualiza tu información personal y académica

### Para Profesores
-  **Gestión de Notas**: Crea, actualiza y elimina calificaciones
-  **Administración de Estudiantes**: Lista y búsqueda de estudiantes
-  **Reportes Académicos**: Acceso a informes de rendimiento por estudiante
-  **Historial de Cambios**: Seguimiento completo de modificaciones

### Para Administradores
-  **Control Total**: Acceso a todas las funcionalidades del sistema
-  **Gestión de Usuarios**: Administración de estudiantes y profesores
-  **Reportes Globales**: Estadísticas y análisis del rendimiento académico

##  Tecnologías Utilizadas

### Backend
- **Node.js** v18+
- **Express.js** - Framework web
- **TypeORM** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación y autorización
- **Joi** - Validación de datos
- **PDFKit** - Generación de documentos PDF

### Frontend
- **React** v18+
- **Vite** - Build tool y dev server
- **React Router** - Navegación SPA
- **Tailwind CSS** - Framework de estilos
- **Axios** - Cliente HTTP

## 📋 Requisitos Previos

- Node.js v18 o superior
- PostgreSQL v14 o superior
- npm o yarn

## Instalación

### 1. Clonar el Repositorio
```bash
git clone https://github.com/lucianoVillanuevaR/Proyecto-Sistema-De-Notas-Derecho.git
cd Proyecto-Sistema-De-Notas-Derecho
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env` en la carpeta `backend`:
```env
PORT=3000
HOST=localhost
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
DB_DATABASE=notas_derecho
JWT_SECRET=tu_secreto_jwt_muy_seguro
FRONTEND_URL=http://localhost:5173
```

Ejecutar migraciones y seed:
```bash
npm run dev
```

### 3. Configurar Frontend

```bash
cd ../frontend
npm install
```

Crear archivo `.env` en la carpeta `frontend`:
```env
VITE_BASE_URL=http://localhost:3000/api
```

Iniciar servidor de desarrollo:
```bash
npm run dev
```

## 🗄️ Estructura de la Base de Datos

### Tablas Principales

#### `users`
- Almacena usuarios (estudiantes, profesores, administradores)
- Campos: id, email, password, role, studentId, faculty, created_at

#### `grades`
- Registro de calificaciones
- Campos: id, studentId, professorId, evaluation, type, score (1.0-7.0), observation, created_at

#### `evaluaciones`
- Definición de evaluaciones
- Campos: id, nombreEv, asignatura1, profesor, tipoEv, ponderacion

#### `asistencias_evaluaciones`
- Registro de asistencia y notas por evaluación
- Campos: id, estudianteId, evaluacionId, asistio, nota (1.0-7.0), calificadoPor, estado

#### `notificaciones`
- Sistema de notificaciones
- Campos: id, userId, type, title, message, read, metadata, created_at

#### `historial`
- Auditoría de cambios
- Campos: id, studentId, actorId, action, details, created_at

##  Sistema de Calificación

El sistema utiliza la **escala chilena de 1.0 a 7.0**:
- **6.0 - 7.0**: Aprobado (verde)
-  **4.0 - 5.9**: En riesgo (azul)
-  **1.0 - 3.9**: Reprobado (rojo)

### Validaciones
- Notas individuales: 1 decimal (ej: 5.5)
- Promedios: 2 decimales (ej: 5.75)
- Validación tanto en frontend como backend

## 📡 API Endpoints

### Autenticación
```
POST   /api/auth/login          - Iniciar sesión
POST   /api/auth/logout         - Cerrar sesión
```

### Calificaciones
```
GET    /api/grades              - Obtener todas las notas (profesor/admin)
GET    /api/grades/:id          - Obtener nota por ID
PATCH  /api/grades/:id          - Actualizar nota
DELETE /api/grades/:id          - Eliminar nota
```

### Reportes
```
GET    /api/reports/miinforme           - Obtener informe propio
GET    /api/reports/mipdf               - Descargar PDF propio
GET    /api/reports/students            - Listar estudiantes
GET    /api/reports/students/:id        - Informe de estudiante
GET    /api/reports/students/:id/pdf    - PDF de estudiante
GET    /api/reports/students/:id/history - Historial de estudiante
```

### Perfil
```
GET    /api/profile/me          - Obtener perfil propio
PATCH  /api/profile/me          - Actualizar perfil propio
GET    /api/profile/user/:id    - Obtener perfil por ID
```

### Notificaciones
```
GET    /api/notifications       - Obtener notificaciones propias
PATCH  /api/notifications/:id/read - Marcar como leída
```

##  Usuarios de Prueba

Después de ejecutar el seed, puedes usar:

### Estudiantes
- `alumno1@alumnos.ubiobio.cl` / `alumno1`
- `alumno2@alumnos.ubiobio.cl` / `alumno2`
- `alumno3@alumnos.ubiobio.cl` / `alumno3`
- `alumno4@alumnos.ubiobio.cl` / `alumno4`
- `alumno5@alumnos.ubiobio.cl` / `alumno5`

### Profesores
- `profesor1@ubiobio.cl` / `profesor1`
- `profesor2@ubiobio.cl` / `profesor2`

##  Diseño UI

### Paleta de Colores
- **Primario**: `#0b3d91` (Azul institucional)
- **Secundario**: `#7b1e3a` (Vino)
- **Acento**: `#d4af37` (Dorado)
- **Fondo**: `#f8fafc` (Gris claro)

### Tipografía
- **Títulos**: Merriweather (serif) - Aspecto académico formal
- **Cuerpo**: Inter (sans-serif) - Legibilidad moderna

### Componentes
- Sidebar fijo de 240px con navegación sin iconos (texto profesional)
- Cards con elevación y bordes suaves
- Animaciones sutiles con cubic-bezier
- Diseño responsive mobile-first

##  Seguridad

- ✅ Autenticación JWT con cookies httpOnly
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Validación de datos con Joi
- ✅ Middleware de autorización por roles
- ✅ Sanitización de inputs
- ✅ CORS configurado

## 📝 Scripts Disponibles

### Backend
```bash
npm run dev          # Modo desarrollo con nodemon
npm start           # Modo producción
```

### Frontend
```bash
npm run dev         # Servidor de desarrollo
npm run build       # Build para producción
npm run preview     # Preview del build
```


