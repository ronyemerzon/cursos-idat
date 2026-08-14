import { UserRole } from './user.model';

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface DecodedToken {
  sub: string;
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  iat: number;
  exp: number;
}
