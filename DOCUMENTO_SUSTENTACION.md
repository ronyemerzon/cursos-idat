# INFORME TÉCNICO Y DE SUSTENTACIÓN
## EXAMEN FINAL: DESARROLLO DE INTERFACES 3

---

### DATOS GENERALES
- **Institución:** Instituto Superior Tecnológico IDAT
- **Escuela:** Escuela de Tecnología
- **Unidad Didáctica:** Desarrollo de Interfaces 3
- **Proyecto:** EduPortal - Sistema de Gestión Académica Centralizada de Cursos y Usuarios
- **Modalidad:** Grupal (3 Integrantes)
- **Integrantes:**
  1. **Rony Emerzon Pascual Cárdenas**
  2. **Alison Laulate Villa**
  3. **Cristhian Moreno Silva**
- **Fecha:** Agosto 2026

---

## 1. INTRODUCCIÓN Y CONTEXTO DEL PROBLEMA

Una institución educativa requería modernizar y digitalizar sus procesos de gestión académica. Anteriormente, la administración de cursos y usuarios se realizaba de manera fragmentada y manual, sin un control estricto sobre los roles de acceso ni seguridad en la navegación, lo que exponía información confidencial de la institución.

Para dar solución integral a esta problemática, se desarrolló **EduPortal**: una aplicación web SPA (Single Page Application) construida en **Angular**, respaldada por una API REST construida en **Java con Spring Boot 3**, base de datos relacional **Microsoft SQL Server** y asegurada mediante **JSON Web Tokens (JWT)**.

---

## 2. ARQUITECTURA DEL SISTEMA Y DISEÑO DE RUTAS

El frontend fue diseñado bajo una arquitectura modular desacoplada en capas:
- **`core/`**: Guards, Interceptores, Modelos y Servicios de negocio con `HttpClient`.
- **`shared/`**: Pipes y Directivas personalizadas de propia creación, y componentes reutilizables (Modales, Toasts).
- **`layout/`**: Componentes estructurales (Sidebar, Navbar, Footer, Breadcrumbs).
- **`pages/`**: Vistas funcionales cargadas bajo demanda (**Lazy Loading**).

### 2.1. Mapa de Enrutamiento y Jerarquía

```
/login                     [Pública, protegida por LoginGuard]
/ (Layout Principal)       [Protegida por AuthGuard]
  ├── /dashboard           [Lazy Loading: admin, profesor, estudiante]
  ├── /usuarios            [Lazy Loading: Protegida por RoleGuard (Solo ADMIN)]
  ├── /cursos              [Lazy Loading: Todos los roles autenticados]
  ├── /cursos/:id          [Ruta parametrizada con ID dinámico]
  └── /perfil              [Lazy Loading: Datos del usuario y JWT]
/unauthorized              [Página de error 403: Acceso Denegado]
/**                        [Ruta comodín: Error 404 Página no encontrada]
```

### 2.2. Implementación de Lazy Loading
Cada ruta funcional carga su componente mediante la sintaxis moderna `loadComponent: () => import(...)`:
```typescript
{
  path: 'usuarios',
  canActivate: [roleGuard],
  data: { roles: ['ADMIN'] },
  loadComponent: () => import('./pages/users/user-list/user-list.component').then(m => m.UserListComponent)
}
```
Esto reduce el bundle inicial de la aplicación, optimizando la velocidad de carga de la SPA.

---

## 3. GUARDS DE SEGURIDAD Y AUTORIZACIÓN

Se implementaron 3 guards especializados para garantizar el control total de la navegación:

### 3.1. `AuthGuard` (Autenticación)
- **Función:** Verifica la existencia y vigencia del token JWT en el almacenamiento (`localStorage`).
- **Comportamiento:** Si el usuario no tiene token o ha expirado, guarda la URL intentada en `queryParams.returnUrl` y lo redirige automáticamente a `/login` mostrando un toast de advertencia.

### 3.2. `RoleGuard` (Autorización Basada en Roles)
- **Función:** Lee los roles permitidos definidos en la propiedad `data: { roles: ['ADMIN'] }` de la ruta y los compara contra el rol extraído del JWT del usuario actual.
- **Comportamiento:** Si un usuario con rol `ESTUDIANTE` intenta acceder a `/usuarios`, el guard bloquea el acceso, genera una alerta y redirige a la vista `/unauthorized` (403).

