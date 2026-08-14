import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, tap, catchError, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { JwtResponse, LoginRequest, DecodedToken } from '../models/auth.model';
import { User, UserRole } from '../models/user.model';
import { NotificationService } from './notification.service';

const TOKEN_KEY = 'eduportal_jwt_token';
const USER_KEY = 'eduportal_user_data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private notification = inject(NotificationService);

  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor() {
    // Verificar token al iniciar
    if (this.hasValidToken()) {
      const user = this.getStoredUser();
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    } else {
      this.clearSession();
    }
  }

  login(credentials: LoginRequest): Observable<ApiResponse<JwtResponse>> {
    return this.http.post<ApiResponse<JwtResponse>>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.saveSession(response.data);
          this.notification.success('¡Bienvenido!', `Has iniciado sesión como ${response.data.name}`);
        }
      }),
      catchError(error => {
        const errorMsg = error?.error?.message || 'Error de conexión con el servidor de autenticación';
        this.notification.error('Error de Acceso', errorMsg);
        throw error;
      })
    );
  }

  logout(showNotification: boolean = true): void {
    this.clearSession();
    if (showNotification) {
      this.notification.info('Sesión Cerrada', 'Has cerrado tu sesión de forma segura.');
    }
    this.router.navigate(['/login']);
  }

  saveSession(authData: JwtResponse): void {
    localStorage.setItem(TOKEN_KEY, authData.token);
    
    const user: User = {
      id: authData.id,
      name: authData.name,
      email: authData.email,
      role: authData.role,
      status: 'ACTIVO',
      avatar: authData.avatar
    };

    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getStoredUser(): User | null {
    const data = localStorage.getItem(USER_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data) as User;
    } catch {
      return null;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.getValue();
  }

  getUserRole(): string | null {
    const user = this.getCurrentUser();
    if (!user) return null;
    return this.normalizeRole(user.role);
  }

  hasRole(roles: string[]): boolean {
    const currentRole = this.getUserRole();
    if (!currentRole) return false;
    const normalizedTargetRoles = roles.map(r => this.normalizeRole(r));
    return normalizedTargetRoles.includes(currentRole);
  }

  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) return true; // Si es token simulado sin exp estándar
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  }

  decodeToken(token: string): DecodedToken | null {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodeURIComponent(escape(payload))) as DecodedToken;
    } catch {
      return null;
    }
  }

  private clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  normalizeRole(role: string): string {
    if (!role) return '';
    return role.replace('ROLE_', '').toUpperCase();
  }
}
