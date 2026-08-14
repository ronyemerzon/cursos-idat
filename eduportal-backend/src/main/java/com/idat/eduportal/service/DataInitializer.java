package com.idat.eduportal.service;

import com.idat.eduportal.model.Course;
import com.idat.eduportal.model.Role;
import com.idat.eduportal.model.User;
import com.idat.eduportal.repository.CourseRepository;
import com.idat.eduportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initUsers();
        initCourses();
    }

    private void initUsers() {
        if (userRepository.count() == 0) {
            String defaultPassword = passwordEncoder.encode("123456");

            User admin = new User(
                    "Rony Emerzon (Admin)",
                    "admin@idat.edu.pe",
                    defaultPassword,
                    Role.ROLE_ADMIN,
                    "ACTIVO",
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                    "+51 987 654 321"
            );

            User profesor = new User(
                    "Carlos Mendoza (Docente)",
                    "profesor@idat.edu.pe",
                    defaultPassword,
                    Role.ROLE_PROFESOR,
                    "ACTIVO",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                    "+51 987 111 222"
            );

            User estudiante = new User(
                    "Lucía Fernández (Estudiante)",
                    "estudiante@idat.edu.pe",
                    defaultPassword,
                    Role.ROLE_ESTUDIANTE,
                    "ACTIVO",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
                    "+51 987 333 444"
            );

            User profesor2 = new User(
                    "María Elena Quispe",
                    "mquispe@idat.edu.pe",
                    defaultPassword,
                    Role.ROLE_PROFESOR,
                    "ACTIVO",
                    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
                    "+51 987 555 666"
            );

            User estudiante2 = new User(
                    "Jorge Ramos Silva",
                    "jramos@idat.edu.pe",
                    defaultPassword,
                    Role.ROLE_ESTUDIANTE,
                    "INACTIVO",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
                    "+51 987 777 888"
            );

            userRepository.saveAll(Arrays.asList(admin, profesor, estudiante, profesor2, estudiante2));
            System.out.println(">>> Usuarios de prueba inicializados con éxito.");
        }
    }

    private void initCourses() {
        if (courseRepository.count() == 0) {
            Course c1 = new Course(
                    "Desarrollo de Interfaces Web 3 (Angular SPA)",
                    "INT-301",
                    "Construcción de aplicaciones SPA avanzadas en Angular con TypeScript, enrutamiento lazy loading, guards, interceptores y autenticación JWT.",
                    "Frontend",
                    2L,
                    "Carlos Mendoza",
                    4,
                    30,
                    24,
                    "ACTIVO",
                    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
                    "Lun - Mie 19:00 - 22:00"
            );

            Course c2 = new Course(
                    "Desarrollo de Backend con Spring Boot & Microservicios",
                    "SPR-402",
                    "Arquitectura de servicios REST seguros con Java 17+, Spring Security 6, JPA Hibernate, Docker y despliegue en la nube.",
                    "Backend",
                    2L,
                    "Carlos Mendoza",
                    5,
                    25,
                    19,
                    "ACTIVO",
                    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
                    "Mar - Jue 19:00 - 22:00"
            );

            Course c3 = new Course(
                    "Bases de Datos Avanzadas & Optimización SQL",
                    "BD-203",
                    "Modelado relacional y NoSQL, indexación, procedimientos almacenados y tuning de rendimiento en PostgreSQL y MongoDB.",
                    "Base de Datos",
                    4L,
                    "María Elena Quispe",
                    4,
                    35,
                    31,
                    "ACTIVO",
                    "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80",
                    "Sab 08:00 - 14:00"
            );

            Course c4 = new Course(
                    "Desarrollo de Aplicaciones Móviles con Flutter",
                    "MOB-305",
                    "Creación de apps multiplataforma Android e iOS con arquitectura limpia, manejo de estado con Bloc y consumo de APIs REST.",
                    "Móvil",
                    4L,
                    "María Elena Quispe",
                    4,
                    25,
                    15,
                    "ACTIVO",
                    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80",
                    "Vie 18:30 - 22:30"
            );

            Course c5 = new Course(
                    "Cloud Computing & Arquitectura AWS",
                    "CLD-501",
                    "Implementación de infraestructura como código, contenedores con ECS, funciones serverless Lambda y almacenamiento seguro en S3.",
                    "Cloud",
                    2L,
                    "Carlos Mendoza",
                    5,
                    20,
                    18,
                    "ACTIVO",
                    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
                    "Sab 15:00 - 21:00"
            );

            Course c6 = new Course(
                    "Inteligencia Artificial Aplicada al Desarrollo Web",
                    "IA-602",
                    "Integración de modelos LLM, RAG, generación de código y automatización inteligente en sistemas empresariales modernos.",
                    "IA",
                    4L,
                    "María Elena Quispe",
                    4,
                    30,
                    28,
                    "ACTIVO",
                    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80",
                    "Dom 09:00 - 15:00"
            );

            courseRepository.saveAll(Arrays.asList(c1, c2, c3, c4, c5, c6));
            System.out.println(">>> Cursos de prueba inicializados con éxito.");
        }
    }
}
