import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course.service';
import { Course } from '../../core/models/course.model';
import { RoleNamePipe } from '../../shared/pipes/role-name.pipe';
import { TruncateTextPipe } from '../../shared/pipes/truncate-text.pipe';
import { StatusBadgePipe } from '../../shared/pipes/status-badge.pipe';
import { HasRoleDirective } from '../../shared/directives/has-role.directive';
import { HoverCardDirective } from '../../shared/directives/hover-card.directive';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RoleNamePipe,
    TruncateTextPipe,
    StatusBadgePipe,
    HasRoleDirective,
    HoverCardDirective
  ],
  template: `
    <div class="dashboard-page">
      <!-- Saludo y Bienvenida -->
      @if (authService.currentUser$ | async; as user) {
        <div class="welcome-banner card" appHoverCard>
          <div class="welcome-content">
            <span class="badge badge-info mb-2">Panel Institucional</span>
            <h1>¡Hola, {{ user.name }}! 👋</h1>
            <p>Bienvenido al Sistema de Gestión Académica de IDAT. Estás autenticado con el rol de <strong>{{ user.role | roleName }}</strong> mediante JWT seguro.</p>
          </div>
          <div class="welcome-actions">
            <a routerLink="/cursos" class="btn btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              Explorar Cursos
            </a>
            <!-- Botón solo para ADMIN usando Directiva appHasRole -->
            <a *appHasRole="['ADMIN']" routerLink="/usuarios" class="btn btn-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
              </svg>
              Administrar Usuarios
            </a>
          </div>
        </div>
      }

      <!-- Tarjetas de Métricas Dinámicas -->
      <div class="stats-grid">
        <div class="stat-card card" appHoverCard>
          <div class="stat-icon bg-indigo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <div class="stat-details">
            <span class="stat-label">Cursos Activos</span>
            <span class="stat-value">{{ stats.activeCourses }}</span>
            <span class="stat-sub">De {{ stats.totalCourses }} cursos totales</span>
          </div>
        </div>

        <div class="stat-card card" appHoverCard>
          <div class="stat-icon bg-emerald">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          </div>
          <div class="stat-details">
            <span class="stat-label">Estudiantes</span>
            <span class="stat-value">{{ stats.totalStudents }}</span>
            <span class="stat-sub">Matriculados en plataforma</span>
          </div>
        </div>

        <div class="stat-card card" appHoverCard>
          <div class="stat-icon bg-blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div class="stat-details">
            <span class="stat-label">Docentes</span>
            <span class="stat-value">{{ stats.totalProfessors }}</span>
            <span class="stat-sub">Profesores asignados</span>
          </div>
        </div>

        <div class="stat-card card" appHoverCard>
          <div class="stat-icon bg-pink">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <div class="stat-details">
            <span class="stat-label">Seguridad JWT</span>
            <span class="stat-value">Activa</span>
            <span class="stat-sub">Bearer Token en HttpClient</span>
          </div>
        </div>
      </div>

      <!-- Cursos Destacados -->
      <div class="card recent-courses-section">
        <div class="card-header">
          <div>
            <h3>Cursos Disponibles Recientes</h3>
            <p class="text-muted">Explora el catálogo académico y el estado de cupos en tiempo real</p>
          </div>
          <a routerLink="/cursos" class="btn btn-secondary btn-sm">Ver Todos</a>
        </div>

        <div class="courses-preview-grid">
          @for (course of recentCourses; track course.id) {
            <div class="course-mini-card" appHoverCard [routerLink]="['/cursos', course.id]">
              <div class="course-img-box">
                <img [src]="course.imageUrl" [alt]="course.title" class="course-thumb" />
                <span class="course-badge-category">{{ course.category }}</span>
              </div>
              <div class="course-mini-body">
                <span class="course-code">{{ course.code }}</span>
                <h4 class="course-mini-title">{{ course.title | truncateText:45 }}</h4>
                <p class="course-mini-desc">{{ course.description | truncateText:65 }}</p>
                <div class="course-mini-footer">
                  <span class="instructor-tag">👨‍🏫 {{ course.instructorName }}</span>
                  <span class="capacity-tag">{{ course.enrolledCount }}/{{ course.maxCapacity }} inscritos</span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }
    .welcome-banner {
      background: linear-gradient(135deg, #ffffff, var(--primary-50));
      border: 1px solid var(--primary-200);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1.5rem;
      padding: 2rem;
    }
    .welcome-content h1 {
      font-size: 1.75rem;
      margin-bottom: 0.5rem;
    }
    .welcome-content p {
      color: #475569;
      font-size: 0.9375rem;
      max-width: 650px;
    }
    .welcome-actions {
      display: flex;
      gap: 0.75rem;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
    }
    .stat-card {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.25rem;
    }
    .stat-icon {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .bg-indigo { background-color: #e0e7ff; color: #4338ca; }
    .bg-emerald { background-color: #d1fae5; color: #065f46; }
    .bg-blue { background-color: #dbeafe; color: #1e40af; }
    .bg-pink { background-color: #fce7f3; color: #9d174d; }

    .stat-details {
      display: flex;
      flex-direction: column;
    }
    .stat-label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #64748b;
    }
    .stat-value {
      font-size: 1.5rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.2;
    }
    .stat-sub {
      font-size: 0.75rem;
      color: #94a3b8;
    }
    .recent-courses-section {
      padding: 1.75rem;
    }
    .courses-preview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.25rem;
      margin-top: 1rem;
    }
    .course-mini-card {
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      overflow: hidden;
      cursor: pointer;
      background: #ffffff;
      transition: all 0.2s;
    }
    .course-mini-card:hover {
      border-color: var(--primary-300);
    }
    .course-img-box {
      position: relative;
      height: 140px;
      overflow: hidden;
    }
    .course-thumb {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .course-badge-category {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(15, 23, 42, 0.85);
      color: #ffffff;
      font-size: 0.6875rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-sm);
      backdrop-filter: blur(4px);
    }
    .course-mini-body {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }
    .course-code {
      font-size: 0.6875rem;
      font-weight: 700;
      color: var(--primary-600);
      text-transform: uppercase;
    }
    .course-mini-title {
      font-size: 0.9375rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.3;
    }
    .course-mini-desc {
      font-size: 0.8125rem;
      color: #64748b;
      line-height: 1.4;
    }
    .course-mini-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px solid #f1f5f9;
      font-size: 0.75rem;
      color: #64748b;
    }
    .capacity-tag {
      font-weight: 600;
      color: var(--primary-700);
    }
  `]
})
export class DashboardComponent implements OnInit {
  public authService = inject(AuthService);
  private courseService = inject(CourseService);

  stats = {
    totalUsers: 5,
    totalStudents: 2,
    totalProfessors: 2,
    totalAdmins: 1,
    totalCourses: 6,
    activeCourses: 6
  };

  recentCourses: Course[] = [];

  ngOnInit(): void {
    this.loadStats();
    this.loadRecentCourses();
  }

  loadStats(): void {
    this.courseService.getDashboardStats().subscribe({
      next: (res) => {
        if (res.data) this.stats = res.data;
      },
      error: () => {}
    });
  }

  loadRecentCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (res) => {
        if (res.data) {
          this.recentCourses = res.data.slice(0, 3);
        }
      },
      error: () => {}
    });
  }
}
