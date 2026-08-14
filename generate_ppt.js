const pptxgen = require('pptxgenjs');
const path = require('path');

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'Rony Emerzon Pascual, Alison Laulate, Cristhian Moreno';
pres.company = 'IDAT - Desarrollo de Interfaces 3';
pres.title = 'EduPortal - Sustentación Examen Final';

// Paleta de Colores
const BG_DARK = '0F172A';
const CARD_BG = '1E293B';
const PRIMARY = '4F46E5';
const ACCENT = '06B6D4';
const TEXT_LIGHT = 'F8FAFC';
const TEXT_MUTED = '94A3B8';
const SUCCESS = '10B981';

// Helper para agregar Header y Footer a cada Slide
function applySlideMaster(slide, categoryName, slideNum) {
  slide.background = { color: BG_DARK };
  
  // Header
  slide.addText('IDAT • ESCUELA DE TECNOLOGÍA', {
    x: 0.8, y: 0.4, w: 5.0, h: 0.3,
    fontSize: 10, bold: true, color: ACCENT, fontFace: 'Arial'
  });
  slide.addText(categoryName.toUpperCase(), {
    x: 6.5, y: 0.4, w: 5.5, h: 0.3, align: 'right',
    fontSize: 9, color: TEXT_MUTED, fontFace: 'Arial'
  });
  slide.addShape(pres.shapes.LINE, {
    x: 0.8, y: 0.75, w: 11.7, h: 0,
    line: { color: '334155', width: 1 }
  });

  // Footer
  slide.addShape(pres.shapes.LINE, {
    x: 0.8, y: 6.8, w: 11.7, h: 0,
    line: { color: '334155', width: 1 }
  });
  slide.addText('EduPortal - Sistema de Gestión Académica SPA', {
    x: 0.8, y: 6.9, w: 6.0, h: 0.3,
    fontSize: 9, color: TEXT_MUTED, fontFace: 'Arial'
  });
  slide.addText(`Diapositiva ${slideNum} de 10`, {
    x: 8.5, y: 6.9, w: 4.0, h: 0.3, align: 'right',
    fontSize: 9, color: TEXT_MUTED, fontFace: 'Arial'
  });
}

// -------------------------------------------------------------
// SLIDE 1: PORTADA
// -------------------------------------------------------------
const slide1 = pres.addSlide();
slide1.background = { color: BG_DARK };

slide1.addText('DESARROLLO DE INTERFACES 3 • EVALUACIÓN FINAL', {
  x: 0.8, y: 1.2, w: 11.5, h: 0.4,
  fontSize: 12, bold: true, color: ACCENT, fontFace: 'Arial'
});

slide1.addText('EduPortal: Sistema de Gestión Académica Centralizada', {
  x: 0.8, y: 1.7, w: 11.5, h: 1.5,
  fontSize: 28, bold: true, color: TEXT_LIGHT, fontFace: 'Arial'
});

slide1.addText('Aplicación Web SPA en Angular con Autenticación JWT, Enrutamiento con Guards, Pipes & Directivas y Backend REST en Spring Boot con SQL Server.', {
  x: 0.8, y: 3.3, w: 11.5, h: 0.8,
  fontSize: 14, color: TEXT_MUTED, fontFace: 'Arial'
});

// Tarjetas de Integrantes
const members = [
  { name: 'Rony Emerzon Pascual Cárdenas', role: 'Frontend & Enrutamiento Angular' },
  { name: 'Alison Laulate Villa', role: 'Backend Spring Boot & JWT' },
  { name: 'Cristhian Moreno Silva', role: 'Integración REST & SQL Server' }
];

members.forEach((m, idx) => {
  const xPos = 0.8 + idx * 3.9;
  slide1.addShape(pres.shapes.RECTANGLE, {
    x: xPos, y: 4.5, w: 3.7, h: 1.6,
    fill: { color: CARD_BG },
    line: { color: '334155', width: 1 }
  });
  slide1.addShape(pres.shapes.RECTANGLE, {
    x: xPos, y: 4.5, w: 0.1, h: 1.6,
    fill: { color: ACCENT }
  });
  slide1.addText(m.name, {
    x: xPos + 0.25, y: 4.7, w: 3.3, h: 0.6,
    fontSize: 12, bold: true, color: TEXT_LIGHT, fontFace: 'Arial'
  });
  slide1.addText(m.role, {
    x: xPos + 0.25, y: 5.3, w: 3.3, h: 0.5,
    fontSize: 10, color: ACCENT, fontFace: 'Arial'
  });
});