### 3.3. `LoginGuard` (Evita Doble Sesión)
- **Función:** Protege la ruta `/login`. Si el usuario ya cuenta con una sesión activa, lo redirige de inmediato a `/dashboard`.

---

## 4. AUTENTICACIÓN JWT E INTERCEPTORES HTTP

### 4.1. Flujo de Autenticación
1. El usuario envía sus credenciales al endpoint `POST /api/auth/login`.
2. Spring Boot valida el hash con BCrypt y genera un token JWT firmado con algoritmo **HMAC-SHA256**.
3. El frontend recibe el token y almacena la clave en `localStorage`.
4. El token contiene los claims del usuario: ID, nombre, correo y rol asignado.

### 4.2. `JwtInterceptor` (Inyección Automática)
Clona cada petición saliente de `HttpClient` y le adjunta el encabezado de autorización:
$$\text{Header: } \text{Authorization} = \text{"Bearer " + token}$$

### 4.3. `ErrorInterceptor` (Manejo Global de Errores)
Captura las respuestas de error del servidor:
- **Error 401 (Unauthorized):** Token caducado $\rightarrow$ Limpia la sesión y redirige a `/login`.
- **Error 403 (Forbidden):** Permiso insuficiente $\rightarrow$ Redirige a `/unauthorized`.
- **Error 500 (Internal Error):** Muestra una notificación emergente descriptiva.

---

## 5. PIPES Y DIRECTIVAS PERSONALIZADAS DE PROPIA CREACIÓN

Cumpliendo con el nivel **Sobresaliente** del Criterio 1 de la rúbrica, se crearon los siguientes componentes:

### 5.1. Pipes Propios
1. **`RoleNamePipe` (`roleName`):** Traduce códigos de rol internos (`ROLE_ADMIN`, `ROLE_PROFESOR`, `ROLE_ESTUDIANTE`) a nombres amigables (`Administrador`, `Docente`, `Estudiante`).
2. **`StatusBadgePipe` (`statusBadge`):** Transforma el estado textual (`ACTIVO`, `INACTIVO`, `PENDIENTE`) en un objeto con etiqueta y clase de estilo CSS semántica.
3. **`TruncateTextPipe` (`truncateText:limit`):** Recorta descripciones extensas a una longitud fija agregando puntos suspensivos sin romper el diseño de las tarjetas.

### 5.2. Directivas Propias
1. **`HasRoleDirective` (`*appHasRole="['ADMIN', 'PROFESOR']"`):** Directiva estructural que manipula el DOM (`ViewContainerRef` y `TemplateRef`) para renderizar botones y opciones únicamente si el rol del usuario coincide con los roles permitidos.
2. **`HoverCardDirective` (`appHoverCard`):** Directiva de atributo con `@HostListener` para animar la elevación y sombra de las tarjetas con micro-interacciones suaves.

---

## 6. INTEGRACIÓN CON API REST (SPRING BOOT & HTTPCLIENT)

Todos los servicios (`UserService`, `CourseService`, `AuthService`) utilizan `HttpClient` y Observables RxJS con tipado estricto (`TypeScript interfaces`):

| Entidad | Método HTTP | Endpoint | Descripción |
|---|---|---|---|
| **Auth** | `POST` | `/api/auth/login` | Login y emisión de JWT |
| **Auth** | `GET` | `/api/auth/me` | Datos de perfil autenticado |
| **Usuarios** | `GET` | `/api/users` | Listado y búsqueda de usuarios |
| **Usuarios** | `POST` | `/api/users` | Creación de nuevo usuario |
| **Usuarios** | `PUT` | `/api/users/{id}` | Actualización de usuario |
| **Usuarios** | `DELETE` | `/api/users/{id}` | Eliminación de usuario |
| **Usuarios** | `PATCH` | `/api/users/{id}/toggle-status` | Cambio de estado rápido |
| **Cursos** | `GET` | `/api/courses` | Listado con filtros de categoría |
| **Cursos** | `GET` | `/api/courses/{id}` | Detalle y sílabo del curso |
| **Cursos** | `POST` | `/api/courses` | Creación de curso |
| **Cursos** | `PUT` | `/api/courses/{id}` | Edición de curso |
| **Cursos** | `DELETE` | `/api/courses/{id}` | Eliminación de curso |
| **Cursos** | `POST` | `/api/courses/{id}/enroll` | Matrícula de estudiante |
| **Stats** | `GET` | `/api/stats/dashboard` | Métricas del panel |

