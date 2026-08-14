import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HasRoleDirective } from '../../shared/directives/has-role.directive';
import { RoleNamePipe } from '../../shared/pipes/role-name.pipe';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, HasRoleDirective, RoleNamePipe],
  template: `
    <aside class="main-sidebar">
      <!-- Header de la Barra Lateral -->
      <div class="sidebar-brand">
        <div class="brand-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
            <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
          </svg>
        </div>
        <div class="brand-text">
          <h2>EduPortal</h2>
          <span>Gestión Académica</span>
        </div>
      </div>

      <!-- Navegación -->
      <nav class="sidebar-nav">
        <div class="nav-section-title">MENÚ PRINCIPAL</div>

        <!-- Dashboard: Todos -->
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
          <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span class="link-label">Dashboard</span>
        </a>

        <!-- Usuarios: Solo ADMIN (Uso de Directiva appHasRole) -->
        <a *appHasRole="['ADMIN']" routerLink="/usuarios" routerLinkActive="active" class="nav-link">
          <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span class="link-label">Gestión de Usuarios</span>
          <span class="role-indicator">Admin</span>
        </a>

        <!-- Cursos: Todos -->
        <a routerLink="/cursos" routerLinkActive="active" class="nav-link">
          <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <span class="link-label">Gestión de Cursos</span>
        </a>

        <div class="nav-section-title">CUENTA Y SISTEMA</div>

        <!-- Mi Perfil -->
        <a routerLink="/perfil" routerLinkActive="active" class="nav-link">
          <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span class="link-label">Mi Perfil</span>
        </a>
      </nav>

      <!-- Footer de la Barra Lateral -->
      @if (authService.currentUser$ | async; as user) {
        <div class="sidebar-footer">
          <div class="user-card-mini">
            <img [src]="user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.name" alt="Avatar" class="mini-avatar" />
            <div class="mini-info">
              <span class="mini-name">{{ user.name }}</span>
              <span class="mini-badge">{{ user.role | roleName }}</span>
            </div>
          </div>
        </div>
      }
    </aside>
  `,
  styles: [`
    .main-sidebar {
      width: 260px;
      height: 100vh;
      background: var(--bg-sidebar);
      color: #94a3b8;
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 100;
      transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      border-right: 1px solid rgba(255, 255, 255, 0.06);
    }
    .sidebar-brand {
      height: 70px;
      display: flex;
      align-items: center;
      gap: 0.875rem;
      padding: 0 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .brand-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
      color: #ffffff;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
    .brand-text h2 {
      font-size: 1.125rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0;
      line-height: 1.2;
    }
    .brand-text span {
      font-size: 0.6875rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }
    .sidebar-nav {
      flex: 1;
      padding: 1.5rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      overflow-y: auto;
    }
    .nav-section-title {
      font-size: 0.6875rem;
      font-weight: 700;
      color: #475569;
      letter-spacing: 0.08em;
      padding: 0.75rem 0.75rem 0.25rem;
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      padding: 0.75rem 0.875rem;
      border-radius: var(--radius-md);
      color: #94a3b8;
      font-size: 0.875rem;
      font-weight: 600;
      transition: all 0.2s ease;
      position: relative;
    }
    .nav-link:hover {
      color: #ffffff;
      background-color: rgba(255, 255, 255, 0.05);
    }
    .nav-link.active {
      color: #ffffff;
      background: linear-gradient(90deg, var(--primary-600), var(--primary-700));
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
    }
    .nav-icon {
      flex-shrink: 0;
    }
    .role-indicator {
      margin-left: auto;
      font-size: 0.6875rem;
      background: rgba(219, 39, 119, 0.2);
      color: #f472b6;
      padding: 0.125rem 0.375rem;
      border-radius: 4px;
      font-weight: 700;
    }
    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(0, 0, 0, 0.2);
    }
    .user-card-mini {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .mini-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
    }
    .mini-info {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .mini-name {
      font-size: 0.8125rem;
      font-weight: 700;
      color: #f1f5f9;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .mini-badge {
      font-size: 0.6875rem;
      color: var(--primary-400);
      font-weight: 600;
    }
  `]
})
export class SidebarComponent {
  public authService = inject(AuthService);
}
