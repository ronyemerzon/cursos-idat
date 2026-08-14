import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found-wrapper">
      <div class="not-found-card card">
        <span class="code-404">404</span>
        <h2>Página No Encontrada</h2>
        <p>La ruta a la que intentas ingresar no existe en el sistema o ha sido reubicada.</p>
        <div class="actions">
          <a routerLink="/dashboard" class="btn btn-primary">
            Regresar al Inicio
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-wrapper {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .not-found-card {
      max-width: 480px;
      text-align: center;
      padding: 3rem 2rem;
    }
    .code-404 {
      font-size: 4.5rem;
      font-weight: 900;
      color: var(--primary-600);
      line-height: 1;
      display: block;
      margin-bottom: 0.5rem;
    }
    .not-found-card h2 {
      font-size: 1.5rem;
      margin-bottom: 0.75rem;
    }
    .not-found-card p {
      color: #64748b;
      margin-bottom: 2rem;
    }
    .actions {
      display: flex;
      justify-content: center;
    }
  `]
})
export class NotFoundComponent {}
