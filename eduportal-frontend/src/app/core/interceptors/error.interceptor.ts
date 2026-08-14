import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401: No autorizado o token expirado
      if (error.status === 401) {
        if (!req.url.includes('/auth/login')) {
          notification.error('Sesión Expirada', 'Tu sesión ha caducado. Por favor inicia sesión nuevamente.');
          authService.logout(false);
        }
      }
      // 403: Acceso denegado por rol
      else if (error.status === 403) {
        notification.error('Acceso Prohibido', 'No tienes los permisos necesarios para realizar esta acción.');
        router.navigate(['/unauthorized']);
      }
      // 404: Recurso no encontrado
      else if (error.status === 404) {
        const msg = error.error?.message || 'El recurso solicitado no fue encontrado.';
        notification.warning('No Encontrado', msg);
      }
      // 500: Error interno del servidor
      else if (error.status >= 500) {
        notification.error('Error de Servidor', 'Ocurrió un error inesperado en el servidor backend.');
      }

      return throwError(() => error);
    })
  );
};
