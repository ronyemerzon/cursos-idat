import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, ToastMessage } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of notificationService.toasts$ | async; track toast.id) {
        <div class="toast-item" [ngClass]="'toast-' + toast.type">
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') {
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              }
              @case ('error') {
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              }
              @case ('warning') {
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              }
              @case ('info') {
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              }
            }
          </div>
          <div class="toast-content">
            <h4 class="toast-title">{{ toast.title }}</h4>
            @if (toast.message) {
              <p class="toast-message">{{ toast.message }}</p>
            }
          </div>
          <button type="button" class="toast-close" (click)="notificationService.remove(toast.id)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1.25rem;
      right: 1.25rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 420px;
      width: calc(100% - 2.5rem);
      pointer-events: none;
    }
    .toast-item {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 0.875rem;
      padding: 1rem 1.25rem;
      border-radius: var(--radius-md);
      background: #ffffff;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.12), 0 8px 10px -6px rgba(0,0,0,0.06);
      border-left: 4px solid #cbd5e1;
      animation: toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      transition: all 0.2s ease;
    }
    .toast-success { border-left-color: #10b981; }
    .toast-success .toast-icon { color: #10b981; }
    .toast-error { border-left-color: #ef4444; }
    .toast-error .toast-icon { color: #ef4444; }
    .toast-warning { border-left-color: #f59e0b; }
    .toast-warning .toast-icon { color: #f59e0b; }
    .toast-info { border-left-color: #3b82f6; }
    .toast-info .toast-icon { color: #3b82f6; }

    .toast-icon {
      flex-shrink: 0;
      margin-top: 0.125rem;
    }
    .toast-content {
      flex: 1;
    }
    .toast-title {
      font-size: 0.875rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 0.125rem;
    }
    .toast-message {
      font-size: 0.8125rem;
      color: #64748b;
      margin: 0;
      line-height: 1.4;
    }
    .toast-close {
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.15s;
    }
    .toast-close:hover {
      color: #0f172a;
    }
    @keyframes toastSlideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastContainerComponent {
  public notificationService = inject(NotificationService);
}
