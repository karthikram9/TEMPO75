/**
 * TEMPO 75 — AUTHENTICATION TYPES
 *
 * Clean domain contracts for user sessions and authentication actions.
 * NOTE: These interfaces are designed for seamless drop-in replacement
 * when a production authentication provider (Supabase Auth, Clerk, Auth0) is introduced.
 */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

export interface IAuthService {
  getCurrentUser(): Promise<AuthUser | null>;
  login(credentials: LoginCredentials): Promise<AuthResult>;
  signup(credentials: SignupCredentials): Promise<AuthResult>;
  logout(): Promise<void>;
}