slide1.addText('GitHub: github.com/ronyemerzon/cursos-idat  |  Instituto Superior IDAT 2026', {
  x: 0.8, y: 6.8, w: 11.5, h: 0.4,
  fontSize: 10, color: TEXT_MUTED, fontFace: 'Arial'
});

// -------------------------------------------------------------
// SLIDE 2: PROBLEMÁTICA & OBJETIVOS
// -------------------------------------------------------------
const slide2 = pres.addSlide();
applySlideMaster(slide2, '1. Contexto & Problemática', 2);

slide2.addText('Situación Problemática & Objetivos de la Solución', {
  x: 0.8, y: 1.0, w: 11.5, h: 0.5,
  fontSize: 22, bold: true, color: TEXT_LIGHT, fontFace: 'Arial'
});

const cards2 = [
  { title: '⚠️ El Problema Actual', desc: 'Procesos académicos manuales, información dispersa y falta de control de acceso por roles, exponiendo datos y complicando la gestión.' },
  { title: '🎯 Solución SPA en Angular', desc: 'Desarrollo de una plataforma web unificada con navegación reactiva, interfaz moderna y carga perezosa de componentes (Lazy Loading).' },
  { title: '🛡️ Seguridad Integral', desc: 'Control de navegación con Guards en Angular, tokens JWT cifrados con HMAC-SHA256 e interceptores que inyectan Bearer Headers.' }
];

cards2.forEach((c, idx) => {
  const xPos = 0.8 + idx * 3.9;
  slide2.addShape(pres.shapes.RECTANGLE, {
    x: xPos, y: 1.8, w: 3.7, h: 4.5,
    fill: { color: CARD_BG },
    line: { color: '334155', width: 1 }
  });
  slide2.addText(c.title, {
    x: xPos + 0.3, y: 2.1, w: 3.1, h: 0.6,
    fontSize: 14, bold: true, color: ACCENT, fontFace: 'Arial'
  });
  slide2.addText(c.desc, {
    x: xPos + 0.3, y: 2.8, w: 3.1, h: 3.2,
    fontSize: 12, color: TEXT_MUTED, fontFace: 'Arial', lineSpacing: 18
  });
});

// -------------------------------------------------------------
// SLIDE 3: ARQUITECTURA TÉCNICA
// -------------------------------------------------------------
const slide3 = pres.addSlide();
applySlideMaster(slide3, '2. Arquitectura & Tecnologías', 3);

slide3.addText('Stack Tecnológico Desacoplado (2 Proyectos)', {
  x: 0.8, y: 1.0, w: 11.5, h: 0.5,
  fontSize: 22, bold: true, color: TEXT_LIGHT, fontFace: 'Arial'
});

const cards3 = [
  { title: 'Frontend SPA', tech: 'Angular 18+', desc: 'Componentes Standalone, enrutamiento con Lazy Loading, Reactive Forms, Pipes y Directivas personalizadas.' },
  { title: 'Backend REST', tech: 'Spring Boot 3 (Java 17+)', desc: 'Controladores REST, Spring Data JPA, Spring Security 6 y hashing seguro de contraseñas con BCrypt.' },
  { title: 'Seguridad JWT', tech: 'JJWT (HMAC-SHA256)', desc: 'Generación y validación de tokens de 24 horas con claims de usuario y rol para peticiones sin estado (stateless).' },
  { title: 'Base de Datos', tech: 'Microsoft SQL Server', desc: 'Base de datos relacional EduPortalDB con tablas users y courses, e integridad referencial garantizada.' }
];

cards3.forEach((c, idx) => {
  const xPos = 0.8 + idx * 2.92;
  slide3.addShape(pres.shapes.RECTANGLE, {
    x: xPos, y: 1.8, w: 2.75, h: 4.5,
    fill: { color: CARD_BG },
    line: { color: '334155', width: 1 }
  });
  slide3.addText(c.title, {
    x: xPos + 0.2, y: 2.0, w: 2.35, h: 0.4,
    fontSize: 13, bold: true, color: TEXT_LIGHT, fontFace: 'Arial'
  });
  slide3.addText(c.tech, {
    x: xPos + 0.2, y: 2.4, w: 2.35, h: 0.4,
    fontSize: 10, bold: true, color: ACCENT, fontFace: 'Arial'
  });
  slide3.addText(c.desc, {
    x: xPos + 0.2, y: 3.0, w: 2.35, h: 3.0,
    fontSize: 11, color: TEXT_MUTED, fontFace: 'Arial', lineSpacing: 16
  });
});

