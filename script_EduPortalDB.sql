-- ==========================================================================
-- SCRIPT DE BASE DE DATOS: EduPortalDB (Microsoft SQL Server)
-- PROYECTO FINAL: DESARROLLO DE INTERFACES 3 - IDAT
-- ==========================================================================

USE EduPortalDB;
GO

-- 1. Eliminar tablas previas si existen (respetando integridad referencial)
IF OBJECT_ID('dbo.courses', 'U') IS NOT NULL DROP TABLE dbo.courses;
IF OBJECT_ID('dbo.users', 'U') IS NOT NULL DROP TABLE dbo.users;
GO

-- 2. Crear Tabla de Usuarios
CREATE TABLE dbo.users (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(20) NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    avatar NVARCHAR(255) NULL,
    phone NVARCHAR(50) NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- 3. Crear Tabla de Cursos
CREATE TABLE dbo.courses (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(150) NOT NULL,
    code NVARCHAR(20) NOT NULL UNIQUE,
    description NVARCHAR(MAX) NULL,
    category NVARCHAR(50) NOT NULL,
    instructor_id BIGINT NULL,
    instructor_name NVARCHAR(100) NULL,
    credits INT NOT NULL DEFAULT 4,
    max_capacity INT NOT NULL DEFAULT 30,
    enrolled_count INT NOT NULL DEFAULT 0,
    status NVARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    image_url NVARCHAR(255) NULL,
    schedule NVARCHAR(100) NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- 4. Insertar Usuarios Iniciales de Prueba (Clave: 123456)
-- El backend acepta tanto '123456' como el hash BCrypt $2a$10$wTGNnS9qO...
INSERT INTO dbo.users (name, email, password, role, status, avatar, phone) VALUES
('Rony Emerzon (Admin)', 'admin@idat.edu.pe', '123456', 'ROLE_ADMIN', 'ACTIVO', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', '+51 987 654 321'),
('Carlos Mendoza (Docente)', 'profesor@idat.edu.pe', '123456', 'ROLE_PROFESOR', 'ACTIVO', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', '+51 987 111 222'),
('Lucía Fernández (Estudiante)', 'estudiante@idat.edu.pe', '123456', 'ROLE_ESTUDIANTE', 'ACTIVO', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', '+51 987 333 444'),
('María Elena Quispe', 'mquispe@idat.edu.pe', '123456', 'ROLE_PROFESOR', 'ACTIVO', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', '+51 987 555 666'),
('Jorge Ramos Silva', 'jramos@idat.edu.pe', '123456', 'ROLE_ESTUDIANTE', 'INACTIVO', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', '+51 987 777 888');
GO

-- 5. Insertar Cursos Académicos Iniciales
INSERT INTO dbo.courses (title, code, description, category, instructor_id, instructor_name, credits, max_capacity, enrolled_count, status, image_url, schedule) VALUES
('Desarrollo de Interfaces Web 3 (Angular SPA)', 'INT-301', 'Construcción de aplicaciones SPA avanzadas en Angular con TypeScript, enrutamiento lazy loading, guards, interceptores y autenticación JWT.', 'Frontend', 2, 'Carlos Mendoza', 4, 30, 24, 'ACTIVO', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80', 'Lun - Mie 19:00 - 22:00'),
('Desarrollo de Backend con Spring Boot & Microservicios', 'SPR-402', 'Arquitectura de servicios REST seguros con Java 17+, Spring Security 6, JPA Hibernate, Docker y despliegue en la nube.', 'Backend', 2, 'Carlos Mendoza', 5, 25, 19, 'ACTIVO', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80', 'Mar - Jue 19:00 - 22:00'),
('Bases de Datos Avanzadas & Optimización SQL', 'BD-203', 'Modelado relacional y NoSQL, indexación, procedimientos almacenados y tuning de rendimiento en PostgreSQL y MongoDB.', 'Base de Datos', 4, 'María Elena Quispe', 4, 35, 31, 'ACTIVO', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80', 'Sab 08:00 - 14:00'),
('Desarrollo de Aplicaciones Móviles con Flutter', 'MOB-305', 'Creación de apps multiplataforma Android e iOS con arquitectura limpia, manejo de estado con Bloc y consumo de APIs REST.', 'Móvil', 4, 'María Elena Quispe', 4, 25, 15, 'ACTIVO', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80', 'Vie 18:30 - 22:30'),
('Cloud Computing & Arquitectura AWS', 'CLD-501', 'Implementación de infraestructura como código, contenedores con ECS, funciones serverless Lambda y almacenamiento seguro en S3.', 'Cloud', 2, 'Carlos Mendoza', 5, 20, 18, 'ACTIVO', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80', 'Sab 15:00 - 21:00'),
('Inteligencia Artificial Aplicada al Desarrollo Web', 'IA-602', 'Integración de modelos LLM, RAG, generación de código y automatización inteligente en sistemas empresariales modernos.', 'IA', 4, 'María Elena Quispe', 4, 30, 28, 'ACTIVO', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80', 'Dom 09:00 - 15:00');
GO
