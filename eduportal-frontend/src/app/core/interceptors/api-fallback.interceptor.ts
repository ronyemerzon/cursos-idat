import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response.model';
import { JwtResponse } from '../models/auth.model';
import { User } from '../models/user.model';
import { Course } from '../models/course.model';

const MOCK_USERS_KEY = 'eduportal_mock_users_v2';
const MOCK_COURSES_KEY = 'eduportal_mock_courses_v2';

function initMockData(): { users: User[], courses: Course[] } {
  let users: User[] = [];
  let courses: Course[] = [];

  const storedUsers = localStorage.getItem(MOCK_USERS_KEY);
  if (storedUsers) {
    try { users = JSON.parse(storedUsers); } catch {}
  }

  if (users.length === 0) {
    users = [
      {
        id: 1,
        name: 'Rony Emerzon (Admin)',
        email: 'admin@idat.edu.pe',
        password: '123456',
        role: 'ROLE_ADMIN',
        status: 'ACTIVO',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        phone: '+51 987 654 321',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Carlos Mendoza (Docente)',
        email: 'profesor@idat.edu.pe',
        password: '123456',
        role: 'ROLE_PROFESOR',
        status: 'ACTIVO',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        phone: '+51 987 111 222',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Lucía Fernández (Estudiante)',
        email: 'estudiante@idat.edu.pe',
        password: '123456',
        role: 'ROLE_ESTUDIANTE',
        status: 'ACTIVO',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        phone: '+51 987 333 444',
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        name: 'María Elena Quispe',
        email: 'mquispe@idat.edu.pe',
        password: '123456',
        role: 'ROLE_PROFESOR',
        status: 'ACTIVO',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        phone: '+51 987 555 666',
        createdAt: new Date().toISOString()
      },
      {
        id: 5,
        name: 'Jorge Ramos Silva',
        email: 'jramos@idat.edu.pe',
        password: '123456',
        role: 'ROLE_ESTUDIANTE',
        status: 'INACTIVO',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        phone: '+51 987 777 888',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  }

  const storedCourses = localStorage.getItem(MOCK_COURSES_KEY);
  if (storedCourses) {
    try { courses = JSON.parse(storedCourses); } catch {}
  }

  if (courses.length === 0) {
    courses = [
      {
        id: 1,
        title: 'Desarrollo de Interfaces Web 3 (Angular SPA)',
        code: 'INT-301',
        description: 'Construcción de aplicaciones SPA avanzadas en Angular con TypeScript, enrutamiento lazy loading, guards, interceptores y autenticación JWT.',
        category: 'Frontend',
        instructorId: 2,
        instructorName: 'Carlos Mendoza',
        credits: 4,
        maxCapacity: 30,
        enrolledCount: 24,
        status: 'ACTIVO',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
        schedule: 'Lun - Mie 19:00 - 22:00',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Desarrollo de Backend con Spring Boot & Microservicios',
        code: 'SPR-402',
        description: 'Arquitectura de servicios REST seguros con Java 17+, Spring Security 6, JPA Hibernate, Docker y despliegue en la nube.',
        category: 'Backend',
        instructorId: 2,
        instructorName: 'Carlos Mendoza',
        credits: 5,
        maxCapacity: 25,
        enrolledCount: 19,
        status: 'ACTIVO',
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
        schedule: 'Mar - Jue 19:00 - 22:00',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Bases de Datos Avanzadas & Optimización SQL',
        code: 'BD-203',
        description: 'Modelado relacional y NoSQL, indexación, procedimientos almacenados y tuning de rendimiento en PostgreSQL y MongoDB.',
        category: 'Base de Datos',
        instructorId: 4,
        instructorName: 'María Elena Quispe',
        credits: 4,
        maxCapacity: 35,
        enrolledCount: 31,
        status: 'ACTIVO',
        imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
        schedule: 'Sab 08:00 - 14:00',
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        title: 'Desarrollo de Aplicaciones Móviles con Flutter',
        code: 'MOB-305',
        description: 'Creación de apps multiplataforma Android e iOS con arquitectura limpia, manejo de estado con Bloc y consumo de APIs REST.',
        category: 'Móvil',
        instructorId: 4,
        instructorName: 'María Elena Quispe',
        credits: 4,
        maxCapacity: 25,
        enrolledCount: 15,
        status: 'ACTIVO',
        imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80',
        schedule: 'Vie 18:30 - 22:30',
        createdAt: new Date().toISOString()
      },
      {
        id: 5,
        title: 'Cloud Computing & Arquitectura AWS',
        code: 'CLD-501',
        description: 'Implementación de infraestructura como código, contenedores con ECS, funciones serverless Lambda y almacenamiento seguro en S3.',
        category: 'Cloud',
        instructorId: 2,
        instructorName: 'Carlos Mendoza',
        credits: 5,
        maxCapacity: 20,
        enrolledCount: 18,
        status: 'ACTIVO',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
        schedule: 'Sab 15:00 - 21:00',
        createdAt: new Date().toISOString()
      },
      {
        id: 6,
        title: 'Inteligencia Artificial Aplicada al Desarrollo Web',
        code: 'IA-602',
        description: 'Integración de modelos LLM, RAG, generación de código y automatización inteligente en sistemas empresariales modernos.',
        category: 'IA',
        instructorId: 4,
        instructorName: 'María Elena Quispe',
        credits: 4,
        maxCapacity: 30,
        enrolledCount: 28,
        status: 'ACTIVO',
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80',
        schedule: 'Dom 09:00 - 15:00',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(MOCK_COURSES_KEY, JSON.stringify(courses));
  }

  return { users, courses };
}

function generateMockJwt(user: User): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 24 horas
  const payload = btoa(unescape(encodeURIComponent(JSON.stringify({
    sub: user.email,
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    iat: Math.floor(Date.now() / 1000),
    exp: exp
  }))));
  const signature = btoa('idat_signature_jwt_hash_2026');
  return `${header}.${payload}.${signature}`;
}

export const apiFallbackInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el servidor backend está apagado o falla la conexión (0, 404, 500, 504), atender con el mock
      if (error.status === 0 || error.status === 504 || error.status === 404 || (error.status === 400 && req.url.includes('/auth/login') && !error.error?.message)) {
        return handleMockRequest(req);
      }
      return throwError(() => error);
    })
  );
};

