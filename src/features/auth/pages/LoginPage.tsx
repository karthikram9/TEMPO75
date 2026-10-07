import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ChevronRight, Loader2, Info } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { AuthLayout } from '../components/AuthLayout';
import { SocialAuthButtons } from '../components/SocialAuthButtons';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import type { Challenge } from '@/types';
import { EMAIL_REGEX } from '../services/authService';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setFormError(null);
    setForgotPasswordNotice(false);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setFormError('Please enter your email address.');
      return;
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setFormError('Please enter your password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await login({ email: trimmedEmail, password });

      if (!result.success) {
        setFormError(result.error ?? 'Invalid email or password.');
        setIsSubmitting(false);
        return;
      }

      // Check existing challenge to determine destination
      const activeChallenge = await storage.get<Challenge>(STORAGE_KEYS.ACTIVE_CHALLENGE);
      if (activeChallenge && activeChallenge.status === 'active') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    } catch {
      setFormError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Continue your 75-day transformation."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Form-level Error Banner */}
        {formError && (
          <div
            role="alert"
            className="flex items-center gap-2 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs animate-fade-in"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{formError}</span>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-1.5">
          <label htmlFor="login-email" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (formError) setFormError(null);
              }}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-subtle border border-border-subtle text-text-primary placeholder-text-tertiary text-sm focus:border-text-primary focus:bg-white focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Password
            </label>
            <button
              type="button"
              onClick={() => setForgotPasswordNotice((prev) => !prev)}
              className="text-xs text-text-tertiary hover:text-text-primary font-medium transition-colors focus:outline-none"
            >
              Forgot password?
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (formError) setFormError(null);
              }}
              placeholder="Enter your password"
              className="w-full pl-10 pr-11 py-3 rounded-xl bg-surface-subtle border border-border-subtle text-text-primary placeholder-text-tertiary text-sm focus:border-text-primary focus:bg-white focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-tertiary hover:text-text-primary transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Informational notice for forgot password */}
          {forgotPasswordNotice && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-surface-subtle border border-border-subtle text-text-secondary text-xs animate-fade-in mt-2">
              <Info className="w-3.5 h-3.5 text-text-primary shrink-0" />
              <span>Password recovery will be enabled in a future cloud synchronization release.</span>
            </div>
          )}
        </div>

        {/* Primary Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 sm:h-13 rounded-full bg-[#1A382B] hover:bg-[#234A39] active:bg-[#142C22] disabled:opacity-60 text-white font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all touch-manipulation focus:outline-none focus:ring-2 focus:ring-[#1A382B] cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>SIGNING IN...</span>
              </>
            ) : (
              <>
                <span>LOG IN</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Social Authentication Previews */}
        <SocialAuthButtons />

        {/* Sign-up Switcher Link */}
        <div className="pt-4 text-center">
          <p className="text-xs text-text-secondary">
            New to TEMPO 75?{' '}
            <Link
              to="/signup"
              className="text-text-primary hover:underline font-bold transition-colors ml-1"
            >
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
