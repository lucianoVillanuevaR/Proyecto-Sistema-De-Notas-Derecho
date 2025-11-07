# Sistema de Notas - Facultad de Derecho

Repositorio con la aplicación completa (backend + frontend) del sistema de gestión de notas para la Facultad de Derecho.

Contenido
- `backend/` - API en Node.js con Express y TypeORM (PostgreSQL).
- `frontend/` - Aplicación React + Vite + Tailwind para la interfaz de usuario (login, perfil, reportes).

Objetivo
:
Proveer una intranet de notas donde estudiantes y profesores puedan autenticarse, consultar y gestionar calificaciones.

Requisitos previos
- Node.js (16+ recomendado)
- npm (o yarn)
- PostgreSQL (base de datos)

Configuración rápida

1) Clonar el repositorio

```bash
git clone <https://github.com/lucianoVillanuevaR/Proyecto-Sistema-De-Notas-Derecho.git>
cd Proyecto-Sistema-De-Notas-Derecho
```

2) Backend - instalar y configurar

- Entrar a la carpeta del backend e instalar dependencias:

```bash
cd backend
npm install
```

- Crear un archivo `.env` en `backend/` con las variables necesarias. Ejemplo mínimo:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
DATABASE=nombre_basedatos
JWT_SECRET=una_clave_secreta
COOKIE_KEY=otra_clave
```

- Notas:
	- `configDb.js` usa TypeORM y al inicializar (synchronize: true) crea las tablas y sembrará dos usuarios de ejemplo:
		- `estudiante@ejemplo.com` / `Estudiante123`
		- `profesor@ejemplo.com` / `Profesor123`
	- Cambia las contraseñas por defecto en producción.

3) Frontend - instalar y configurar

```bash
cd ../frontend
npm install
```

- Crear un `.env` en `frontend/` con la URL base de la API (Vite usa prefijo VITE_):

```env
VITE_BASE_URL=http://localhost:3000/api
```

Desarrollo (correr la app)

- Ejecutar backend en modo desarrollo (con nodemon):

```bash
cd backend
npm run dev
```

- Ejecutar frontend:

```bash
cd frontend
npm run dev
```

Luego abre en el navegador la URL que muestre Vite (por defecto http://localhost:5173).

Build / Producción

- Backend:

```bash
cd backend
npm start
```

- Frontend (build estático):

```bash
cd frontend
npm run build
npm run preview   # para servir una vista previa del build
```
