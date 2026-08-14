import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseService } from '../../../core/services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Course } from '../../../core/models/course.model';
import { TruncateTextPipe } from '../../../shared/pipes/truncate-text.pipe';
import { StatusBadgePipe } from '../../../shared/pipes/status-badge.pipe';
import { RoleNamePipe } from '../../../shared/pipes/role-name.pipe';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';
import { HoverCardDirective } from '../../../shared/directives/hover-card.directive';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TruncateTextPipe,
    StatusBadgePipe,
    RoleNamePipe,
    HasRoleDirective,
    HoverCardDirective,
    ConfirmModalComponent
  ],
  template: `
    <div class="courses-page">
      <!-- Encabezado -->
      <div class="page-header flex-between">
        <div>
          <h2>Gestión de Cursos Académicos</h2>
          <p class="text-muted">Explora la oferta académica, cupos disponibles y administra las asignaturas</p>
        </div>

        <!-- Botón Crear: Solo para ADMIN o PROFESOR -->
        <button *appHasRole="['ADMIN', 'PROFESOR']" type="button" class="btn btn-primary" (click)="openCreateModal()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Nuevo Curso
        </button>
      </div>

      <!-- Filtros y Búsqueda -->
      <div class="filters-card card">
        <div class="search-box">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Buscar por título o código del curso..."
            class="form-control search-control"
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
          />
        </div>

        <div class="category-pills">
          @for (cat of categories; track cat) {
            <button
              type="button"
              class="filter-pill"
              [class.active]="selectedCategory === cat"
              (click)="setCategory(cat)"
            >
              {{ cat }}
            </button>
          }
        </div>

        <div class="view-toggle">
          <button type="button" class="toggle-btn" [class.active]="viewMode === 'grid'" (click)="viewMode = 'grid'" title="Vista Cuadrícula">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </button>
          <button type="button" class="toggle-btn" [class.active]="viewMode === 'table'" (click)="viewMode = 'table'" title="Vista Tabla">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Contenido: Cuadrícula o Tabla -->
      @if (isLoading) {
        <div class="loading-box card">
          <span class="spinner"></span>
          <p>Cargando catálogo de cursos...</p>
        </div>
      } @else if (filteredCourses.length === 0) {
        <div class="empty-state card">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <h4>No se encontraron cursos</h4>
          <p>No hay cursos que coincidan con la categoría o término de búsqueda.</p>
        </div>
      } @else if (viewMode === 'grid') {
        <!-- Vista Cuadrícula -->
        <div class="courses-grid">
          @for (course of filteredCourses; track course.id) {
            <div class="course-card card" appHoverCard>
              <div class="course-header-img">
                <img [src]="course.imageUrl" [alt]="course.title" class="course-image" />
                <span class="category-chip">{{ course.category }}</span>
                <span class="credits-chip">{{ course.credits }} Créditos</span>
              </div>

              <div class="course-card-content">
                <div class="course-meta-top">
                  <span class="code-tag">{{ course.code }}</span>
                  @let badge = course.status | statusBadge;
                  <span class="badge" [ngClass]="badge.cssClass">{{ badge.label }}</span>
                </div>

                <h3 class="course-title">
                  <a [routerLink]="['/cursos', course.id]">{{ course.title }}</a>
                </h3>

                <p class="course-description">{{ course.description | truncateText:95 }}</p>

                <div class="course-instructor">
                  <div class="instructor-icon">👨‍🏫</div>
                  <span>Docente: <strong>{{ course.instructorName || 'Por Asignar' }}</strong></span>
                </div>

                <!-- Barra de Capacidad de Cupos -->
                <div class="capacity-wrapper">
                  <div class="capacity-labels">
                    <span>Cupos Ocupados</span>
                    <strong>{{ course.enrolledCount }} / {{ course.maxCapacity }}</strong>
                  </div>
                  <div class="capacity-progress">
                    <div
                      class="progress-fill"
                      [style.width.%]="(course.enrolledCount / course.maxCapacity) * 100"
                      [ngClass]="{
                        'progress-full': course.enrolledCount >= course.maxCapacity,
                        'progress-high': course.enrolledCount >= (course.maxCapacity * 0.8)
                      }"
                    ></div>
                  </div>
                </div>

                <!-- Acciones del Curso -->
                <div class="course-card-actions">
                  <a [routerLink]="['/cursos', course.id]" class="btn btn-secondary btn-sm flex-1">
                    Ver Detalle
                  </a>

                  <!-- Matrícula para Estudiantes -->
                  @if (authService.getUserRole() === 'ESTUDIANTE') {
                    <button
                      type="button"
                      class="btn btn-primary btn-sm flex-1"
                      [disabled]="course.enrolledCount >= course.maxCapacity"
                      (click)="enrollInCourse(course)"
                    >
                      {{ course.enrolledCount >= course.maxCapacity ? 'Cupos Llenos' : 'Matricularme' }}
                    </button>
                  }

                  <!-- Botones de Admin / Docente -->
                  <div *appHasRole="['ADMIN', 'PROFESOR']" class="admin-action-group">
                    <button type="button" class="btn-icon-action edit" (click)="openEditModal(course)" title="Editar Curso">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <!-- Eliminar: Solo ADMIN -->
                    <button *appHasRole="['ADMIN']" type="button" class="btn-icon-action delete" (click)="openDeleteModal(course)" title="Eliminar Curso">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <!-- Vista Tabla -->
        <div class="table-container card">
          <table class="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Curso</th>
                <th>Categoría</th>
                <th>Docente</th>
                <th>Créditos</th>
                <th>Cupos</th>
                <th>Estado</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (course of filteredCourses; track course.id) {
                <tr>
                  <td><span class="code-badge">{{ course.code }}</span></td>
                  <td>
                    <a [routerLink]="['/cursos', course.id]" class="table-course-title">
                      {{ course.title }}
                    </a>
                  </td>
                  <td><span class="badge badge-info">{{ course.category }}</span></td>
                  <td>{{ course.instructorName || 'Sin Asignar' }}</td>
                  <td><strong>{{ course.credits }}</strong></td>
                  <td>{{ course.enrolledCount }} / {{ course.maxCapacity }}</td>
                  <td>
                    @let badge = course.status | statusBadge;
                    <span class="badge" [ngClass]="badge.cssClass">{{ badge.label }}</span>
                  </td>
                  <td class="text-right">
                    <div class="actions-group">
                      <a [routerLink]="['/cursos', course.id]" class="btn-action view" title="Ver Detalle">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </a>
                      <button *appHasRole="['ADMIN', 'PROFESOR']" type="button" class="btn-action edit" (click)="openEditModal(course)" title="Editar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button *appHasRole="['ADMIN']" type="button" class="btn-action delete" (click)="openDeleteModal(course)" title="Eliminar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <!-- Modal Crear / Editar Curso -->
      @if (isModalOpen) {
        <div class="modal-backdrop" (click)="closeModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header flex-between">
              <h3>{{ isEditing ? 'Editar Curso' : 'Registrar Nuevo Curso' }}</h3>
              <button type="button" class="btn-close" (click)="closeModal()">✕</button>
            </div>

            <form [formGroup]="courseForm" (ngSubmit)="saveCourse()" class="modal-form">
              <div class="form-row">
                <div class="form-group flex-2">
                  <label class="form-label">Título del Curso *</label>
                  <input type="text" formControlName="title" class="form-control" placeholder="Ej. Desarrollo Frontend con Angular" />
                </div>
                <div class="form-group flex-1">
                  <label class="form-label">Código *</label>
                  <input type="text" formControlName="code" class="form-control" placeholder="ANG-101" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Descripción Académica *</label>
                <textarea formControlName="description" rows="3" class="form-control" placeholder="Objetivos y temario del curso..."></textarea>
              </div>

              <div class="form-row">
                <div class="form-group flex-1">
                  <label class="form-label">Categoría *</label>
                  <select formControlName="category" class="form-control">
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Base de Datos">Base de Datos</option>
                    <option value="Móvil">Móvil</option>
                    <option value="Cloud">Cloud</option>
                    <option value="DevOps">DevOps</option>
                    <option value="IA">IA</option>
                  </select>
                </div>
                <div class="form-group flex-1">
                  <label class="form-label">Docente Responsable</label>
                  <input type="text" formControlName="instructorName" class="form-control" placeholder="Nombre del docente" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group flex-1">
                  <label class="form-label">Créditos</label>
                  <input type="number" formControlName="credits" class="form-control" min="1" max="10" />
                </div>
                <div class="form-group flex-1">
                  <label class="form-label">Capacidad Máxima</label>
                  <input type="number" formControlName="maxCapacity" class="form-control" min="5" max="100" />
                </div>
                <div class="form-group flex-1">
                  <label class="form-label">Estado</label>
                  <select formControlName="status" class="form-control">
                    <option value="ACTIVO">Activo</option>
                    <option value="INACTIVO">Inactivo</option>
                    <option value="FINALIZADO">Finalizado</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Horario de Clases</label>
                <input type="text" formControlName="schedule" class="form-control" placeholder="Ej. Lun - Mie 19:00 - 22:00" />
              </div>

              <div class="modal-footer flex-between">
                <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancelar</button>
                <button type="submit" class="btn btn-primary" [disabled]="courseForm.invalid || isSaving">
                  {{ isSaving ? 'Guardando...' : (isEditing ? 'Actualizar Curso' : 'Crear Curso') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Modal de Confirmación de Eliminación -->
      <app-confirm-modal
        [isOpen]="isDeleteModalOpen"
        [title]="'¿Eliminar curso académico?'"
        [message]="'¿Estás seguro de eliminar el curso ' + courseToDelete?.title + '? Esta acción borrará todas sus matrículas asociadas.'"
        [confirmText]="'Sí, eliminar curso'"
        [cancelText]="'Cancelar'"
        [type]="'danger'"
        (confirm)="confirmDelete()"
        (cancel)="isDeleteModalOpen = false"
      ></app-confirm-modal>
    </div>
  `,
  styles: [`
    .courses-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .page-header h2 {
      font-size: 1.5rem;
      margin-bottom: 0.25rem;
    }
    .filters-card {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1rem 1.25rem;
    }
    .search-box {
      position: relative;
      flex: 1;
      min-width: 250px;
    }
    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
    }
    .search-control {
      padding-left: 2.5rem;
    }
    .category-pills {
      display: flex;
      gap: 0.375rem;
      flex-wrap: wrap;
    }
    .filter-pill {
      background: #f8fafc;
      border: 1px solid var(--border-color);
      padding: 0.375rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s;
    }
    .filter-pill:hover, .filter-pill.active {
      background: var(--primary-600);
      color: #ffffff;
      border-color: var(--primary-600);
    }
    .view-toggle {
      display: flex;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      overflow: hidden;
    }
    .toggle-btn {
      background: #ffffff;
      border: none;
      padding: 0.375rem 0.625rem;
      color: #64748b;
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    .toggle-btn.active {
      background-color: var(--primary-50);
      color: var(--primary-600);
    }
    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    .course-card {
      padding: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .course-header-img {
      position: relative;
      height: 160px;
      background: #0f172a;
    }
    .course-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.9;
    }
    .category-chip {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(4px);
      color: #ffffff;
      font-size: 0.6875rem;
      font-weight: 700;
      padding: 0.25rem 0.625rem;
      border-radius: var(--radius-sm);
    }
    .credits-chip {
      position: absolute;
      top: 12px;
      right: 12px;
      background: rgba(79, 70, 229, 0.9);
      backdrop-filter: blur(4px);
      color: #ffffff;
      font-size: 0.6875rem;
      font-weight: 700;
      padding: 0.25rem 0.625rem;
      border-radius: var(--radius-sm);
    }
    .course-card-content {
      padding: 1.25rem;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
    }
    .course-meta-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .code-tag {
      font-size: 0.75rem;
      font-weight: 800;
      color: var(--primary-600);
      background-color: var(--primary-50);
      padding: 0.125rem 0.5rem;
      border-radius: 4px;
    }
    .course-title {
      font-size: 1.0625rem;
      line-height: 1.35;
      font-weight: 700;
    }
    .course-title a {
      color: #0f172a;
    }
    .course-title a:hover {
      color: var(--primary-600);
    }
    .course-description {
      font-size: 0.8125rem;
      color: #64748b;
      line-height: 1.45;
    }
    .course-instructor {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.8125rem;
      color: #475569;
      background: #f8fafc;
      padding: 0.375rem 0.625rem;
      border-radius: var(--radius-sm);
    }
    .capacity-wrapper {
      margin-top: 0.25rem;
    }
    .capacity-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #64748b;
      margin-bottom: 0.25rem;
    }
    .capacity-progress {
      height: 6px;
      background-color: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background-color: var(--primary-600);
      transition: width 0.3s ease;
    }
    .progress-high { background-color: #f59e0b; }
    .progress-full { background-color: #ef4444; }

    .course-card-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: auto;
      padding-top: 1rem;
      border-top: 1px solid #f1f5f9;
    }
    .admin-action-group {
      display: flex;
      gap: 0.25rem;
    }
    .btn-icon-action {
      background: #f8fafc;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: 0.375rem;
      cursor: pointer;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-icon-action.edit:hover {
      background-color: var(--primary-50);
      color: var(--primary-600);
    }
    .btn-icon-action.delete:hover {
      background-color: var(--danger-bg);
      color: var(--danger-text);
    }
    .table-course-title {
      font-weight: 700;
      color: #0f172a;
    }
    .code-badge {
      font-weight: 700;
      color: var(--primary-700);
      background: var(--primary-50);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-size: 0.75rem;
    }
    .modal-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border-color);
    }
    .modal-form {
      padding: 1.5rem;
    }
    .form-row {
      display: flex;
      gap: 1rem;
    }
    .flex-2 { flex: 2; }
    .flex-1 { flex: 1; }
    .modal-footer {
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);
    }
    .btn-close {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      color: #94a3b8;
    }
    .loading-box, .empty-state {
      padding: 3.5rem 1.5rem;
      text-align: center;
      color: #64748b;
    }
    .empty-state svg {
      color: #cbd5e1;
      margin-bottom: 0.75rem;
    }
    .actions-group {
      display: inline-flex;
      gap: 0.375rem;
    }
    .btn-action {
      background: none;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: 0.375rem;
      cursor: pointer;
      color: #64748b;
      display: inline-flex;
    }
    .btn-action.view:hover {
      background: var(--info-bg);
      color: var(--info-text);
    }
    .btn-action.edit:hover {
      background: var(--primary-50);
      color: var(--primary-600);
    }
    .btn-action.delete:hover {
      background: var(--danger-bg);
      color: var(--danger-text);
    }
  `]
})
export class CourseListComponent implements OnInit {
  private courseService = inject(CourseService);
  public authService = inject(AuthService);
  private notification = inject(NotificationService);
  private fb = inject(FormBuilder);

