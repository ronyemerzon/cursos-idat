export interface Course {
  id?: number;
  title: string;
  code: string;
  description: string;
  category: string;
  instructorId?: number;
  instructorName?: string;
  credits: number;
  maxCapacity: number;
  enrolledCount: number;
  status: 'ACTIVO' | 'INACTIVO' | 'FINALIZADO' | string;
  imageUrl?: string;
  schedule?: string;
  createdAt?: string;
}
