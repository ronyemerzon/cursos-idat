export type UserRole = 'ROLE_ADMIN' | 'ROLE_PROFESOR' | 'ROLE_ESTUDIANTE' | 'ADMIN' | 'PROFESOR' | 'ESTUDIANTE';

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status: 'ACTIVO' | 'INACTIVO' | string;
  avatar?: string;
  phone?: string;
  createdAt?: string;
}