// -------------------------------------------------------------
// SLIDE 4: ENRUTAMIENTO Y LAZY LOADING
// -------------------------------------------------------------
const slide4 = pres.addSlide();
applySlideMaster(slide4, '3. Enrutamiento SPA', 4);

slide4.addText('Enrutamiento Jerárquico & Lazy Loading', {
  x: 0.8, y: 1.0, w: 11.5, h: 0.5,
  fontSize: 22, bold: true, color: TEXT_LIGHT, fontFace: 'Arial'
});

slide4.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 1.8, w: 6.0, h: 4.5,
  fill: { color: '090D16' },
  line: { color: '334155', width: 1 }
});

const routeCode = `// app.routes.ts (Lazy Loading Moderno)
export const routes: Routes = [
  { path: 'login', canActivate: [loginGuard], ... },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: ... },
      { 
        path: 'usuarios', 
        canActivate: [roleGuard], 
        data: { roles: ['ADMIN'] },
        loadComponent: ... 
      },
      { path: 'cursos', loadComponent: ... },
      { path: 'cursos/:id', loadComponent: ... },
      { path: 'perfil', loadComponent: ... }
    ]
  },
  { path: 'unauthorized', loadComponent: ... },
  { path: '**', loadComponent: ... }
];`;

slide4.addText(routeCode, {
  x: 0.9, y: 1.9, w: 5.8, h: 4.3,
  fontSize: 9.5, color: '38BDF8', fontFace: 'Courier New', lineSpacing: 14
});

const routePoints = [
  { title: '⚡ Lazy Loading', desc: 'Carga diferida por componente que disminuye el peso del paquete inicial de la SPA.' },
  { title: '📁 Rutas Jerárquicas', desc: 'Hijos organizados bajo un Layout común con Sidebar y Navbar protegidos.' },
  { title: '🔍 Rutas Parametrizadas (:id)', desc: 'Ruta dinámica /cursos/:id para consultar detalle, vacantes y syllabus.' },
  { title: '🚫 Comodín Wildcard (**)', desc: 'Captura de errores 404 con redirección a vista personalizada.' }
];

routePoints.forEach((p, idx) => {
  const yPos = 1.8 + idx * 1.15;
  slide4.addShape(pres.shapes.RECTANGLE, {
    x: 7.1, y: yPos, w: 5.4, h: 1.0,
    fill: { color: CARD_BG },
    line: { color: '334155', width: 1 }
  });
  slide4.addText(p.title, {
    x: 7.3, y: yPos + 0.1, w: 5.0, h: 0.3,
    fontSize: 11, bold: true, color: ACCENT, fontFace: 'Arial'
  });
  slide4.addText(p.desc, {
    x: 7.3, y: yPos + 0.45, w: 5.0, h: 0.5,
    fontSize: 10, color: TEXT_MUTED, fontFace: 'Arial'
  });
});

// -------------------------------------------------------------
// SLIDE 5: GUARDS DE SEGURIDAD
// -------------------------------------------------------------
const slide5 = pres.addSlide();
applySlideMaster(slide5, '4. Guards de Seguridad', 5);

slide5.addText('Protección de Rutas con Guards de Angular', {
  x: 0.8, y: 1.0, w: 11.5, h: 0.5,
  fontSize: 22, bold: true, color: TEXT_LIGHT, fontFace: 'Arial'
});

const guards = [
  { 
    name: 'AuthGuard', 
    role: 'Autenticación de Sesión', 
    desc: '• Valida la presencia de un token JWT en localStorage.\n• Comprueba que el token no haya expirado.\n• Redirige a /login?returnUrl=... si no hay sesión activa.' 
  },
  { 
    name: 'RoleGuard', 
    role: 'Autorización por Roles', 
    desc: '• Inspecciona el array data: { roles: [...] } de la ruta.\n• Extrae el rol del token JWT del usuario actual.\n• Bloquea el paso y redirige a /unauthorized (403) si el rol es insuficiente.' 
  },
  { 
    name: 'LoginGuard', 
    role: 'Prevención de Doble Login', 
    desc: '• Detecta si el usuario ya se encuentra autenticado.\n• Impide volver al formulario de login innecesariamente.\n• Redirige automáticamente al usuario al /dashboard.' 
  }
];

