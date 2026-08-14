import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { NotificationService } from '../../core/services/notification.service';
import { RoleNamePipe } from '../../shared/pipes/role-name.pipe';
import { StatusBadgePipe } from '../../shared/pipes/status-badge.pipe';
import { HoverCardDirective } from '../../shared/directives/hover-card.directive';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RoleNamePipe, StatusBadgePipe, HoverCardDirective],
  template: `
    <div class="profile-page">
      <div class="page-header">
        <h2>Mi Perfil</h2>
        <p class="text-muted">Consulta y actualiza tu información personal y datos de contacto</p>
      </div>

      @if (authService.currentUser$ | async; as user) {
        <div class="profile-grid">
          <!-- Tarjeta Lateral de Perfil -->
          <div class="card profile-card" appHoverCard>
            <div class="profile-avatar-box">
              <img [src]="user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.name" alt="Avatar" class="avatar-lg" />
              <span class="badge badge-online">En línea</span>
            </div>
            
            <h3 class="profile-name">{{ user.name }}</h3>
            <span class="badge badge-role mb-2">{{ user.role | roleName }}</span>
            <p class="profile-email">{{ user.email }}</p>

            <div class="profile-meta-list">
              <div class="meta-item">
                <span class="meta-label">ID de Registro:</span>
                <strong>#00{{ user.id }}</strong>
              </div>
              <div class="meta-item">
                <span class="meta-label">Estado:</span>
                @let badge = user.status | statusBadge;
                <span class="badge" [ngClass]="badge.cssClass">{{ badge.label }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Institución:</span>
                <strong>Instituto IDAT</strong>
              </div>
              <div class="meta-item">
                <span class="meta-label">Sede:</span>
                <strong>Lima Centro</strong>
              </div>
            </div>
          </div>

          <!-- Formulario de Edición de Datos Personales -->
          <div class="card profile-form-card" appHoverCard>
            <div class="card-header-clean">
              <h3>Información Personal</h3>
              <p class="text-muted">Mantén actualizados tus datos de contacto en la plataforma</p>
            </div>

            <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="profile-form">
              <div class="form-row">
                <div class="form-group flex-1">
                  <label class="form-label">Nombre Completo</label>
                  <input type="text" formControlName="name" class="form-control" />
                </div>
                <div class="form-group flex-1">
                  <label class="form-label">Correo Institucional</label>
                  <input type="email" formControlName="email" class="form-control" readonly />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group flex-1">
                  <label class="form-label">Teléfono / Celular</label>
                  <input type="text" formControlName="phone" class="form-control" placeholder="+51 987 654 321" />
                </div>
                <div class="form-group flex-1">
                  <label class="form-label">Rol Asignado</label>
                  <input type="text" [value]="user.role | roleName" class="form-control" readonly />
                </div>
              </div>

              <div class="section-divider">
                <h4>Seguridad de la Cuenta</h4>
              </div>

              <div class="form-group">
                <label class="form-label">Nueva Contraseña (Opcional)</label>
                <input type="password" formControlName="newPassword" class="form-control" placeholder="••••••••" />
                <span class="field-hint">Déjala en blanco si deseas conservar tu contraseña actual.</span>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary" [disabled]="profileForm.invalid || isSaving">
                  {{ isSaving ? 'Guardando cambios...' : 'Guardar Cambios' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .profile-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .page-header h2 {
      font-size: 1.5rem;
      margin-bottom: 0.25rem;
    }
    .profile-grid {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 1.5rem;
    }
    @media (max-width: 900px) {
      .profile-grid {
        grid-template-columns: 1fr;
      }
    }
    .profile-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 2.25rem 1.5rem;
    }
    .profile-avatar-box {
      position: relative;
      margin-bottom: 1.25rem;
    }
    .avatar-lg {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid var(--border-color);
      box-shadow: 0 4px 10px rgba(0,0,0,0.06);
    }
    .badge-online {
      position: absolute;
      bottom: 4px;
      right: 4px;
      background: #10b981;
      color: #ffffff;
      font-size: 0.6875rem;
      padding: 0.2rem 0.5rem;
      border: 2px solid #ffffff;
    }
    .badge-role {
      background-color: var(--primary-50);
      color: var(--primary-700);
      border: 1px solid var(--primary-200);
    }
    .profile-name {
      font-size: 1.25rem;
      margin-bottom: 0.25rem;
    }
    .profile-email {
      font-size: 0.875rem;
      color: #64748b;
      margin-bottom: 1.5rem;
    }
    .profile-meta-list {
      width: 100%;
      border-top: 1px solid #f1f5f9;
      padding-top: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
    }
    .meta-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8125rem;
    }
    .meta-label {
      color: #64748b;
    }
    .profile-form-card {
      padding: 2rem;
    }
    .card-header-clean {
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #f1f5f9;
    }
    .card-header-clean h3 {
      font-size: 1.125rem;
      margin-bottom: 0.25rem;
    }
    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .form-row {
      display: flex;
      gap: 1rem;
    }
    .flex-1 { flex: 1; }
    .section-divider {
      margin-top: 0.5rem;
      padding-top: 1rem;
      border-top: 1px dashed var(--border-color);
    }
    .section-divider h4 {
      font-size: 0.9375rem;
      color: #334155;
      margin-bottom: 0.25rem;
    }
    .field-hint {
      font-size: 0.75rem;
      color: #94a3b8;
      margin-top: 0.25rem;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 0.5rem;
    }
    .mb-2 { margin-bottom: 0.5rem; }
  `]
})
export class ProfileComponent implements OnInit {
  public authService = inject(AuthService);
  private userService = inject(UserService);
  private notification = inject(NotificationService);
  private fb = inject(FormBuilder);

  profileForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: [{ value: '', disabled: true }],
    phone: [''],
    newPassword: ['']
  });

  isSaving = false;

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.profileForm.patchValue({
        name: user.name,
        email: user.email,
        phone: user.phone || ''
      });
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;

    const user = this.authService.getCurrentUser();
    if (!user?.id) return;

    this.isSaving = true;
    const formVal = this.profileForm.value;

    const updateData: any = {
      name: formVal.name,
      email: user.email,
      phone: formVal.phone,
      role: user.role,
      status: user.status
    };

    if (formVal.newPassword && formVal.newPassword.trim()) {
      updateData.password = formVal.newPassword.trim();
    }

    this.userService.updateUser(user.id, updateData).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.notification.success('Perfil Actualizado', 'Tus datos han sido guardados correctamente.');
        if (res.data) {
          const updatedUser = { ...user, name: res.data.name, phone: res.data.phone };
          localStorage.setItem('eduportal_user_data', JSON.stringify(updatedUser));
        }
      },
      error: () => {
        this.isSaving = false;
      }
    });
  }
}
