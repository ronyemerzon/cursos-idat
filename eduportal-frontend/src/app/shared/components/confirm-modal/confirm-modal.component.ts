import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="modal-backdrop" (click)="onCancel()">
        <div class="modal-content confirm-dialog" (click)="$event.stopPropagation()">
          <div class="confirm-icon" [ngClass]="'icon-' + type">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          
          <h3 class="confirm-title">{{ title }}</h3>
          <p class="confirm-message">{{ message }}</p>

          <div class="confirm-actions">
            <button type="button" class="btn btn-secondary" (click)="onCancel()">
              {{ cancelText }}
            </button>
            <button type="button" class="btn" [ngClass]="type === 'danger' ? 'btn-danger' : 'btn-primary'" (click)="onConfirm()">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .confirm-dialog {
      max-width: 440px;
      text-align: center;
      padding: 2rem 1.5rem;
    }
    .confirm-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.25rem;
    }
    .icon-danger {
      background-color: var(--danger-bg);
      color: var(--danger-text);
    }
    .icon-warning {
      background-color: var(--warning-bg);
      color: var(--warning-text);
    }
    .confirm-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 0.5rem;
    }
    .confirm-message {
      font-size: 0.875rem;
      color: #64748b;
      margin-bottom: 1.75rem;
      line-height: 1.5;
    }
    .confirm-actions {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
    }
  `]
})
export class ConfirmModalComponent {
  @Input() isOpen = false;
  @Input() title = '¿Estás seguro?';
  @Input() message = 'Esta acción no se puede deshacer.';
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';
  @Input() type: 'danger' | 'warning' | 'primary' = 'danger';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
