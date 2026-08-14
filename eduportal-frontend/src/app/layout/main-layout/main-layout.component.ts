import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent, ToastContainerComponent],
  template: `
    <div class="app-layout-wrapper">
      <app-sidebar></app-sidebar>
      
      <div class="app-main-content">
        <app-navbar></app-navbar>
        
        <main class="page-body">
          <router-outlet></router-outlet>
        </main>

        <footer class="app-footer">
          <p>© 2026 Instituto IDAT - Escuela de Tecnología | Examen Final Desarrollo de Interfaces 3</p>
        </footer>
      </div>

      <app-toast-container></app-toast-container>
    </div>
  `,
  styles: [`
    .app-layout-wrapper {
      display: flex;
      min-height: 100vh;
      background-color: var(--bg-app);
    }
    .app-main-content {
      flex: 1;
      margin-left: 260px;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      transition: margin-left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .page-body {
      flex: 1;
      padding: 2rem;
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
    }
    .app-footer {
      padding: 1.25rem 2rem;
      border-top: 1px solid var(--border-color);
      background: #ffffff;
      text-align: center;
      font-size: 0.8125rem;
      color: #64748b;
    }
  `]
})
export class MainLayoutComponent {}
