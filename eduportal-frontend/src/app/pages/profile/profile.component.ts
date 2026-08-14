import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { RoleNamePipe } from '../../shared/pipes/role-name.pipe';
import { StatusBadgePipe } from '../../shared/pipes/status-badge.pipe';
import { HoverCardDirective } from '../../shared/directives/hover-card.directive';
import { DecodedToken } from '../../core/models/auth.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RoleNamePipe, StatusBadgePipe, HoverCardDirective],
  template: `
    <div class="profile-page">
      <div class="page-header">
        <h2>Mi Perfil Institucional</h2>
        <p class="text-muted">Información de la cuenta y detalles técnicos de la sesión JWT</p>
      </div>

      @if (authService.currentUser$ | async; as user) {
        <div class="profile-grid">
          <!-- Tarjeta de Usuario -->
          <div class="card profile-card" appHoverCard>
            <div class="profile-avatar-box">
              <img [src]="user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.name" alt="Avatar" class="avatar-lg" />
              <span class="badge badge-online">Conectado</span>
            </div>
            
            <h3 class="profile-name">{{ user.name }}</h3>
            <span class="badge badge-role-admin mb-2">{{ user.role | roleName }}</span>
            <p class="profile-email">{{ user.email }}</p>

            <div class="profile-meta-list">
              <div class="meta-item">
                <span class="meta-label">ID de Usuario:</span>
                <strong>#{{ user.id }}</strong>
              </div>
              <div class="meta-item">
                <span class="meta-label">Estado de Cuenta:</span>
                @let badge = user.status | statusBadge;
                <span class="badge" [ngClass]="badge.cssClass">{{ badge.label }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Institución:</span>
                <strong>Instituto Superior IDAT</strong>
              </div>
            </div>
          </div>

          <!-- Información Técnica del Token JWT -->
          <div class="card jwt-details-card" appHoverCard>
            <div class="jwt-header">
              <div class="jwt-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <div>
                <h3>Detalles de Autenticación JWT</h3>
                <p class="text-muted">Token emitido por el backend Spring Boot / Mock API</p>
              </div>
            </div>

            <div class="jwt-info-body">
              <div class="jwt-stat-row">
                <div class="jwt-stat-box">
                  <span class="stat-title">Algoritmo</span>
                  <strong>HS256 (HMAC SHA-256)</strong>
                </div>
                <div class="jwt-stat-box">
                  <span class="stat-title">Tipo de Token</span>
                  <strong>Bearer Token</strong>
                </div>
                <div class="jwt-stat-box">
                  <span class="stat-title">Expiración</span>
                  <strong>24 Horas</strong>
                </div>
              </div>

              <div class="token-code-section">
                <label class="form-label">Token JWT Actual (Almacenado en LocalStorage):</label>
                <div class="token-box">
                  <code>{{ rawToken }}</code>
                </div>
              </div>

              @if (decodedToken) {
                <div class="payload-section">
                  <label class="form-label">Claims / Payload Decodificado:</label>
                  <pre class="payload-box"><code>{{ decodedToken | json }}</code></pre>
                </div>
              }
            </div>
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
      grid-template-columns: 340px 1fr;
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
      border: 3px solid var(--primary-200);
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
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
    .profile-name {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
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
    .jwt-details-card {
      padding: 1.75rem;
    }
    .jwt-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #f1f5f9;
      margin-bottom: 1.5rem;
    }
    .jwt-icon {
      width: 44px;
      height: 44px;
      background-color: var(--primary-50);
      color: var(--primary-600);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .jwt-info-body {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .jwt-stat-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }
    .jwt-stat-box {
      background: #f8fafc;
      padding: 0.875rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .stat-title {
      font-size: 0.75rem;
      color: #64748b;
    }
    .token-box {
      background: #0f172a;
      color: #38bdf8;
      padding: 1rem;
      border-radius: var(--radius-md);
      font-size: 0.75rem;
      word-break: break-all;
      max-height: 90px;
      overflow-y: auto;
      font-family: monospace;
    }
    .payload-box {
      background: #f8fafc;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 1rem;
      font-size: 0.8125rem;
      color: #1e293b;
      overflow-x: auto;
      font-family: monospace;
    }
    .mb-2 { margin-bottom: 0.5rem; }
  `]
})
export class ProfileComponent implements OnInit {
  public authService = inject(AuthService);

  rawToken: string = '';
  decodedToken: DecodedToken | null = null;

  ngOnInit(): void {
    this.rawToken = this.authService.getToken() || 'No hay token activo';
    if (this.rawToken) {
      this.decodedToken = this.authService.decodeToken(this.rawToken);
    }
  }
}
