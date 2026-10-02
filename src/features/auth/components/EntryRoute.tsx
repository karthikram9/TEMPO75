import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import type { Challenge } from '@/types';

/**
 * Intelligent Gatekeeper Route for root path (/)
 * Evaluates session authentication and existing protocol state.
 *
 * Single Source of Truth Rules:
 * 1. Checks useAuth() session.
 * 2. Reads STORAGE_KEYS.ACTIVE_CHALLENGE directly from existing storage.
 * 3. Unauthenticated -> /welcome
 * 4. Authenticated without active challenge -> /onboarding
 * 5. Authenticated with active challenge -> /dashboard
 */
export const EntryRoute: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [challengeLoading, setChallengeLoading] = useState<boolean>(true);
  const [hasActiveChallenge, setHasActiveChallenge] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function checkChallenge() {
      try {
        const challenge = await storage.get<Challenge>(STORAGE_KEYS.ACTIVE_CHALLENGE);
        if (isMounted) {
          setHasActiveChallenge(Boolean(challenge && challenge.status === 'active'));
        }
      } catch (err) {
        console.error('[EntryRoute] Failed to verify challenge:', err);
        if (isMounted) setHasActiveChallenge(false);
      } finally {
        if (isMounted) setChallengeLoading(false);
      }
    }

    void checkChallenge();

    return () => {
      isMounted = false;
    };
  }, []);

  if (authLoading || challengeLoading) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-[#090A0C] flex flex-col items-center justify-center text-neutral-400">
        <div className="w-8 h-8 rounded-full border-2 border-[#FF5000] border-t-transparent animate-spin mb-3" />
        <span className="text-xs uppercase font-mono tracking-wider">Verifying Session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }

  if (hasActiveChallenge) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/onboarding" replace />;
};
