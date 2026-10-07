import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { AuthLayout } from '../components/AuthLayout';
import { SocialAuthButtons } from '../components/SocialAuthButtons';
import { EMAIL_REGEX } from '../services/authService';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setFormError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setFormError('Please enter your full name (minimum 2 characters).');
      return;
    }
    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match. Please verify both fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await signup({
        name: trimmedName,
        email: trimmedEmail,
        password,
        confirmPassword,
      });

      if (!result.success) {
        setFormError(result.error ?? 'Failed to create account.');
        setIsSubmitting(false);
        return;
      }

      // First-time athlete immediately enters onboarding to configure their 75-day protocol
      navigate('/onboarding', { replace: true });
    } catch {
      setFormError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Begin your 75-day transformation protocol."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Form Error Banner */}
        {formError && (
          <div
            role="alert"
            className="flex items-center gap-2 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs animate-fade-in"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{formError}</span>
          </div>
        )}

        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="signup-name" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
              <User className="w-4 h-4" />
            </div>
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (formError) setFormError(null);
              }}
              placeholder="Alex Walker"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-subtle border border-border-subtle text-text-primary placeholder-text-tertiary text-sm focus:border-text-primary focus:bg-white focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label htmlFor="signup-email" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="signup-email"
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

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="signup-password" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Password (Min. 8 characters)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (formError) setFormError(null);
              }}
              placeholder="At least 8 characters"
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
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label htmlFor="signup-confirm-password" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="signup-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (formError) setFormError(null);
              }}
              placeholder="Re-enter password"
              className="w-full pl-10 pr-11 py-3 rounded-xl bg-surface-subtle border border-border-subtle text-text-primary placeholder-text-tertiary text-sm focus:border-text-primary focus:bg-white focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-tertiary hover:text-text-primary transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
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
                <span>CREATING ACCOUNT...</span>
              </>
            ) : (
              <>
                <span>CREATE ACCOUNT</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Social Authentication Previews */}
        <SocialAuthButtons />

        {/* Login Switcher Link */}
        <div className="pt-4 text-center">
          <p className="text-xs text-text-secondary">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-text-primary hover:underline font-bold transition-colors ml-1"
            >
              LOG IN
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
