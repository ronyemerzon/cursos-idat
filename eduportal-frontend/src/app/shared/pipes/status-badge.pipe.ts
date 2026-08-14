import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusBadge',
  standalone: true
})
export class StatusBadgePipe implements PipeTransform {
  transform(status: string | null | undefined): { label: string; cssClass: string } {
    if (!status) {
      return { label: 'Desconocido', cssClass: 'badge-secondary' };
    }

    const upper = status.toUpperCase();
    switch (upper) {
      case 'ACTIVO':
        return { label: 'Activo', cssClass: 'badge-success' };
      case 'INACTIVO':
        return { label: 'Inactivo', cssClass: 'badge-danger' };
      case 'PENDIENTE':
        return { label: 'Pendiente', cssClass: 'badge-warning' };
      case 'FINALIZADO':
        return { label: 'Finalizado', cssClass: 'badge-info' };
      default:
        return { label: status, cssClass: 'badge-secondary' };
    }
  }
}