guards.forEach((g, idx) => {
  const xPos = 0.8 + idx * 3.9;
  slide5.addShape(pres.shapes.RECTANGLE, {
    x: xPos, y: 1.8, w: 3.7, h: 4.5,
    fill: { color: CARD_BG },
    line: { color: '334155', width: 1 }
  });
  slide5.addText(g.name, {
    x: xPos + 0.3, y: 2.1, w: 3.1, h: 0.4,
    fontSize: 16, bold: true, color: ACCENT, fontFace: 'Arial'
  });
  slide5.addText(g.role, {
    x: xPos + 0.3, y: 2.55, w: 3.1, h: 0.35,
    fontSize: 11, bold: true, color: TEXT_LIGHT, fontFace: 'Arial'
  });
  slide5.addText(g.desc, {
    x: xPos + 0.3, y: 3.05, w: 3.1, h: 3.0,
    fontSize: 11, color: TEXT_MUTED, fontFace: 'Arial', lineSpacing: 18
  });
});

// -------------------------------------------------------------
// SLIDE 6: TOKEN JWT & INTERCEPTORES
// -------------------------------------------------------------
const slide6 = pres.addSlide();
applySlideMaster(slide6, '5. JWT & Interceptores HTTP', 6);

slide6.addText('Autenticación JWT y Comunicación con Interceptores', {
  x: 0.8, y: 1.0, w: 11.5, h: 0.5,
  fontSize: 22, bold: true, color: TEXT_LIGHT, fontFace: 'Arial'
});

slide6.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 1.8, w: 5.6, h: 4.5,
  fill: { color: CARD_BG },
  line: { color: '334155', width: 1 }
});

slide6.addText('Flujo del Token JWT en la Arquitectura', {
  x: 1.1, y: 2.1, w: 5.0, h: 0.4,
  fontSize: 14, bold: true, color: ACCENT, fontFace: 'Arial'
});

slide6.addText(`1. Login Inicial:\nEl usuario envía correo y clave a POST /api/auth/login.\n\n2. Emisión y Firma:\nSpring Boot valida en SQL Server y genera el JWT con claims (id, email, rol) firmado con HMAC-SHA256.\n\n3. Almacenamiento:\nAngular recibe el token y lo almacena en localStorage.\n\n4. Inyección Automática:\nCada llamada con HttpClient incluye Authorization: Bearer <token>.`, {
  x: 1.1, y: 2.6, w: 5.0, h: 3.4,
  fontSize: 11, color: TEXT_MUTED, fontFace: 'Arial', lineSpacing: 16
});

slide6.addShape(pres.shapes.RECTANGLE, {
  x: 6.7, y: 1.8, w: 5.8, h: 4.5,
  fill: { color: '090D16' },
  line: { color: '334155', width: 1 }
});

const interceptorCode = `// jwt.interceptor.ts
export const jwtInterceptor: HttpInterceptorFn = 
(req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token && !req.url.includes('/auth/login')) {
    const authReq = req.clone({
      setHeaders: { 
        Authorization: \`Bearer \${token}\` 
      }
    });
    return next(authReq);
  }
  return next(req);
};`;

slide6.addText(interceptorCode, {
  x: 6.9, y: 2.0, w: 5.4, h: 4.1,
  fontSize: 10, color: '38BDF8', fontFace: 'Courier New', lineSpacing: 16
});

// -------------------------------------------------------------
// SLIDE 7: PIPES Y DIRECTIVAS PROPIAS
// -------------------------------------------------------------
const slide7 = pres.addSlide();
applySlideMaster(slide7, '6. Buenas Prácticas de Desarrollo', 7);

slide7.addText('Pipes y Directivas Personalizadas de Propia Creación', {
  x: 0.8, y: 1.0, w: 11.5, h: 0.5,
  fontSize: 22, bold: true, color: TEXT_LIGHT, fontFace: 'Arial'
});

slide7.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 1.8, w: 5.7, h: 4.5,
  fill: { color: CARD_BG },
  line: { color: '334155', width: 1 }
});

