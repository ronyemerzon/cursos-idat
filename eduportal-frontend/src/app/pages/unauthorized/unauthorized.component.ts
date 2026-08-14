import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="error-page-wrapper">
      <div class="error-card card">
        <div class="error-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <span class="error-code">ERROR 403</span>
        <h2>Acceso No Autorizado</h2>
        <p>Tu rol de usuario actual no cuenta con los privilegios suficientes para visualizar o modificar esta sección del sistema (Protegido por <strong>RoleGuard</strong>).</p>

        <div class="error-actions">
          <a routerLink="/dashboard" class="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Volver al Dashboard
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-page-wrapper {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .error-card {
      max-width: 500px;
      text-align: center;
      padding: 3rem 2rem;
    }
    .error-icon {
      width: 80px;
      height: 80px;
      background-color: var(--danger-bg);
      color: var(--danger-text);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }
    .error-code {
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: var(--danger-text);
      display: block;
      margin-bottom: 0.5rem;
    }
    .error-card h2 {
      font-size: 1.5rem;
      margin-bottom: 0.75rem;
    }
    .error-card p {
      color: #64748b;
      font-size: 0.875rem;
      margin-bottom: 2rem;
      line-height: 1.6;
    }
    .error-actions {
      display: flex;
      justify-content: center;
    }
  `]
})
export class UnauthorizedComponent {}
