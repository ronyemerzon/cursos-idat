import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleName',
  standalone: true
})
export class RoleNamePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return 'Sin Rol';
    const cleanRole = value.replace('ROLE_', '').toUpperCase();
    
    switch (cleanRole) {
      case 'ADMIN':
        return 'Administrador';
      case 'PROFESOR':
        return 'Docente';
      case 'ESTUDIANTE':
        return 'Estudiante';
      default:
        return cleanRole;
    }
  }
}
