import { createContext } from 'react';
import type {
  AuthResult,
  AuthState,
  LoginCredentials,
  SignupCredentials,
} from '../types';

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  signup: (credentials: SignupCredentials) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
