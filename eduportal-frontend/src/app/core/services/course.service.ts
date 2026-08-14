import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/courses`;
  private statsUrl = `${environment.apiUrl}/stats`;

  getCourses(search?: string, category?: string): Observable<ApiResponse<Course[]>> {
    let params = new HttpParams();
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }
    if (category && category !== 'TODOS') {
      params = params.set('category', category);
    }
    return this.http.get<ApiResponse<Course[]>>(this.apiUrl, { params });
  }

  getCourseById(id: number): Observable<ApiResponse<Course>> {
    return this.http.get<ApiResponse<Course>>(`${this.apiUrl}/${id}`);
  }

  createCourse(course: Partial<Course>): Observable<ApiResponse<Course>> {
    return this.http.post<ApiResponse<Course>>(this.apiUrl, course);
  }

  updateCourse(id: number, course: Partial<Course>): Observable<ApiResponse<Course>> {
    return this.http.put<ApiResponse<Course>>(`${this.apiUrl}/${id}`, course);
  }

  deleteCourse(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  enrollCourse(id: number): Observable<ApiResponse<Course>> {
    return this.http.post<ApiResponse<Course>>(`${this.apiUrl}/${id}/enroll`, {});
  }

  getDashboardStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.statsUrl}/dashboard`);
  }
}