slide7.addText('Custom Pipes Creados', {
  x: 1.1, y: 2.1, w: 5.1, h: 0.4,
  fontSize: 14, bold: true, color: ACCENT, fontFace: 'Arial'
});

slide7.addText(`• roleName (| roleName):\nTransforma enums internos (ROLE_ADMIN, ROLE_PROFESOR) a nombres amigables (Administrador, Docente).\n\n• statusBadge (| statusBadge):\nConvierte el estado (ACTIVO, INACTIVO) a clases CSS semánticas y etiquetas legibles.\n\n• truncateText (| truncateText:80):\nRecorta textos extensos con puntos suspensivos sin romper la estructura de las tarjetas.`, {
  x: 1.1, y: 2.6, w: 5.1, h: 3.4,
  fontSize: 11, color: TEXT_MUTED, fontFace: 'Arial', lineSpacing: 16
});

slide7.addShape(pres.shapes.RECTANGLE, {
  x: 6.8, y: 1.8, w: 5.7, h: 4.5,
  fill: { color: CARD_BG },
  line: { color: '334155', width: 1 }
});

slide7.addText('Custom Directives Creadas', {
  x: 7.1, y: 2.1, w: 5.1, h: 0.4,
  fontSize: 14, bold: true, color: ACCENT, fontFace: 'Arial'
});

slide7.addText(`• *appHasRole="['ADMIN']":\nDirectiva estructural que inyecta TemplateRef y ViewContainerRef para remover del DOM botones y acciones según el rol del usuario autenticado.\n\n• appHoverCard:\nDirectiva de atributo con @HostListener que anima dinámicamente elevaciones y transiciones suaves en tarjetas de cursos y paneles.`, {
  x: 7.1, y: 2.6, w: 5.1, h: 3.4,
  fontSize: 11, color: TEXT_MUTED, fontFace: 'Arial', lineSpacing: 16
});

// -------------------------------------------------------------
// SLIDE 8: CRUD Y SERVICIOS REST
// -------------------------------------------------------------
const slide8 = pres.addSlide();
applySlideMaster(slide8, '7. Consumo de Servicios REST', 8);

slide8.addText('Operaciones CRUD Completas con HttpClient', {
  x: 0.8, y: 1.0, w: 11.5, h: 0.5,
  fontSize: 22, bold: true, color: TEXT_LIGHT, fontFace: 'Arial'
});

const crudModules = [
  {
    title: '👤 Módulo Usuarios (Admin)',
    items: '• GET /api/users (Listar con búsqueda)\n• POST /api/users (Crear nuevo)\n• PUT /api/users/:id (Editar datos)\n• PATCH /toggle-status (Cambiar estado)\n• DELETE /api/users/:id (Eliminar)'
  },
  {
    title: '📚 Módulo Cursos (Docente/Admin)',
    items: '• GET /api/courses (Filtros por categoría)\n• GET /api/courses/:id (Detalle de curso)\n• POST /api/courses (Crear asignatura)\n• PUT /api/courses/:id (Modificar curso)\n• DELETE /api/courses/:id (Eliminar curso)'
  },
  {
    title: '🎓 Matrícula (Estudiante)',
    items: '• Exploración de catálogo con cupos\n• Ficha técnica con sílabo académico\n• POST /api/courses/:id/enroll\n• Validación de vacantes disponibles\n• Confirmación interactiva con Toast'
  }
];

crudModules.forEach((m, idx) => {
  const xPos = 0.8 + idx * 3.9;
  slide8.addShape(pres.shapes.RECTANGLE, {
    x: xPos, y: 1.8, w: 3.7, h: 4.5,
    fill: { color: CARD_BG },
    line: { color: '334155', width: 1 }
  });
  slide8.addText(m.title, {
    x: xPos + 0.3, y: 2.1, w: 3.1, h: 0.4,
    fontSize: 13, bold: true, color: ACCENT, fontFace: 'Arial'
  });
  slide8.addText(m.items, {
    x: xPos + 0.3, y: 2.7, w: 3.1, h: 3.3,
    fontSize: 11, color: TEXT_MUTED, fontFace: 'Arial', lineSpacing: 18
  });
});

// -------------------------------------------------------------
// SLIDE 9: PRUEBAS FUNCIONALES
// -------------------------------------------------------------
const slide9 = pres.addSlide();
applySlideMaster(slide9, '8. Pruebas Funcionales', 9);