function handleMockRequest(req: any) {
  const { url, method, body, params } = req;
  const { users, courses } = initMockData();

  // POST /api/auth/login
  if (url.includes('/api/auth/login') && method === 'POST') {
    const email = body?.email?.toLowerCase().trim();
    const user = users.find(u => u.email.toLowerCase() === email);

    if (user) {
      if (user.status === 'INACTIVO') {
        return throwError(() => new HttpErrorResponse({
          status: 400,
          error: { success: false, message: 'Usuario inactivo. Contacte al administrador.' }
        }));
      }
      const token = generateMockJwt(user);
      const jwtRes: JwtResponse = {
        token,
        type: 'Bearer',
        id: user.id!,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      };
      return of(new HttpResponse({ status: 200, body: { success: true, message: 'Login exitoso', data: jwtRes } }));
    }

    return throwError(() => new HttpErrorResponse({
      status: 400,
      error: { success: false, message: 'Credenciales inválidas. Verifique su correo o contraseña.' }
    }));
  }

  // GET /api/stats/dashboard
  if (url.includes('/api/stats/dashboard') && method === 'GET') {
    const stats = {
      totalUsers: users.length,
      totalStudents: users.filter(u => u.role.includes('ESTUDIANTE')).length,
      totalProfessors: users.filter(u => u.role.includes('PROFESOR')).length,
      totalAdmins: users.filter(u => u.role.includes('ADMIN')).length,
      totalCourses: courses.length,
      activeCourses: courses.filter(c => c.status === 'ACTIVO').length
    };
    return of(new HttpResponse({ status: 200, body: { success: true, data: stats } }));
  }

  // GET /api/users
  if (url.includes('/api/users') && method === 'GET') {
    const search = params?.get('search')?.toLowerCase();
    const filtered = search
      ? users.filter(u => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search))
      : users;
    return of(new HttpResponse({ status: 200, body: { success: true, data: filtered } }));
  }

  // POST /api/users
  if (url.includes('/api/users') && method === 'POST') {
    const newUser: User = {
      ...body,
      id: Date.now(),
      status: body.status || 'ACTIVO',
      avatar: body.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${body.name}`,
      createdAt: new Date().toISOString()
    };
    users.unshift(newUser);
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
    return of(new HttpResponse({ status: 201, body: { success: true, message: 'Usuario creado exitosamente', data: newUser } }));
  }

  // PUT /api/users/:id
  if (url.includes('/api/users/') && method === 'PUT') {
    const id = parseInt(url.split('/').pop() || '0', 10);
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...body, id };
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
      return of(new HttpResponse({ status: 200, body: { success: true, message: 'Usuario actualizado exitosamente', data: users[index] } }));
    }
  }

  // DELETE /api/users/:id
  if (url.includes('/api/users/') && method === 'DELETE') {
    const id = parseInt(url.split('/').pop() || '0', 10);
    const updated = users.filter(u => u.id !== id);
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(updated));
    return of(new HttpResponse({ status: 200, body: { success: true, message: 'Usuario eliminado exitosamente', data: null } }));
  }

  // PATCH /api/users/:id/toggle-status
  if (url.includes('/toggle-status') && method === 'PATCH') {
    const parts = url.split('/');
    const id = parseInt(parts[parts.length - 2], 10);
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index].status = users[index].status === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
      return of(new HttpResponse({ status: 200, body: { success: true, message: 'Estado actualizado', data: users[index] } }));
    }
  }

  // GET /api/courses
  if (url.includes('/api/courses') && method === 'GET') {
    const idParam = url.split('/api/courses/')[1];
    if (idParam && !idParam.includes('?')) {
      const id = parseInt(idParam, 10);
      const course = courses.find(c => c.id === id);
      if (course) {
        return of(new HttpResponse({ status: 200, body: { success: true, data: course } }));
      }
    }

    const search = params?.get('search')?.toLowerCase();
    const category = params?.get('category');

    let filtered = courses;
    if (category && category !== 'TODOS') {
      filtered = filtered.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      filtered = filtered.filter(c => c.title.toLowerCase().includes(search) || c.code.toLowerCase().includes(search));
    }
    return of(new HttpResponse({ status: 200, body: { success: true, data: filtered } }));
  }

  // POST /api/courses
  if (url.includes('/api/courses') && method === 'POST') {
    const newCourse: Course = {
      ...body,
      id: Date.now(),
      enrolledCount: body.enrolledCount || 0,
      status: body.status || 'ACTIVO',
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    };
    courses.unshift(newCourse);
    localStorage.setItem(MOCK_COURSES_KEY, JSON.stringify(courses));
    return of(new HttpResponse({ status: 201, body: { success: true, message: 'Curso creado exitosamente', data: newCourse } }));
  }

  // PUT /api/courses/:id
  if (url.includes('/api/courses/') && method === 'PUT') {
    const id = parseInt(url.split('/').pop() || '0', 10);
    const index = courses.findIndex(c => c.id === id);
    if (index !== -1) {
      courses[index] = { ...courses[index], ...body, id };
      localStorage.setItem(MOCK_COURSES_KEY, JSON.stringify(courses));
      return of(new HttpResponse({ status: 200, body: { success: true, message: 'Curso actualizado exitosamente', data: courses[index] } }));
    }
  }

  // DELETE /api/courses/:id
  if (url.includes('/api/courses/') && method === 'DELETE') {
    const id = parseInt(url.split('/').pop() || '0', 10);
    const updated = courses.filter(c => c.id !== id);
    localStorage.setItem(MOCK_COURSES_KEY, JSON.stringify(updated));
    return of(new HttpResponse({ status: 200, body: { success: true, message: 'Curso eliminado exitosamente', data: null } }));
  }

  // POST /api/courses/:id/enroll
  if (url.includes('/enroll') && method === 'POST') {
    const parts = url.split('/');
    const id = parseInt(parts[parts.length - 2], 10);
    const index = courses.findIndex(c => c.id === id);
    if (index !== -1) {
      if (courses[index].enrolledCount < courses[index].maxCapacity) {
        courses[index].enrolledCount += 1;
        localStorage.setItem(MOCK_COURSES_KEY, JSON.stringify(courses));
        return of(new HttpResponse({ status: 200, body: { success: true, message: '¡Matrícula realizada exitosamente!', data: courses[index] } }));
      } else {
        return throwError(() => new HttpErrorResponse({
          status: 400,
          error: { success: false, message: 'No hay cupos disponibles para este curso.' }
        }));
      }
    }
  }

  return throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Endpoint no encontrado' }));
}
