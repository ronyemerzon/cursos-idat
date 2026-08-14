import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { User, UserRole } from '../../../core/models/user.model';
import { RoleNamePipe } from '../../../shared/pipes/role-name.pipe';
import { StatusBadgePipe } from '../../../shared/pipes/status-badge.pipe';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { HoverCardDirective } from '../../../shared/directives/hover-card.directive';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RoleNamePipe,
    StatusBadgePipe,
    ConfirmModalComponent,
    HoverCardDirective
  ],
  template: `
    <div class="users-page">
      <!-- Encabezado de Página -->
      <div class="page-header flex-between">
        <div>
          <h2>Gestión de Usuarios</h2>
          <p class="text-muted">Administra los usuarios institucionales, roles y permisos de acceso</p>
        </div>
        <button type="button" class="btn btn-primary" (click)="openCreateModal()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Nuevo Usuario
        </button>
      </div>

      <!-- Barra de Filtros y Búsqueda -->
      <div class="filters-card card">
        <div class="search-input-box">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre o correo electrónico..."
            class="form-control search-control"
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
          />
        </div>
        
        <div class="role-filter-group">
          <button
            type="button"
            class="filter-pill"
            [class.active]="selectedRoleFilter === 'TODOS'"
            (click)="setRoleFilter('TODOS')"
          >
            Todos ({{ users.length }})
          </button>
          <button
            type="button"
            class="filter-pill"
            [class.active]="selectedRoleFilter === 'ADMIN'"
            (click)="setRoleFilter('ADMIN')"
          >
            Admins
          </button>
          <button
            type="button"
            class="filter-pill"
            [class.active]="selectedRoleFilter === 'PROFESOR'"
            (click)="setRoleFilter('PROFESOR')"
          >
            Docentes
          </button>
          <button
            type="button"
            class="filter-pill"
            [class.active]="selectedRoleFilter === 'ESTUDIANTE'"
            (click)="setRoleFilter('ESTUDIANTE')"
          >
            Estudiantes
          </button>
        </div>
      </div>

      <!-- Tabla Dinámica de Usuarios -->
      <div class="table-container card">
        @if (isLoading) {
          <div class="loading-state">
            <span class="spinner"></span>
            <p>Cargando lista de usuarios...</p>
          </div>
        } @else if (filteredUsers.length === 0) {
          <div class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
            <h4>No se encontraron usuarios</h4>
            <p>Intenta con otros términos de búsqueda o añade un nuevo usuario.</p>
          </div>
        } @else {
          <table class="data-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Fecha Registro</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (user of filteredUsers; track user.id) {
                <tr>
                  <td>
                    <div class="user-cell">
                      <img [src]="user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.name" alt="Avatar" class="avatar-sm" />
                      <div class="user-cell-meta">
                        <span class="cell-name">{{ user.name }}</span>
                        <span class="cell-email">{{ user.email }}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="getRoleBadgeClass(user.role)">
                      {{ user.role | roleName }}
                    </span>
                  </td>
                  <td>{{ user.phone || 'No registrado' }}</td>
                  <td>
                    @let badge = user.status | statusBadge;
                    <button
                      type="button"
                      class="status-toggle-btn"
                      (click)="toggleUserStatus(user)"
                      title="Haz clic para alternar estado"
                    >
                      <span class="badge" [ngClass]="badge.cssClass">
                        {{ badge.label }}
                      </span>
                    </button>
                  </td>
                  <td>{{ user.createdAt ? (user.createdAt | date:'shortDate') : 'Hoy' }}</td>
                  <td class="text-right">
                    <div class="actions-group">
                      <button
                        type="button"
                        class="btn-action edit"
                        (click)="openEditModal(user)"
                        title="Editar Usuario"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        type="button"
                        class="btn-action delete"
                        (click)="openDeleteModal(user)"
                        title="Eliminar Usuario"
                      >
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
        }
      </div>

      <!-- Modal de Creación / Edición -->
      @if (isModalOpen) {
        <div class="modal-backdrop" (click)="closeModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header flex-between">
              <h3>{{ isEditing ? 'Editar Usuario' : 'Registrar Nuevo Usuario' }}</h3>
              <button type="button" class="btn-close" (click)="closeModal()">✕</button>
            </div>

            <form [formGroup]="userForm" (ngSubmit)="saveUser()" class="modal-form">
              <div class="form-group">
                <label class="form-label">Nombre Completo *</label>
                <input type="text" formControlName="name" class="form-control" placeholder="Ej. Ana Morales" />
                @if (isFieldInvalid('name')) {
                  <span class="form-error">El nombre es obligatorio (mínimo 3 letras).</span>
                }
              </div>

              <div class="form-group">
                <label class="form-label">Correo Electrónico *</label>
                <input type="email" formControlName="email" class="form-control" placeholder="amorales@idat.edu.pe" />
                @if (isFieldInvalid('email')) {
                  <span class="form-error">Ingrese un correo válido.</span>
                }
              </div>

              <div class="form-row">
                <div class="form-group flex-1">
                  <label class="form-label">Rol Institucional *</label>
                  <select formControlName="role" class="form-control">
                    <option value="ROLE_ADMIN">Administrador</option>
                    <option value="ROLE_PROFESOR">Docente</option>
                    <option value="ROLE_ESTUDIANTE">Estudiante</option>
                  </select>
                </div>

                <div class="form-group flex-1">
                  <label class="form-label">Estado</label>
                  <select formControlName="status" class="form-control">
                    <option value="ACTIVO">Activo</option>
                    <option value="INACTIVO">Inactivo</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Teléfono / WhatsApp</label>
                <input type="text" formControlName="phone" class="form-control" placeholder="+51 987 654 321" />
              </div>

              <div class="form-group">
                <label class="form-label">{{ isEditing ? 'Nueva Contraseña (Opcional)' : 'Contraseña *' }}</label>
                <input type="password" formControlName="password" class="form-control" placeholder="••••••••" />
              </div>

              <div class="modal-footer flex-between">
                <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancelar</button>
                <button type="submit" class="btn btn-primary" [disabled]="userForm.invalid || isSaving">
                  {{ isSaving ? 'Guardando...' : (isEditing ? 'Actualizar Usuario' : 'Crear Usuario') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Modal de Confirmación de Eliminación -->
      <app-confirm-modal
        [isOpen]="isDeleteModalOpen"
        [title]="'¿Eliminar usuario?'"
        [message]="'¿Estás seguro de eliminar a ' + userToDelete?.name + '? Esta operación no se puede revertir.'"
        [confirmText]="'Sí, eliminar'"
        [cancelText]="'Cancelar'"
        [type]="'danger'"
        (confirm)="confirmDelete()"
        (cancel)="isDeleteModalOpen = false"
      ></app-confirm-modal>
    </div>
  `,
  styles: [`
    .users-page {
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
    .search-input-box {
      position: relative;
      flex: 1;
      min-width: 280px;
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
    .role-filter-group {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .filter-pill {
      background: #f8fafc;
      border: 1px solid var(--border-color);
      padding: 0.375rem 0.875rem;
      border-radius: var(--radius-full);
      font-size: 0.8125rem;
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
    .user-cell {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .avatar-sm {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      object-fit: cover;
      border: 1.5px solid var(--border-color);
    }
    .user-cell-meta {
      display: flex;
      flex-direction: column;
    }
    .cell-name {
      font-weight: 700;
      color: #0f172a;
    }
    .cell-email {
      font-size: 0.75rem;
      color: #64748b;
    }
    .text-right {
      text-align: right;
    }
    .actions-group {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
    }
    .btn-action {
      background: none;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: 0.375rem;
      cursor: pointer;
      color: #64748b;
      transition: all 0.15s;
    }
    .btn-action.edit:hover {
      background-color: var(--primary-50);
      color: var(--primary-600);
      border-color: var(--primary-300);
    }
    .btn-action.delete:hover {
      background-color: var(--danger-bg);
      color: var(--danger-text);
      border-color: var(--danger-border);
    }
    .status-toggle-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
    }
    .status-toggle-btn:hover {
      opacity: 0.8;
    }
    .loading-state, .empty-state {
      padding: 3.5rem 1.5rem;
      text-align: center;
      color: #64748b;
    }
    .empty-state svg {
      color: #cbd5e1;
      margin-bottom: 0.75rem;
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
  `]
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private notification = inject(NotificationService);
  private fb = inject(FormBuilder);

  users: User[] = [];
  filteredUsers: User[] = [];
  isLoading = true;
  searchQuery = '';
  selectedRoleFilter = 'TODOS';

  isModalOpen = false;
  isEditing = false;
  editingUserId?: number;
  isSaving = false;

  isDeleteModalOpen = false;
  userToDelete?: User;

  userForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['ROLE_ESTUDIANTE', [Validators.required]],
    status: ['ACTIVO', [Validators.required]],
    phone: [''],
    password: ['']
  });

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.users = res.data || [];
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  setRoleFilter(role: string): void {
    this.selectedRoleFilter = role;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.users];

    if (this.selectedRoleFilter !== 'TODOS') {
      result = result.filter(u => u.role.includes(this.selectedRoleFilter));
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(u =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }

    this.filteredUsers = result;
  }

  getRoleBadgeClass(role: string): string {
    const clean = role.replace('ROLE_', '').toUpperCase();
    return `badge-role-${clean.toLowerCase()}`;
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.editingUserId = undefined;
    this.userForm.reset({
      name: '',
      email: '',
      role: 'ROLE_ESTUDIANTE',
      status: 'ACTIVO',
      phone: '',
      password: ''
    });
    this.isModalOpen = true;
  }

  openEditModal(user: User): void {
    this.isEditing = true;
    this.editingUserId = user.id;
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone || '',
      password: ''
    });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formData = this.userForm.value;

    if (this.isEditing && this.editingUserId) {
      this.userService.updateUser(this.editingUserId, formData).subscribe({
        next: (res) => {
          this.notification.success('Usuario Actualizado', 'Los datos del usuario han sido actualizados con éxito.');
          this.isSaving = false;
          this.closeModal();
          this.loadUsers();
        },
        error: () => {
          this.isSaving = false;
        }
      });
    } else {
      this.userService.createUser(formData).subscribe({
        next: (res) => {
          this.notification.success('Usuario Creado', 'El nuevo usuario ha sido registrado exitosamente.');
          this.isSaving = false;
          this.closeModal();
          this.loadUsers();
        },
        error: () => {
          this.isSaving = false;
        }
      });
    }
  }

  toggleUserStatus(user: User): void {
    if (!user.id) return;
    this.userService.toggleStatus(user.id).subscribe({
      next: (res) => {
        this.notification.info('Estado Modificado', `El usuario ${user.name} ahora está ${res.data?.status}`);
        this.loadUsers();
      }
    });
  }

  openDeleteModal(user: User): void {
    this.userToDelete = user;
    this.isDeleteModalOpen = true;
  }

  confirmDelete(): void {
    if (!this.userToDelete?.id) return;

    this.userService.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        this.notification.success('Usuario Eliminado', 'El registro ha sido eliminado del sistema.');
        this.isDeleteModalOpen = false;
        this.userToDelete = undefined;
        this.loadUsers();
      }
    });
  }
}
