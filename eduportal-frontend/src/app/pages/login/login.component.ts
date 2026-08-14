import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastContainerComponent],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <!-- Encabezado con Logo y Marca -->
        <div class="login-header">
          <div class="logo-box">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          </div>
          <h2>EduPortal IDAT</h2>
          <p>Sistema Centralizado de Gestión Académica</p>
        </div>

        <!-- Botones de Prueba Rápida (1 Clic) -->
        <div class="quick-access-box">
          <span class="quick-title">⚡ Acceso Rápido para Pruebas de Roles:</span>
          <div class="quick-buttons">
            <button type="button" class="quick-btn admin" (click)="setCredentials('admin@idat.edu.pe', '123456')">
              👑 Admin
            </button>
            <button type="button" class="quick-btn profesor" (click)="setCredentials('profesor@idat.edu.pe', '123456')">
              👨‍🏫 Docente
            </button>
            <button type="button" class="quick-btn estudiante" (click)="setCredentials('estudiante@idat.edu.pe', '123456')">
              🎓 Estudiante
            </button>
          </div>
        </div>

        <!-- Formulario Reactivo -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label class="form-label" for="email">Correo Institucional</label>
            <div class="input-with-icon">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <input
                id="email"
                type="email"
                formControlName="email"
                placeholder="ejemplo@idat.edu.pe"
                class="form-control"
                [ngClass]="{ 'is-invalid': isFieldInvalid('email') }"
              />
            </div>
            @if (isFieldInvalid('email')) {
              <span class="form-error">Ingrese un correo institucional válido.</span>
            }
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Contraseña</label>
            <div class="input-with-icon">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                id="password"
                type="password"
                formControlName="password"
                placeholder="••••••••"
                class="form-control"
                [ngClass]="{ 'is-invalid': isFieldInvalid('password') }"
              />
            </div>
            @if (isFieldInvalid('password')) {
              <span class="form-error">La contraseña es obligatoria.</span>
            }
          </div>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="loginForm.invalid || isLoading">
            @if (isLoading) {
              <span class="spinner"></span>
              <span>Autenticando con JWT...</span>
            } @else {
              <span>Iniciar Sesión Segura</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            }
          </button>
        </form>

        <div class="login-footer">
          <p>© 2026 Instituto de Educación Superior IDAT • Todos los derechos reservados</p>
        </div>
      </div>

      <app-toast-container></app-toast-container>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at 50% 10%, #1e1b4b 0%, #0f172a 100%);
      padding: 1.5rem;
    }
    .login-card {
      width: 100%;
      max-width: 460px;
      background: #ffffff;
      border-radius: var(--radius-xl);
      padding: 2.5rem 2rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .login-header {
      text-align: center;
      margin-bottom: 1.75rem;
    }
    .logo-box {
      width: 58px;
      height: 58px;
      background: linear-gradient(135deg, var(--primary-600), var(--primary-800));
      color: #ffffff;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      box-shadow: 0 8px 16px rgba(79, 70, 229, 0.3);
    }
    .login-header h2 {
      font-size: 1.5rem;
      color: #0f172a;
      margin-bottom: 0.25rem;
    }
    .login-header p {
      font-size: 0.875rem;
      color: #64748b;
    }
    .quick-access-box {
      background: #f8fafc;
      border: 1px dashed var(--primary-300);
      border-radius: var(--radius-md);
      padding: 0.875rem;
      margin-bottom: 1.5rem;
    }
    .quick-title {
      display: block;
      font-size: 0.75rem;
      font-weight: 700;
      color: #475569;
      margin-bottom: 0.5rem;
      text-align: center;
    }
    .quick-buttons {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
    }
    .quick-btn {
      padding: 0.375rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 700;
      border-radius: var(--radius-sm);
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }
    .quick-btn.admin {
      background-color: #fdf2f8;
      color: #db2777;
      border-color: #fbcfe8;
    }
    .quick-btn.profesor {
      background-color: #eef2ff;
      color: #4f46e5;
      border-color: #c7d2fe;
    }
    .quick-btn.estudiante {
      background-color: #f0fdf4;
      color: #16a34a;
      border-color: #bbf7d0;
    }
    .quick-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .input-with-icon {
      position: relative;
      display: flex;
      align-items: center;
    }
    .input-icon {
      position: absolute;
      left: 12px;
      color: #94a3b8;
      pointer-events: none;
    }
    .input-with-icon .form-control {
      padding-left: 2.5rem;
    }
    .is-invalid {
      border-color: var(--danger-text) !important;
    }
    .btn-block {
      width: 100%;
      padding: 0.75rem;
      font-size: 0.9375rem;
      margin-top: 0.5rem;
    }
    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .login-footer {
      margin-top: 1.5rem;
      text-align: center;
      font-size: 0.75rem;
      color: #94a3b8;
      border-top: 1px solid #f1f5f9;
      padding-top: 1rem;
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  isLoading = false;

  setCredentials(email: string, pass: string): void {
    this.loginForm.patchValue({
      email,
      password: pass
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading = false;
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