  courses: Course[] = [];
  filteredCourses: Course[] = [];
  isLoading = true;
  viewMode: 'grid' | 'table' = 'grid';

  searchQuery = '';
  selectedCategory = 'TODOS';
  categories = ['TODOS', 'Frontend', 'Backend', 'Base de Datos', 'Móvil', 'Cloud', 'IA'];

  isModalOpen = false;
  isEditing = false;
  editingCourseId?: number;
  isSaving = false;

  isDeleteModalOpen = false;
  courseToDelete?: Course;

  courseForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(4)]],
    code: ['', [Validators.required]],
    description: ['', [Validators.required]],
    category: ['Frontend', [Validators.required]],
    instructorName: [''],
    credits: [4, [Validators.required, Validators.min(1)]],
    maxCapacity: [30, [Validators.required, Validators.min(5)]],
    status: ['ACTIVO', [Validators.required]],
    schedule: ['']
  });

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.courseService.getCourses().subscribe({
      next: (res) => {
        this.courses = res.data || [];
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  setCategory(cat: string): void {
    this.selectedCategory = cat;
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.courses];

    if (this.selectedCategory !== 'TODOS') {
      result = result.filter(c => c.category.toLowerCase() === this.selectedCategory.toLowerCase());
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
      );
    }

    this.filteredCourses = result;
  }

  enrollInCourse(course: Course): void {
    if (!course.id) return;
    this.courseService.enrollCourse(course.id).subscribe({
      next: (res) => {
        this.notification.success('¡Matrícula Exitosa!', `Te has matriculado en el curso ${course.title}`);
        this.loadCourses();
      }
    });
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.editingCourseId = undefined;
    this.courseForm.reset({
      title: '',
      code: '',
      description: '',
      category: 'Frontend',
      instructorName: this.authService.getCurrentUser()?.name || '',
      credits: 4,
      maxCapacity: 30,
      status: 'ACTIVO',
      schedule: 'Lun - Mie 19:00 - 22:00'
    });
    this.isModalOpen = true;
  }

  openEditModal(course: Course): void {
    this.isEditing = true;
    this.editingCourseId = course.id;
    this.courseForm.patchValue({
      title: course.title,
      code: course.code,
      description: course.description,
      category: course.category,
      instructorName: course.instructorName || '',
      credits: course.credits,
      maxCapacity: course.maxCapacity,
      status: course.status,
      schedule: course.schedule || ''
    });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveCourse(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formData = this.courseForm.value;

    if (this.isEditing && this.editingCourseId) {
      this.courseService.updateCourse(this.editingCourseId, formData).subscribe({
        next: () => {
          this.notification.success('Curso Actualizado', 'La información del curso ha sido modificada.');
          this.isSaving = false;
          this.closeModal();
          this.loadCourses();
        },
        error: () => {
          this.isSaving = false;
        }
      });
    } else {
      this.courseService.createCourse(formData).subscribe({
        next: () => {
          this.notification.success('Curso Creado', 'El nuevo curso ha sido registrado exitosamente.');
          this.isSaving = false;
          this.closeModal();
          this.loadCourses();
        },
        error: () => {
          this.isSaving = false;
        }
      });
    }
  }

  openDeleteModal(course: Course): void {
    this.courseToDelete = course;
    this.isDeleteModalOpen = true;
  }

  confirmDelete(): void {
    if (!this.courseToDelete?.id) return;
    this.courseService.deleteCourse(this.courseToDelete.id).subscribe({
      next: () => {
        this.notification.success('Curso Eliminado', 'El curso ha sido retirado del sistema.');
        this.isDeleteModalOpen = false;
        this.courseToDelete = undefined;
        this.loadCourses();
      }
    });
  }
}
