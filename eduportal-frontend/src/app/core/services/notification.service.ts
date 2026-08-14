import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  show(type: 'success' | 'error' | 'info' | 'warning', title: string, message: string, duration: number = 4000): void {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: ToastMessage = { id, type, title, message, duration };
    const current = this.toastsSubject.getValue();
    this.toastsSubject.next([...current, toast]);

    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  success(title: string, message: string = ''): void {
    this.show('success', title, message);
  }

  error(title: string, message: string = ''): void {
    this.show('error', title, message, 5000);
  }

  info(title: string, message: string = ''): void {
    this.show('info', title, message);
  }

  warning(title: string, message: string = ''): void {
    this.show('warning', title, message);
  }

  remove(id: string): void {
    const current = this.toastsSubject.getValue();
    this.toastsSubject.next(current.filter(t => t.id !== id));
  }
}
