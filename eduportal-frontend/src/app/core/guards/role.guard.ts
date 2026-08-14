import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notification = inject(NotificationService);

  if (!authService.isAuthenticated()) {
    notification.warning('Acceso Restringido', 'Por favor inicia sesión para continuar.');
    return router.createUrlTree(['/login']);
  }

  const expectedRoles = route.data['roles'] as Array<string>;
  const userRole = authService.getUserRole();

  if (!expectedRoles || expectedRoles.length === 0) {
    return true;
  }

  if (userRole && authService.hasRole(expectedRoles)) {
    return true;
  }

  notification.error(
    'Permiso Denegado',
    `Tu rol (${userRole || 'Sin Rol'}) no tiene autorización para acceder a esta sección.`
  );
  return router.createUrlTree(['/unauthorized']);
};
