/**
 * TEMPO 75 — DEVELOPMENT-ONLY LOCAL AUTHENTICATION ADAPTER
 *
 * ARCHITECTURAL NOTICE:
 * This adapter provides local prototype session state for TEMPO 75 using
 * client-side storage (IStorageAdapter). It is intended EXCLUSIVELY for local development
 * and UX prototyping.
 *
 * CRITICAL SECURITY & PROTOCOL PRINCIPLES:
 * 1. This is NOT secure production authentication.
 * 2. Passwords are NEVER stored in plaintext (or at all) in localStorage.
 * 3. Client-side input validation is strictly enforced (format, minimum length).
 * 4. All session persistence is isolated under STORAGE_KEYS.AUTH_USER.
 * 5. This class implements IAuthService so it can be replaced 1:1 with a real
 *    production backend provider (Supabase Auth, Clerk, Auth0) without touching UI or routes.
 */

import { storage, STORAGE_KEYS } from '@/lib/storage';
import type {
  AuthResult,
  AuthUser,
  IAuthService,
  LoginCredentials,
  SignupCredentials,
} from '../types';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class DevelopmentAuthAdapter implements IAuthService {
  /**
   * Retrieves the currently active user session from local storage.
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const user = await storage.get<AuthUser>(STORAGE_KEYS.AUTH_USER);
      return user ?? null;
    } catch (err) {
      console.error('[DevelopmentAuthAdapter] Failed to read current user:', err);
      return null;
    }
  }

  /**
   * Establishes a new development athlete session.
   * Enforces client-side format and length constraints.
   * Does NOT store the plaintext password anywhere.
   */
  async signup(credentials: SignupCredentials): Promise<AuthResult> {
    const name = credentials.name.trim();
    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password;
    const confirmPassword = credentials.confirmPassword;

    // 1. Validation
    if (!name || name.length < 2) {
      return { success: false, error: 'Full name must be at least 2 characters.' };
    }
    if (!email || !EMAIL_REGEX.test(email)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match.' };
    }

    try {
      // 2. Construct safe public session token (zero plaintext password persistence)
      const user: AuthUser = {
        id: `athlete_${Date.now()}`,
        name,
        email,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      await storage.set(STORAGE_KEYS.AUTH_USER, user);

      return { success: true, user };
    } catch (err) {
      console.error('[DevelopmentAuthAdapter] Signup failed:', err);
      return { success: false, error: 'Failed to create account. Please try again.' };
    }
  }

  /**
   * Establishes a returning development user session.
   * In this development adapter, it validates format and activates the local session.
   */
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password;

    // 1. Validation
    if (!email || !EMAIL_REGEX.test(email)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 1) {
      return { success: false, error: 'Please enter your password.' };
    }

    try {
      // 2. Check existing session or create active session
      const existingUser = await storage.get<AuthUser>(STORAGE_KEYS.AUTH_USER);

      const user: AuthUser = existingUser && existingUser.email === email
        ? {
            ...existingUser,
            lastLoginAt: new Date().toISOString(),
          }
        : {
            id: existingUser?.id ?? `athlete_${Date.now()}`,
            name: existingUser?.name ?? email.split('@')[0] ?? 'Athlete',
            email,
            createdAt: existingUser?.createdAt ?? new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
          };

      await storage.set(STORAGE_KEYS.AUTH_USER, user);

      return { success: true, user };
    } catch (err) {
      console.error('[DevelopmentAuthAdapter] Login failed:', err);
      return { success: false, error: 'Failed to log in. Please try again.' };
    }
  }

  /**
   * Clears the current user session from local storage.
   */
  async logout(): Promise<void> {
    try {
      await storage.remove(STORAGE_KEYS.AUTH_USER);
    } catch (err) {
      console.error('[DevelopmentAuthAdapter] Logout error:', err);
    }
  }
}

// Canonical singleton export
export const authService: IAuthService = new DevelopmentAuthAdapter();
