import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { loginGuard } from './core/guards/login.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  // Ruta Pública de Autenticación con LoginGuard
  {
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },

  // Rutas Protegidas bajo Layout Principal
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      // Ruta Usuarios: Protegida por AuthGuard y RoleGuard (Solo ADMIN)
      {
        path: 'usuarios',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () => import('./pages/users/user-list/user-list.component').then(m => m.UserListComponent)
      },
      // Ruta Cursos: Accesible para todos los usuarios autenticados
      {
        path: 'cursos',
        loadComponent: () => import('./pages/courses/course-list/course-list.component').then(m => m.CourseListComponent)
      },
      // Ruta Parametrizada de Detalle de Curso
      {
        path: 'cursos/:id',
        loadComponent: () => import('./pages/courses/course-detail/course-detail.component').then(m => m.CourseDetailComponent)
      },
      // Ruta Perfil del Usuario Autenticado
      {
        path: 'perfil',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },

  // Ruta 403: Acceso No Autorizado
  {
    path: 'unauthorized',
    loadComponent: () => import('./pages/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },

  // Ruta Wildcard 404: Página no encontrada
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
