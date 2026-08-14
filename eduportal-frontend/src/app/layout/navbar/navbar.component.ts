import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RoleNamePipe } from '../../shared/pipes/role-name.pipe';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, RoleNamePipe],
  template: `
    <header class="top-navbar">
      <div class="navbar-left">
        <button class="menu-toggle-btn" (click)="toggleSidebar()">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div class="institution-badge">
          <span class="dot-online"></span>
          <span class="badge-text">IDAT - Sistema Académico Centralizado</span>
        </div>
      </div>

      <div class="navbar-right">
        <!-- Notificaciones -->
        <div class="header-icon-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span class="notification-dot"></span>
        </div>

        <!-- Usuario Autenticado -->
        @if (authService.currentUser$ | async; as user) {
          <div class="user-profile-menu" [routerLink]="['/perfil']">
            <img [src]="user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.name" alt="Avatar" class="user-avatar" />
            <div class="user-info">
              <span class="user-name">{{ user.name }}</span>
              <span class="user-role">{{ user.role | roleName }}</span>
            </div>
          </div>
        }

        <!-- Botón Salir -->
        <button class="logout-btn" (click)="logout()" title="Cerrar Sesión">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Salir</span>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .top-navbar {
      height: 70px;
      background: #ffffff;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.75rem;
      position: sticky;
      top: 0;
      z-index: 50;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    .navbar-left, .navbar-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .menu-toggle-btn {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      transition: background-color 0.2s;
    }
    .menu-toggle-btn:hover {
      background-color: #f1f5f9;
      color: var(--text-main);
    }
    .institution-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background-color: #f1f5f9;
      padding: 0.375rem 0.875rem;
      border-radius: var(--radius-full);
      font-size: 0.8125rem;
      font-weight: 600;
      color: #334155;
    }
    .dot-online {
      width: 8px;
      height: 8px;
      background-color: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
    }
    .header-icon-btn {
      position: relative;
      background: #f8fafc;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 0.5rem;
      color: #64748b;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .header-icon-btn:hover {
      color: var(--primary-600);
      background: var(--primary-50);
      border-color: var(--primary-200);
    }
    .notification-dot {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 6px;
      height: 6px;
      background-color: #ef4444;
      border-radius: 50%;
    }
    .user-profile-menu {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.375rem 0.75rem;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .user-profile-menu:hover {
      background-color: #f8fafc;
    }
    .user-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--primary-200);
    }
    .user-info {
      display: flex;
      flex-direction: column;
    }
    .user-name {
      font-size: 0.875rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.2;
    }
    .user-role {
      font-size: 0.75rem;
      color: var(--primary-600);
      font-weight: 600;
    }
    .logout-btn {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      background-color: var(--danger-bg);
      color: var(--danger-text);
      border: 1px solid var(--danger-border);
      padding: 0.5rem 0.875rem;
      border-radius: var(--radius-md);
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .logout-btn:hover {
      background-color: #fee2e2;
      border-color: #fca5a5;
    }
  `]
})
export class NavbarComponent {
  public authService = inject(AuthService);

  toggleSidebar(): void {
    const sidebar = document.querySelector('.main-sidebar');
    sidebar?.classList.toggle('collapsed');
  }

  logout(): void {
    this.authService.logout();
  }
}
