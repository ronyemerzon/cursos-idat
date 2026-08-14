# GUÍA MAESTRA DEL PROYECTO EDUPORTAL: DE PRINCIPIO A FIN
### Aprende, domina y explica cada componente del proyecto como si lo hubieras desarrollado desde cero

- **Institución:** Instituto Superior IDAT - Escuela de Tecnología
- **Unidad Didáctica:** Desarrollo de Interfaces 3 (Examen Final)
- **Integrantes:**
  1. **Rony Emerzon Pascual Cárdenas**
  2. **Alison Laulate Villa**
  3. **Cristhian Moreno Silva**
- **Repositorio:** [https://github.com/ronyemerzon/cursos-idat](https://github.com/ronyemerzon/cursos-idat)

---

## 1. Visión General: ¿Qué construimos y por qué?
El proyecto resuelve la necesidad de una institución educativa de digitalizar la gestión de cursos y usuarios mediante una **Single Page Application (SPA)** moderna, reactiva y segura.

El sistema se compone de dos proyectos desacoplados:
1. **Backend (`eduportal-backend`):** API REST desarrollada en **Java con Spring Boot 3**, asegurada con **Spring Security 6** y **JSON Web Tokens (JWT)**, conectada a **Microsoft SQL Server** (`EduPortalDB`).
2. **Frontend (`eduportal-frontend`):** SPA en **Angular 18+** con componentes Standalone, enrutamiento con **Lazy Loading**, protección con **Guards** (`AuthGuard`, `RoleGuard`, `LoginGuard`), e interceptores HTTP para inyectar tokens Bearer automáticamente.

---

## 2. La Base de Datos: Microsoft SQL Server (`EduPortalDB`)
Tablas creadas en el script `script_EduPortalDB.sql`:
- **`dbo.users`:** Almacena los usuarios, roles (`ROLE_ADMIN`, `ROLE_PROFESOR`, `ROLE_ESTUDIANTE`), estado y contraseñas (encriptadas con BCrypt).
- **`dbo.courses`:** Almacena el catálogo de asignaturas con código, créditos, categoría, docente asignado, capacidad máxima y contador de matriculados.

> **💡 Explicación sobre seguridad de contraseñas:**
> *"Las contraseñas nunca se guardan en texto plano en la base de datos. Usamos el algoritmo **BCrypt** con 10 rondas de hashing a través de `PasswordEncoder` en Spring Security. Incluso si alguien tiene acceso directo a la base de datos SQL Server, no podrá descifrar la clave original."*

---

## 3. El Backend Spring Boot: Estructura y Seguridad
Arquitectura por capas:
- **`model/`:** Clases JPA anotadas (`@Entity`, `@Table`) que mapean las tablas de SQL Server.
- **`repository/`:** Interfaces que extienden `JpaRepository` para operaciones CRUD y búsquedas automáticas.
- **`service/`:** Lógica de negocio (login, encriptación, validación de cupos de matrícula).
- **`controller/`:** Endpoints REST (`@RestController`) que exponen los servicios vía HTTP en formato JSON.
- **`config/`:** Configuración de seguridad (`SecurityConfig`), CORS y el filtro `JwtAuthenticationFilter`.

### Flujo de Autenticación JWT en el Backend:
1. El cliente envía `POST /api/auth/login` con `{ email, password }`.
2. `AuthService` valida las credenciales contra la base de datos SQL Server.
3. `JwtTokenProvider` genera una cadena JWT firmada con **HMAC-SHA256** conteniendo los claims (`id`, `email`, `name`, `role`).
4. El token se devuelve al cliente con vigencia de 24 horas.

---

## 4. El Frontend Angular: Enrutamiento, Guards y Componentes

### 4.1. Enrutamiento y Lazy Loading (`app.routes.ts`)
Cada página se configuró con **Lazy Loading** mediante `loadComponent: () => import(...)`:
- `/login` $\rightarrow$ `LoginComponent` (protegido por `loginGuard`)
- `/` $\rightarrow$ `MainLayoutComponent` (protegido por `authGuard`)
  - `/dashboard` $\rightarrow$ Panel con estadísticas
  - `/usuarios` $\rightarrow$ CRUD Usuarios (protegido por `roleGuard` solo para `ADMIN`)
  - `/cursos` $\rightarrow$ Catálogo y gestión de cursos
  - `/cursos/:id` $\rightarrow$ Detalle parametrizado con sílabo
  - `/perfil` $\rightarrow$ Datos del usuario y token decodificado
- `/unauthorized` $\rightarrow$ Vista 403 de acceso prohibido
- `/**` $\rightarrow$ Vista 404 de página no encontrada

### 4.2. Los 3 Guards
- **`authGuard`:** Verifica que exista un JWT válido en `localStorage`. Si no, manda a `/login`.
- **`roleGuard`:** Compara el rol del usuario con `data['roles']` de la ruta. Si no coincide, manda a `/unauthorized` (403).
- **`loginGuard`:** Evita que un usuario autenticado vuelva al formulario de login.

### 4.3. Los Interceptores HTTP
- **`jwtInterceptor`:** Inyecta automáticamente el header `Authorization: Bearer <token>` en cada petición saliente.
- **`errorInterceptor`:** Captura errores 401 (deslogueo por expiración) y 403 (redirección a unauthorized).
- **`apiFallbackInterceptor`:** Proporciona persistencia de respaldo si el backend se encuentra offline.

### 4.4. Pipes y Directivas Propias
- **`RoleNamePipe` (`roleName`):** Traduce roles (`ROLE_ADMIN` $\rightarrow$ "Administrador", `ROLE_PROFESOR` $\rightarrow$ "Docente").
- **`StatusBadgePipe` (`statusBadge`):** Mapea estados a badges CSS semánticos.
- **`TruncateTextPipe` (`truncateText:80`):** Recorta textos largos con puntos suspensivos.
- **`HasRoleDirective` (`*appHasRole="['ADMIN']"`):** Directiva estructural que oculta botones si el usuario no tiene el rol.
- **`HoverCardDirective` (`appHoverCard`):** Directiva de atributo que anima elevación y sombras al pasar el mouse.

---

## 5. Banco de Preguntas Típicas del Docente (Sustentación)

1. **¿Cómo viaja el Token JWT desde que el usuario inicia sesión hasta que consulta los cursos?**
   - *Respuesta:* Al hacer login, el backend valida las credenciales y devuelve el token. El `AuthService` lo almacena en `localStorage`. Cuando un servicio hace peticiones con `HttpClient`, el `jwtInterceptor` inyecta automáticamente la cabecera `Authorization: Bearer <token>`.

2. **¿Qué diferencia hay entre AuthGuard y RoleGuard?**
   - *Respuesta:* `AuthGuard` valida *autenticación* (si el usuario está logueado y el token no ha expirado), mientras que `RoleGuard` valida *autorización* (si el rol del usuario tiene permisos para acceder a una ruta específica).

3. **¿Por qué usamos Lazy Loading en las rutas?**
   - *Respuesta:* Porque reduce el tamaño del bundle inicial descargado por el navegador, cargando los módulos y componentes únicamente cuando el usuario navega a esa ruta.

4. **¿Cómo implementaron una Directiva personalizada de propia creación?**
   - *Respuesta:* Creamos `HasRoleDirective` (`*appHasRole`) como directiva estructural. Inyecta `TemplateRef` y `ViewContainerRef`, se suscribe a `currentUser$` y elimina el elemento del DOM si el rol no coincide.

5. **¿Qué sucede si el token JWT expira mientras el usuario navega?**
   - *Respuesta:* El backend responde `401 Unauthorized`. El `errorInterceptor` captura el 401, limpia la sesión en `localStorage`, redirige al usuario a `/login` y le muestra una notificación toast informativa.
