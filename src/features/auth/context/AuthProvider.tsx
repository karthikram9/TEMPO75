import React, { useEffect, useState, useCallback, useMemo } from 'react';
import type {
  AuthResult,
  AuthUser,
  LoginCredentials,
  SignupCredentials,
} from '../types';
import { authService } from '../services/authService';
import { AuthContext, type AuthContextValue } from './authContextDef';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session upon mount / page reload
  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const storedUser = await authService.getCurrentUser();
        if (isMounted) {
          setUser(storedUser);
        }
      } catch (err) {
        console.error('[AuthProvider] Failed to restore session:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResult> => {
    const result = await authService.login(credentials);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  }, []);

  const signup = useCallback(async (credentials: SignupCredentials): Promise<AuthResult> => {
    const result = await authService.signup(credentials);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      signup,
      logout,
    }),
    [user, isLoading, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