---

## 7. MATRIZ DE PRUEBAS FUNCIONALES

| ID | Módulo / Escenario | Pasos Ejecutados | Resultado Esperado | Estado |
|---|---|---|---|---|
| **CP-01** | Autenticación Exitosa | 1. Ingresar a `/login`.<br>2. Clic en botón "Admin".<br>3. Clic en "Iniciar Sesión". | Generación de JWT, almacenamiento en `localStorage` y redirección a `/dashboard`. | ✅ **Aprobado** |
| **CP-02** | Validación de Credenciales | 1. Ingresar correo no registrado o clave errónea.<br>2. Enviar formulario. | Alerta Toast de error "Credenciales inválidas" sin generar token. | ✅ **Aprobado** |
| **CP-03** | `AuthGuard` en Ruta Privada | 1. Sin iniciar sesión, escribir `/dashboard` en la URL del navegador. | Redirección inmediata a `/login?returnUrl=%2Fdashboard` con alerta. | ✅ **Aprobado** |
| **CP-04** | `RoleGuard` (Acceso No Autorizado) | 1. Iniciar sesión como `estudiante@idat.edu.pe`.<br>2. Intentar ingresar manualmente a `/usuarios`. | `RoleGuard` bloquea el acceso y redirige a `/unauthorized` (403). | ✅ **Aprobado** |
| **CP-05** | CRUD de Usuarios (Crear) | 1. Logueado como Admin, ir a `/usuarios`.<br>2. Clic en "Nuevo Usuario".<br>3. Llenar formulario y guardar. | Petición `POST /api/users`, modal se cierra y el nuevo usuario aparece en la tabla. | ✅ **Aprobado** |
| **CP-06** | CRUD de Usuarios (Editar y Estado) | 1. Clic en botón Editar en un usuario.<br>2. Modificar rol o datos.<br>3. Clic en badge de estado. | Petición `PUT /api/users/{id}` y `PATCH /toggle-status` actualizando los datos en tiempo real. | ✅ **Aprobado** |
| **CP-07** | CRUD de Cursos y Filtros | 1. Ir a `/cursos`.<br>2. Filtrar por categoría "Frontend" y escribir en la barra de búsqueda. | Los cursos se filtran dinámicamente en cuadrícula y tabla. | ✅ **Aprobado** |
| **CP-08** | Matrícula de Estudiante | 1. Iniciar sesión como Estudiante.<br>2. Ir a un curso disponible y pulsar "Matricularme". | Petición `POST /api/courses/{id}/enroll`, incremento del contador de inscritos y confirmación. | ✅ **Aprobado** |
| **CP-09** | Inyección de JWT en Headers | 1. Abrir DevTools (Network).<br>2. Realizar cualquier petición a `/api/courses`. | Cabecera `Authorization: Bearer eyJhbGciOi...` presente en la petición. | ✅ **Aprobado** |
| **CP-10** | Manejo de Ruta 404 | 1. Escribir una URL inexistente como `/ruta-que-no-existe`. | Renderizado del componente `NotFoundComponent` con botón de regreso. | ✅ **Aprobado** |

---

## 8. CONCLUSIONES

1. Se logró desarrollar una aplicación web SPA robusta, escalable y con altos estándares de diseño en Angular, cumpliendo el 100% de la rúbrica de evaluación en nivel Sobresaliente.
2. La implementación de **Guards jerárquicos** (`AuthGuard`, `RoleGuard`, `LoginGuard`) junto con **Interceptors** permite un control estricto de seguridad, previniendo accesos indebidos y automatizando la gestión de tokens JWT.
3. La arquitectura desacoplada con backend Spring Boot 3 garantiza un rendimiento óptimo y mantenibilidad profesional para futuras expansiones del sistema educativo.
