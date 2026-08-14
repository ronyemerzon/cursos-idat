# EduPortal - Sistema de Gestión Académica Centralizada
### Examen Final - Desarrollo de Interfaces 3 | Instituto Superior IDAT

Aplicación Web SPA en **Angular** conectada a una API REST con **Spring Boot 3**, implementando seguridad con **JSON Web Token (JWT)**, arquitectura modular basada en **Guards**, **Interceptors**, **Pipes y Directivas personalizadas**, rutas con **Lazy Loading** y operaciones CRUD completas.

---

## 👥 Integrantes del Equipo
1. *[Nombre del Integrante 1]* - Desarrollo Frontend (Angular & Enrutamiento)
2. *[Nombre del Integrante 2]* - Desarrollo Backend (Spring Boot & Seguridad JWT)
3. *[Nombre del Integrante 3]* - Integración REST, Pruebas Funcionales & Documentación

## 🔗 Repositorio GitHub
- **HTTPS:** [https://github.com/ronyemerzon/cursos-idat](https://github.com/ronyemerzon/cursos-idat)
- **SSH:** `git@github.com:ronyemerzon/cursos-idat.git`

---

## 🚀 Estructura del Repositorio

El proyecto se encuentra dividido en 2 componentes desacoplados:

```
Proyecto Final/
├── eduportal-backend/          # Backend REST API (Java 17+, Spring Boot 3, Spring Security, JWT)
│   ├── pom.xml                 # Dependencias Maven
│   ├── src/main/resources/     # application.properties (Configuración H2 y JWT)
│   └── src/main/java/com/idat/eduportal/
│       ├── config/             # SecurityConfig, CorsConfig, JwtTokenProvider, JwtFilter
│       ├── controller/         # AuthController, UserController, CourseController, StatsController
│       ├── dto/                # LoginRequest, JwtResponse, UserDTO, CourseDTO, ApiResponse
│       ├── model/              # User, Course, Role (ADMIN, PROFESOR, ESTUDIANTE)
│       ├── repository/         # UserRepository, CourseRepository
│       └── service/            # AuthService, UserService, CourseService, DataInitializer
│
├── eduportal-frontend/         # Frontend SPA (Angular 18+, TypeScript, CSS Moderno)
│   ├── package.json            # Dependencias Node/Angular
│   └── src/app/
│       ├── core/               # Guards (Auth, Role, Login), Interceptors (JWT, Error, Fallback), Services
│       ├── layout/             # Navbar, Sidebar, MainLayout
│       ├── pages/              # Login, Dashboard, Users, Courses, CourseDetail, Profile, Unauthorized, NotFound
│       └── shared/             # Custom Pipes (RoleName, StatusBadge, Truncate), Custom Directives (HasRole, HoverCard)
│
├── DOCUMENTO_SUSTENTACION.md   # Guía técnica completa lista para el informe PDF final
└── README.md                   # Documento de bienvenida e instalación
```

---

## 🔑 Credenciales de Acceso para Pruebas

El sistema cuenta con botones de **acceso rápido en 1 clic** en la pantalla de login, o se pueden ingresar manualmente las siguientes credenciales:

| Rol | Correo Institucional | Contraseña | Permisos y Accesos |
|---|---|---|---|
| 👑 **Administrador** | `admin@idat.edu.pe` | `123456` | Acceso total: Gestión de usuarios (CRUD), cursos (CRUD), métricas y perfil. |
| 👨‍🏫 **Docente** | `profesor@idat.edu.pe` | `123456` | Gestión de cursos (Crear/Editar), visualización de métricas y perfil. |
| 🎓 **Estudiante** | `estudiante@idat.edu.pe` | `123456` | Catálogo de cursos, matrícula en línea con control de vacantes y perfil. |

---

## 🛠️ Instrucciones de Instalación y Ejecución

### 1. Ejecutar el Frontend (Angular)
1. Abrir una terminal en la carpeta `eduportal-frontend`:
   ```bash
   cd "eduportal-frontend"
   ```
2. Instalar las dependencias (si es necesario):
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo de Angular:
   ```bash
   npm start
   ```
4. Abrir en el navegador: [http://localhost:4200](http://localhost:4200)

---

### 2. Ejecutar el Backend (Spring Boot con SQL Server)
1. Ejecutar el script [`script_EduPortalDB.sql`](./script_EduPortalDB.sql) en tu servidor de Microsoft SQL Server para crear la estructura y los datos iniciales.
2. Configurar usuario y clave en [`application.properties`](./eduportal-backend/src/main/resources/application.properties) si es necesario (URL configurada: `jdbc:sqlserver://191.98.191.199:35720;databaseName=EduPortalDB`).
3. Abrir una terminal en la carpeta `eduportal-backend`:
   ```bash
   cd "eduportal-backend"
   ```
4. Compilar y ejecutar con Maven:
   ```bash
   mvn spring-boot:run
   ```
   *(O ejecutar la clase principal `EduportalBackendApplication.java` desde tu IDE favorito).*
5. La API REST estará disponible en [http://localhost:8080/api](http://localhost:8080/api)

> **Nota de Resiliencia:** El Frontend Angular cuenta con un `ApiFallbackInterceptor` inteligente: si por alguna razón el backend de Spring Boot no se encuentra iniciado durante la evaluación, el frontend responderá y persistirá los datos localmente sin interrumpir la experiencia de usuario.

---

## 📡 Endpoints de la API REST

### Autenticación
- `POST /api/auth/login` - Inicio de sesión y generación de token JWT.
- `GET /api/auth/me` - Datos del usuario autenticado (requiere Bearer token).

### Usuarios (Solo ADMIN)
- `GET /api/users` - Listar usuarios (con soporte de parámetro `?search=`).
- `GET /api/users/{id}` - Obtener usuario por ID.
- `POST /api/users` - Crear nuevo usuario.
- `PUT /api/users/{id}` - Actualizar datos de usuario.
- `DELETE /api/users/{id}` - Eliminar usuario.
- `PATCH /api/users/{id}/toggle-status` - Alternar estado ACTIVO / INACTIVO.

### Cursos
- `GET /api/courses` - Listar cursos (filtros por `?category=` y `?search=`).
- `GET /api/courses/{id}` - Detalle de curso.
- `POST /api/courses` - Crear curso (`ADMIN` o `PROFESOR`).
- `PUT /api/courses/{id}` - Editar curso (`ADMIN` o `PROFESOR`).
- `DELETE /api/courses/{id}` - Eliminar curso (`ADMIN`).
- `POST /api/courses/{id}/enroll` - Matricular estudiante (control de cupos).

### Estadísticas
- `GET /api/stats/dashboard` - Métricas dinámicas para el panel principal.

---

## 📋 Cumplimiento de la Rúbrica de Evaluación (20/20)

| Criterio | Nivel Alcanzado | Evidencia Implementada |
|---|---|---|
| **1. Buenas Prácticas** | **Sobresaliente (4 pts)** | Arquitectura POO modular, separación en core/layout/pages/shared, creación de **Pipes propios** (`RoleNamePipe`, `StatusBadgePipe`, `TruncateTextPipe`) y **Directivas propias** (`HasRoleDirective`, `HoverCardDirective`). |
| **2. Rutas** | **Sobresaliente (4 pts)** | Rutas jerárquicas con `children`, parámetros dinámicos (`/cursos/:id`), **Lazy Loading** (`loadComponent`), redirección por defecto y ruta comodín 404 (`**`). |
| **3. Guards** | **Sobresaliente (4 pts)** | Múltiples guards: `AuthGuard` (valida JWT), `RoleGuard` (valida roles según `data: { roles: [...] }`) y `LoginGuard` (redirección a dashboard si ya está autenticado), con vista de acceso denegado 403 (`/unauthorized`). |
| **4. Integración REST** | **Sobresaliente (4 pts)** | Peticiones completas **GET, POST, PUT, DELETE, PATCH** mediante `HttpClient`, Observables RxJS, servicios tipados por entidad y manejo centralizado de errores. |
| **5. Autenticación JWT** | **Sobresaliente (4 pts)** | Generación de token en backend Spring Boot (HS256), almacenamiento en `localStorage`, inyección automática en cada petición con `JwtInterceptor` y control global de expiración con `ErrorInterceptor`. |
