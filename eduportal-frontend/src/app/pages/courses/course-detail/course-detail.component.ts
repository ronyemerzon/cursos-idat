import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Course } from '../../../core/models/course.model';
import { StatusBadgePipe } from '../../../shared/pipes/status-badge.pipe';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';
import { HoverCardDirective } from '../../../shared/directives/hover-card.directive';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    StatusBadgePipe,
    HasRoleDirective,
    HoverCardDirective
  ],
  template: `
    <div class="course-detail-page">
      <!-- Breadcrumb y Botón Volver -->
      <div class="detail-top-nav flex-between">
        <a routerLink="/cursos" class="back-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Volver a la lista de cursos
        </a>

        <div class="detail-badges">
          @if (course) {
            <span class="code-badge-lg">{{ course.code }}</span>
            @let badge = course.status | statusBadge;
            <span class="badge" [ngClass]="badge.cssClass">{{ badge.label }}</span>
          }
        </div>
      </div>

      @if (isLoading) {
        <div class="loading-state card">
          <span class="spinner"></span>
          <p>Cargando información del curso...</p>
        </div>
      } @else if (course) {
        <div class="course-detail-grid">
          <!-- Columna Principal: Información General y Temario -->
          <div class="main-column">
            <div class="course-hero card" appHoverCard>
              <img [src]="course.imageUrl" [alt]="course.title" class="hero-image" />
              <div class="hero-body">
                <span class="category-pill">{{ course.category }}</span>
                <h2>{{ course.title }}</h2>
                <p class="hero-desc">{{ course.description }}</p>
              </div>
            </div>

            <!-- Temario y Contenido Modular -->
            <div class="syllabus-card card">
              <h3>📚 Estructura y Sílabo del Curso</h3>
              <p class="text-muted mb-4">Competencias y unidades de aprendizaje planificadas</p>

              <div class="syllabus-list">
                <div class="syllabus-item">
                  <div class="unit-number">01</div>
                  <div class="unit-content">
                    <h4>Fundamentos, Arquitectura y Configuración Inicial</h4>
                    <p>Introducción al ecosistema, configuración del entorno de trabajo, inyección de dependencias y tipado estricto.</p>
                  </div>
                </div>

                <div class="syllabus-item">
                  <div class="unit-number">02</div>
                  <div class="unit-content">
                    <h4>Enrutamiento Avanzado, Lazy Loading y Modularización</h4>
                    <p>Rutas jerárquicas con hijos, parámetros dinámicos en URL, carga perezosa de componentes y optimización de rendimiento.</p>
                  </div>
                </div>

                <div class="syllabus-item">
                  <div class="unit-number">03</div>
                  <div class="unit-content">
                    <h4>Seguridad, Guards de Navegación y Token JWT</h4>
                    <p>Protección de rutas con AuthGuard y RoleGuard, interceptores HTTP para inyección de cabeceras Bearer y control de expiración.</p>
                  </div>
                </div>

                <div class="syllabus-item">
                  <div class="unit-number">04</div>
                  <div class="unit-content">
                    <h4>Integración REST con HttpClient y Operaciones CRUD</h4>
                    <p>Consumo de APIs asíncronas con Observables RxJS, validación reactiva de formularios y manejo global de errores.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Columna Lateral: Ficha Técnica y Matrícula -->
          <div class="sidebar-column">
            <div class="card course-specs-card" appHoverCard>
              <h3>Ficha Técnica</h3>
              
              <div class="spec-list">
                <div class="spec-item">
                  <span class="spec-label">👨‍🏫 Docente</span>
                  <span class="spec-value">{{ course.instructorName || 'Carlos Mendoza' }}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">⭐ Créditos</span>
                  <span class="spec-value">{{ course.credits }} Créditos Académicos</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">🕒 Horario</span>
                  <span class="spec-value">{{ course.schedule || 'Lun - Mie 19:00 - 22:00' }}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">📍 Modalidad</span>
                  <span class="spec-value">Virtual / Presencial IDAT</span>
                </div>
              </div>

              <!-- Vacantes y Barra -->
              <div class="vacancies-box">
                <div class="flex-between mb-1">
                  <span class="vacancies-label">Disponibilidad de Cupos</span>
                  <strong>{{ course.enrolledCount }} / {{ course.maxCapacity }}</strong>
                </div>
                <div class="capacity-bar">
                  <div
                    class="capacity-fill"
                    [style.width.%]="(course.enrolledCount / course.maxCapacity) * 100"
                  ></div>
                </div>
                <span class="vacancies-left">
                  Quedan <strong>{{ course.maxCapacity - course.enrolledCount }}</strong> cupos disponibles
                </span>
              </div>

              <!-- Botón de Matrícula para Estudiante -->
              @if (authService.getUserRole() === 'ESTUDIANTE') {
                <button
                  type="button"
                  class="btn btn-primary btn-block mt-4"
                  [disabled]="course.enrolledCount >= course.maxCapacity"
                  (click)="enroll()"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <line x1="19" y1="8" x2="19" y2="14"></line>
                    <line x1="22" y1="11" x2="16" y2="11"></line>
                  </svg>
                  {{ course.enrolledCount >= course.maxCapacity ? 'Cupos Agotados' : 'Inscribirme en este Curso' }}
                </button>
              }

              <a routerLink="/cursos" class="btn btn-secondary btn-block mt-2">
                Volver a Catálogo
              </a>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .course-detail-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .detail-top-nav {
      padding-bottom: 0.5rem;
    }
    .back-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: #64748b;
    }
    .back-link:hover {
      color: var(--primary-600);
    }
    .code-badge-lg {
      font-size: 0.875rem;
      font-weight: 800;
      color: var(--primary-700);
      background-color: var(--primary-50);
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-sm);
      margin-right: 0.5rem;
    }
    .course-detail-grid {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 1.5rem;
    }
    @media (max-width: 900px) {
      .course-detail-grid {
        grid-template-columns: 1fr;
      }
    }
    .course-hero {
      padding: 0;
      overflow: hidden;
      margin-bottom: 1.5rem;
    }
    .hero-image {
      width: 100%;
      height: 240px;
      object-fit: cover;
    }
    .hero-body {
      padding: 1.75rem;
    }
    .category-pill {
      display: inline-block;
      background-color: var(--primary-50);
      color: var(--primary-700);
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.625rem;
      border-radius: var(--radius-sm);
      margin-bottom: 0.75rem;
    }
    .hero-body h2 {
      font-size: 1.5rem;
      margin-bottom: 0.75rem;
    }
    .hero-desc {
      color: #475569;
      line-height: 1.6;
    }
    .syllabus-card {
      padding: 1.75rem;
    }
    .syllabus-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .syllabus-item {
      display: flex;
      gap: 1.25rem;
      align-items: flex-start;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid #f1f5f9;
    }
    .syllabus-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .unit-number {
      width: 44px;
      height: 44px;
      background-color: var(--primary-50);
      color: var(--primary-600);
      font-weight: 800;
      font-size: 1.125rem;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .unit-content h4 {
      font-size: 0.9375rem;
      margin-bottom: 0.25rem;
    }
    .unit-content p {
      font-size: 0.8125rem;
      color: #64748b;
      line-height: 1.45;
    }
    .course-specs-card {
      padding: 1.75rem;
      position: sticky;
      top: 90px;
    }
    .course-specs-card h3 {
      font-size: 1.125rem;
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #f1f5f9;
    }
    .spec-list {
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
      margin-bottom: 1.5rem;
    }
    .spec-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8125rem;
    }
    .spec-label {
      color: #64748b;
    }
    .spec-value {
      font-weight: 700;
      color: #0f172a;
    }
    .vacancies-box {
      background: #f8fafc;
      padding: 1rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
    }
    .vacancies-label {
      font-size: 0.75rem;
      color: #64748b;
    }
    .capacity-bar {
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
      margin: 0.5rem 0;
    }
    .capacity-fill {
      height: 100%;
      background: var(--primary-600);
      transition: width 0.3s;
    }
    .vacancies-left {
      font-size: 0.75rem;
      color: #475569;
    }
    .btn-block {
      width: 100%;
    }
    .mt-4 { margin-top: 1rem; }
    .mt-2 { margin-top: 0.5rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-1 { margin-bottom: 0.25rem; }
    .loading-state {
      padding: 3rem;
      text-align: center;
      color: #64748b;
    }
  `]
})
export class CourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  public authService = inject(AuthService);
  private notification = inject(NotificationService);

  course?: Course;
  isLoading = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCourse(parseInt(id, 10));
    } else {
      this.router.navigate(['/cursos']);
    }
  }

  loadCourse(id: number): void {
    this.isLoading = true;
    this.courseService.getCourseById(id).subscribe({
      next: (res) => {
        this.course = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/cursos']);
      }
    });
  }

  enroll(): void {
    if (!this.course?.id) return;
    this.courseService.enrollCourse(this.course.id).subscribe({
      next: (res) => {
        this.course = res.data;
        this.notification.success('¡Matrícula Confirmada!', `Te has inscrito correctamente en ${this.course.title}`);
      }
    });
  }
}