slide9.addText('Resultados de Pruebas Funcionales (10/10 Aprobadas)', {
  x: 0.8, y: 1.0, w: 11.5, h: 0.5,
  fontSize: 22, bold: true, color: TEXT_LIGHT, fontFace: 'Arial'
});

slide9.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 1.8, w: 5.7, h: 4.5,
  fill: { color: CARD_BG },
  line: { color: '334155', width: 1 }
});

slide9.addText('Seguridad y Navegación (Guards & JWT)', {
  x: 1.1, y: 2.1, w: 5.1, h: 0.4,
  fontSize: 13, bold: true, color: ACCENT, fontFace: 'Arial'
});

slide9.addText(`• CP-01: Login exitoso con JWT ➔ Aprobado ✅\n• CP-02: Rechazo de credenciales erróneas ➔ Aprobado ✅\n• CP-03: AuthGuard bloquea rutas sin login ➔ Aprobado ✅\n• CP-04: RoleGuard bloquea /usuarios a Estudiantes ➔ Aprobado ✅\n• CP-09: Inyección automática de Bearer Header ➔ Aprobado ✅`, {
  x: 1.1, y: 2.6, w: 5.1, h: 3.4,
  fontSize: 11, color: TEXT_LIGHT, fontFace: 'Arial', lineSpacing: 18
});

slide9.addShape(pres.shapes.RECTANGLE, {
  x: 6.8, y: 1.8, w: 5.7, h: 4.5,
  fill: { color: CARD_BG },
  line: { color: '334155', width: 1 }
});

slide9.addText('Operaciones CRUD y Negocio', {
  x: 7.1, y: 2.1, w: 5.1, h: 0.4,
  fontSize: 13, bold: true, color: ACCENT, fontFace: 'Arial'
});

slide9.addText(`• CP-05: Creación de usuario en SQL Server ➔ Aprobado ✅\n• CP-06: Edición y toggle de estado ➔ Aprobado ✅\n• CP-07: Filtros reactivos por categoría ➔ Aprobado ✅\n• CP-08: Matrícula con control de cupos ➔ Aprobado ✅\n• CP-10: Captura de ruta inexistente 404 ➔ Aprobado ✅`, {
  x: 7.1, y: 2.6, w: 5.1, h: 3.4,
  fontSize: 11, color: TEXT_LIGHT, fontFace: 'Arial', lineSpacing: 18
});

// -------------------------------------------------------------
// SLIDE 10: CONCLUSIONES
// -------------------------------------------------------------
const slide10 = pres.addSlide();
applySlideMaster(slide10, '9. Conclusiones Finales', 10);

slide10.addText('¡Gracias por su atención!', {
  x: 0.8, y: 1.6, w: 11.7, h: 0.8,
  fontSize: 32, bold: true, color: TEXT_LIGHT, fontFace: 'Arial', align: 'center'
});

slide10.addText('Se demostró una solución SPA robusta, con seguridad JWT, Lazy Loading y persistencia en SQL Server cumpliendo al 100% la rúbrica oficial de IDAT.', {
  x: 1.5, y: 2.6, w: 10.3, h: 1.0,
  fontSize: 14, color: TEXT_MUTED, fontFace: 'Arial', align: 'center', lineSpacing: 20
});

slide10.addShape(pres.shapes.RECTANGLE, {
  x: 3.5, y: 3.9, w: 6.3, h: 1.8,
  fill: { color: CARD_BG },
  line: { color: ACCENT, width: 1 }
});

slide10.addText('¿Preguntas o Demostración en Vivo?', {
  x: 3.7, y: 4.2, w: 5.9, h: 0.4,
  fontSize: 14, bold: true, color: ACCENT, fontFace: 'Arial', align: 'center'
});

slide10.addText('Repositorio GitHub: github.com/ronyemerzon/cursos-idat\nEquipo: Rony Pascual • Alison Laulate • Cristhian Moreno', {
  x: 3.7, y: 4.7, w: 5.9, h: 0.8,
  fontSize: 11, color: TEXT_LIGHT, fontFace: 'Arial', align: 'center'
});

// Guardar archivo PPTX
const outputPath = path.join(__dirname, 'PRESENTACION_SUSTENTACION.pptx');
pres.writeFile({ fileName: outputPath }).then(() => {
  console.log(`Presentacion generada exitosamente en: ${outputPath}`);
}).catch(err => {
  console.error('Error al generar PPTX:', err);
});
