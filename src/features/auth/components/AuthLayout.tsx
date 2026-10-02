import React from 'react';
import { Link } from 'react-router-dom';
import { TempoBrandmark } from './TempoBrandmark';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-bg-base text-text-primary flex flex-col lg:flex-row overflow-x-hidden selection:bg-accent selection:text-text-primary">
      {/* ---------------------------------------------------- */}
      {/* LEFT / EDITORIAL ATHLETIC SIDE (Desktop Split)       */}
      {/* ---------------------------------------------------- */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 relative flex-col justify-between p-12 xl:p-16 overflow-hidden border-r border-border-subtle bg-surface-subtle/40">
        {/* Subtle architectural ambient daylight gradient */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Top Header / Branding */}
        <div className="relative z-10">
          <Link
            to="/welcome"
            className="inline-block transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-accent rounded-lg"
          >
            <TempoBrandmark size="lg" variant="lime" />
          </Link>
        </div>

        {/* Center / Protocol Typography */}
        <div className="relative z-10 max-w-lg space-y-5 my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-[11px] font-mono font-bold tracking-wider uppercase text-text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-text-primary" />
            <span>THE 75-DAY TRANSFORMATION PROTOCOL</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-black uppercase tracking-tight text-text-primary leading-[1.05]">
            75 DAYS. <br />
            <span className="text-text-secondary">
              ONE SYSTEM.
            </span>
          </h2>

          <p className="text-sm xl:text-base text-text-secondary leading-relaxed max-w-md">
            A structured protocol for progressive overload, precise nutrition floors, and undeniable physique transformation.
          </p>
        </div>

        {/* Bottom Ticker */}
        <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-text-tertiary pt-6 border-t border-border-subtle">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full border border-text-primary" />
            <div className="w-6 h-0.5 bg-accent" />
          </div>
          <span className="tracking-widest">PHYSIQUE • PERFORMANCE • CONSISTENCY</span>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* RIGHT / AUTHENTICATION PANEL (Desktop & Mobile)     */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 relative">
        {/* Mobile Header Brandmark */}
        <div className="lg:hidden flex items-center justify-between pb-6">
          <Link to="/welcome" className="focus:outline-none focus:ring-2 focus:ring-accent rounded-lg">
            <TempoBrandmark size="md" variant="lime" />
          </Link>
          <Link
            to="/welcome"
            className="text-xs font-mono font-bold text-text-secondary hover:text-text-primary transition-colors"
          >
            ← Back
          </Link>
        </div>

        {/* Centered Auth Card Container */}
        <div className="my-auto w-full max-w-md mx-auto">
          <div className="rounded-3xl border border-border-subtle bg-surface-base p-6 sm:p-8 shadow-floating relative overflow-hidden">
            {/* Header */}
            <div className="mb-6 space-y-1.5">
              <div className="flex items-center gap-1.5 mb-2" aria-hidden="true">
                <div className="w-1.5 h-4 bg-accent -skew-x-[20deg] rounded-sm" />
                <div className="w-1.5 h-4 bg-accent -skew-x-[20deg] rounded-sm" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-text-primary">
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary">
                {subtitle}
              </p>
            </div>

            {/* Form Slot */}
            {children}
          </div>
        </div>

        {/* Footer info (Designates development prototype scope) */}
        <div className="pt-6 text-center">
          <p className="text-[11px] font-mono text-text-tertiary">
            TEMPO 75 PROTOCOL • SECURE LOCAL-FIRST PERSISTENCE
          </p>
        </div>
      </div>
    </div>
  );
};
